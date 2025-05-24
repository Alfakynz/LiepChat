import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'About',
      },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
      meta: {
        title: 'Sign in',
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: {
        title: 'Sign up',
      },
    },
  ],
})

export default router
