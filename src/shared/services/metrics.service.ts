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

    this.newrelic.recordCustomEvent('OrdemServicoCriada', {
      timestamp: Date.now(),
      eventType: 'criacao',
    })
  }

  /**
   * Registra o tempo que uma ordem de serviço ficou em um status
   * @param status - Status da ordem de serviço
   * @param tempoEmMinutos - Tempo que ficou no status (em minutos)
   */
  recordTempoNoStatus(status: string, tempoEmMinutos: number): void {
    if (!this.newrelic) return

    this.newrelic.recordCustomEvent('OrdemServicoTempoStatus', {
      status,
      tempoEmMinutos,
      timestamp: Date.now(),
    })
  }

  /**
   * Registra uma mudança de status da ordem de serviço
   * @param statusAnterior - Status anterior
   * @param novoStatus - Novo status
   */
  recordMudancaStatus(statusAnterior: string, novoStatus: string): void {
    if (!this.newrelic) return

    this.newrelic.recordCustomEvent('OrdemServicoMudancaStatus', {
      statusAnterior,
      novoStatus,
      transicao: `${statusAnterior}_para_${novoStatus}`,
      timestamp: Date.now(),
    })
  }

  /**
   * Registra um erro no processamento de ordem de serviço
   * @param tipoErro - Tipo do erro
   */
  recordErroOrdemServico(tipoErro: string): void {
    if (!this.newrelic) return

    this.newrelic.recordCustomEvent('OrdemServicoErro', {
      tipoErro,
      timestamp: Date.now(),
    })
  }
}
