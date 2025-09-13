<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'
import ChatView from '@/components/ChatView.vue'
import UnknowChat from './UnknowChat.vue'

const route = useRoute()
const room = route.params.room as string

const loading = ref(true)
const roomExists = ref(false)
const isTemporal = ref(false)

async function getChat(room: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('id, created_at, name, temporal')
    .eq('id', room)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

onMounted(async () => {
  const chat = await getChat(room)
  roomExists.value = !!chat
  if (chat) {
    isTemporal.value = chat.temporal
  }
  loading.value = false
})
</script>

<template>
  <div>
    <div v-if="loading">Loading chat...</div>

    <ChatView v-else-if="roomExists" :room="room" :temporal="isTemporal" />

    <UnknowChat v-else />
  </div>
</template>
