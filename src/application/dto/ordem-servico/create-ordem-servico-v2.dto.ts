import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ItemServicoCreateDto {
  @ApiProperty({
    description: 'ID do serviço',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  servicoId: string

  @ApiProperty({
    description: 'Quantidade do serviço',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantidade: number
}

export class ItemPecaCreateDto {
  @ApiProperty({
    description: 'ID da peça',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  pecaId: string

  @ApiProperty({
    description: 'Quantidade da peça',
    example: 4,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantidade: number
}

export class CreateOrdemServicoV2Dto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  clienteId: string

  @ApiProperty({
    description: 'ID do veículo',
    example: '550e8400-e29b-41d4-a716-446655440003',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  veiculoId: string

  @ApiProperty({
    description: 'Lista de serviços da ordem de serviço (preços buscados automaticamente)',
    type: [ItemServicoCreateDto],
    example: [
      {
        servicoId: '550e8400-e29b-41d4-a716-446655440000',
        quantidade: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemServicoCreateDto)
  servicos: ItemServicoCreateDto[]

  @ApiProperty({
    description: 'Lista de peças da ordem de serviço (preços buscados automaticamente)',
    type: [ItemPecaCreateDto],
    example: [
      {
        pecaId: '550e8400-e29b-41d4-a716-446655440001',
        quantidade: 4,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPecaCreateDto)
  pecas: ItemPecaCreateDto[]
}
