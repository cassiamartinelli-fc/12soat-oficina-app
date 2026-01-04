import { Inject, Injectable } from '@nestjs/common'
import type { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import { Veiculo } from '../../../domain/entities/veiculo.entity'
import { VeiculoId, ClienteId } from '../../../shared/types/entity-id'
import { Placa } from '../../../domain/value-objects/placa.vo'
import { VEICULO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class BuscarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY_TOKEN)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async buscarPorId(id: string): Promise<Veiculo> {
    const veiculoId = VeiculoId.criar(id)
    const veiculo = await this.veiculoRepository.buscarPorId(veiculoId)

    if (!veiculo) {
      throw new EntityNotFoundException('Veículo', id)
    }

    return veiculo
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo> {
    const placaVO = Placa.criar(placa)
    const veiculo = await this.veiculoRepository.buscarPorPlaca(placaVO)

    if (!veiculo) {
      throw new EntityNotFoundException('Veículo', placa)
    }

    return veiculo
  }

  async buscarPorClienteId(clienteId: string): Promise<Veiculo[]> {
    const clienteIdVO = ClienteId.criar(clienteId)
    return await this.veiculoRepository.buscarPorClienteId(clienteIdVO)
  }

  async buscarTodos(): Promise<Veiculo[]> {
    return await this.veiculoRepository.buscarTodos()
  }
}
