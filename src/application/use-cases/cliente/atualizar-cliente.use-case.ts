import { Inject, Injectable } from '@nestjs/common'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Cliente } from '../../../domain/entities/cliente.entity'
import { ClienteId } from '../../../shared/types/entity-id'
import { CpfCnpj } from '../../../domain/value-objects/cpf-cnpj.vo'
import { CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException, BusinessRuleException } from '../../../shared/exceptions/domain.exception'

export interface AtualizarClienteCommand {
  id: string
  nome?: string
  cpfCnpj?: string
  telefone?: string
}

@Injectable()
export class AtualizarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(command: AtualizarClienteCommand): Promise<Cliente> {
    // Buscar cliente existente
    const clienteId = ClienteId.criar(command.id)
    const cliente = await this.clienteRepository.buscarPorId(clienteId)

    if (!cliente) {
      throw new EntityNotFoundException('Cliente', command.id)
    }

    // Validar CPF/CNPJ se foi alterado
    if (command.cpfCnpj && command.cpfCnpj !== cliente.cpfCnpj.obterValor()) {
      const novoCpfCnpj = CpfCnpj.criar(command.cpfCnpj)
      const clienteExistente = await this.clienteRepository.buscarPorCpfCnpj(novoCpfCnpj)

      if (clienteExistente && !clienteExistente.equals(cliente)) {
        throw new BusinessRuleException('CPF/CNPJ já cadastrado')
      }

      cliente.atualizarCpfCnpj(command.cpfCnpj)
    }

    // Atualizar outros campos se fornecidos
    if (command.nome) {
      cliente.atualizarNome(command.nome)
    }

    if (command.telefone !== undefined) {
      cliente.atualizarTelefone(command.telefone || undefined)
    }

    // Salvar alterações
    await this.clienteRepository.salvar(cliente)

    return cliente
  }
}
