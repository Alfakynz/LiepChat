<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import NavView from './components/NavView.vue'

const route = useRoute()
</script>

<template>
  <header>
    <h1>{{ route.meta.title || 'Page' }}</h1>
  </header>

  <NavView />

  <main>
    <RouterView />
  </main>
</template>
