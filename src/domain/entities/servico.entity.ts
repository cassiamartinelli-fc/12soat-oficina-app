import { ServicoId } from '../../shared/types/entity-id'
import { Nome } from '../value-objects/nome.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface ServicoProps {
  id: ServicoId
  nome: Nome
  preco: Preco
  createdAt: Date
  updatedAt: Date
}

export interface CreateServicoProps {
  nome: string
  preco: number
}

export class Servico {
  private constructor(private readonly props: ServicoProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateServicoProps): Servico {
    const id = ServicoId.gerar()
    const agora = new Date()

    return new Servico({
      id,
      nome: Nome.criar(props.nome),
      preco: Preco.criar(props.preco),
      createdAt: agora,
      updatedAt: agora,
    })
  }

  static reconstituir(props: ServicoProps): Servico {
    return new Servico(props)
  }

  private validarRegrasNegocio(): void {
    if (!this.props.nome) {
      throw new BusinessRuleException('Serviço deve ter um nome')
    }

    if (!this.props.preco) {
      throw new BusinessRuleException('Serviço deve ter um preço')
    }
  }

  // Getters para acessar propriedades
  get id(): ServicoId {
    return this.props.id
  }

  get nome(): Nome {
    return this.props.nome
  }

  get preco(): Preco {
    return this.props.preco
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Métodos de negócio
  atualizarNome(novoNome: string): void {
    this.props.nome = Nome.criar(novoNome)
    this.props.updatedAt = new Date()
  }

  atualizarPreco(novoPreco: number): void {
    this.props.preco = Preco.criar(novoPreco)
    this.props.updatedAt = new Date()
  }

  // Métodos auxiliares
  calcularValorTotal(quantidade: number): Preco {
    return this.props.preco.multiplicar(quantidade)
  }

  equals(outro: Servico): boolean {
    return this.props.id.equals(outro.id)
  }

  // Para facilitar serialização/debug
  toSnapshot(): ServicoProps {
    return {
      id: this.props.id,
      nome: this.props.nome,
      preco: this.props.preco,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
