import { supabaseWithAuth } from '../supabaseClient'
import { MessagePayload } from '../types'

export const getMessages = async (room: string, token: string) => {
  const { data, error } = await supabaseWithAuth(token)
    .from(room + '-chat')
    .select('*')

  if (error) {
    console.error('Error getting messages:', error)
  } else {
    return data.map((message) => {
      return {
        ...message,
        user_id: message.user_id,
        date: new Date(message.date).toISOString(),
      } as MessagePayload
    })
  }
}
