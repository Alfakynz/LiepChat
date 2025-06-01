<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

const deleteAccount = async () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const email = user.email || user.user_metadata?.email
  const userId = user.id || user.user_metadata?.user_id
  if (!email) {
    alert('No email found for the user.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/delete-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error deleting account.')
      return
    }

    localStorage.removeItem('user')
    window.location.href = '/signup'
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
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
    <h3>{{ t('profile') }}</h3>
    <button @click="logout">{{ t('logout') }}</button>
    <button @click="deleteAccount" class="delete-account">{{ t('deleteAccount') }}</button>
  </section>
</template>
