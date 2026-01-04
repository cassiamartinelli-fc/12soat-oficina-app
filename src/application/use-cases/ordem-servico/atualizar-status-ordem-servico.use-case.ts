import { Inject, Injectable } from '@nestjs/common'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { OrdemServicoId } from '../../../shared/types/entity-id'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

export interface AtualizarStatusOrdemServicoCommand {
  ordemServicoId: string
  novoStatus: StatusOrdemServico
}

@Injectable()
export class AtualizarStatusOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
  ) {}

  async execute(command: AtualizarStatusOrdemServicoCommand): Promise<OrdemServico> {
    // Buscar ordem de serviço
    const ordemServicoId = OrdemServicoId.criar(command.ordemServicoId)
    const ordemServico = await this.ordemServicoRepository.buscarPorId(ordemServicoId)

    if (!ordemServico) {
      throw new EntityNotFoundException('OrdemServico', command.ordemServicoId)
    }

    // Atualizar status (validação de transição é feita no domain)
    ordemServico.atualizarStatusManualmente(command.novoStatus)

    // Salvar no repositório
    await this.ordemServicoRepository.salvar(ordemServico)

    return ordemServico
  }
}
