import { Estoque } from './estoque.vo'

describe('Estoque', () => {
  describe('criar()', () => {
    it('deve criar instância válida com quantidade inteira dentro dos limites', () => {
      const estoque = Estoque.criar(100)
      expect(estoque.obterQuantidade()).toBe(100)
    })

    it('deve lançar erro se quantidade não for um número inteiro', () => {
      expect(() => Estoque.criar(10.5)).toThrow('Quantidade em estoque deve ser um número inteiro')
    })

    it('deve lançar erro se quantidade for negativa', () => {
      expect(() => Estoque.criar(-1)).toThrow('Quantidade em estoque não pode ser negativa')
    })

    it('deve lançar erro se quantidade for maior que 999.999', () => {
      expect(() => Estoque.criar(1_000_000)).toThrow('Quantidade em estoque não pode ser maior que 999.999')
    })
  })

  describe('zero()', () => {
    it('deve criar estoque com quantidade zero', () => {
      const estoque = Estoque.zero()
      expect(estoque.obterQuantidade()).toBe(0)
    })
  })

  describe('obterQuantidade()', () => {
    it('deve retornar a quantidade armazenada', () => {
      const estoque = Estoque.criar(50)
      expect(estoque.obterQuantidade()).toBe(50)
    })
  })

  describe('temEstoque()', () => {
    it('deve retornar true se quantidade > 0', () => {
      expect(Estoque.criar(5).temEstoque()).toBe(true)
    })

    it('deve retornar false se quantidade = 0', () => {
      expect(Estoque.zero().temEstoque()).toBe(false)
    })
  })

  describe('temEstoqueSuficiente()', () => {
    it('deve retornar true se quantidade >= necessária', () => {
      expect(Estoque.criar(10).temEstoqueSuficiente(5)).toBe(true)
    })

    it('deve retornar false se quantidade < necessária', () => {
      expect(Estoque.criar(3).temEstoqueSuficiente(5)).toBe(false)
    })
  })

  describe('baixar()', () => {
    it('deve reduzir quantidade corretamente se houver estoque suficiente', () => {
      const estoque = Estoque.criar(10).baixar(3)
      expect(estoque.obterQuantidade()).toBe(7)
    })

    it('deve lançar erro se quantidade a baixar for <= 0', () => {
      expect(() => Estoque.criar(10).baixar(0)).toThrow('Quantidade a baixar deve ser positiva')
    })

    it('deve lançar erro se estoque for insuficiente', () => {
      expect(() => Estoque.criar(2).baixar(5)).toThrow('Estoque insuficiente para baixa')
    })
  })

  describe('repor()', () => {
    it('deve aumentar quantidade corretamente', () => {
      const estoque = Estoque.criar(5).repor(10)
      expect(estoque.obterQuantidade()).toBe(15)
    })

    it('deve lançar erro se quantidade a repor for <= 0', () => {
      expect(() => Estoque.criar(5).repor(0)).toThrow('Quantidade a repor deve ser positiva')
    })
  })

  describe('equals()', () => {
    it('deve retornar true para estoques com a mesma quantidade', () => {
      const e1 = Estoque.criar(10)
      const e2 = Estoque.criar(10)
      expect(e1.equals(e2)).toBe(true)
    })

    it('deve retornar false para estoques com quantidades diferentes', () => {
      const e1 = Estoque.criar(10)
      const e2 = Estoque.criar(20)
      expect(e1.equals(e2)).toBe(false)
    })
  })
})
