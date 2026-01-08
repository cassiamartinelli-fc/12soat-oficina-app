import { Inject, Injectable } from '@nestjs/common'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { OrdemServicoId } from '../../../shared/types/entity-id'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { MetricsService } from '../../../shared/services/metrics.service'

export interface AtualizarStatusOrdemServicoCommand {
  ordemServicoId: string
  novoStatus: StatusOrdemServico
}

@Injectable()
export class AtualizarStatusOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
    private readonly metricsService: MetricsService,
  ) {}

  async execute(command: AtualizarStatusOrdemServicoCommand): Promise<OrdemServico> {
    // Buscar ordem de serviço
    const ordemServicoId = OrdemServicoId.criar(command.ordemServicoId)
    const ordemServico = await this.ordemServicoRepository.buscarPorId(ordemServicoId)

    if (!ordemServico) {
      throw new EntityNotFoundException('OrdemServico', command.ordemServicoId)
    }

    // Capturar status anterior para métricas
    const statusAnterior = ordemServico.status.obterValor()

    // Calcular tempo no status anterior (em minutos)
    const tempoNoStatusAnterior = this.calcularTempoNoStatus(ordemServico.updatedAt)

    // Atualizar status (validação de transição é feita no domain)
    ordemServico.atualizarStatusManualmente(command.novoStatus)

    // Salvar no repositório
    await this.ordemServicoRepository.salvar(ordemServico)

    // Registrar métricas
    this.metricsService.recordTempoNoStatus(statusAnterior, tempoNoStatusAnterior)
    this.metricsService.recordMudancaStatus(statusAnterior, command.novoStatus)

    return ordemServico
  }

  private calcularTempoNoStatus(dataAtualizacao: Date): number {
    const agora = new Date()
    const diferencaMs = agora.getTime() - dataAtualizacao.getTime()
    return Math.floor(diferencaMs / 60000) // Converter para minutos
  }
}
