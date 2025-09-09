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

async function checkTableExists(tableName: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('table_exists', { tbl_name: tableName })
  if (error) {
    console.error(error)
    return false
  }
  return data as boolean
}

onMounted(async () => {
  if (room !== 'temporal') {
    const exists = await checkTableExists(`${room}-chat`)
    roomExists.value = exists
    loading.value = false
  } else {
    roomExists.value = true
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="loading">Loading chat...</div>

    <ChatView v-else-if="roomExists" :room="room" :useTokenJoin="room === 'main'" />

    <UnknowChat v-else />
  </div>
</template>
