import { ServicoResponseMapper } from './servico-response.mapper'

describe('ServicoResponseMapper', () => {
  let mapper: ServicoResponseMapper

  const mockServico = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'Troca de Óleo' },
    preco: { obterValor: () => 50.0 },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  } as unknown as any

  beforeEach(() => {
    mapper = new ServicoResponseMapper()
  })

  describe('toDto', () => {
    it('deve converter Servico para ServicoResponseDto', () => {
      const result = mapper.toDto(mockServico)

      expect(result).toEqual({
        id: 'test-id',
        nome: 'Troca de Óleo',
        preco: 50.0,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de Servicos para lista de DTOs', () => {
      const servicos = [mockServico, mockServico]

      const result = mapper.toDtoList(servicos)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'test-id',
        nome: 'Troca de Óleo',
        preco: 50.0,
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
