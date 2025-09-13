import { supabaseWithAuth } from '../supabaseClient'
import { MessagePayload } from '../types'

export const getMessages = async (room: string, token: string) => {
  const { data, error } = await supabaseWithAuth(token)
    .from('messages')
    .select('*')
    .eq('chat_id', room)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error getting messages:', error)
  } else {
    return data.map((message) => {
      return {
        ...message,
        user_id: message.user_id,
        created_at: new Date(message.created_at).toISOString(),
      } as MessagePayload
    })
  }
}
