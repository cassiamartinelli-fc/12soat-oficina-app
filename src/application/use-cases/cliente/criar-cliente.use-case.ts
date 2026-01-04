import { Inject, Injectable } from '@nestjs/common'
import type { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Cliente } from '../../../domain/entities/cliente.entity'
import { CpfCnpj } from '../../../domain/value-objects/cpf-cnpj.vo'
import { CLIENTE_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { BusinessRuleException } from '../../../shared/exceptions/domain.exception'

export interface CriarClienteCommand {
  nome: string
  cpfCnpj: string
  telefone?: string
}

@Injectable()
export class CriarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY_TOKEN)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(command: CriarClienteCommand): Promise<Cliente> {
    // Validar se CPF/CNPJ já existe
    const cpfCnpjVO = CpfCnpj.criar(command.cpfCnpj)
    const clienteExistente = await this.clienteRepository.buscarPorCpfCnpj(cpfCnpjVO)

    if (clienteExistente) {
      throw new BusinessRuleException('CPF/CNPJ já cadastrado')
    }

    // Criar nova entidade Cliente
    const novoCliente = Cliente.criar({
      nome: command.nome,
      cpfCnpj: command.cpfCnpj,
      telefone: command.telefone,
    })

    // Salvar no repositório
    await this.clienteRepository.salvar(novoCliente)

    return novoCliente
  }
}
