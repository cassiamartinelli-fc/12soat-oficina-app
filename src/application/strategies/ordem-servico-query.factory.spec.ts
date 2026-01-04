import { OrdemServicoQueryFactory } from './ordem-servico-query.factory'
import {
  BuscarTodasOrdensStrategy,
  BuscarPorClienteStrategy,
  BuscarPorVeiculoStrategy,
  BuscarPorStatusStrategy,
} from './ordem-servico-query.strategy'
import { BuscarOrdemServicoUseCase } from '../use-cases/ordem-servico'
import { StatusOrdemServico } from '../../domain/value-objects'

describe('OrdemServicoQueryFactory', () => {
  let factory: OrdemServicoQueryFactory
  let mockBuscarOrdemServicoUseCase: jest.Mocked<BuscarOrdemServicoUseCase>

  beforeEach(() => {
    mockBuscarOrdemServicoUseCase = {
      buscarTodos: jest.fn(),
      buscarPorCliente: jest.fn(),
      buscarPorVeiculo: jest.fn(),
      buscarPorStatus: jest.fn(),
      buscarPorId: jest.fn(),
    }

    factory = new OrdemServicoQueryFactory(mockBuscarOrdemServicoUseCase)
  })

  describe('createStrategy', () => {
    it('deve criar BuscarPorClienteStrategy quando clienteId é fornecido', () => {
      const filters = { clienteId: 'cliente-123' }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorClienteStrategy)
    })

    it('deve criar BuscarPorVeiculoStrategy quando veiculoId é fornecido', () => {
      const filters = { veiculoId: 'veiculo-123' }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorVeiculoStrategy)
    })

    it('deve criar BuscarPorStatusStrategy quando status é fornecido', () => {
      const filters = { status: StatusOrdemServico.EM_DIAGNOSTICO }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorStatusStrategy)
    })

    it('deve criar BuscarTodasOrdensStrategy quando nenhum filtro é fornecido', () => {
      const filters = {}

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarTodasOrdensStrategy)
    })

    it('deve priorizar clienteId quando múltiplos filtros são fornecidos', () => {
      const filters = {
        clienteId: 'cliente-123',
        veiculoId: 'veiculo-123',
        status: StatusOrdemServico.EM_DIAGNOSTICO,
      }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorClienteStrategy)
    })

    it('deve priorizar veiculoId quando clienteId não está presente', () => {
      const filters = {
        veiculoId: 'veiculo-123',
        status: StatusOrdemServico.EM_DIAGNOSTICO,
      }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorVeiculoStrategy)
    })

    it('deve usar status quando apenas status é fornecido', () => {
      const filters = {
        status: StatusOrdemServico.FINALIZADA,
      }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarPorStatusStrategy)
    })

    it('deve funcionar com filtros undefined', () => {
      const filters = {
        clienteId: undefined,
        veiculoId: undefined,
        status: undefined,
      }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarTodasOrdensStrategy)
    })

    it('deve funcionar com filtros vazios', () => {
      const filters = {
        clienteId: '',
        veiculoId: '',
      }

      const strategy = factory.createStrategy(filters)

      expect(strategy).toBeInstanceOf(BuscarTodasOrdensStrategy)
    })

    it('deve criar strategy correta para cada status válido', () => {
      const statusList = [
        StatusOrdemServico.RECEBIDA,
        StatusOrdemServico.EM_DIAGNOSTICO,
        StatusOrdemServico.AGUARDANDO_APROVACAO,
        StatusOrdemServico.EM_EXECUCAO,
        StatusOrdemServico.FINALIZADA,
        StatusOrdemServico.ENTREGUE,
      ]

      statusList.forEach((status) => {
        const filters = { status }
        const strategy = factory.createStrategy(filters)
        expect(strategy).toBeInstanceOf(BuscarPorStatusStrategy)
      })
    })
  })

  describe('integração com strategies', () => {
    it('deve criar strategy que funciona corretamente com clienteId', async () => {
      const filters = { clienteId: 'cliente-123' }
      const strategy = factory.createStrategy(filters)
      const mockOrdens = [{ id: 'ordem-1' }] as any

      mockBuscarOrdemServicoUseCase.buscarPorCliente.mockResolvedValue(mockOrdens)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(mockOrdens)
      expect(mockBuscarOrdemServicoUseCase.buscarPorCliente).toHaveBeenCalledWith('cliente-123')
    })

    it('deve criar strategy que funciona corretamente com veiculoId', async () => {
      const filters = { veiculoId: 'veiculo-456' }
      const strategy = factory.createStrategy(filters)
      const mockOrdens = [{ id: 'ordem-2' }] as any

      mockBuscarOrdemServicoUseCase.buscarPorVeiculo.mockResolvedValue(mockOrdens)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(mockOrdens)
      expect(mockBuscarOrdemServicoUseCase.buscarPorVeiculo).toHaveBeenCalledWith('veiculo-456')
    })

    it('deve criar strategy que funciona corretamente com status', async () => {
      const filters = { status: StatusOrdemServico.EM_EXECUCAO }
      const strategy = factory.createStrategy(filters)
      const mockOrdens = [{ id: 'ordem-3' }] as any

      mockBuscarOrdemServicoUseCase.buscarPorStatus.mockResolvedValue(mockOrdens)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(mockOrdens)
      expect(mockBuscarOrdemServicoUseCase.buscarPorStatus).toHaveBeenCalledWith(StatusOrdemServico.EM_EXECUCAO)
    })

    it('deve criar strategy que funciona corretamente sem filtros', async () => {
      const filters = {}
      const strategy = factory.createStrategy(filters)
      const mockOrdens = [{ id: 'ordem-4' }] as any

      mockBuscarOrdemServicoUseCase.buscarTodos.mockResolvedValue(mockOrdens)

      const resultado = await strategy.execute()

      expect(resultado).toEqual(mockOrdens)
      expect(mockBuscarOrdemServicoUseCase.buscarTodos).toHaveBeenCalledTimes(1)
    })
  })
})
