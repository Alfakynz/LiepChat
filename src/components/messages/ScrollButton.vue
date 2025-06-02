<template>
  <transition name="fade">
    <button
      v-if="!isAtBottom"
      class="scroll-button"
      @click="scrollToBottom"
      title="Revenir en bas"
    >
      ↓
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isAtBottom = ref(true)
let mainElement: HTMLElement | null = null

function checkIfAtBottom() {
  if (!mainElement) return
  // On considère qu'on est en bas si on est à moins de 10px du bas
  const threshold = 10
  const scrollPosition = mainElement.scrollTop + mainElement.clientHeight
  const scrollHeight = mainElement.scrollHeight
  isAtBottom.value = scrollHeight - scrollPosition <= threshold
}

onMounted(() => {
  mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.addEventListener('scroll', checkIfAtBottom)
    // vérifier initialement si on est en bas
    checkIfAtBottom()
  }
})

onBeforeUnmount(() => {
  if (mainElement) {
    mainElement.removeEventListener('scroll', checkIfAtBottom)
  }
})

function scrollToBottom() {
  if (mainElement) {
    mainElement.scrollTo({
      top: mainElement.scrollHeight,
      behavior: 'smooth'
    })
  }
}
</script>
