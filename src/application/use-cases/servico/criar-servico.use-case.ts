import { Inject, Injectable } from '@nestjs/common'
import type { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { Servico } from '../../../domain/entities/servico.entity'
import { SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'

export interface CriarServicoCommand {
  nome: string
  preco: number
}

@Injectable()
export class CriarServicoUseCase {
  constructor(
    @Inject(SERVICO_REPOSITORY_TOKEN)
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async execute(command: CriarServicoCommand): Promise<Servico> {
    // Criar nova entidade Servico
    const novoServico = Servico.criar({
      nome: command.nome,
      preco: command.preco,
    })

    // Salvar no repositório
    await this.servicoRepository.salvar(novoServico)

    return novoServico
  }
}
