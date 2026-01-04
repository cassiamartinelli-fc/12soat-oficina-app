import { ApiProperty } from '@nestjs/swagger'
import { StatusOrdemServico } from '../../../domain/value-objects'

export class OrdemServicoResponseDto {
  @ApiProperty({ description: 'ID único da ordem de serviço' })
  id: string

  @ApiProperty({ enum: StatusOrdemServico, description: 'Status atual da ordem de serviço' })
  status: StatusOrdemServico

  @ApiProperty({ description: 'Valor total da ordem de serviço' })
  valorTotal: number

  @ApiProperty({ description: 'ID do cliente', required: false })
  clienteId?: string

  @ApiProperty({ description: 'ID do veículo', required: false })
  veiculoId?: string

  @ApiProperty({ description: 'Data de início da execução', required: false })
  dataInicio?: Date | null

  @ApiProperty({ description: 'Data de fim da execução', required: false })
  dataFim?: Date | null

  @ApiProperty({ description: 'Duração da execução em dias', required: false })
  duracaoDias?: number | null

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date
}
