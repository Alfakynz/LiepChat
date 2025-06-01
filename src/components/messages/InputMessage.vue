<script setup lang="ts">
import { defineProps } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import socket from '@/socket'

const { t } = useI18n()

const props = defineProps<{
  username: string
  userColor: string
  userImage: string
}>()

const message = ref('')

function sendMessage(content: string) {
  socket.emit('message', {
    user: props.username,
    color: props.userColor,
    image: props.userImage,
    date: new Date().toISOString(),
    content,
  })
}

function handleSubmit() {
  if (message.value.trim()) {
    sendMessage(message.value.trim())
    message.value = ''
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!event.shiftKey) {
    handleSubmit()
  }
}
</script>

<template>
  <section class="chat">
    <form id="form" @submit.prevent="handleSubmit">
      <textarea
        v-model="message"
        @keydown.enter.exact.prevent="handleKeydown"
        @keydown.shift.enter.stop
        id="inputMsg"
        rows="3"
        :placeholder="t('message') + '...'"
        maxlength="500"
        autocomplete="off"
      >
      </textarea>
      <button class="send">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
          <g id="_01_align_center" data-name="01 align center">
            <path
              d="M1.444,6.669a2,2,0,0,0-.865,3.337l3.412,3.408V20h6.593l3.435,3.43a1.987,1.987,0,0,0,1.408.588,2.034,2.034,0,0,0,.51-.066,1.978,1.978,0,0,0,1.42-1.379L23.991.021ZM2,8.592l17.028-5.02L5.993,16.586v-4Zm13.44,13.424L11.413,18h-4L20.446,4.978Z"
            />
          </g>
        </svg>
      </button>
    </form>
  </section>
</template>
