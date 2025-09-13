import { supabaseWithAuth } from '../supabaseClient'
import { MessagePayload } from '../types'

export const sendMessage = async (msg: MessagePayload, room: string, token: string) => {
  const { error } = await supabaseWithAuth(token)
    .from('messages')
    .insert([
      { chat_id: room, user_id: msg.user_id, content: msg.content, created_at: msg.created_at },
    ])

  if (error) {
    console.error('Error inserting:', error)
  }
}
