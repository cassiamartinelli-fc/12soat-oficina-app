import { Injectable } from '@nestjs/common'
import { Peca } from '../../domain/entities'
import { PecaResponseDto } from '../dto/peca/peca-response.dto'

@Injectable()
export class PecaResponseMapper {
  toDto(peca: Peca): PecaResponseDto {
    return {
      id: peca.id.obterValor(),
      nome: peca.nome.obterValor(),
      codigo: peca.codigo?.obterValor(),
      preco: peca.preco.obterValor(),
      quantidadeEstoque: peca.estoque.obterQuantidade(),
      createdAt: peca.createdAt,
      updatedAt: peca.updatedAt,
    }
  }

  toDtoList(pecas: Peca[]): PecaResponseDto[] {
    return pecas.map((peca) => this.toDto(peca))
  }
}
