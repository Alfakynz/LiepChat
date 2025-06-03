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
    default: 'password', // mot de passe par défaut
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
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Générer des id uniques pour les inputs (comme dans le formulaire basique)
const currentPasswordId = `input-current-${Math.random().toString(36).substr(2, 9)}`
const newPasswordId = `input-new-${Math.random().toString(36).substr(2, 9)}`
const confirmPasswordId = `input-confirm-${Math.random().toString(36).substr(2, 9)}`

function handleSubmit() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('Tous les champs sont requis.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Les nouveaux mots de passe ne correspondent pas.')
    return
  }

  props.post({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })

  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label :for="currentPasswordId">{{ t('currentPassword') }}</label>
      <input
        :id="currentPasswordId"
        :type="inputType"
        v-model="currentPassword"
        required
      />
    </div>

    <div>
      <label :for="newPasswordId">{{ t('newPassword') }}</label>
      <input
        :id="newPasswordId"
        :type="inputType"
        v-model="newPassword"
        required
      />
    </div>

    <div>
      <label :for="confirmPasswordId">{{ t('confirmPassword') }}</label>
      <input
        :id="confirmPasswordId"
        :type="inputType"
        v-model="confirmPassword"
        required
      />
    </div>

    <button type="submit">{{ buttonText }}</button>
  </form>
</template>
