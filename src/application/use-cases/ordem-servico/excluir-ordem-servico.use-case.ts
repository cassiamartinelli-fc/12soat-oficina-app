import { Inject, Injectable } from '@nestjs/common'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServicoId } from '../../../shared/types/entity-id'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class ExcluirOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const ordemServicoId = OrdemServicoId.criar(id)

    // Verificar se a ordem de serviço existe antes de excluir
    const ordemServico = await this.ordemServicoRepository.buscarPorId(ordemServicoId)

    if (!ordemServico) {
      throw new EntityNotFoundException('Ordem de Serviço', id)
    }

    await this.ordemServicoRepository.excluir(ordemServicoId)
  }
}
