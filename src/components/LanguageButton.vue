<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import usFlag from '@/assets/images/icons/us_flag.svg'
import frFlag from '@/assets/images/icons/fr_flag.svg'

const { locale, t } = useI18n()
const showLangMenu = ref(false)

// Liste des langues disponibles
const languages = [
  { code: 'en', label: 'English', flag: usFlag },
  { code: 'fr', label: 'Français', flag: frFlag },
  // Ajoute d'autres langues ici si besoin
]

const currentLangFlag = computed(() => {
  const lang = languages.find((l) => l.code === locale.value)
  return lang?.flag || null
})

function selectLanguage(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
  showLangMenu.value = false
}

function getLangLabel(code: string): string {
  const lang = languages.find((l) => l.code === code)
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
      <img v-if="currentLangFlag" :src="currentLangFlag" alt="" class="flag-icon" />
      {{ getLangLabel(locale) }}
    </button>

    <div v-if="showLangMenu" class="language-modal">
      <div class="language-backdrop" @click="showLangMenu = false"></div>
      <div class="language-popup">
        <h2>🌐 {{ t('chooseLanguage') }}</h2>
        <button v-for="lang in languages" :key="lang.code" @click="selectLanguage(lang.code)">
          <img :src="lang.flag" alt="" class="flag-icon" />
          {{ lang.label }}
        </button>
      </div>
    </div>
  </div>
</template>
