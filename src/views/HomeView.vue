<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageButton from '@/components/LanguageButton.vue'
import { setStoredUser } from '@/scripts/setStoredUser'

const { t } = useI18n()
const username = ref<string>('')

onMounted(() => {
  const stored = setStoredUser()
  username.value = stored.username ?? 'User'
})
</script>

<template>
  <section>
    <h3>{{ t('welcome') }} {{ username }}</h3>
    <p>{{ t('welcomeExplanation') }}</p>
  </section>

  <section>
    <h3>{{ t('changeLanguage') }}</h3>
    <LanguageButton />
  </section>

  <section>
    <h3>{{ t('markdown.title') }}</h3>
    <p>
      <template v-for="i in 13" :key="i">
        <span v-if="t(`markdown.text.${i - 1}`)"> {{ t(`markdown.text.${i - 1}`) }}<br /> </span>
      </template>
    </p>
  </section>
</template>
