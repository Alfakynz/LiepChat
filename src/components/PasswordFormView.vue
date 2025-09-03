<script lang="ts" setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  post: {
    type: Function,
    required: true,
  },
  inputType: {
    type: String,
    default: 'password',
  },
  buttonText: {
    type: String,
    default: 'Submit',
  },
  t: {
    type: Function,
    required: false,
    default: (key: string) => key,
  },
  statusMessage: {
    type: String,
    default: '',
  },
  statusType: {
    type: String,
    default: 'success', // 'success' or 'error'
  },
})

const newPassword = ref('')
const confirmPassword = ref('')

// Generate unique ID for inputs
const newPasswordId = `input-new-${Math.random().toString(36).substr(2, 9)}`
const confirmPasswordId = `input-confirm-${Math.random().toString(36).substr(2, 9)}`

function handleSubmit() {
  if (!newPassword.value || !confirmPassword.value) {
    alert('Tous les champs sont requis.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Les nouveaux mots de passe ne correspondent pas.')
    return
  }

  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('Aucun utilisateur connecté.')
    return
  }

  props.post(newPassword.value)

  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label :for="newPasswordId">{{ t('newPassword') }}</label>
      <input :id="newPasswordId" :type="inputType" v-model="newPassword" required />
    </div>

    <div>
      <label :for="confirmPasswordId">{{ t('confirmPassword') }}</label>
      <input :id="confirmPasswordId" :type="inputType" v-model="confirmPassword" required />
    </div>

    <button type="submit">{{ buttonText }}</button>
    <p
      v-if="statusMessage"
      :class="['mt-2 text-sm', statusType === 'error' ? 'text-red-600' : 'text-green-600']"
    >
      {{ statusMessage }}
    </p>
  </form>
</template>
