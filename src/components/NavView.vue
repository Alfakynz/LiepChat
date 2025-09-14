<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NavItem from './NavItem.vue'
import eventBus from '@/eventBus' // import eventBus created with mitt
import HomeIcon from '@/assets/icons/HomeIcon.vue'
import AboutIcon from '@/assets/icons/AboutIcon.vue'
import SigninIcon from '@/assets/icons/SigninIcon.vue'
import SignupIcon from '@/assets/icons/SignupIcon.vue'
import ChatIcon from '@/assets/icons/ChatIcon.vue'
import ChatTempIcon from '@/assets/icons/ChatTempIcon.vue'

const { t } = useI18n()

const username = ref<string>('')
const user_color = ref<string>('')
const user_image = ref<string>('')
const isImageUrl = ref<boolean>(false)
const isAuthenticated = ref(false)

function checkImageUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function refreshUserData() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    if (user.user_metadata) {
      username.value = user.user_metadata.username || 'User'
      user_color.value = user.user_metadata.color || '$text-color'
      user_image.value = user.user_metadata.image || ''
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  } else {
    isAuthenticated.value = false
  }
  isImageUrl.value = checkImageUrl(user_image.value)
}

// User data initialization on screen
refreshUserData()

// Update flag isImageUrl when user_image is updated
watch(user_image, (newVal) => {
  isImageUrl.value = checkImageUrl(newVal)
})

// Listen event 'userUpdated' emitted by the profile to refresh data
onMounted(() => {
  eventBus.on('userUpdated', refreshUserData)
})

onUnmounted(() => {
  eventBus.off('userUpdated', refreshUserData)
})
</script>

<template>
  <nav>
    <div v-if="!isAuthenticated">
      <!-- Nav for user not connected -->
      <NavItem to="/" :label="t('welcome')">
        <template #icon>
          <HomeIcon />
        </template>
      </NavItem>
      <NavItem to="/signin" :label="t('signin')">
        <template #icon>
          <SigninIcon />
        </template>
      </NavItem>
      <NavItem to="/signup" :label="t('signup')">
        <template #icon>
          <SignupIcon />
        </template>
      </NavItem>
      <NavItem to="/about" :label="t('about')">
        <template #icon>
          <AboutIcon />
        </template>
      </NavItem>
    </div>
    <div v-else>
      <!-- Nav for user connected -->
      <NavItem to="/home" :label="t('home')">
        <template #icon>
          <HomeIcon />
        </template>
      </NavItem>
      <NavItem to="/chat/main" :label="t('mainChat')">
        <template #icon>
          <ChatIcon />
        </template>
      </NavItem>
      <NavItem to="/chat/temporal" :label="t('temporalChat')">
        <template #icon>
          <ChatTempIcon />
        </template>
      </NavItem>
      <NavItem to="/profile" :label="t('profile')">
        <template #icon>
          <img v-if="isImageUrl" class="profile-pic" :src="user_image" :alt="username[0]" />
          <span
            v-else
            class="profile-span"
            :style="{
              color: user_color,
              backgroundColor: user_color + '80',
            }"
          >
            {{ username[0] }}
          </span>
        </template>
      </NavItem>
    </div>
  </nav>
</template>
