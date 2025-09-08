<script setup lang="ts">
import { useRoute } from 'vue-router'
import ChatView from '@/components/ChatView.vue'

const route = useRoute()
const room = route.params.room as string
</script>

<template>
  <ChatView :room="room" :useTokenJoin="room === 'main'" />
</template>
