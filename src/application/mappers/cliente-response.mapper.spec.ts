import { ClienteResponseMapper } from './cliente-response.mapper'

describe('ClienteResponseMapper', () => {
  let mapper: ClienteResponseMapper

  const mockCliente = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'João Silva' },
    cpfCnpj: { obterValor: () => '11144477735' },
    telefone: { obterValor: () => '11999887766' },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  } as unknown as any

  beforeEach(() => {
    mapper = new ClienteResponseMapper()
  })

  describe('toDto', () => {
    it('deve converter Cliente para ClienteResponseDto', () => {
      const result = mapper.toDto(mockCliente)

      expect(result).toEqual({
        id: 'test-id',
        nome: 'João Silva',
        cpfCnpj: '11144477735',
        telefone: '11999887766',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      })
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de Clientes para lista de DTOs', () => {
      const clientes = [mockCliente, mockCliente]

      const result = mapper.toDtoList(clientes)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'test-id',
        nome: 'João Silva',
        cpfCnpj: '11144477735',
        telefone: '11999887766',
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
