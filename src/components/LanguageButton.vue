<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FlagFrIcon from '@/assets/icons/FlagFrIcon.vue'
import FlagUsIcon from '@/assets/icons/FlagUsIcon.vue'

const { locale, t } = useI18n()
const showLangMenu = ref(false)

// Languages avaible
const languages = [
  { code: 'en', label: 'English', flag: FlagUsIcon },
  { code: 'fr', label: 'Français', flag: FlagFrIcon },
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
      <component v-if="currentLangFlag" :is="currentLangFlag" class="flag-icon" />
      {{ getLangLabel(locale) }}
    </button>

    <div v-if="showLangMenu" class="language-modal">
      <div class="language-backdrop" @click="showLangMenu = false"></div>
      <div class="language-popup">
        <h2>🌐 {{ t('chooseLanguage') }}</h2>
        <button v-for="lang in languages" :key="lang.code" @click="selectLanguage(lang.code)">
          <component :is="lang.flag" class="flag-icon" />
          {{ lang.label }}
        </button>
      </div>
    </div>
  </div>
</template>
