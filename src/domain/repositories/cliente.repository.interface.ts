import { ClienteId } from '../../shared/types/entity-id'
import { CpfCnpj } from '../value-objects/cpf-cnpj.vo'
import { Cliente } from '../entities/cliente.entity'

export interface IClienteRepository {
  salvar(cliente: Cliente): Promise<void>
  buscarPorId(id: ClienteId): Promise<Cliente | null>
  buscarPorCpfCnpj(cpfCnpj: CpfCnpj): Promise<Cliente | null>
  buscarTodos(): Promise<Cliente[]>
  excluir(id: ClienteId): Promise<void>
}
