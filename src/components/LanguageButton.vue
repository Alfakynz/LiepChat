<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

function toggleLanguage() {
  const newLang = locale.value === 'en' ? 'fr' : 'en'
  locale.value = newLang
  localStorage.setItem('lang', newLang)
}
</script>

<template>
  <button @click="toggleLanguage" id="language-toggle">
    <span v-if="locale === 'en'">English</span>
    <span v-else>Français</span>
  </button>
</template>
