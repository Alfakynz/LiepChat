<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const signUp = async () => {
  // This function can be used to trigger any action, if needed
}
</script>

<template>
  <section>
    <h1>{{ t('verifyEmail') }}</h1>
    <p>
      {{ t('checkYourEmail') }}
      <br />
      {{ t('clickLinkToContinue') }}
    </p>
    <form @submit.prevent="signUp">
      <button type="submit">{{ t('checkEmail') }}</button>
    </form>
  </section>
</template>
