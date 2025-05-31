<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  to: string
  label: string
}>()
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ navigate, href }">
    <a :href="href" @click="navigate">
      <slot name="icon"></slot>
      <div>{{ label }}</div>
    </a>
  </RouterLink>
</template>
