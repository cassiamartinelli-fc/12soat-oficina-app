import { Inject, Injectable } from '@nestjs/common'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'

@Injectable()
export class ListarOrdensEmAndamentoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
  ) {}

  async execute(): Promise<OrdemServico[]> {
    const ordensEmAndamento = await this.ordemServicoRepository.buscarOrdensEmAndamento()

    // Ordenação adicional no código como fallback (caso a ordenação SQL falhe)
    return ordensEmAndamento.sort((a, b) => {
      const prioridadeA = a.status.getPrioridade()
      const prioridadeB = b.status.getPrioridade()

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB
      }

      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }
}
