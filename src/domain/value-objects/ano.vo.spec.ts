import { Ano } from './ano.vo'

describe('Ano', () => {
  const anoAtual = new Date().getFullYear()

  describe('criar()', () => {
    it('deve criar instância válida para ano inteiro dentro dos limites', () => {
      const ano = Ano.criar(2000)
      expect(ano.obterValor()).toBe(2000)
    })

    it('deve lançar erro se ano não for inteiro', () => {
      expect(() => Ano.criar(2000.5)).toThrow('Ano deve ser um número inteiro')
    })

    it('deve lançar erro se ano for menor que 1950', () => {
      expect(() => Ano.criar(1949)).toThrow('Ano deve ser maior ou igual a 1950')
    })

    it('deve lançar erro se ano for maior que ano atual + 1', () => {
      expect(() => Ano.criar(anoAtual + 2)).toThrow(`Ano não pode ser maior que ${anoAtual + 1}`)
    })
  })

  describe('obterValor()', () => {
    it('deve retornar o valor correto', () => {
      const ano = Ano.criar(2020)
      expect(ano.obterValor()).toBe(2020)
    })
  })

  describe('isClassico()', () => {
    it('deve retornar true se ano for 30 anos ou mais antigo', () => {
      const ano = Ano.criar(anoAtual - 31)
      expect(ano.isClassico()).toBe(true)
    })

    it('deve retornar false se ano for mais recente que 30 anos', () => {
      const ano = Ano.criar(anoAtual - 29)
      expect(ano.isClassico()).toBe(false)
    })
  })

  describe('isAntigo()', () => {
    it('deve retornar true se ano for 20 anos ou mais antigo', () => {
      const ano = Ano.criar(anoAtual - 21)
      expect(ano.isAntigo()).toBe(true)
    })

    it('deve retornar false se ano for mais recente que 20 anos', () => {
      const ano = Ano.criar(anoAtual - 19)
      expect(ano.isAntigo()).toBe(false)
    })
  })

  describe('isRecente()', () => {
    it('deve retornar true se ano for nos últimos 5 anos', () => {
      const ano = Ano.criar(anoAtual - 3)
      expect(ano.isRecente()).toBe(true)
    })

    it('deve retornar false se ano for mais antigo que 5 anos', () => {
      const ano = Ano.criar(anoAtual - 6)
      expect(ano.isRecente()).toBe(false)
    })
  })

  describe('equals()', () => {
    it('deve retornar true para anos iguais', () => {
      const ano1 = Ano.criar(2000)
      const ano2 = Ano.criar(2000)
      expect(ano1.equals(ano2)).toBe(true)
    })

    it('deve retornar false para anos diferentes', () => {
      const ano1 = Ano.criar(2000)
      const ano2 = Ano.criar(2001)
      expect(ano1.equals(ano2)).toBe(false)
    })
  })
})
