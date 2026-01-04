import { Injectable } from '@nestjs/common'
import { Servico } from '../../domain/entities'
import { ServicoResponseDto } from '../dto/servico/servico-response.dto'

@Injectable()
export class ServicoResponseMapper {
  toDto(servico: Servico): ServicoResponseDto {
    return {
      id: servico.id.obterValor(),
      nome: servico.nome.obterValor(),
      preco: servico.preco.obterValor(),
      createdAt: servico.createdAt,
      updatedAt: servico.updatedAt,
    }
  }

  toDtoList(servicos: Servico[]): ServicoResponseDto[] {
    return servicos.map((servico) => this.toDto(servico))
  }
}
