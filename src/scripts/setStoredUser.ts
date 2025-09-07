export const setStoredUser = () => {
  const storedUser = localStorage.getItem('user')
  let user_id: string | undefined
  let username: string | undefined
  let user_color: string | undefined
  let user_image: string | undefined
  let user_email: string | undefined
  if (storedUser) {
    const user = JSON.parse(storedUser)
    user_id = user.id
    username = user.user_metadata.username || 'User'
    user_color = user.user_metadata.color || '$text-color'
    user_image = user.user_metadata.image || ''
    user_email = user.email || user.user_metadata?.email || 'No email provided'
  }

  return { user_id, username, user_color, user_image, user_email }
}
