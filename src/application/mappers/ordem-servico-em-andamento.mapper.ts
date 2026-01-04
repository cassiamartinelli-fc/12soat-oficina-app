import { Injectable } from '@nestjs/common'
import { OrdemServico } from '../../domain/entities/ordem-servico.entity'
import { OrdemServicoEmAndamentoDto } from '../dto/ordem-servico/ordem-servico-em-andamento.dto'

@Injectable()
export class OrdemServicoEmAndamentoMapper {
  toDto(ordemServico: OrdemServico): OrdemServicoEmAndamentoDto {
    return {
      id: ordemServico.id.obterValor(),
      status: ordemServico.status.obterValor(),
      dataCriacao: ordemServico.createdAt,
    }
  }

  toDtoList(ordensServico: OrdemServico[]): OrdemServicoEmAndamentoDto[] {
    return ordensServico.map((os) => this.toDto(os))
  }
}
