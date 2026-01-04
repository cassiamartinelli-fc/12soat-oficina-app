import { Inject, Injectable } from '@nestjs/common'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { ClienteId } from '../../../shared/types/entity-id'
import { CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class ExcluirClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar se cliente existe
    const clienteId = ClienteId.criar(id)
    const cliente = await this.clienteRepository.buscarPorId(clienteId)

    if (!cliente) {
      throw new EntityNotFoundException('Cliente', id)
    }

    // Aqui poderiam ser adicionadas validações de negócio
    // Ex: verificar se cliente possui veículos ou ordens de serviço

    // Excluir cliente
    await this.clienteRepository.excluir(clienteId)
  }
}
