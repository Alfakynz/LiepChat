// backend/routes.ts
import { Router } from 'express'
import { supabaseAdmin } from './supabaseClient'

const router = Router()

// Main route
router.get('/', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/home` || 'http://localhost:5173/home')
})

// Delete User
router.post('/delete-account', async (req, res) => {
  const { user_id } = req.body
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'User deleted successfully' })
})

export default router
