import type { Router } from 'vue-router'

export const isConnected = (router: Router) => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    router.push('/home')
  }
}
