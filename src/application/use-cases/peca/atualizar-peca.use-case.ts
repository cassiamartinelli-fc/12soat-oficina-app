import { Inject, Injectable } from '@nestjs/common'
import type { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { Peca } from '../../../domain/entities/peca.entity'
import { PecaId } from '../../../shared/types/entity-id'
import { PECA_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

export interface AtualizarPecaCommand {
  id: string
  nome?: string
  codigo?: string
  preco?: number
  quantidadeEstoque?: number
}

@Injectable()
export class AtualizarPecaUseCase {
  constructor(
    @Inject(PECA_REPOSITORY_TOKEN)
    private readonly pecaRepository: IPecaRepository,
  ) {}

  async execute(command: AtualizarPecaCommand): Promise<Peca> {
    const pecaId = PecaId.criar(command.id)
    const peca = await this.pecaRepository.buscarPorId(pecaId)

    if (!peca) {
      throw new EntityNotFoundException('Peça', command.id)
    }

    // Atualizar campos conforme necessário
    if (command.nome !== undefined) {
      peca.atualizarNome(command.nome)
    }

    if (command.codigo !== undefined) {
      peca.atualizarCodigo(command.codigo)
    }

    if (command.preco !== undefined) {
      peca.atualizarPreco(command.preco)
    }

    if (command.quantidadeEstoque !== undefined) {
      const estoqueAtual = peca.estoque.obterQuantidade()
      const novoEstoque = command.quantidadeEstoque

      if (novoEstoque > estoqueAtual) {
        // Repor estoque (adicionar)
        peca.reporEstoque(novoEstoque - estoqueAtual)
      } else if (novoEstoque < estoqueAtual) {
        // Baixar estoque (remover)
        peca.baixarEstoque(estoqueAtual - novoEstoque)
      }
      // Se novoEstoque === estoqueAtual, não faz nada
    }

    // Salvar alterações
    await this.pecaRepository.salvar(peca)

    return peca
  }
}
