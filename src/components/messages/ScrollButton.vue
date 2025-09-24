<template>
  <transition name="fade">
    <button v-if="!isAtBottom" class="scroll-button" @click="scrollToBottom">
      <ArrowBottom />
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ArrowBottom from '@/assets/icons/ArrowBottom.vue'

const isAtBottom = ref(true)
let mainElement: HTMLElement | null = null

function checkIfAtBottom() {
  if (!mainElement) return
  const threshold = 10 // px from bottom
  const scrollPosition = mainElement.scrollTop + mainElement.clientHeight
  const scrollHeight = mainElement.scrollHeight
  isAtBottom.value = scrollHeight - scrollPosition <= threshold
}

onMounted(() => {
  mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.addEventListener('scroll', checkIfAtBottom)
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
      behavior: 'smooth',
    })
  }
}
</script>
