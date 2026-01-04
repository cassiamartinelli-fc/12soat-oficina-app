import { DomainException } from '../../shared/exceptions/domain.exception'

export enum StatusOrdemServico {
  RECEBIDA = 'recebida',
  EM_DIAGNOSTICO = 'em_diagnostico',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  EM_EXECUCAO = 'em_execucao',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
  ENTREGUE = 'entregue',
}

export class StatusOrdemServicoVO {
  private constructor(private readonly valor: StatusOrdemServico) {}

  // Factory method para criação inicial (sempre RECEBIDA)
  static inicial(): StatusOrdemServicoVO {
    return new StatusOrdemServicoVO(StatusOrdemServico.RECEBIDA)
  }

  // Factory method para reconstituir de persistência
  static reconstituir(valor: string): StatusOrdemServicoVO {
    if (!valor) {
      throw new DomainException('Status da ordem de serviço é obrigatório')
    }

    const statusValido = Object.values(StatusOrdemServico).includes(valor as StatusOrdemServico)
    if (!statusValido) {
      throw new DomainException(`Status inválido: ${valor}`)
    }

    return new StatusOrdemServicoVO(valor as StatusOrdemServico)
  }

  obterValor(): StatusOrdemServico {
    return this.valor
  }

  // Transições automáticas (regras de negócio)
  transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo(): StatusOrdemServicoVO {
    if (!this.isRecebida()) {
      throw new DomainException('Só pode transicionar para EM_DIAGNOSTICO quando status é RECEBIDA')
    }

    return new StatusOrdemServicoVO(StatusOrdemServico.EM_DIAGNOSTICO)
  }

  transicionarParaAguardandoAprovacaoAoAdicionarItens(): StatusOrdemServicoVO {
    if (!this.isEmDiagnostico()) {
      throw new DomainException('Só pode transicionar para AGUARDANDO_APROVACAO quando status é EM_DIAGNOSTICO')
    }

    return new StatusOrdemServicoVO(StatusOrdemServico.AGUARDANDO_APROVACAO)
  }

  // Transições manuais (com validação)
  transicionarManualmentePara(novoStatus: StatusOrdemServico): StatusOrdemServicoVO {
    if (!this.podeTransicionarManualmentePara(novoStatus)) {
      throw new DomainException(`Transição manual inválida de ${this.valor} para ${novoStatus}`)
    }

    return new StatusOrdemServicoVO(novoStatus)
  }

  // Validação de transições manuais permitidas
  private podeTransicionarManualmentePara(novoStatus: StatusOrdemServico): boolean {
    const transicoesPermitidas = {
      [StatusOrdemServico.RECEBIDA]: [StatusOrdemServico.EM_DIAGNOSTICO],
      [StatusOrdemServico.EM_DIAGNOSTICO]: [StatusOrdemServico.AGUARDANDO_APROVACAO],
      [StatusOrdemServico.AGUARDANDO_APROVACAO]: [
        StatusOrdemServico.EM_EXECUCAO, // Aprovado
        StatusOrdemServico.CANCELADA, // Rejeitado
      ],
      [StatusOrdemServico.EM_EXECUCAO]: [StatusOrdemServico.FINALIZADA],
      [StatusOrdemServico.FINALIZADA]: [StatusOrdemServico.ENTREGUE],
      [StatusOrdemServico.CANCELADA]: [StatusOrdemServico.ENTREGUE],
    }

    return transicoesPermitidas[this.valor]?.includes(novoStatus) || false
  }

  // Métodos de query sobre o status atual
  isRecebida(): boolean {
    return this.valor === StatusOrdemServico.RECEBIDA
  }

  isEmDiagnostico(): boolean {
    return this.valor === StatusOrdemServico.EM_DIAGNOSTICO
  }

  isAguardandoAprovacao(): boolean {
    return this.valor === StatusOrdemServico.AGUARDANDO_APROVACAO
  }

  isEmExecucao(): boolean {
    return this.valor === StatusOrdemServico.EM_EXECUCAO
  }

  isFinalizada(): boolean {
    return this.valor === StatusOrdemServico.FINALIZADA
  }

  isEntregue(): boolean {
    return this.valor === StatusOrdemServico.ENTREGUE
  }

  isCancelada(): boolean {
    return this.valor === StatusOrdemServico.CANCELADA
  }

  isConcluida(): boolean {
    return [StatusOrdemServico.FINALIZADA, StatusOrdemServico.CANCELADA, StatusOrdemServico.ENTREGUE].includes(
      this.valor,
    )
  }

  // Status que podem receber itens (peças/serviços)
  podeAdicionarItens(): boolean {
    return this.isEmDiagnostico()
  }

  equals(outro: StatusOrdemServicoVO): boolean {
    return this.valor === outro.valor
  }

  toString(): string {
    return this.valor
  }

  getPrioridade(): number {
    const prioridades = {
      [StatusOrdemServico.EM_EXECUCAO]: 1,
      [StatusOrdemServico.AGUARDANDO_APROVACAO]: 2,
      [StatusOrdemServico.EM_DIAGNOSTICO]: 3,
      [StatusOrdemServico.RECEBIDA]: 4,
      [StatusOrdemServico.FINALIZADA]: 999,
      [StatusOrdemServico.ENTREGUE]: 999,
      [StatusOrdemServico.CANCELADA]: 999,
    }
    return prioridades[this.valor]
  }

  isEmAndamento(): boolean {
    return [
      StatusOrdemServico.RECEBIDA,
      StatusOrdemServico.EM_DIAGNOSTICO,
      StatusOrdemServico.AGUARDANDO_APROVACAO,
      StatusOrdemServico.EM_EXECUCAO,
    ].includes(this.valor)
  }
}
