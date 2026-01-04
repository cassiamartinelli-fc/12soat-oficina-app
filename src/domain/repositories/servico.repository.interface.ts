import { ServicoId } from '../../shared/types/entity-id'
import { Servico } from '../entities/servico.entity'

export interface IServicoRepository {
  salvar(servico: Servico): Promise<void>
  buscarPorId(id: ServicoId): Promise<Servico | null>
  buscarTodos(): Promise<Servico[]>
  excluir(id: ServicoId): Promise<void>
}
