<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const signUp = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match.")
    return
  }
  if (!email.value || !username.value || !password.value || !confirmPassword.value) {
    alert('Please fill all inputs.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(data)
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
</script>

<template>
  <section>
    <form @submit.prevent="signUp">
      <div>
        <input v-model="email" type="text" :placeholder="t('email')" required />
      </div>
      <div>
        <input v-model="username" type="text" :placeholder="t('username')" required />
      </div>
      <div>
        <input v-model="password" type="password" :placeholder="t('password')" required />
      </div>
      <div>
        <input
          v-model="confirmPassword"
          type="password"
          :placeholder="t('confirmPassword')"
          required
        />
      </div>
      <button type="submit">{{ t('signup') }}</button>
    </form>
    <p>
      {{ t('haveAccount') }} <RouterLink to="/signin">{{ t('login') }}</RouterLink>
    </p>
  </section>
</template>
