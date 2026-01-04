import { VeiculoId, ClienteId } from '../../shared/types/entity-id'
import { Placa } from '../value-objects/placa.vo'
import { Veiculo } from '../entities/veiculo.entity'

export interface IVeiculoRepository {
  salvar(veiculo: Veiculo): Promise<void>
  buscarPorId(id: VeiculoId): Promise<Veiculo | null>
  buscarPorPlaca(placa: Placa): Promise<Veiculo | null>
  buscarPorClienteId(clienteId: ClienteId): Promise<Veiculo[]>
  buscarTodos(): Promise<Veiculo[]>
  excluir(id: VeiculoId): Promise<void>
}
