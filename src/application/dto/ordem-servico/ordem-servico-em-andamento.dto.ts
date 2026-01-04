import { ApiProperty } from '@nestjs/swagger'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'

export class OrdemServicoEmAndamentoDto {
  @ApiProperty({
    description: 'ID único da ordem de serviço',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'Status atual da ordem de serviço',
    enum: StatusOrdemServico,
    example: StatusOrdemServico.EM_EXECUCAO,
  })
  status: StatusOrdemServico

  @ApiProperty({
    description: 'Data de criação da ordem de serviço',
    example: '2025-01-15T10:30:00.000Z',
  })
  dataCriacao: Date
}
