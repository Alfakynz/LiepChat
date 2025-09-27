<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabaseClient'
import { isConnected } from '@/scripts/isConnected'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')

const errorMessage = ref('')

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Error during sign in:', error.message)
    errorMessage.value = error.message || t('error.connection')
    return
  }

  const user = data.user

  if (!user) {
    errorMessage.value = t('error.userDataMissing')
    alert(t('error.connection'))
    return
  }

  localStorage.setItem('user', JSON.stringify(data.user))
  window.location.href = '/home'
}

onMounted(() => {
  isConnected(router)
})
</script>

<template>
  <section>
    <form @submit.prevent="signIn">
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div>
        <input v-model="email" type="email" :placeholder="t('email')" required />
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
