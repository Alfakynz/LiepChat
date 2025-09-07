<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageButton from '@/components/LanguageButton.vue'
import { isConnected } from '@/scripts/isConnected'

const { t } = useI18n()
const router = useRouter()

onMounted(() => {
  isConnected(router)
})
</script>

<template>
  <section>
    <h3>{{ t('welcomeMessage') }}</h3>
    <p>
      {{ t('toAccessChat') }} <RouterLink to="/signin">{{ t('login') }}</RouterLink>
      {{ t('signin/up[2]') }} <RouterLink to="signup">{{ t('createAccount') }}</RouterLink
      >.
    </p>
    <p>
      {{ t('codeGitHub') }}
      <a target="_blank" href="https://github.com/Alfakynz/LiepChat">GitHub</a>
    </p>
  </section>
  <section>
    <h3>{{ t('changeLanguage') }}</h3>
    <LanguageButton />
  </section>
</template>
