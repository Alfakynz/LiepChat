<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <section>
    <p>Page not found</p>
    <p><a href="#" @click.prevent="goBack">Back</a></p>
  </section>
</template>
