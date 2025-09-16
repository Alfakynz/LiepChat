import { supabaseAdmin } from '../supabaseClient'

export const getColorById = async (user_id: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(user_id)

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  const color = data.user.user_metadata.color
  return color || '#808080'
}
