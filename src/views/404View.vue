<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <section>
    <p>{{ t('error.404[0]') }}: {{ t('error.404[1]') }}</p>
    <p>
      <a href="#" @click.prevent="goBack">{{ t('back') }}</a>
    </p>
  </section>
</template>
