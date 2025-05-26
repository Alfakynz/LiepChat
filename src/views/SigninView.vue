<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const username = ref('')
const password = ref('')

const signIn = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Erreur de connexion.')
      return
    }

    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/home')
  } catch (error) {
    console.error(error)
    alert('Erreur de connexion au serveur.')
  }
}
</script>

<template>
  <section>
    <form @submit.prevent="signIn">
      <div>
        <input v-model="username" type="text" :placeholder="t('username')" required />
      </div>
      <div>
        <input v-model="password" type="password" :placeholder="t('password')" required />
      </div>
      <button type="submit">{{ t('signin') }}</button>
    </form>
    <p>{{ t('dontHaveAccount') }}<RouterLink to="/signup">{{ t('createAccount') }}</RouterLink></p>
  </section>
</template>
