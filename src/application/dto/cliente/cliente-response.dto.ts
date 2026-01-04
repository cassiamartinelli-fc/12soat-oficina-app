import { ApiProperty } from '@nestjs/swagger'

export class ClienteResponseDto {
  @ApiProperty({ description: 'ID único do cliente' })
  id: string

  @ApiProperty({ description: 'Nome completo do cliente' })
  nome: string

  @ApiProperty({ description: 'CPF ou CNPJ do cliente' })
  cpfCnpj: string

  @ApiProperty({ description: 'Telefone do cliente', required: false })
  telefone?: string

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date
}
