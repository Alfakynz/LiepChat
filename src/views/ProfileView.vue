<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormView from '@/components/FormView.vue'
import LanguageButton from '../components/LanguageButton.vue'
//import PasswordFormView from '@/components/PasswordFormView.vue'
import eventBus from '@/eventBus'

const { t } = useI18n()

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

const username = ref<string>('')
const userColor = ref<string>('')
const userImage = ref<string>('')
const userEmail = ref<string>('')

const isImageUrl = ref<boolean>(false)

function checkImageUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

watch(userImage, (newVal) => {
  isImageUrl.value = checkImageUrl(newVal)
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    username.value = user.user_metadata.username || 'User'
    userColor.value = user.user_metadata.color || '$text-color'
    userImage.value = user.user_metadata.image || ''
    userEmail.value = user.email || user.user_metadata?.email || 'No email provided'
  }
})

const refreshSignin = async () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const userId = user.id || user.user_metadata?.user_id
  if (!userId) {
    alert('No user ID found.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/refresh-signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error refreshing sign-in.')
      return
    }

    const data = await response.json()
    const refreshedUser = data.user
    console.log('Refreshed user:', refreshedUser)
    localStorage.setItem('user', JSON.stringify(refreshedUser))
    username.value = refreshedUser.user_metadata.username || 'User'
    userColor.value = refreshedUser.user_metadata.color || '$text-color'
    userImage.value = refreshedUser.user_metadata.image || ''
    userEmail.value =
      refreshedUser.email || refreshedUser.user_metadata?.email || 'No email provided'
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

const deleteAccount = async () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const email = user.email || user.user_metadata?.email
  const userId = user.id || user.user_metadata?.user_id
  if (!email) {
    alert('No email found for the user.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/delete-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error deleting account.')
      return
    }

    localStorage.removeItem('user')
    window.location.href = '/signup'
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

const showDeleteConfirm = ref(false)

function confirmDelete() {
  showDeleteConfirm.value = true
}

function cancelDelete() {
  showDeleteConfirm.value = false
}

function handleDeleteConfirmed() {
  showDeleteConfirm.value = false
  deleteAccount()
}

const updateUsername = async (newUsername: string) => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const userId = user.id || user.user_metadata?.user_id
  if (!userId) {
    alert('No user ID found.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/update-username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newUsername }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error updating username.')
      return
    }

    const data = await response.json()
    const updatedUser = data.user
    console.log('Updated user:', updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    username.value = updatedUser.user_metadata.username || 'User'
    eventBus.emit('userUpdated')
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

const updateEmail = async (newEmail: string) => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const userId = user.id || user.user_metadata?.user_id
  if (!userId) {
    alert('No user ID found.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/update-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newEmail }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error updating email.')
      return
    }

    const data = await response.json()
    const updatedUser = data.user
    console.log('Updated user:', updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    userEmail.value = updatedUser.email || newEmail
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

const updateColor = async (newColor: string) => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const userId = user.id || user.user_metadata?.user_id
  if (!userId) {
    alert('No user ID found.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/update-color`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newColor }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error updating color.')
      return
    }

    const data = await response.json()
    const updatedUser = data.user
    console.log('Updated user:', updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    userColor.value = updatedUser.user_metadata.color || newColor
    eventBus.emit('userUpdated')
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

const updateImage = async (newImage: string) => {
  const storedUser = localStorage.getItem('user')
  if (newImage === '') {
    newImage = ' '
  }
  if (!storedUser) {
    alert('No user is logged in.')
    return
  }
  const user = JSON.parse(storedUser)
  const userId = user.id || user.user_metadata?.user_id
  if (!userId) {
    alert('No user ID found.')
    return
  }
  try {
    const response = await fetch(`${API_URL}/update-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newImage }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.message || 'Error updating image.')
      return
    }

    const data = await response.json()
    const updatedUser = data.user
    console.log('Updated user:', updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    userImage.value = updatedUser.user_metadata.image || newImage
    eventBus.emit('userUpdated')
  } catch (error) {
    console.error(error)
    alert('Server connection error.')
  }
}

// const updatePassword = async ({
//   currentPassword,
//   newPassword,
// }: {
//   currentPassword: string
//   newPassword: string
// }) => {
//   const storedUser = localStorage.getItem('user')
//   if (!storedUser) {
//     alert('No user is logged in.')
//     return
//   }

//   const user = JSON.parse(storedUser)
//   const userId = user.id || user.user_metadata?.user_id
//   if (!userId) {
//     alert('No user ID found.')
//     return
//   }

//   try {
//     const response = await fetch(`${API_URL}/update-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         currentPassword,
//         newPassword,
//       }),
//     })

//     if (!response.ok) {
//       const data = await response.json()
//       alert(data.message || 'Error updating password.')
//       return
//     }

//     const data = await response.json()
//     alert(data.message || 'Password updated successfully.')
//   } catch (error) {
//     console.error(error)
//     alert('Server connection error.')
//   }
// }
</script>

<template>
  <section>
    <div>
      <img v-if="isImageUrl" class="profile-img" :src="userImage" :alt="username[0]" />
      <span
        v-else
        class="profile-img"
        :style="{
          color: userColor,
          backgroundColor: userColor + '80',
        }"
      >
        {{ username[0] }}
      </span>
    </div>
    <h1>{{ username }}</h1>
    <FormView
      :label="t('color')"
      inputType="text"
      :placeholder="userColor"
      :buttonText="t('changeColor')"
      :post="updateColor"
    />
    <FormView
      :label="t('image')"
      inputType="text"
      :labelRequired="false"
      :placeholder="userImage"
      :buttonText="t('changeImage')"
      :post="updateImage"
    />
  </section>
  <section>
    <FormView
      :label="t('username')"
      inputType="text"
      :placeholder="username"
      :buttonText="t('changeUsername')"
      :post="updateUsername"
    />
    <FormView
      :label="t('email')"
      inputType="text"
      :placeholder="userEmail"
      :buttonText="t('changeEmail')"
      :post="updateEmail"
    />
  </section>
  <!--section>
    <PasswordFormView :post="updatePassword" :buttonText="t('changePassword')" :t="t" />
  </section-->
  <section>
    <h3>{{ t('changeLanguage') }}</h3>
    <LanguageButton />
  </section>
  <section>
    <button @click="refreshSignin">{{ t('refreshSignin') }}</button>
    <br />
    <button @click="logout">{{ t('logout') }}</button>
    <br />
    <button @click="confirmDelete" class="delete-account">
      {{ t('deleteAccount') }}
    </button>
    <div v-if="showDeleteConfirm" class="language-modal">
      <div class="language-backdrop" @click="cancelDelete"></div>
      <div class="language-popup">
        <p>{{ t('confirmDeleteAccount') }}</p>
        <div class="popup-buttons">
          <button @click="handleDeleteConfirmed" class="confirm-btn">{{ t('confirm') }}</button>
          <button @click="cancelDelete" class="cancel-btn">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
