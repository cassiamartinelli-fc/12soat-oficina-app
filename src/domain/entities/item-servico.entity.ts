import { ServicoId, OrdemServicoId } from '../../shared/types/entity-id'
import { Quantidade } from '../value-objects/quantidade.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface ItemServicoProps {
  servicoId: ServicoId
  ordemServicoId: OrdemServicoId
  quantidade: Quantidade
  precoUnitario: Preco // Será preenchido automaticamente pelo domínio
}

export interface CreateItemServicoProps {
  servicoId: string
  ordemServicoId: string
  quantidade: number
}

export class ItemServico {
  private constructor(private readonly props: ItemServicoProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateItemServicoProps, precoUnitario: Preco): ItemServico {
    return new ItemServico({
      servicoId: ServicoId.criar(props.servicoId),
      ordemServicoId: OrdemServicoId.criar(props.ordemServicoId),
      quantidade: Quantidade.criar(props.quantidade),
      precoUnitario, // Preço obtido do serviço cadastrado
    })
  }

  static reconstituir(props: ItemServicoProps): ItemServico {
    return new ItemServico(props)
  }

  private validarRegrasNegocio(): void {
    if (!this.props.servicoId) {
      throw new BusinessRuleException('Item de serviço deve ter um serviço')
    }

    if (!this.props.ordemServicoId) {
      throw new BusinessRuleException('Item de serviço deve pertencer a uma ordem de serviço')
    }

    if (!this.props.quantidade) {
      throw new BusinessRuleException('Item de serviço deve ter quantidade')
    }

    if (!this.props.precoUnitario || this.props.precoUnitario.obterValor() <= 0) {
      throw new BusinessRuleException('Item de serviço deve ter preço unitário válido')
    }
  }

  // Getters
  get servicoId(): ServicoId {
    return this.props.servicoId
  }

  get ordemServicoId(): OrdemServicoId {
    return this.props.ordemServicoId
  }

  get quantidade(): Quantidade {
    return this.props.quantidade
  }

  get precoUnitario(): Preco {
    return this.props.precoUnitario
  }

  // Métodos de negócio
  calcularSubtotal(): Preco {
    return this.props.precoUnitario.multiplicar(this.props.quantidade.obterValor())
  }

  atualizarQuantidade(novaQuantidade: number): ItemServico {
    const quantidade = Quantidade.criar(novaQuantidade)

    return new ItemServico({
      ...this.props,
      quantidade,
    })
  }

  // Métodos auxiliares
  pertenceAOrdemServico(ordemServicoId: OrdemServicoId): boolean {
    return this.props.ordemServicoId.equals(ordemServicoId)
  }

  equals(outro: ItemServico): boolean {
    return this.props.servicoId.equals(outro.servicoId) && this.props.ordemServicoId.equals(outro.ordemServicoId)
  }

  // Para facilitar serialização/debug
  toSnapshot(): ItemServicoProps {
    return {
      servicoId: this.props.servicoId,
      ordemServicoId: this.props.ordemServicoId,
      quantidade: this.props.quantidade,
      precoUnitario: this.props.precoUnitario,
    }
  }
}
