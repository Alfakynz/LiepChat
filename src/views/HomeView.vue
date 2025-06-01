<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/home'
}

const username = ref<string>('')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    username.value = user.user_metadata.username || 'User'
  }
})
</script>

<template>
  <section>
    <h3>{{ t('welcome') }} {{ username }}</h3>
    <button @click="logout">{{ t('logout') }}</button>
  </section>
</template>
