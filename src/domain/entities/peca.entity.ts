import { PecaId } from '../../shared/types/entity-id'
import { Nome } from '../value-objects/nome.vo'
import { Codigo } from '../value-objects/codigo.vo'
import { Preco } from '../value-objects/preco.vo'
import { Estoque } from '../value-objects/estoque.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface PecaProps {
  id: PecaId
  nome: Nome
  codigo?: Codigo
  preco: Preco
  estoque: Estoque
  createdAt: Date
  updatedAt: Date
}

export interface CreatePecaProps {
  nome: string
  codigo?: string
  preco: number
  quantidadeEstoque?: number
}

export class Peca {
  private constructor(private readonly props: PecaProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreatePecaProps): Peca {
    const id = PecaId.gerar()
    const agora = new Date()

    return new Peca({
      id,
      nome: Nome.criar(props.nome),
      codigo: props.codigo ? Codigo.criar(props.codigo) : undefined,
      preco: Preco.criar(props.preco),
      estoque: Estoque.criar(props.quantidadeEstoque || 0),
      createdAt: agora,
      updatedAt: agora,
    })
  }

  static reconstituir(props: PecaProps): Peca {
    return new Peca(props)
  }

  private validarRegrasNegocio(): void {
    if (!this.props.nome) {
      throw new BusinessRuleException('Peça deve ter um nome')
    }

    if (!this.props.preco) {
      throw new BusinessRuleException('Peça deve ter um preço')
    }
  }

  // Getters para acessar propriedades
  get id(): PecaId {
    return this.props.id
  }

  get nome(): Nome {
    return this.props.nome
  }

  get codigo(): Codigo | undefined {
    return this.props.codigo
  }

  get preco(): Preco {
    return this.props.preco
  }

  get estoque(): Estoque {
    return this.props.estoque
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

  atualizarCodigo(novoCodigo?: string): void {
    this.props.codigo = novoCodigo ? Codigo.criar(novoCodigo) : undefined
    this.props.updatedAt = new Date()
  }

  atualizarPreco(novoPreco: number): void {
    this.props.preco = Preco.criar(novoPreco)
    this.props.updatedAt = new Date()
  }

  reporEstoque(quantidade: number): void {
    this.props.estoque = this.props.estoque.repor(quantidade)
    this.props.updatedAt = new Date()
  }

  baixarEstoque(quantidade: number): void {
    if (!this.temEstoqueSuficiente(quantidade)) {
      throw new BusinessRuleException(
        `Estoque insuficiente para ${this.props.nome.obterValor()}. Disponível: ${this.props.estoque.obterQuantidade()}, Solicitado: ${quantidade}`,
      )
    }

    this.props.estoque = this.props.estoque.baixar(quantidade)
    this.props.updatedAt = new Date()
  }

  // Métodos auxiliares
  temEstoque(): boolean {
    return this.props.estoque.temEstoque()
  }

  temEstoqueSuficiente(quantidade: number): boolean {
    return this.props.estoque.temEstoqueSuficiente(quantidade)
  }

  possuiCodigo(): boolean {
    return this.props.codigo !== undefined
  }

  calcularValorTotal(quantidade: number): Preco {
    return this.props.preco.multiplicar(quantidade)
  }

  equals(outra: Peca): boolean {
    return this.props.id.equals(outra.id)
  }

  // Para facilitar serialização/debug
  toSnapshot(): PecaProps {
    return {
      id: this.props.id,
      nome: this.props.nome,
      codigo: this.props.codigo,
      preco: this.props.preco,
      estoque: this.props.estoque,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
