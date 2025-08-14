import { supabaseAdmin } from '../supabaseClient'

export async function getImageById(userId) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  const username = data.user.user_metadata.image
  return username || 'Unknow user'
}
