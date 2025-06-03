import { supabaseAdmin } from '../supabaseClient'

export async function getUsernameById(userId) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  const username = data.user.user_metadata.username
  return username || null
}
