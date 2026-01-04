import { ApiProperty } from '@nestjs/swagger'

export class PecaResponseDto {
  @ApiProperty({ description: 'ID único da peça' })
  id: string

  @ApiProperty({ description: 'Nome da peça' })
  nome: string

  @ApiProperty({ description: 'Código da peça', required: false })
  codigo?: string

  @ApiProperty({ description: 'Preço da peça', example: 45.9 })
  preco: number

  @ApiProperty({ description: 'Quantidade disponível em estoque' })
  quantidadeEstoque: number

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date
}
