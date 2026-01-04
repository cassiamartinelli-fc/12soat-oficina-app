import { Injectable } from '@nestjs/common'
import { OrdemServico } from '../../domain/entities'
import { OrdemServicoResponseDto } from '../dto/ordem-servico/ordem-servico-response.dto'

@Injectable()
export class OrdemServicoResponseMapper {
  toDto(ordemServico: OrdemServico): OrdemServicoResponseDto {
    return {
      id: ordemServico.id.obterValor(),
      status: ordemServico.status.obterValor(),
      valorTotal: ordemServico.valorTotal.obterValor(),
      clienteId: ordemServico.clienteId?.obterValor(),
      veiculoId: ordemServico.veiculoId?.obterValor(),
      dataInicio: ordemServico.periodoExecucao.obterDataInicio(),
      dataFim: ordemServico.periodoExecucao.obterDataFim(),
      duracaoDias: ordemServico.calcularDuracaoExecucao(),
      createdAt: ordemServico.createdAt,
      updatedAt: ordemServico.updatedAt,
    }
  }

  toDtoList(ordensServico: OrdemServico[]): OrdemServicoResponseDto[] {
    return ordensServico.map((ordemServico) => this.toDto(ordemServico))
  }
}
