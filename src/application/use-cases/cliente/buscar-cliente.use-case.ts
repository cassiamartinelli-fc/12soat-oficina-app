import { Inject, Injectable } from '@nestjs/common'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Cliente } from '../../../domain/entities/cliente.entity'
import { ClienteId } from '../../../shared/types/entity-id'
import { CpfCnpj } from '../../../domain/value-objects/cpf-cnpj.vo'
import { CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class BuscarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async buscarPorId(id: string): Promise<Cliente> {
    const clienteId = ClienteId.criar(id)
    const cliente = await this.clienteRepository.buscarPorId(clienteId)

    if (!cliente) {
      throw new EntityNotFoundException('Cliente', id)
    }

    return cliente
  }

  async buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente> {
    const cpfCnpjVO = CpfCnpj.criar(cpfCnpj)
    const cliente = await this.clienteRepository.buscarPorCpfCnpj(cpfCnpjVO)

    if (!cliente) {
      throw new EntityNotFoundException('Cliente', cpfCnpj)
    }

    return cliente
  }

  async buscarTodos(): Promise<Cliente[]> {
    return await this.clienteRepository.buscarTodos()
  }
}
