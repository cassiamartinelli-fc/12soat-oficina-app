import { ClienteId } from '../../shared/types/entity-id'
import { CpfCnpj, Nome, Telefone } from '../value-objects'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

export interface ClienteProps {
  id: ClienteId
  nome: Nome
  cpfCnpj: CpfCnpj
  telefone?: Telefone
  createdAt: Date
  updatedAt: Date
}

export interface CreateClienteProps {
  nome: string
  cpfCnpj: string
  telefone?: string
}

export class Cliente {
  private constructor(private readonly props: ClienteProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateClienteProps): Cliente {
    const id = ClienteId.gerar()
    const agora = new Date()

    return new Cliente({
      id,
      nome: Nome.criar(props.nome),
      cpfCnpj: CpfCnpj.criar(props.cpfCnpj),
      telefone: props.telefone ? Telefone.criar(props.telefone) : undefined,
      createdAt: agora,
      updatedAt: agora,
    })
  }

  static reconstituir(props: ClienteProps): Cliente {
    return new Cliente(props)
  }

  private validarRegrasNegocio(): void {
    // Regras de negócio específicas do Cliente podem ser adicionadas aqui
    if (!this.props.nome) {
      throw new BusinessRuleException('Cliente deve ter um nome')
    }

    if (!this.props.cpfCnpj) {
      throw new BusinessRuleException('Cliente deve ter CPF ou CNPJ')
    }
  }

  // Getters para acessar propriedades
  get id(): ClienteId {
    return this.props.id
  }

  get nome(): Nome {
    return this.props.nome
  }

  get cpfCnpj(): CpfCnpj {
    return this.props.cpfCnpj
  }

  get telefone(): Telefone | undefined {
    return this.props.telefone
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

  atualizarTelefone(novoTelefone?: string): void {
    this.props.telefone = novoTelefone ? Telefone.criar(novoTelefone) : undefined
    this.props.updatedAt = new Date()
  }

  atualizarCpfCnpj(novoCpfCnpj: string): void {
    this.props.cpfCnpj = CpfCnpj.criar(novoCpfCnpj)
    this.props.updatedAt = new Date()
  }

  // Métodos auxiliares
  isPessoaFisica(): boolean {
    return this.props.cpfCnpj.isCpf()
  }

  isPessoaJuridica(): boolean {
    return this.props.cpfCnpj.isCnpj()
  }

  possuiTelefone(): boolean {
    return this.props.telefone !== undefined
  }

  equals(outro: Cliente): boolean {
    return this.props.id.equals(outro.id)
  }

  // Para facilitar serialização/debug
  toSnapshot(): ClienteProps {
    return {
      id: this.props.id,
      nome: this.props.nome,
      cpfCnpj: this.props.cpfCnpj,
      telefone: this.props.telefone,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
