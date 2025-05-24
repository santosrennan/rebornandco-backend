import { Controller, Post, Get, Body } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CurrentUser, CurrentUserData, transform } from 'src/shared'
import {
  CreateRebornDto,
  RebornResponseDto,
  RebornsListResponseDto,
} from 'src/application/dto'
import {
  CreateRebornUseCase,
  GetUserRebornsUseCase,
} from 'src/application/use-cases'

@ApiTags('reborns')
@Controller('reborns')
@ApiBearerAuth()
export class RebornController {
  constructor(
    private readonly createRebornUseCase: CreateRebornUseCase,
    private readonly getUserRebornsUseCase: GetUserRebornsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo reborn' })
  @ApiResponse({
    status: 201,
    description: 'Reborn criado com sucesso',
    type: RebornResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async create(
    @Body() createRebornDto: CreateRebornDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<RebornResponseDto> {
    const result = await this.createRebornUseCase.execute({
      userId: user.id,
      name: createRebornDto.name,
      birthDate: createRebornDto.birthDate,
      weight: createRebornDto.weight,
      height: createRebornDto.height,
      photoUrl: createRebornDto.photoUrl,
      description: createRebornDto.description,
    })

    return transform(RebornResponseDto, result)
  }

  @Get()
  @ApiOperation({ summary: 'Listar reborns do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reborns do usuário',
    type: RebornsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findUserReborns(
    @CurrentUser() user: CurrentUserData,
  ): Promise<RebornsListResponseDto> {
    const result = await this.getUserRebornsUseCase.execute({
      userId: user.id,
    })

    return transform(RebornsListResponseDto, result)
  }
}
