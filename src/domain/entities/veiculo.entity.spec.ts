import { Veiculo } from './veiculo.entity'

describe('Veiculo Entity', () => {
  describe('Criação', () => {
    it('deve criar veículo válido', () => {
      const veiculo = Veiculo.criar({
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: '123e4567-e89b-12d3-a456-426614174000',
      })

      expect(veiculo.placa.obterValor()).toBe('ABC1234')
      expect(veiculo.marca.obterValor()).toBe('TOYOTA')
      expect(veiculo.modelo.obterValor()).toBe('Corolla')
      expect(veiculo.ano.obterValor()).toBe(2020)
      expect(veiculo.clienteId.obterValor()).toBe('123e4567-e89b-12d3-a456-426614174000')
    })

    it('deve criar veículo com placa Mercosul', () => {
      const veiculo = Veiculo.criar({
        placa: 'ABC1A23',
        marca: 'HONDA',
        modelo: 'Civic',
        ano: 2022,
        clienteId: '123e4567-e89b-12d3-a456-426614174000',
      })

      expect(veiculo.isPlacaMercosul()).toBe(true)
      expect(veiculo.placa.obterValor()).toBe('ABC1A23')
    })

    it('deve definir datas de criação e atualização', () => {
      const antes = new Date()
      const veiculo = Veiculo.criar({
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: '123e4567-e89b-12d3-a456-426614174000',
      })
      const depois = new Date()

      expect(veiculo.createdAt.getTime()).toBeGreaterThanOrEqual(antes.getTime())
      expect(veiculo.createdAt.getTime()).toBeLessThanOrEqual(depois.getTime())
      expect(veiculo.updatedAt.getTime()).toBeGreaterThanOrEqual(antes.getTime())
      expect(veiculo.updatedAt.getTime()).toBeLessThanOrEqual(depois.getTime())
    })
  })

  describe('Métodos de negócio', () => {
    let veiculo: Veiculo

    beforeEach(() => {
      veiculo = Veiculo.criar({
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: '123e4567-e89b-12d3-a456-426614174000',
      })
    })

    it('deve atualizar placa', () => {
      veiculo.atualizarPlaca('XYZ5678')

      expect(veiculo.placa.obterValor()).toBe('XYZ5678')
    })

    it('deve atualizar marca', () => {
      veiculo.atualizarMarca('HONDA')

      expect(veiculo.marca.obterValor()).toBe('HONDA')
    })

    it('deve atualizar modelo', () => {
      veiculo.atualizarModelo('Civic')

      expect(veiculo.modelo.obterValor()).toBe('Civic')
    })

    it('deve atualizar ano', () => {
      veiculo.atualizarAno(2021)

      expect(veiculo.ano.obterValor()).toBe(2021)
    })

    it('deve transferir propriedade', () => {
      const novoClienteId = '987e6543-e21c-34b5-a654-123456789000'
      veiculo.transferirPropriedade(novoClienteId)

      expect(veiculo.clienteId.obterValor()).toBe(novoClienteId)
    })

    it('deve gerar descrição completa', () => {
      const descricao = veiculo.obterDescricaoCompleta()

      expect(descricao).toBe('TOYOTA Corolla 2020')
    })
  })

  describe('Validações', () => {
    it('deve rejeitar placa inválida', () => {
      expect(() =>
        Veiculo.criar({
          placa: 'INVALID',
          marca: 'TOYOTA',
          modelo: 'Corolla',
          ano: 2020,
          clienteId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      ).toThrow('Placa deve seguir formato AAA0000 ou AAA0A00')
    })

    it('deve rejeitar marca vazia', () => {
      expect(() =>
        Veiculo.criar({
          placa: 'ABC1234',
          marca: '',
          modelo: 'Corolla',
          ano: 2020,
          clienteId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      ).toThrow('Marca não pode estar vazia')
    })

    it('deve rejeitar modelo vazio', () => {
      expect(() =>
        Veiculo.criar({
          placa: 'ABC1234',
          marca: 'TOYOTA',
          modelo: '',
          ano: 2020,
          clienteId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      ).toThrow('Modelo não pode estar vazio')
    })

    it('deve rejeitar ano inválido', () => {
      expect(() =>
        Veiculo.criar({
          placa: 'ABC1234',
          marca: 'TOYOTA',
          modelo: 'Corolla',
          ano: 1900,
          clienteId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      ).toThrow('Ano deve ser maior ou igual a 1950')
    })
  })

  describe('Comparação', () => {
    it('deve comparar veículos pelo ID', () => {
      const veiculo1 = Veiculo.criar({
        placa: 'ABC1234',
        marca: 'TOYOTA',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: '123e4567-e89b-12d3-a456-426614174000',
      })

      const veiculo2 = Veiculo.criar({
        placa: 'XYZ5678',
        marca: 'HONDA',
        modelo: 'Civic',
        ano: 2021,
        clienteId: '987e6543-e21c-34b5-a654-123456789000',
      })

      expect(veiculo1.equals(veiculo1)).toBe(true)
      expect(veiculo1.equals(veiculo2)).toBe(false)
    })
  })
})
