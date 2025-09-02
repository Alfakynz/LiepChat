<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabaseClient'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Error during sign in:', error.message)
    alert(error.message || 'Connection error.')
    return
  }

  const user = data.user

  if (!user) {
    alert('User data is missing after sign in.')
    return
  }

  localStorage.setItem('user', JSON.stringify(data.user))
  window.location.href = '/home'
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
