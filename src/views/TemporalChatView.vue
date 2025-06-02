<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
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

// ref pour l'élément <main> qui scroll
const mainElement = ref<HTMLElement | null>(null)

onMounted(() => {
  mainElement.value = document.querySelector('main')

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

  socket.on('message', (msg) => {
    messages.value.push(msg)
    nextTick(() => {
      if (mainElement.value) {
        mainElement.value.scrollTo({
          top: mainElement.value.scrollHeight,
          behavior: 'smooth'
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
    username: username.value,
    userColor: userColor.value,
    userImage: userImage.value,
  })

  window.addEventListener('scroll', handleScroll)

  if (detectDevice() === 'computer') {
    const input = document.getElementById('inputMsg') as HTMLTextAreaElement | null
    if (input) input.focus()
  }
})

onBeforeUnmount(() => {
  socket.emit('unregisterUser')
  socket.off('message')
  socket.off('disconnect')
  socket.off('connectedUsers')
  window.removeEventListener('scroll', handleScroll)
})

function detectDevice(): 'mobile' | 'tablet' | 'computer' {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/mobile/i.test(userAgent)) {
    return 'mobile'
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet'
  } else {
    return 'computer'
  }
}

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
