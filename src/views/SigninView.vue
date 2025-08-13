<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

const email = ref('')
const password = ref('')

const signIn = async () => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Connection error.')
      return
    }

    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.href = '/home'
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    router.push('/home')
  }
})
</script>

<template>
  <section>
    <form @submit.prevent="signIn">
      <div>
        <input v-model="email" type="text" :placeholder="t('email')" required />
      </div>
      <div>
        <input v-model="password" type="password" :placeholder="t('password')" required />
      </div>
      <button type="submit">{{ t('signin') }}</button>
    </form>
    <p>
      {{ t('dontHaveAccount') }} <RouterLink to="/signup">{{ t('createAccount') }}</RouterLink>
    </p>
  </section>
</template>
