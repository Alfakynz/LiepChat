// backend/routes.ts
import { Router } from 'express'
import { supabase, supabaseAdmin } from './supabaseClient'
import { SignUpData, SignInData } from './types'
import getRandomColor from './utils/getRandomColor'

const router = Router()

// Main route
router.get('/', (req, res) => {
  res.redirect('https://mzd1s2gh-5173.uks1.devtunnels.ms/home')
})

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, username, password }: SignUpData = req.body
  const randomColor = getRandomColor()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        color: randomColor,
      },
    },
  })

  if (error) return res.status(400).json({ error: error.message })

  const user = data.user

  if (!user) {
    return res.status(500).json({ error: 'User object is null after sign up.' })
  }

  res.json({ message: 'Signup successful', user })
})

// Sign In
router.post('/signin', async (req, res) => {
  const { email, password }: SignInData = req.body

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// Delete User
router.post('/delete-account', async (req, res) => {
  const { userId } = req.body
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'User deleted successfully' })
})

export default router
