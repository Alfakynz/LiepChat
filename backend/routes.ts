// backend/routes.ts
import { Router } from 'express'
import { supabase, supabaseAdmin } from './supabaseClient'
import { SignUpData, SignInData } from './types'
import getRandomColor from './utils/getRandomColor'

const router = Router()

// Main route
router.get('/', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/home` || 'http://localhost:5173/home')
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
        image: '',
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

// Update Username
router.post('/update-username', async (req, res) => {
  const { userId, newUsername } = req.body

  if (!userId || !newUsername) {
    return res.status(400).json({ error: 'userId and newUsername are required' })
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { username: newUsername },
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Username updated successfully', user: data.user })
})

// Update Email
router.post('/update-email', async (req, res) => {
  const { userId, newEmail } = req.body

  if (!userId || !newEmail) {
    return res.status(400).json({ error: 'userId and newEmail are required' })
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email: newEmail,
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Email updated successfully', user: data.user })
})

// Update Color
router.post('/update-color', async (req, res) => {
  const { userId, newColor } = req.body
  if (!userId || !newColor) {
    return res.status(400).json({ error: 'userId and newColor are required' })
  }
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { color: newColor },
  })
  if (error) {
    return res.status(400).json({ error: error.message })
  }
  res.json({ message: 'Color updated successfully', user: data.user })
})

// Update Image
router.post('/update-image', async (req, res) => {
  const { userId, newImage } = req.body
  if (!userId || !newImage) {
    return res.status(400).json({ error: 'userId and newImage are required' })
  }
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { image: newImage },
  })
  if (error) {
    return res.status(400).json({ error: error.message })
  }
  res.json({ message: 'Image updated successfully', user: data.user })
})

// Refresh sign-in session
router.post('/refresh-signin', async (req, res) => {
  const { userId } = req.body

  // Fetch the user by userId using supabaseAdmin
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
  if (error || !data?.user) {
    return res.status(400).json({ error: error?.message || 'User not found' })
  }
  // Refresh the session
  res.json({ message: 'User fetched successfully', user: data.user })
})

// Delete User
router.post('/delete-account', async (req, res) => {
  const { userId } = req.body
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'User deleted successfully' })
})

export default router
