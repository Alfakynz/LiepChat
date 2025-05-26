<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/')
}

const username = ref<string>('')

// Charger le nom de l'utilisateur à partir du localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    username.value = user.username || 'User'
  }
})
</script>

<template>
  <section>
    <h3>{{ t('welcome') }} {{ username }}</h3>
    <button @click="logout">{{ t('logout') }}</button>
  </section>
</template>
