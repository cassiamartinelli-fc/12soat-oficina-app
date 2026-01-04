import { Preco } from './preco.vo'

describe('Preco', () => {
  describe('criar', () => {
    it('deve criar um preço válido', () => {
      const preco = Preco.criar(10)
      expect(preco.obterValor()).toBe(10)
    })

    it('deve lançar erro se o valor for negativo', () => {
      expect(() => Preco.criar(-5)).toThrow('Preço não pode ser negativo')
    })

    it('deve lançar erro se tiver mais de 2 casas decimais', () => {
      expect(() => Preco.criar(10.123)).toThrow('Preço deve ter no máximo 2 casas decimais')
    })
  })

  describe('criarDe', () => {
    it('deve criar um preço a partir de string válida', () => {
      const preco = Preco.criarDe('15.50')
      expect(preco.obterValor()).toBe(15.5)
    })

    it('deve lançar erro se a string não for um número válido', () => {
      expect(() => Preco.criarDe('abc')).toThrow('Preço deve ser um número válido')
    })
  })

  describe('zero', () => {
    it('deve criar um preço zero', () => {
      const preco = Preco.zero()
      expect(preco.obterValor()).toBe(0)
    })
  })

  describe('obterFormatado', () => {
    it('deve retornar o valor formatado em reais', () => {
      const preco = Preco.criar(10.5)
      expect(preco.obterFormatado()).toBe('R$ 10,50')
    })
  })

  describe('somar', () => {
    it('deve somar dois preços', () => {
      const preco1 = Preco.criar(10.25)
      const preco2 = Preco.criar(5.75)
      const resultado = preco1.somar(preco2)
      expect(resultado.obterValor()).toBe(16)
    })
  })

  describe('multiplicar', () => {
    it('deve multiplicar o preço por uma quantidade', () => {
      const preco = Preco.criar(10)
      const resultado = preco.multiplicar(3)
      expect(resultado.obterValor()).toBe(30)
    })

    it('deve lançar erro se a quantidade for negativa', () => {
      const preco = Preco.criar(10)
      expect(() => preco.multiplicar(-2)).toThrow('Quantidade deve ser positiva')
    })
  })

  describe('equals', () => {
    it('deve retornar true para preços iguais', () => {
      const preco1 = Preco.criar(10)
      const preco2 = Preco.criar(10)
      expect(preco1.equals(preco2)).toBe(true)
    })

    it('deve retornar false para preços diferentes', () => {
      const preco1 = Preco.criar(10)
      const preco2 = Preco.criar(12)
      expect(preco1.equals(preco2)).toBe(false)
    })
  })
})
