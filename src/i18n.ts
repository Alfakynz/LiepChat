import { createI18n } from 'vue-i18n'
import en from './languages/en.json'
import fr from './languages/fr.json'

const messages = {
  en,
  fr,
}

// Récupère la langue enregistrée, sinon utilise la langue du navigateur
const savedLang = localStorage.getItem('lang')
const browserLang = navigator.language.split('-')[0] // ex: "fr-FR" → "fr"

// Si la langue est supportée (en/fr), on l'utilise, sinon "en"
const defaultLang = savedLang || (['en', 'fr'].includes(browserLang) ? browserLang : 'en')

export const i18n = createI18n({
  legacy: false,
  locale: defaultLang,
  fallbackLocale: 'en',
  messages,
})
