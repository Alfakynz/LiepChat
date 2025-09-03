export interface MessagePayload {
  userId: string
  color: string
  image?: string
  date: string
  content: string
}

export type ConnectedUser = {
  userId: string
  userColor: string
  userImage: string
  socketIds: string[]
}
