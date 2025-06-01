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
  content: string
}
