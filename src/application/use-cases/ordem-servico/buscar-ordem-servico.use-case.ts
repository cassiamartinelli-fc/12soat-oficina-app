import { Inject, Injectable } from '@nestjs/common'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { OrdemServicoId, ClienteId, VeiculoId } from '../../../shared/types/entity-id'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class BuscarOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
  ) {}

  async buscarPorId(id: string): Promise<OrdemServico> {
    const ordemServicoId = OrdemServicoId.criar(id)
    const ordemServico = await this.ordemServicoRepository.buscarPorId(ordemServicoId)

    if (!ordemServico) {
      throw new EntityNotFoundException('Ordem de Serviço', id)
    }

    return ordemServico
  }

  async buscarTodos(): Promise<OrdemServico[]> {
    return await this.ordemServicoRepository.buscarTodos()
  }

  async buscarPorCliente(clienteId: string): Promise<OrdemServico[]> {
    const clienteIdVO = ClienteId.criar(clienteId)
    return await this.ordemServicoRepository.buscarPorCliente(clienteIdVO)
  }

  async buscarPorVeiculo(veiculoId: string): Promise<OrdemServico[]> {
    const veiculoIdVO = VeiculoId.criar(veiculoId)
    return await this.ordemServicoRepository.buscarPorVeiculo(veiculoIdVO)
  }

  async buscarPorStatus(status: StatusOrdemServico): Promise<OrdemServico[]> {
    return await this.ordemServicoRepository.buscarPorStatus(status)
  }
}
