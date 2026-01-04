import { OrdemServicoResponseMapper } from './ordem-servico-response.mapper'
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo'

describe('OrdemServicoResponseMapper', () => {
  let mapper: OrdemServicoResponseMapper

  const mockOrdemServico = {
    id: { obterValor: () => 'test-id' },
    status: { obterValor: () => StatusOrdemServico.RECEBIDA },
    valorTotal: { obterValor: () => 150.0 },
    clienteId: { obterValor: () => 'cliente-id' },
    veiculoId: { obterValor: () => 'veiculo-id' },
    periodoExecucao: {
      obterDataInicio: () => new Date('2025-01-01'),
      obterDataFim: () => new Date('2025-01-02'),
    },
    calcularDuracaoExecucao: () => 1,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  } as unknown as any

  beforeEach(() => {
    mapper = new OrdemServicoResponseMapper()
  })

  describe('toDto', () => {
    it('deve converter OrdemServico para OrdemServicoResponseDto', () => {
      const result = mapper.toDto(mockOrdemServico)

      expect(result).toEqual({
        id: 'test-id',
        status: StatusOrdemServico.RECEBIDA,
        valorTotal: 150.0,
        clienteId: 'cliente-id',
        veiculoId: 'veiculo-id',
        dataInicio: new Date('2025-01-01'),
        dataFim: new Date('2025-01-02'),
        duracaoDias: 1,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })

    it('deve converter OrdemServico sem período de execução', () => {
      const mockOrdemServicoSemPeriodo = {
        ...mockOrdemServico,
        periodoExecucao: {
          obterDataInicio: () => null as unknown as Date,
          obterDataFim: () => null as unknown as Date,
        },
        calcularDuracaoExecucao: () => null,
      }

      const result = mapper.toDto(mockOrdemServicoSemPeriodo)

      expect(result.dataInicio).toBeNull()
      expect(result.dataFim).toBeNull()
      expect(result.duracaoDias).toBeNull()
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de OrdemServicos para lista de DTOs', () => {
      const ordensServico = [mockOrdemServico, mockOrdemServico]

      const result = mapper.toDtoList(ordensServico)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'test-id',
        status: StatusOrdemServico.RECEBIDA,
        valorTotal: 150.0,
        clienteId: 'cliente-id',
        veiculoId: 'veiculo-id',
        dataInicio: new Date('2025-01-01'),
        dataFim: new Date('2025-01-02'),
        duracaoDias: 1,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })

    it('deve retornar lista vazia para array vazio', () => {
      const result = mapper.toDtoList([])

      expect(result).toEqual([])
    })
  })
})
