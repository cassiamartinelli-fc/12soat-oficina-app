import { OrdemServico } from '../../domain/entities'
import { StatusOrdemServico } from '../../domain/value-objects'
import { BuscarOrdemServicoUseCase } from '../use-cases/ordem-servico'

export interface OrdemServicoQueryStrategy {
  execute(): Promise<OrdemServico[]>
}

export class BuscarTodasOrdensStrategy implements OrdemServicoQueryStrategy {
  constructor(private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase) {}

  async execute(): Promise<OrdemServico[]> {
    return this.buscarOrdemServicoUseCase.buscarTodos()
  }
}

export class BuscarPorClienteStrategy implements OrdemServicoQueryStrategy {
  constructor(
    private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase,
    private readonly clienteId: string,
  ) {}

  async execute(): Promise<OrdemServico[]> {
    return this.buscarOrdemServicoUseCase.buscarPorCliente(this.clienteId)
  }
}

export class BuscarPorVeiculoStrategy implements OrdemServicoQueryStrategy {
  constructor(
    private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase,
    private readonly veiculoId: string,
  ) {}

  async execute(): Promise<OrdemServico[]> {
    return this.buscarOrdemServicoUseCase.buscarPorVeiculo(this.veiculoId)
  }
}

export class BuscarPorStatusStrategy implements OrdemServicoQueryStrategy {
  constructor(
    private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase,
    private readonly status: StatusOrdemServico,
  ) {}

  async execute(): Promise<OrdemServico[]> {
    return this.buscarOrdemServicoUseCase.buscarPorStatus(this.status)
  }
}
