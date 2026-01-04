import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'

export class AtualizarStatusDto {
  @ApiProperty({
    description: 'Novo status da ordem de serviço',
    enum: StatusOrdemServico,
    example: StatusOrdemServico.EM_DIAGNOSTICO,
    enumName: 'StatusOrdemServico',
  })
  @IsEnum(StatusOrdemServico, {
    message:
      'Status deve ser um dos valores: recebida, em_diagnostico, aguardando_aprovacao, em_execucao, finalizada, cancelada, entregue',
  })
  status: StatusOrdemServico
}
