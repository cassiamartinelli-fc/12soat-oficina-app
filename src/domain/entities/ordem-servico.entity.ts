import { BusinessRuleException } from '../../shared/exceptions/domain.exception'
import { ClienteId, OrdemServicoId, VeiculoId } from '../../shared/types/entity-id'
import { PeriodoExecucao } from '../value-objects/periodo-execucao.vo'
import { Preco } from '../value-objects/preco.vo'
import { StatusOrdemServico, StatusOrdemServicoVO } from '../value-objects/status-ordem-servico.vo'

export interface OrdemServicoProps {
  id: OrdemServicoId
  status: StatusOrdemServicoVO
  valorTotal: Preco
  clienteId?: ClienteId
  veiculoId?: VeiculoId
  periodoExecucao: PeriodoExecucao
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrdemServicoProps {
  clienteId?: string
  veiculoId?: string
}

export class OrdemServico {
  private constructor(private readonly props: OrdemServicoProps) {
    this.validarRegrasNegocio()
  }

  static criar(props: CreateOrdemServicoProps): OrdemServico {
    const id = OrdemServicoId.gerar()
    const agora = new Date()

    // Status sempre inicia como RECEBIDA (simplificação)
    const statusInicial = StatusOrdemServicoVO.inicial()

    return new OrdemServico({
      id,
      status: statusInicial,
      valorTotal: Preco.zero(),
      clienteId: props.clienteId ? ClienteId.criar(props.clienteId) : undefined,
      veiculoId: props.veiculoId ? VeiculoId.criar(props.veiculoId) : undefined,
      periodoExecucao: PeriodoExecucao.criar(),
      createdAt: agora,
      updatedAt: agora,
    })
  }

  static reconstituir(props: OrdemServicoProps): OrdemServico {
    return new OrdemServico(props)
  }

  private validarRegrasNegocio(): void {
    // Validar que se tem veículo, deve ter cliente
    if (this.props.veiculoId && !this.props.clienteId) {
      throw new BusinessRuleException('Não é possível ter veículo sem cliente')
    }
  }

  // Getters
  get id(): OrdemServicoId {
    return this.props.id
  }

  get status(): StatusOrdemServicoVO {
    return this.props.status
  }

  get valorTotal(): Preco {
    return this.props.valorTotal
  }

  get clienteId(): ClienteId | undefined {
    return this.props.clienteId
  }

  get veiculoId(): VeiculoId | undefined {
    return this.props.veiculoId
  }

  get periodoExecucao(): PeriodoExecucao {
    return this.props.periodoExecucao
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Métodos de negócio - Gerenciamento de Cliente e Veículo
  definirCliente(clienteId: string): void {
    this.props.clienteId = ClienteId.criar(clienteId)

    // Se não tinha cliente e agora tem, e também tem veículo, transicionar para EM_DIAGNOSTICO
    if (this.props.veiculoId && this.props.status.isRecebida()) {
      this.props.status = this.props.status.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()
    }

    this.props.updatedAt = new Date()
  }

  definirVeiculo(veiculoId: string): void {
    if (!this.props.clienteId) {
      throw new BusinessRuleException('Cliente deve ser definido antes do veículo')
    }

    this.props.veiculoId = VeiculoId.criar(veiculoId)

    // Se tinha cliente e agora definiu veículo, transicionar para EM_DIAGNOSTICO
    if (this.props.status.isRecebida()) {
      this.props.status = this.props.status.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()
    }

    this.props.updatedAt = new Date()
  }

  // Métodos de negócio - Gerenciamento de Status
  atualizarStatusManualmente(novoStatus: StatusOrdemServico): void {
    this.props.status = this.props.status.transicionarManualmentePara(novoStatus)
    this.props.updatedAt = new Date()

    // Lógica adicional baseada no status
    if (novoStatus === StatusOrdemServico.EM_EXECUCAO && !this.props.periodoExecucao.isIniciado()) {
      this.iniciarExecucao()
    }

    if (novoStatus === StatusOrdemServico.FINALIZADA && !this.props.periodoExecucao.isFinalizado()) {
      this.finalizarExecucao()
    }
  }

  // Será chamado automaticamente quando itens forem adicionados
  transicionarParaAguardandoAprovacao(): void {
    if (this.props.status.podeAdicionarItens()) {
      this.props.status = this.props.status.transicionarParaAguardandoAprovacaoAoAdicionarItens()
      this.props.updatedAt = new Date()
    }
  }

  // Métodos de negócio - Aprovação de Orçamento
  aprovarOrcamento(): void {
    if (!this.props.status.isAguardandoAprovacao()) {
      throw new BusinessRuleException('Apenas ordens com status AGUARDANDO_APROVACAO podem ser aprovadas')
    }

    this.props.status = this.props.status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)
    this.props.updatedAt = new Date()

    // Iniciar execução automaticamente
    this.iniciarExecucao()
  }

  rejeitarOrcamento(): void {
    if (!this.props.status.isAguardandoAprovacao()) {
      throw new BusinessRuleException('Apenas ordens com status AGUARDANDO_APROVACAO podem ser rejeitadas')
    }

    this.props.status = this.props.status.transicionarManualmentePara(StatusOrdemServico.CANCELADA)
    this.props.updatedAt = new Date()
  }

  // Métodos de negócio - Gerenciamento de Execução
  iniciarExecucao(): void {
    if (!this.props.status.isEmExecucao()) {
      throw new BusinessRuleException('Ordem de serviço deve estar EM_EXECUCAO para iniciar execução')
    }

    this.props.periodoExecucao = PeriodoExecucao.iniciar(new Date())
    this.props.updatedAt = new Date()
  }

  finalizarExecucao(): void {
    if (!this.props.periodoExecucao.isIniciado()) {
      throw new BusinessRuleException('Execução deve ser iniciada antes de ser finalizada')
    }

    this.props.periodoExecucao = this.props.periodoExecucao.finalizar(new Date())
    this.props.updatedAt = new Date()
  }

  // Métodos de negócio - Gerenciamento de Valor
  atualizarValorTotal(novoValor: number): void {
    // Permitir valor zero para OrdemServico (diferente de Preco isolado)
    this.props.valorTotal = novoValor === 0 ? Preco.zero() : Preco.criar(novoValor)

    // Se está em diagnóstico e agora tem valor, transicionar para aguardando aprovação
    if (this.props.status.podeAdicionarItens() && novoValor > 0) {
      this.transicionarParaAguardandoAprovacao()
    }

    this.props.updatedAt = new Date()
  }

  // Métodos auxiliares
  temCliente(): boolean {
    return this.props.clienteId !== undefined
  }

  temVeiculo(): boolean {
    return this.props.veiculoId !== undefined
  }

  temClienteEVeiculo(): boolean {
    return this.temCliente() && this.temVeiculo()
  }

  isEmAndamento(): boolean {
    return this.props.status.isEmAndamento()
  }

  isConcluida(): boolean {
    return this.props.status.isConcluida()
  }

  podeAdicionarItens(): boolean {
    return this.props.status.podeAdicionarItens()
  }

  calcularDuracaoExecucao(): number | null {
    return this.props.periodoExecucao.calcularDuracaoDias()
  }

  equals(outra: OrdemServico): boolean {
    return this.props.id.equals(outra.id)
  }

  // Para facilitar serialização/debug
  toSnapshot(): OrdemServicoProps {
    return {
      id: this.props.id,
      status: this.props.status,
      valorTotal: this.props.valorTotal,
      clienteId: this.props.clienteId,
      veiculoId: this.props.veiculoId,
      periodoExecucao: this.props.periodoExecucao,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
