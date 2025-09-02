<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabaseClient'
import getRandomColor from '@/scripts/getRandomColor'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const signUp = async () => {
  const randomColor = getRandomColor()

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value,
        color: randomColor,
        image: '',
      },
    },
  })

  if (error) {
    console.error('Error during sign up:', error.message)
    alert(error.message || 'Connection error.')
    return
  }

  const user = data.user

  if (!user) {
    alert('User data is missing after sign up.')
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
