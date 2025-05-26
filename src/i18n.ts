import { createI18n } from 'vue-i18n'
import en from './languages/en.json'
import fr from './languages/fr.json'

const messages = {
  en,
  fr
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})
