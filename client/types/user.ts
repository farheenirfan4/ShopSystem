export type User = {
  id: string
  email: string
  username: string
  role: string
}

export type AuthResponse = {
  accessToken: string
  user: User
}
