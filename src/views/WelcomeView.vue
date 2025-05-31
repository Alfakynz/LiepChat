<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
</template>
