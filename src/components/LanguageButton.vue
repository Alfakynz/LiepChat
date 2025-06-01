<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const showLangMenu = ref(false)

// Liste des langues disponibles
const languages = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'fr', label: '🇫🇷 Français' },
  // Ajoute d'autres langues ici si besoin
]

function selectLanguage(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
  showLangMenu.value = false
}

function getLangLabel(code: string): string {
  const lang = languages.find(l => l.code === code)
  return lang?.label || code
}

onMounted(() => {
  const savedLang = localStorage.getItem('lang')
  if (savedLang) {
    locale.value = savedLang
  }
})
</script>

<template>
  <div class="lang-selector">
    <button @click="showLangMenu = true" id="language-toggle">
      {{ getLangLabel(locale) }}
    </button>

    <div v-if="showLangMenu" class="language-modal">
      <div class="language-backdrop" @click="showLangMenu = false"></div>
      <div class="language-popup">
        <h2>🌐 {{ t('chooseLanguage') }}</h2>
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>
  </div>
</template>
