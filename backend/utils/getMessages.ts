import { supabase } from '../supabaseClient'
import { MessagePayload } from '../types'

export async function getMessages(room: string) {
  const { data, error } = await supabase.from(room + '-chat').select('*')

  if (error) {
    console.error('Error getting messages:', error)
  } else {
    return data.map((message) => {
      return {
        ...message,
        userId: message.userId,
        date: new Date(message.date).toISOString(),
      } as MessagePayload
    })
  }
}
