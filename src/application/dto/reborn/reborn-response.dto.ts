import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class RebornResponseDto {
  @ApiProperty({ description: 'ID do reborn', example: 'uuid-456' })
  @Expose()
  id: string

  @ApiProperty({ description: 'Nome do reborn', example: 'Maria Clara' })
  @Expose()
  name: string

  @ApiProperty({
    description: 'Data de nascimento',
    example: '2024-01-15T00:00:00Z',
  })
  @Expose()
  birthDate: Date

  @ApiProperty({ description: 'Peso em gramas', example: 2500 })
  @Expose()
  weight: number

  @ApiProperty({ description: 'Altura em centímetros', example: 50 })
  @Expose()
  height: number

  @ApiProperty({
    type: String,
    description: 'URL da foto',
    example: 'https://example.com/photo.jpg',
    nullable: true,
    required: false,
  })
  @Expose()
  photoUrl: string | null

  @ApiProperty({
    type: String,
    description: 'Descrição',
    example: 'Um lindo bebê reborn',
    nullable: true,
    required: false,
  })
  @Expose()
  description: string | null

  @ApiProperty({ description: 'Idade em dias', example: 45 })
  @Expose()
  ageInDays: number

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:00:00Z',
  })
  @Expose()
  createdAt: Date

  @Exclude()
  userId: string

  @Exclude()
  updatedAt: Date
}

export class RebornsListResponseDto {
  @ApiProperty({ type: [RebornResponseDto] })
  @Expose()
  reborns: RebornResponseDto[]

  @ApiProperty({ description: 'Total de reborns', example: 3 })
  @Expose()
  total: number
}
