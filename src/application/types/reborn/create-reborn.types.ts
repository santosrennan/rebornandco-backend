export interface CreateRebornRequest {
  userId: string
  name: string
  birthDate: string
  weight: number
  height: number
  photoUrl?: string
  description?: string
}
export interface CreateRebornResponse {
  id: string
  userId: string
  name: string
  birthDate: Date
  weight: number
  height: number
  photoUrl: string | null
  description: string | null
  ageInDays: number
  createdAt: Date
}
