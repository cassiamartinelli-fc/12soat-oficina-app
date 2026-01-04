import { Injectable } from '@nestjs/common'
import { StatusOrdemServico } from '../../domain/value-objects'
import { BuscarOrdemServicoUseCase } from '../use-cases/ordem-servico'
import {
  OrdemServicoQueryStrategy,
  BuscarTodasOrdensStrategy,
  BuscarPorClienteStrategy,
  BuscarPorVeiculoStrategy,
  BuscarPorStatusStrategy,
} from './ordem-servico-query.strategy'

export interface QueryFilters {
  clienteId?: string
  veiculoId?: string
  status?: StatusOrdemServico
}

@Injectable()
export class OrdemServicoQueryFactory {
  constructor(private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase) {}

  createStrategy(filters: QueryFilters): OrdemServicoQueryStrategy {
    if (filters.clienteId) {
      return new BuscarPorClienteStrategy(this.buscarOrdemServicoUseCase, filters.clienteId)
    }

    if (filters.veiculoId) {
      return new BuscarPorVeiculoStrategy(this.buscarOrdemServicoUseCase, filters.veiculoId)
    }

    if (filters.status) {
      return new BuscarPorStatusStrategy(this.buscarOrdemServicoUseCase, filters.status)
    }

    return new BuscarTodasOrdensStrategy(this.buscarOrdemServicoUseCase)
  }
}
