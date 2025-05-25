<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import NavView from './components/NavView.vue'
import ThemeButton from './components/ThemeButton.vue'

const route = useRoute()
</script>

<template>
  <header>
    <RouterLink to="/">
      <img src="/src/assets/images/logos/logo.png" alt="Website Logo" class="logo" />
    </RouterLink>
    <h1>{{ route.meta.title || 'Page' }}</h1>
    <ThemeButton />
  </header>

  <NavView />

  <main>
    <RouterView />
  </main>
</template>
