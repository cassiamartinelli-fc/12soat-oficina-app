import { VeiculoId, ClienteId } from '../../shared/types/entity-id'
import { Placa } from '../value-objects/placa.vo'
import { Marca } from '../value-objects/marca.vo'
import { Modelo } from '../value-objects/modelo.vo'
import { Ano } from '../value-objects/ano.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface VeiculoProps {
  id: VeiculoId
  placa: Placa
  marca: Marca
  modelo: Modelo
  ano: Ano
  clienteId: ClienteId
  createdAt: Date
  updatedAt: Date
}

export interface CreateVeiculoProps {
  placa: string
  marca: string
  modelo: string
  ano: number
  clienteId: string
}

export class Veiculo {
  private constructor(private readonly props: VeiculoProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateVeiculoProps): Veiculo {
    const id = VeiculoId.gerar()
    const agora = new Date()

    return new Veiculo({
      id,
      placa: Placa.criar(props.placa),
      marca: Marca.criar(props.marca),
      modelo: Modelo.criar(props.modelo),
      ano: Ano.criar(props.ano),
      clienteId: ClienteId.criar(props.clienteId),
      createdAt: agora,
      updatedAt: agora,
    })
  }

  static reconstituir(props: VeiculoProps): Veiculo {
    return new Veiculo(props)
  }

  private validarRegrasNegocio(): void {
    if (!this.props.placa) {
      throw new BusinessRuleException('Veículo deve ter uma placa')
    }

    if (!this.props.marca) {
      throw new BusinessRuleException('Veículo deve ter uma marca')
    }

    if (!this.props.modelo) {
      throw new BusinessRuleException('Veículo deve ter um modelo')
    }

    if (!this.props.clienteId) {
      throw new BusinessRuleException('Veículo deve ter um cliente')
    }
  }

  // Getters para acessar propriedades
  get id(): VeiculoId {
    return this.props.id
  }

  get placa(): Placa {
    return this.props.placa
  }

  get marca(): Marca {
    return this.props.marca
  }

  get modelo(): Modelo {
    return this.props.modelo
  }

  get ano(): Ano {
    return this.props.ano
  }

  get clienteId(): ClienteId {
    return this.props.clienteId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Métodos de negócio
  atualizarPlaca(novaPlaca: string): void {
    this.props.placa = Placa.criar(novaPlaca)
    this.props.updatedAt = new Date()
  }

  atualizarMarca(novaMarca: string): void {
    this.props.marca = Marca.criar(novaMarca)
    this.props.updatedAt = new Date()
  }

  atualizarModelo(novoModelo: string): void {
    this.props.modelo = Modelo.criar(novoModelo)
    this.props.updatedAt = new Date()
  }

  atualizarAno(novoAno: number): void {
    this.props.ano = Ano.criar(novoAno)
    this.props.updatedAt = new Date()
  }

  transferirPropriedade(novoClienteId: string): void {
    this.props.clienteId = ClienteId.criar(novoClienteId)
    this.props.updatedAt = new Date()
  }

  // Métodos auxiliares
  isPlacaMercosul(): boolean {
    return this.props.placa.isFormatoMercosul()
  }

  obterDescricaoCompleta(): string {
    return `${this.props.marca.obterValor()} ${this.props.modelo.obterValor()} ${this.props.ano.obterValor()}`
  }

  equals(outro: Veiculo): boolean {
    return this.props.id.equals(outro.id)
  }

  // Para facilitar serialização/debug
  toSnapshot(): VeiculoProps {
    return {
      id: this.props.id,
      placa: this.props.placa,
      marca: this.props.marca,
      modelo: this.props.modelo,
      ano: this.props.ano,
      clienteId: this.props.clienteId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
