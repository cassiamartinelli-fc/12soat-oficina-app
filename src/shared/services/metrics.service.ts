import { Injectable } from '@nestjs/common'

@Injectable()
export class MetricsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private newrelic: any

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      this.newrelic = require('newrelic')
    } catch {
      console.warn('New Relic not available, metrics will be disabled')
      this.newrelic = null
    }
  }

  /**
   * Registra criação de uma ordem de serviço
   */
  recordOrdemServicoCriada(): void {
    if (!this.newrelic) return

    this.newrelic.recordMetric('Custom/OrdemServico/Criada', 1)
  }

  /**
   * Registra o tempo que uma ordem de serviço ficou em um status
   * @param status - Status da ordem de serviço
   * @param tempoEmMinutos - Tempo que ficou no status (em minutos)
   */
  recordTempoNoStatus(status: string, tempoEmMinutos: number): void {
    if (!this.newrelic) return

    this.newrelic.recordMetric(`Custom/OrdemServico/TempoNoStatus/${status}`, tempoEmMinutos)
  }

  /**
   * Registra uma mudança de status da ordem de serviço
   * @param statusAnterior - Status anterior
   * @param novoStatus - Novo status
   */
  recordMudancaStatus(statusAnterior: string, novoStatus: string): void {
    if (!this.newrelic) return

    this.newrelic.recordMetric(`Custom/OrdemServico/Transicao/${statusAnterior}_para_${novoStatus}`, 1)
  }

  /**
   * Registra um erro no processamento de ordem de serviço
   * @param tipoErro - Tipo do erro
   */
  recordErroOrdemServico(tipoErro: string): void {
    if (!this.newrelic) return

    this.newrelic.recordMetric(`Custom/OrdemServico/Erro/${tipoErro}`, 1)
  }
}
