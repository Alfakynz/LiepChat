<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MoonIcon from '@/assets/icons/MoonIcon.vue'
import SunIcon from '@/assets/icons/SunIcon.vue'

const currentTheme = ref('dark')

onMounted(() => {
  const toggleButton = document.getElementById('theme-toggle')
  const html = document.documentElement

  function setTheme(theme: string | null) {
    html.classList.remove('light', 'dark')
    if (theme) html.classList.add(theme)
    localStorage.setItem('theme', theme || '')
    currentTheme.value = theme || 'light'
  }

  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') {
    setTheme(storedTheme)
  }

  toggleButton?.addEventListener('click', () => {
    const isDark = html.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  })
})
</script>

<template>
  <button id="theme-toggle">
    <component v-if="currentTheme === 'dark'" :is="MoonIcon" />
    <component v-else :is="SunIcon" />
  </button>
</template>
