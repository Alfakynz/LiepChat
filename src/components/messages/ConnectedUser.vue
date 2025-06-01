<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  connectedUsers: Array<{
    username: string
    userColor: string
    userImage: string
  }>
}>()

const { t } = useI18n()
</script>

<template>
  <section class="connectedUsers chat">
    <h3>
      <span id="connectedUsers">{{ connectedUsers.length + ' ' }}</span>
      <span id="connectedUsersText">
        {{ connectedUsers.length > 1 ? t('connectedUsers') : t('connectedUser') }}
      </span>
    </h3>
    <!-- <ul class="connected-users-list">
      <li v-for="(user, index) in connectedUsers" :key="index">
        <img :src="user.userImage" alt="user image" class="user-avatar" />
        <span :style="{ color: user.userColor }">{{ user.username }}</span>
      </li>
    </ul> -->
  </section>
</template>
