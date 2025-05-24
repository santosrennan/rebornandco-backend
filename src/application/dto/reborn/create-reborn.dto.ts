import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator'

export class CreateRebornDto {
  @ApiProperty({
    description: 'Nome do reborn',
    example: 'Maria Clara',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string

  @ApiProperty({
    description: 'Data de nascimento do reborn',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate: string

  @ApiProperty({
    description: 'Peso do reborn em gramas',
    example: 2500,
    minimum: 100,
    maximum: 10000,
  })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(100, { message: 'Peso deve ser pelo menos 100 gramas' })
  @Max(10000, { message: 'Peso deve ser no máximo 10000 gramas' })
  weight: number

  @ApiProperty({
    description: 'Altura do reborn em centímetros',
    example: 50,
    minimum: 10,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(10, { message: 'Altura deve ser pelo menos 10 cm' })
  @Max(100, { message: 'Altura deve ser no máximo 100 cm' })
  height: number

  @ApiProperty({
    description: 'URL da foto do reborn',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'URL da foto deve ser uma string' })
  photoUrl?: string

  @ApiProperty({
    description: 'Descrição do reborn',
    example: 'Um lindo bebê reborn com cabelos castanhos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string
}
