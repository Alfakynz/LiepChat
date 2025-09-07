<script setup lang="ts">
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
