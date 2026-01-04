import {
  BuscarTodasOrdensStrategy,
  BuscarPorClienteStrategy,
  BuscarPorVeiculoStrategy,
  BuscarPorStatusStrategy,
} from './ordem-servico-query.strategy'
import { BuscarOrdemServicoUseCase } from '../use-cases/ordem-servico'
import { StatusOrdemServico } from '../../domain/value-objects'
import { OrdemServico } from '../../domain/entities'

describe('OrdemServicoQueryStrategy', () => {
  let mockBuscarOrdemServicoUseCase: jest.Mocked<BuscarOrdemServicoUseCase>
  let mockOrdemServico: OrdemServico

  beforeEach(() => {
    mockBuscarOrdemServicoUseCase = {
      buscarTodos: jest.fn(),
      buscarPorCliente: jest.fn(),
      buscarPorVeiculo: jest.fn(),
      buscarPorStatus: jest.fn(),
      buscarPorId: jest.fn(),
    }

    mockOrdemServico = {
      id: { obterValor: () => 'ordem-id' },
      status: { obterValor: () => StatusOrdemServico.RECEBIDA },
      clienteId: { obterValor: () => 'cliente-id' },
      veiculoId: { obterValor: () => 'veiculo-id' },
    } as any
  })

  describe('BuscarTodasOrdensStrategy', () => {
    it('deve buscar todas as ordens de serviço', async () => {
      const strategy = new BuscarTodasOrdensStrategy(mockBuscarOrdemServicoUseCase)
      const ordensServico = [mockOrdemServico]

      mockBuscarOrdemServicoUseCase.buscarTodos.mockResolvedValue(ordensServico)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(ordensServico)
      expect(mockBuscarOrdemServicoUseCase.buscarTodos).toHaveBeenCalledTimes(1)
    })

    it('deve retornar lista vazia quando não há ordens', async () => {
      const strategy = new BuscarTodasOrdensStrategy(mockBuscarOrdemServicoUseCase)

      mockBuscarOrdemServicoUseCase.buscarTodos.mockResolvedValue([])

      const resultado = await strategy.execute()

      expect(resultado).toEqual([])
    })
  })

  describe('BuscarPorClienteStrategy', () => {
    it('deve buscar ordens por cliente', async () => {
      const clienteId = 'cliente-123'
      const strategy = new BuscarPorClienteStrategy(mockBuscarOrdemServicoUseCase, clienteId)
      const ordensServico = [mockOrdemServico]

      mockBuscarOrdemServicoUseCase.buscarPorCliente.mockResolvedValue(ordensServico)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(ordensServico)
      expect(mockBuscarOrdemServicoUseCase.buscarPorCliente).toHaveBeenCalledWith(clienteId)
    })

    it('deve retornar lista vazia quando cliente não tem ordens', async () => {
      const clienteId = 'cliente-sem-ordens'
      const strategy = new BuscarPorClienteStrategy(mockBuscarOrdemServicoUseCase, clienteId)

      mockBuscarOrdemServicoUseCase.buscarPorCliente.mockResolvedValue([])

      const resultado = await strategy.execute()

      expect(resultado).toEqual([])
      expect(mockBuscarOrdemServicoUseCase.buscarPorCliente).toHaveBeenCalledWith(clienteId)
    })
  })

  describe('BuscarPorVeiculoStrategy', () => {
    it('deve buscar ordens por veículo', async () => {
      const veiculoId = 'veiculo-123'
      const strategy = new BuscarPorVeiculoStrategy(mockBuscarOrdemServicoUseCase, veiculoId)
      const ordensServico = [mockOrdemServico]

      mockBuscarOrdemServicoUseCase.buscarPorVeiculo.mockResolvedValue(ordensServico)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(ordensServico)
      expect(mockBuscarOrdemServicoUseCase.buscarPorVeiculo).toHaveBeenCalledWith(veiculoId)
    })

    it('deve retornar lista vazia quando veículo não tem ordens', async () => {
      const veiculoId = 'veiculo-sem-ordens'
      const strategy = new BuscarPorVeiculoStrategy(mockBuscarOrdemServicoUseCase, veiculoId)

      mockBuscarOrdemServicoUseCase.buscarPorVeiculo.mockResolvedValue([])

      const resultado = await strategy.execute()

      expect(resultado).toEqual([])
      expect(mockBuscarOrdemServicoUseCase.buscarPorVeiculo).toHaveBeenCalledWith(veiculoId)
    })
  })

  describe('BuscarPorStatusStrategy', () => {
    it('deve buscar ordens por status', async () => {
      const status = StatusOrdemServico.EM_DIAGNOSTICO
      const strategy = new BuscarPorStatusStrategy(mockBuscarOrdemServicoUseCase, status)
      const ordensServico = [mockOrdemServico]

      mockBuscarOrdemServicoUseCase.buscarPorStatus.mockResolvedValue(ordensServico)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(ordensServico)
      expect(mockBuscarOrdemServicoUseCase.buscarPorStatus).toHaveBeenCalledWith(status)
    })

    it('deve retornar lista vazia quando não há ordens com o status', async () => {
      const status = StatusOrdemServico.FINALIZADA
      const strategy = new BuscarPorStatusStrategy(mockBuscarOrdemServicoUseCase, status)

      mockBuscarOrdemServicoUseCase.buscarPorStatus.mockResolvedValue([])

      const resultado = await strategy.execute()

      expect(resultado).toEqual([])
      expect(mockBuscarOrdemServicoUseCase.buscarPorStatus).toHaveBeenCalledWith(status)
    })

    it('deve funcionar com diferentes status', async () => {
      const statusList = [
        StatusOrdemServico.RECEBIDA,
        StatusOrdemServico.EM_DIAGNOSTICO,
        StatusOrdemServico.AGUARDANDO_APROVACAO,
        StatusOrdemServico.EM_EXECUCAO,
        StatusOrdemServico.FINALIZADA,
        StatusOrdemServico.ENTREGUE,
      ]

      for (const status of statusList) {
        const strategy = new BuscarPorStatusStrategy(mockBuscarOrdemServicoUseCase, status)
        mockBuscarOrdemServicoUseCase.buscarPorStatus.mockResolvedValue([mockOrdemServico])

        const resultado = await strategy.execute()

        expect(resultado).toEqual([mockOrdemServico])
        expect(mockBuscarOrdemServicoUseCase.buscarPorStatus).toHaveBeenCalledWith(status)
      }
    })
  })
})
