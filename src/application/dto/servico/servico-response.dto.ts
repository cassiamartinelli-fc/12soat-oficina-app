import { ApiProperty } from '@nestjs/swagger'

export class ServicoResponseDto {
  @ApiProperty({ description: 'ID único do serviço' })
  id: string

  @ApiProperty({ description: 'Nome do serviço' })
  nome: string

  @ApiProperty({ description: 'Preço do serviço', example: 85.5 })
  preco: number

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date
}
