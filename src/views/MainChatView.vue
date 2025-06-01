<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import socket from '@/socket'
import InputMessage from '@/components/messages/InputMessage.vue'
import ConnectedUser from '@/components/messages/ConnectedUser.vue'
import Message from '@/components/messages/Message.vue'

const username = ref<string>('')
const userColor = ref<string>('')
const userImage = ref<string>('')

const messages = ref<
  Array<{ user: string; color: string; image?: string; date: string; content: string }>
>([])

const connectedUsers = ref<Array<{ username: string; userColor: string; userImage: string }>>([])

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    username.value = user.user_metadata.username || 'User'
    userColor.value = user.user_metadata.color || '$text-color'
    userImage.value = user.user_metadata.image || ''
  }

  socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id)
  })

  socket.on(
    'message',
    (msg: { user: string; color: string; image: string; date: string; content: string }) => {
      messages.value.push(msg)
    },
  )

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on(
    'connectedUsers',
    (users: Array<{ username: string; userColor: string; userImage: string }>) => {
      connectedUsers.value = users
    },
  )

  socket.emit('registerUser', {
    username: username.value,
    userColor: userColor.value,
    userImage: userImage.value,
  })
})

onBeforeUnmount(() => {
  socket.emit('unregisterUser')
  socket.off('message')
  socket.off('disconnect')
  socket.off('connectedUsers')
})
</script>

<template>
  <ConnectedUser :connectedUsers="connectedUsers" />
  <section class="chat-box chat">
    <div v-for="(msg, index) in messages" :key="index" class="message">
      <Message
        :user="msg.user"
        :color="msg.color"
        :image="msg.image"
        :date="msg.date"
        :content="msg.content"
      />
    </div>
  </section>
  <InputMessage :username="username" :userColor="userColor" :userImage="userImage" />
</template>
