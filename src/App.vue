<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavView from './components/NavView.vue'
import ThemeButton from './components/ThemeButton.vue'

const { t } = useI18n()

const route = useRoute()
</script>

<template>
  <header>
    <RouterLink to="/">
      <img src="/src/assets/images/logos/logo.png" alt="Website Logo" class="logo" />
    </RouterLink>
    <h1>{{ t(route.name as string) || 'Page' }}</h1>
    <ThemeButton />
  </header>

  <NavView />

  <main>
    <RouterView />
  </main>
</template>
