<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '@/supabaseClient'
import ChatView from '@/components/ChatView.vue'
import UnknowChat from './UnknowChat.vue'

const route = useRoute()
const room = computed(() => String(route.params.room || ''))

const loading = ref(true)
const roomExists = ref(false)
const isTemporal = ref(false)
const roomName = ref('')

async function getChat(roomId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('id, created_at, name, temporal')
    .eq('id', roomId)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

async function loadChat(roomId: string) {
  loading.value = true
  const chat = await getChat(roomId)
  roomExists.value = !!chat
  if (chat) {
    isTemporal.value = chat.temporal
    roomName.value = chat.name
  } else {
    isTemporal.value = false
    roomName.value = ''
  }
  loading.value = false
}

onMounted(async () => {
  await loadChat(room.value)
})

watch(room, async (newRoom, oldRoom) => {
  if (newRoom && newRoom !== oldRoom) {
    await loadChat(newRoom)
  }
})
</script>

<template>
  <div>
    <div v-if="loading">Loading chat...</div>

    <ChatView v-else-if="roomExists" :room="room" :temporal="isTemporal" :name="roomName" />

    <UnknowChat v-else />
  </div>
</template>
