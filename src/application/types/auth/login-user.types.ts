export interface LoginUserRequest {
  email: string
  password: string
}
export interface LoginUserResponse {
  accessToken: string
  user: { id: string; email: string; role: string }
}
