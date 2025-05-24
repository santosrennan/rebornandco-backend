export interface CreateUserRequest {
  email: string
  password: string
}
export interface CreateUserResponse {
  id: string
  email: string
  role: string
  createdAt: Date
}
