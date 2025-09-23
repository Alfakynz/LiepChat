<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabaseClient'
import { getRandomColor } from '@/scripts/getRandomColor'
import { isConnected } from '@/scripts/isConnected'

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

  // If an user already exist
  if (!user || !data.user || !data.user.identities || data.user.identities.length === 0) {
    alert('This email is already used, please sign in or choose another email.')
    return
  }

  localStorage.setItem('user', JSON.stringify(user))
  window.location.href = '/home'
}

onMounted(() => {
  isConnected(router)
})
</script>

<template>
  <section>
    <form @submit.prevent="signUp">
      <div>
        <input v-model="email" type="email" :placeholder="t('email')" required />
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
