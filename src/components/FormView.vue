<script lang="ts" setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  labelRequired: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  inputType: {
    type: String,
    default: 'text',
  },
  buttonText: {
    type: String,
    default: 'Submit',
  },
  post: {
    type: Function,
    required: true,
  },
})

const inputValue = ref('')
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

function handleSubmit() {
  if (props.labelRequired && inputValue.value.trim() === '') {
    alert('Ce champ est requis.')
    return
  }

  props.post(inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="inputType"
      :placeholder="placeholder"
      v-model="inputValue"
      :required="labelRequired"
    />
    <button type="submit">{{ buttonText }}</button>
  </form>
</template>
