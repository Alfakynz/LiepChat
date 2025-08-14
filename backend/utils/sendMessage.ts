import { supabase } from '../supabaseClient'
import { MessagePayload } from '../types'

export async function sendMessage(msg: MessagePayload, room: string) {
  const { data, error } = await supabase
    .from(room + '-chat')
    .insert([{ userId: msg.userId, content: msg.content, date: msg.date }])

  if (error) {
    console.error('Error inserting:', error)
  } else {
    console.log('Data inserted: ', data)
  }
}
