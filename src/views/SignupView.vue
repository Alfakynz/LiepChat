<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const username = ref('')
const password = ref('')
const router = useRouter()

const signUp = async () => {
  if (username.value && password.value) {
    const mockUser = { username: username.value }
    localStorage.setItem('user', JSON.stringify(mockUser))
    router.push('/home')
  } else {
    alert('Veuillez remplir tous les champs.')
  }
}
</script>

<template>
  <section>
    <form @submit.prevent="signUp">
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
