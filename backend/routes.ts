// backend/routes.ts
import { Router } from 'express'
import { supabaseAdmin, supabaseWithAuth } from './supabaseClient'

const router = Router()

// Main route
router.get('/', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/home` || 'http://localhost:5173/home')
})

// Delete User
router.post('/delete-account', async (req, res) => {
  const { user_id, deleteMessages } = req.body
  if (deleteMessages) {
    const { error } = await supabaseAdmin
      .from('messages')
      .update({ content: '[deleted]' })
      .eq('user_id', user_id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }
  }
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id, true)
  if (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
  res.json({ message: 'User deleted successfully' })
})

export default router
