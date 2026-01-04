import { Inject, Injectable } from '@nestjs/common'
import type { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Veiculo } from '../../../domain/entities/veiculo.entity'
import { VeiculoId, ClienteId } from '../../../shared/types/entity-id'
import { Placa } from '../../../domain/value-objects/placa.vo'
import { VEICULO_REPOSITORY_TOKEN, CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException, BusinessRuleException } from '../../../shared/exceptions/domain.exception'

export interface AtualizarVeiculoCommand {
  id: string
  placa?: string
  marca?: string
  modelo?: string
  ano?: number
  clienteId?: string
}

@Injectable()
export class AtualizarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY_TOKEN)
    private readonly veiculoRepository: IVeiculoRepository,
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(command: AtualizarVeiculoCommand): Promise<Veiculo> {
    // Buscar veículo existente
    const veiculoId = VeiculoId.criar(command.id)
    const veiculo = await this.veiculoRepository.buscarPorId(veiculoId)

    if (!veiculo) {
      throw new EntityNotFoundException('Veículo', command.id)
    }

    // Validar placa se foi alterada
    if (command.placa && command.placa !== veiculo.placa.obterValor()) {
      const novaPlaca = Placa.criar(command.placa)
      const veiculoExistente = await this.veiculoRepository.buscarPorPlaca(novaPlaca)

      if (veiculoExistente && !veiculoExistente.equals(veiculo)) {
        throw new BusinessRuleException('Placa já cadastrada')
      }

      veiculo.atualizarPlaca(command.placa)
    }

    // Validar cliente se foi alterado
    if (command.clienteId && command.clienteId !== veiculo.clienteId.obterValor()) {
      const novoClienteId = ClienteId.criar(command.clienteId)
      const cliente = await this.clienteRepository.buscarPorId(novoClienteId)

      if (!cliente) {
        throw new EntityNotFoundException('Cliente', command.clienteId)
      }

      veiculo.transferirPropriedade(command.clienteId)
    }

    // Atualizar outros campos se fornecidos
    if (command.marca) {
      veiculo.atualizarMarca(command.marca)
    }

    if (command.modelo) {
      veiculo.atualizarModelo(command.modelo)
    }

    if (command.ano) {
      veiculo.atualizarAno(command.ano)
    }

    // Salvar alterações
    await this.veiculoRepository.salvar(veiculo)

    return veiculo
  }
}
