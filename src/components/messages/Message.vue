<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'

defineOptions({ name: 'ChatMessage' })

const { t } = useI18n()

const props = defineProps<{
  user: string
  color: string
  image?: string
  created_at: string | Date
  content: string
}>()

const isImageUrl = computed<boolean>(() => {
  return checkImageUrl(props.image || '')
})

function checkImageUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function getFormattedDate(created_at: Date, atText: string): string {
  const day = ('0' + created_at.getDate()).slice(-2)
  const month = ('0' + (created_at.getMonth() + 1)).slice(-2)
  const year = created_at.getFullYear()

  const hours = ('0' + ((created_at.getUTCHours() + 2) % 24)).slice(-2)
  const minutes = ('0' + created_at.getMinutes()).slice(-2)
  const seconds = ('0' + created_at.getSeconds()).slice(-2)

  return `${day}/${month}/${year} ${atText} ${hours}:${minutes}:${seconds}`
}

const formattedDate = computed<string>(() => {
  const rawDate = props.created_at
  const d: Date = rawDate instanceof Date ? rawDate : new Date(rawDate as unknown as string)
  return getFormattedDate(d, t('at'))
})

// Markdown parser instance
const md = new MarkdownIt({ breaks: true, linkify: true })

// Convert content to HTML
const parsedContent = computed(() => {
  return md.render(props.content)
})
</script>

<template>
  <img v-if="isImageUrl" :src="props.image" :alt="user[0]" class="profile-pic" />
  <span
    class="profile-span"
    v-else
    :style="{
      color: props.color,
      backgroundColor: props.color + '80',
    }"
  >
    {{ props.user[0] }}
  </span>
  <div class="message-content">
    <div class="header-msg">
      <span class="username" :style="{ color: props.color }">{{ props.user }}</span>
      <span class="date">{{ formattedDate }}</span>
    </div>
    <div class="content-msg">
      <span class="text" v-html="parsedContent"></span>
    </div>
  </div>
</template>
