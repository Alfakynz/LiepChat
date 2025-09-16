import { supabaseAdmin } from '../supabaseClient'

export const getUsernameById = async (user_id: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(user_id)

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  const username = data.user.user_metadata.username
  return username || '[deleted]'
}
