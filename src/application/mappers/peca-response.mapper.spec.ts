import { PecaResponseMapper } from './peca-response.mapper'

describe('PecaResponseMapper', () => {
  let mapper: PecaResponseMapper

  const mockPeca = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'Filtro de Óleo' },
    codigo: { obterValor: () => 'FOL001' },
    preco: { obterValor: () => 45.9 },
    estoque: { obterQuantidade: () => 50 },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  } as unknown as any

  beforeEach(() => {
    mapper = new PecaResponseMapper()
  })

  describe('toDto', () => {
    it('deve converter Peca para PecaResponseDto', () => {
      const result = mapper.toDto(mockPeca)

      expect(result).toEqual({
        id: 'test-id',
        nome: 'Filtro de Óleo',
        codigo: 'FOL001',
        preco: 45.9,
        quantidadeEstoque: 50,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de Pecas para lista de DTOs', () => {
      const pecas = [mockPeca, mockPeca]

      const result = mapper.toDtoList(pecas)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'test-id',
        nome: 'Filtro de Óleo',
        codigo: 'FOL001',
        preco: 45.9,
        quantidadeEstoque: 50,
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
