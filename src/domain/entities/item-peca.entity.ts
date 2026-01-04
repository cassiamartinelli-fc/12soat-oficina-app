import { PecaId, OrdemServicoId } from '../../shared/types/entity-id'
import { Quantidade } from '../value-objects/quantidade.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface ItemPecaProps {
  pecaId: PecaId
  ordemServicoId: OrdemServicoId
  quantidade: Quantidade
  precoUnitario: Preco // Será preenchido automaticamente pelo domínio
}

export interface CreateItemPecaProps {
  pecaId: string
  ordemServicoId: string
  quantidade: number
}

export class ItemPeca {
  private constructor(private readonly props: ItemPecaProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateItemPecaProps, precoUnitario: Preco): ItemPeca {
    return new ItemPeca({
      pecaId: PecaId.criar(props.pecaId),
      ordemServicoId: OrdemServicoId.criar(props.ordemServicoId),
      quantidade: Quantidade.criar(props.quantidade),
      precoUnitario, // Preço obtido da peça cadastrada
    })
  }

  static reconstituir(props: ItemPecaProps): ItemPeca {
    return new ItemPeca(props)
  }

  private validarRegrasNegocio(): void {
    if (!this.props.pecaId) {
      throw new BusinessRuleException('Item de peça deve ter uma peça')
    }

    if (!this.props.ordemServicoId) {
      throw new BusinessRuleException('Item de peça deve pertencer a uma ordem de serviço')
    }

    if (!this.props.quantidade) {
      throw new BusinessRuleException('Item de peça deve ter quantidade')
    }

    if (!this.props.precoUnitario || this.props.precoUnitario.obterValor() <= 0) {
      throw new BusinessRuleException('Item de peça deve ter preço unitário válido')
    }
  }

  // Getters
  get pecaId(): PecaId {
    return this.props.pecaId
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

  atualizarQuantidade(novaQuantidade: number): ItemPeca {
    const quantidade = Quantidade.criar(novaQuantidade)

    return new ItemPeca({
      ...this.props,
      quantidade,
    })
  }

  // Métodos auxiliares
  pertenceAOrdemServico(ordemServicoId: OrdemServicoId): boolean {
    return this.props.ordemServicoId.equals(ordemServicoId)
  }

  equals(outro: ItemPeca): boolean {
    return this.props.pecaId.equals(outro.pecaId) && this.props.ordemServicoId.equals(outro.ordemServicoId)
  }

  // Para facilitar serialização/debug
  toSnapshot(): ItemPecaProps {
    return {
      pecaId: this.props.pecaId,
      ordemServicoId: this.props.ordemServicoId,
      quantidade: this.props.quantidade,
      precoUnitario: this.props.precoUnitario,
    }
  }
}
