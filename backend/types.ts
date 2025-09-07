export interface MessagePayload {
  user_id: string
  color: string
  image?: string
  date: string
  content: string
}

export type ConnectedUser = {
  user_id: string
  userColor: string
  userImage: string
  socketIds: string[]
}
