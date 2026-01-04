import { Inject, Injectable } from '@nestjs/common'
import type { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { Peca } from '../../../domain/entities/peca.entity'
import { PECA_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'

export interface CriarPecaCommand {
  nome: string
  codigo?: string
  preco: number
  quantidadeEstoque: number
}

@Injectable()
export class CriarPecaUseCase {
  constructor(
    @Inject(PECA_REPOSITORY_TOKEN)
    private readonly pecaRepository: IPecaRepository,
  ) {}

  async execute(command: CriarPecaCommand): Promise<Peca> {
    // Criar nova entidade Peca
    const novaPeca = Peca.criar({
      nome: command.nome,
      codigo: command.codigo,
      preco: command.preco,
      quantidadeEstoque: command.quantidadeEstoque,
    })

    // Salvar no repositório
    await this.pecaRepository.salvar(novaPeca)

    return novaPeca
  }
}
