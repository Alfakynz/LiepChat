import { supabaseWithAuth } from '../supabaseClient'
import { MessagePayload } from '../types'

export const sendMessage = async (msg: MessagePayload, room: string, token: string) => {
  const { error } = await supabaseWithAuth(token)
    .from(room + '-chat')
    .insert([{ user_id: msg.user_id, content: msg.content, date: msg.date }])

  if (error) {
    console.error('Error inserting:', error)
  }
}
