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

const errorMessage = ref('')
const loading = ref(false)

const signUp = async () => {
  const randomColor = getRandomColor()
  errorMessage.value = ''

  if (password.value.length < 8) {
    errorMessage.value = t('error.passwordTooShort')
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('error.passwordsDoNotMatch')
    return
  }

  loading.value = true

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

  loading.value = false

  if (error?.message?.includes('already registered')) {
    errorMessage.value = t('error.userAlreadyExist')
    return
  }

  if (error) {
    console.error('Error during sign up:', error.message)
    errorMessage.value = error.message || t('error.connection')
    return
  }

  // if (data.session === null) {
  //   errorMessage.value = t('error.connection')
  //   return
  // }

  const user = data.user
  if (!user) {
    errorMessage.value = t('error.userDataMissing')
    return
  }

  //localStorage.setItem('user', JSON.stringify(user))
  //window.location.href = '/home'
  router.push('/email')
}

onMounted(() => {
  isConnected(router)
})
</script>

<template>
  <section>
    <form @submit.prevent="signUp">
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
      <button type="submit" :disabled="loading">
        {{ loading ? t('loading') : t('signup') }}
      </button>
    </form>
    <p>
      {{ t('haveAccount') }}
      <RouterLink to="/signin">{{ t('login') }}</RouterLink>
    </p>
  </section>
</template>
