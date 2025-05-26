import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import AboutView from '../views/AboutView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/404View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: {
        title: 'Welcome',
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
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: '404 - Not Found',
      },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'signin' })
  } else {
    next()
  }
})


export default router
