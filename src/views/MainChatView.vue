<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import socket from '@/socket'
import { supabase } from '@/supabaseClient'
import InputMessage from '@/components/messages/InputMessage.vue'
import ConnectedUser from '@/components/messages/ConnectedUser.vue'
import Message from '@/components/messages/Message.vue'
import { setStoredUser } from '@/scripts/setStoredUser'
import { fetchSessionToken } from '@/scripts/fetchSessionToken'
import { detectDevice } from '@/scripts/detectDevice'

const username = ref<string>('')
const user_id = ref<string>('')
const user_color = ref<string>('')
const user_image = ref<string>('')
const room = ref<string>('main')
const token = ref<string>('')

const messages = ref<
  Array<{ user_id: string; color: string; image?: string; date: string; content: string }>
>([])

const connectedUsers = ref<Array<{ username: string; user_color: string; user_image: string }>>([])

// ref for the <main> element scrolling
const mainElement = ref<HTMLElement | null>(null)

onMounted(async () => {
  mainElement.value = document.querySelector('main')

  const stored = setStoredUser()
  user_id.value = stored.user_id ?? ''
  username.value = stored.username ?? 'User'
  user_color.value = stored.user_color ?? '$text-color'
  user_image.value = stored.user_image ?? ''

  token.value = await fetchSessionToken()

  supabase.auth.onAuthStateChange((_event, session) => {
    token.value = session?.access_token ?? ''
  })

  socket.on('connect', () => {
    console.log('Connected to server')
  })

  socket.on('message', (msg) => {
    messages.value.push(msg)
    nextTick(() => {
      if (mainElement.value) {
        mainElement.value.scrollTo({
          top: mainElement.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('connectedUsers', (users) => {
    connectedUsers.value = users
  })

  socket.emit('registerUser', {
    user_id: user_id.value,
    user_color: user_color.value,
    user_image: user_image.value,
  })

  window.addEventListener('scroll', handleScroll)

  if (detectDevice() === 'computer') {
    const input = document.getElementById('inputMsg') as HTMLTextAreaElement | null
    if (input) input.focus()
  }
})

watch(token, (newToken: string) => {
  if (newToken) {
    socket.emit('joinRoom', room.value, newToken)
  }
})

onBeforeUnmount(() => {
  socket.emit('unregisterUser')
  socket.off('joinRoom')
  socket.off('message')
  socket.off('disconnect')
  socket.off('connectedUsers')
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  const textarea = document.getElementById('inputMsg')
  const connectedUsers = document.querySelector('.connectedUsers') as HTMLElement | null

  if (!textarea || !connectedUsers) return

  if (window.scrollY === 0) {
    connectedUsers.style.borderRadius = '25px'
  } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    textarea.style.borderRadius = '25px'
  } else {
    textarea.style.borderRadius = '25px 25px 0 0'
    connectedUsers.style.borderRadius = '0 0 25px 25px'
  }
}
</script>

<template>
  <ConnectedUser :connectedUsers="connectedUsers" />
  <section class="chat-box chat">
    <div v-for="(msg, index) in messages" :key="index" class="message">
      <Message
        :user="msg.user_id"
        :color="msg.color"
        :image="msg.image"
        :date="msg.date"
        :content="msg.content"
      />
    </div>
  </section>
  <InputMessage
    :user_id="user_id"
    :user_color="user_color"
    :user_image="user_image"
    :room="room"
    :token="token"
  />
</template>
