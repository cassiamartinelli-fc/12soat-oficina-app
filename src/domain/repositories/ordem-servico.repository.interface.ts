import { OrdemServicoId, ClienteId, VeiculoId } from '../../shared/types/entity-id'
import { OrdemServico } from '../entities/ordem-servico.entity'
import { ItemServico } from '../entities/item-servico.entity'
import { ItemPeca } from '../entities/item-peca.entity'
import { StatusOrdemServico } from '../value-objects/status-ordem-servico.vo'

export interface IOrdemServicoRepository {
  salvar(ordemServico: OrdemServico): Promise<void>
  buscarPorId(id: OrdemServicoId): Promise<OrdemServico | null>
  buscarTodos(): Promise<OrdemServico[]>
  buscarPorCliente(clienteId: ClienteId): Promise<OrdemServico[]>
  buscarPorVeiculo(veiculoId: VeiculoId): Promise<OrdemServico[]>
  buscarPorStatus(status: StatusOrdemServico): Promise<OrdemServico[]>
  buscarOrdensEmAndamento(): Promise<OrdemServico[]>
  excluir(id: OrdemServicoId): Promise<void>

  // Métodos para gerenciar itens
  adicionarItemServico(item: ItemServico): Promise<void>
  adicionarItemPeca(item: ItemPeca): Promise<void>
  buscarItensServico(ordemServicoId: OrdemServicoId): Promise<ItemServico[]>
  buscarItensPeca(ordemServicoId: OrdemServicoId): Promise<ItemPeca[]>
  removerItemServico(ordemServicoId: OrdemServicoId, servicoId: string): Promise<void>
  removerItemPeca(ordemServicoId: OrdemServicoId, pecaId: string): Promise<void>
}
