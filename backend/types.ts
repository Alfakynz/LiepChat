export interface SignUpData {
  email: string
  username: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

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
