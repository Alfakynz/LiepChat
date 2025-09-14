<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import socket from '@/socket'
import SendIcon from '@/assets/icons/SendIcon.vue'

const { t } = useI18n()

const props = defineProps<{
  user_id: string
  user_color: string
  user_image: string
  room: string
  temporal: boolean
  token: string
}>()

const message = ref('')

function sendMessage(content: string) {
  socket.emit(
    'message',
    {
      user_id: props.user_id,
      color: props.user_color,
      image: props.user_image,
      created_at: new Date().toISOString(),
      content,
    },
    props.room,
    props.temporal,
    props.token,
  )
}

function handleSubmit() {
  if (message.value.trim()) {
    sendMessage(message.value.trim())
    message.value = ''
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!event.shiftKey) {
    handleSubmit()
  }
}
</script>

<template>
  <section class="chat">
    <form id="form" @submit.prevent="handleSubmit">
      <textarea
        v-model="message"
        @keydown.enter.exact.prevent="handleKeydown"
        @keydown.shift.enter.stop
        id="inputMsg"
        rows="3"
        :placeholder="t('message') + '...'"
        maxlength="500"
        autocomplete="off"
      >
      </textarea>
      <button class="send">
        <SendIcon />
      </button>
    </form>
  </section>
</template>
