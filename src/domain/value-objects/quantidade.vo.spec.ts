import { DomainException } from '../../shared/exceptions/domain.exception'
import { Quantidade } from './quantidade.vo'

describe('Quantidade', () => {
  describe('criar', () => {
    it('deve criar quantidade válida', () => {
      const quantidade = Quantidade.criar(5)
      expect(quantidade.obterValor()).toBe(5)
    })

    it('deve lançar erro se valor for null', () => {
      expect(() => Quantidade.criar(null as any)).toThrow(DomainException)
      expect(() => Quantidade.criar(null as any)).toThrow('Quantidade é obrigatória')
    })

    it('deve lançar erro se valor for undefined', () => {
      expect(() => Quantidade.criar(undefined as any)).toThrow(DomainException)
      expect(() => Quantidade.criar(undefined as any)).toThrow('Quantidade é obrigatória')
    })

    it('deve lançar erro se valor não for inteiro positivo', () => {
      expect(() => Quantidade.criar(0)).toThrow('Quantidade deve ser um número inteiro positivo')
      expect(() => Quantidade.criar(-1)).toThrow('Quantidade deve ser um número inteiro positivo')
      expect(() => Quantidade.criar(1.5)).toThrow('Quantidade deve ser um número inteiro positivo')
    })
  })

  describe('operações matemáticas', () => {
    it('adicionar deve retornar nova quantidade com soma dos valores', () => {
      const q1 = Quantidade.criar(3)
      const q2 = Quantidade.criar(2)
      const resultado = q1.adicionar(q2)
      expect(resultado.obterValor()).toBe(5)
    })

    it('subtrair deve retornar nova quantidade com diferença positiva', () => {
      const q1 = Quantidade.criar(5)
      const q2 = Quantidade.criar(3)
      const resultado = q1.subtrair(q2)
      expect(resultado.obterValor()).toBe(2)
    })

    it('subtrair deve lançar erro se resultado for zero ou negativo', () => {
      const q1 = Quantidade.criar(3)
      const q2 = Quantidade.criar(3)
      expect(() => q1.subtrair(q2)).toThrow('Quantidade não pode ser zero ou negativa após subtração')
      expect(() => q2.subtrair(Quantidade.criar(5))).toThrow('Quantidade não pode ser zero ou negativa após subtração')
    })

    it('multiplicar deve retornar nova quantidade', () => {
      const q = Quantidade.criar(4)
      const resultado = q.multiplicar(3)
      expect(resultado.obterValor()).toBe(12)
    })

    it('multiplicar deve lançar erro se multiplicador for zero ou negativo', () => {
      const q = Quantidade.criar(4)
      expect(() => q.multiplicar(0)).toThrow('Multiplicador deve ser positivo')
      expect(() => q.multiplicar(-2)).toThrow('Multiplicador deve ser positivo')
    })
  })

  describe('comparações', () => {
    const q5 = Quantidade.criar(5)
    const q3 = Quantidade.criar(3)

    it('equals deve retornar true para valores iguais', () => {
      expect(q5.equals(Quantidade.criar(5))).toBe(true)
    })

    it('equals deve retornar false para valores diferentes', () => {
      expect(q5.equals(q3)).toBe(false)
    })

    it('maiorQue deve funcionar corretamente', () => {
      expect(q5.maiorQue(q3)).toBe(true)
      expect(q3.maiorQue(q5)).toBe(false)
    })

    it('menorQue deve funcionar corretamente', () => {
      expect(q3.menorQue(q5)).toBe(true)
      expect(q5.menorQue(q3)).toBe(false)
    })
  })

  describe('toString', () => {
    it('deve retornar valor como string', () => {
      const q = Quantidade.criar(7)
      expect(q.toString()).toBe('7')
    })
  })
})
