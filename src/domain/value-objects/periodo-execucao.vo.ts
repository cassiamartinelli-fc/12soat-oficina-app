import { DomainException } from '../../shared/exceptions/domain.exception'

export class PeriodoExecucao {
  private constructor(
    private readonly dataInicio: Date | null,
    private readonly dataFim: Date | null,
  ) {}

  static criar(dataInicio?: Date, dataFim?: Date): PeriodoExecucao {
    const inicio = dataInicio || null
    const fim = dataFim || null

    if (inicio && fim && inicio > fim) {
      throw new DomainException('Data de início não pode ser posterior à data de fim')
    }

    if (fim && !inicio) {
      throw new DomainException('Não é possível definir data de fim sem data de início')
    }

    return new PeriodoExecucao(inicio, fim)
  }

  static iniciar(dataInicio: Date): PeriodoExecucao {
    if (!dataInicio) {
      throw new DomainException('Data de início é obrigatória')
    }

    return new PeriodoExecucao(dataInicio, null)
  }

  static finalizar(dataInicio: Date, dataFim: Date): PeriodoExecucao {
    if (!dataInicio || !dataFim) {
      throw new DomainException('Datas de início e fim são obrigatórias')
    }

    if (dataInicio > dataFim) {
      throw new DomainException('Data de início não pode ser posterior à data de fim')
    }

    return new PeriodoExecucao(dataInicio, dataFim)
  }

  obterDataInicio(): Date | null {
    return this.dataInicio
  }

  obterDataFim(): Date | null {
    return this.dataFim
  }

  // Métodos de negócio
  isIniciado(): boolean {
    return this.dataInicio !== null
  }

  isFinalizado(): boolean {
    return this.dataInicio !== null && this.dataFim !== null
  }

  calcularDuracaoDias(): number | null {
    if (!this.isIniciado() || !this.isFinalizado()) {
      return null
    }

    const diffMs = this.dataFim!.getTime() - this.dataInicio!.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) // Convertendo para dias (arredondando para cima)
  }

  finalizar(dataFim: Date): PeriodoExecucao {
    if (!this.isIniciado()) {
      throw new DomainException('Não é possível finalizar um período que não foi iniciado')
    }

    if (this.isFinalizado()) {
      throw new DomainException('Período já foi finalizado')
    }

    if (dataFim < this.dataInicio!) {
      throw new DomainException('Data de fim não pode ser anterior à data de início')
    }

    return new PeriodoExecucao(this.dataInicio, dataFim)
  }

  equals(outro: PeriodoExecucao): boolean {
    return (
      this.dataInicio?.getTime() === outro.dataInicio?.getTime() && this.dataFim?.getTime() === outro.dataFim?.getTime()
    )
  }

  toString(): string {
    if (!this.isIniciado()) {
      return 'Não iniciado'
    }

    if (!this.isFinalizado()) {
      return `Iniciado em: ${this.dataInicio!.toLocaleDateString()}`
    }

    const duracao = this.calcularDuracaoDias()
    return `${this.dataInicio!.toLocaleDateString()} - ${this.dataFim!.toLocaleDateString()} (${duracao} dias)`
  }
}
