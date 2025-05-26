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
    <p>{{ t('PageNotFound') }}</p>
    <p><a href="#" @click.prevent="goBack">{{ t('Back') }}</a></p>
  </section>
</template>
