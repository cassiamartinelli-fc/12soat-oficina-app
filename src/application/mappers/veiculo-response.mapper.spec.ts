import { VeiculoResponseMapper } from './veiculo-response.mapper'

describe('VeiculoResponseMapper', () => {
  let mapper: VeiculoResponseMapper

  const mockVeiculo = {
    id: { obterValor: () => 'test-id' },
    placa: { obterValor: () => 'ABC1234' },
    marca: { obterValor: () => 'TOYOTA' },
    modelo: { obterValor: () => 'Corolla' },
    ano: { obterValor: () => 2020 },
    clienteId: { obterValor: () => 'cliente-id' },
    obterDescricaoCompleta: () => 'TOYOTA Corolla 2020',
    isPlacaMercosul: () => false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  } as unknown as any

  beforeEach(() => {
    mapper = new VeiculoResponseMapper()
  })

  describe('toDto', () => {
    it('deve converter Veiculo para VeiculoResponseDto', () => {
      const result = mapper.toDto(mockVeiculo)

      expect(result).toEqual({
        id: 'test-id',
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-id',
        descricaoCompleta: 'TOYOTA Corolla 2020',
        placaMercosul: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })

    it('deve converter Veiculo com placa Mercosul', () => {
      const mockVeiculoMercosul = {
        ...mockVeiculo,
        placa: { obterValor: () => 'BRA2E19' },
        isPlacaMercosul: () => true,
      }

      const result = mapper.toDto(mockVeiculoMercosul)

      expect(result.placa).toBe('BRA2E19')
      expect(result.placaMercosul).toBe(true)
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de Veiculos para lista de DTOs', () => {
      const veiculos = [mockVeiculo, mockVeiculo]

      const result = mapper.toDtoList(veiculos)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'test-id',
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-id',
        descricaoCompleta: 'TOYOTA Corolla 2020',
        placaMercosul: false,
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
