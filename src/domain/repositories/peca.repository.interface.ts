import { PecaId } from '../../shared/types/entity-id'
import { Peca } from '../entities/peca.entity'

export interface IPecaRepository {
  salvar(peca: Peca): Promise<void>
  buscarPorId(id: PecaId): Promise<Peca | null>
  buscarTodos(): Promise<Peca[]>
  excluir(id: PecaId): Promise<void>
}
