import { ApiProperty } from '@nestjs/swagger'

export class VeiculoResponseDto {
  @ApiProperty({ description: 'ID único do veículo' })
  id: string

  @ApiProperty({ description: 'Placa do veículo' })
  placa: string

  @ApiProperty({ description: 'Marca do veículo' })
  marca: string

  @ApiProperty({ description: 'Modelo do veículo' })
  modelo: string

  @ApiProperty({ description: 'Ano do veículo' })
  ano: number

  @ApiProperty({ description: 'ID do cliente proprietário' })
  clienteId: string

  @ApiProperty({ description: 'Descrição completa formatada do veículo' })
  descricaoCompleta: string

  @ApiProperty({ description: 'Indica se a placa é do padrão Mercosul' })
  placaMercosul: boolean

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date
}
