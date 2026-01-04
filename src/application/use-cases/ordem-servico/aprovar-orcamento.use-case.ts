import { Inject, Injectable } from '@nestjs/common'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { BusinessRuleException, EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { OrdemServicoId } from '../../../shared/types/entity-id'

export interface AprovarOrcamentoCommand {
  ordemServicoId: string
  aprovado: boolean
}

@Injectable()
export class AprovarOrcamentoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
  ) {}

  async execute(command: AprovarOrcamentoCommand): Promise<OrdemServico> {
    // Buscar ordem de serviço
    const ordemServicoId = OrdemServicoId.criar(command.ordemServicoId)
    const ordemServico = await this.ordemServicoRepository.buscarPorId(ordemServicoId)

    if (!ordemServico) {
      throw new EntityNotFoundException('OrdemServico', command.ordemServicoId)
    }

    // Validar se ordem está no status correto para aprovação
    if (!ordemServico.status.isAguardandoAprovacao()) {
      throw new BusinessRuleException(
        'Apenas ordens de serviço com status AGUARDANDO_APROVACAO podem ser aprovadas ou rejeitadas',
      )
    }

    // Aprovar ou rejeitar orçamento
    if (command.aprovado) {
      // Aprovar: transicionar para EM_EXECUCAO
      ordemServico.aprovarOrcamento()
    } else {
      // Rejeitar: retornar para RECEBIDA
      ordemServico.rejeitarOrcamento()
    }

    // Salvar no repositório
    await this.ordemServicoRepository.salvar(ordemServico)

    return ordemServico
  }
}
