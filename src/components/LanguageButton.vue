<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)

function toggleLanguage() {
  const newLang = currentLang.value === 'en' ? 'fr' : 'en'
  locale.value = newLang
  currentLang.value = newLang
  localStorage.setItem('lang', newLang)
}
</script>

<template>
  <button @click="toggleLanguage" id="language-toggle">
    <span v-if="currentLang === 'en'">English</span>
    <span v-else>Français</span>
  </button>
</template>
