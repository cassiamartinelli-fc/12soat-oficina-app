import { Inject, Injectable } from '@nestjs/common'
import type { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Veiculo } from '../../../domain/entities/veiculo.entity'
import { Placa } from '../../../domain/value-objects/placa.vo'
import { ClienteId } from '../../../shared/types/entity-id'
import { VEICULO_REPOSITORY_TOKEN, CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { BusinessRuleException, EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

export interface CriarVeiculoCommand {
  placa: string
  marca: string
  modelo: string
  ano: number
  clienteId: string
}

@Injectable()
export class CriarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY_TOKEN)
    private readonly veiculoRepository: IVeiculoRepository,
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(command: CriarVeiculoCommand): Promise<Veiculo> {
    // Validar se cliente existe
    const clienteId = ClienteId.criar(command.clienteId)
    const cliente = await this.clienteRepository.buscarPorId(clienteId)

    if (!cliente) {
      throw new EntityNotFoundException('Cliente', command.clienteId)
    }

    // Validar se placa já existe
    const placaVO = Placa.criar(command.placa)
    const veiculoExistente = await this.veiculoRepository.buscarPorPlaca(placaVO)

    if (veiculoExistente) {
      throw new BusinessRuleException('Placa já cadastrada')
    }

    // Criar nova entidade Veículo
    const novoVeiculo = Veiculo.criar({
      placa: command.placa,
      marca: command.marca,
      modelo: command.modelo,
      ano: command.ano,
      clienteId: command.clienteId,
    })

    // Salvar no repositório
    await this.veiculoRepository.salvar(novoVeiculo)

    return novoVeiculo
  }
}
