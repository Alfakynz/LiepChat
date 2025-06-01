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
  user: string
  color: string
  image?: string
  date: string
  content: string
}

export type ConnectedUser = {
  username: string
  userColor: string
  userImage: string
  socketIds: string[]
}
