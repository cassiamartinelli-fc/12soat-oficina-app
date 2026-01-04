import { Modelo } from './modelo.vo'

describe('Modelo', () => {
  describe('criar()', () => {
    it('deve criar instância válida com valor normalizado (trim e múltiplos espaços)', () => {
      const modelo = Modelo.criar('  Ford   Fiesta  ')
      expect(modelo.obterValor()).toBe('Ford Fiesta')
    })

    it('deve lançar erro se valor for vazio', () => {
      expect(() => Modelo.criar('')).toThrow('Modelo não pode estar vazio')
    })

    it('deve lançar erro se valor tiver mais de 50 caracteres', () => {
      const valorLongo = 'A'.repeat(51)
      expect(() => Modelo.criar(valorLongo)).toThrow('Modelo deve ter no máximo 50 caracteres')
    })

    it('deve lançar erro se valor contiver caracteres inválidos', () => {
      expect(() => Modelo.criar('Modelo@123')).toThrow(
        'Modelo deve conter apenas letras, números, espaços, hífens, pontos e barras',
      )
    })

    it('deve aceitar letras, números, espaços, hífens, pontos e barras', () => {
      const modelo = Modelo.criar('Civic-Type.R/2025')
      expect(modelo.obterValor()).toBe('Civic-Type.R/2025')
    })
  })

  describe('obterValor()', () => {
    it('deve retornar o valor armazenado', () => {
      const modelo = Modelo.criar('Corolla')
      expect(modelo.obterValor()).toBe('Corolla')
    })
  })

  describe('equals()', () => {
    it('deve retornar true para modelos iguais', () => {
      const m1 = Modelo.criar('Uno Mille')
      const m2 = Modelo.criar('Uno Mille')
      expect(m1.equals(m2)).toBe(true)
    })

    it('deve retornar false para modelos diferentes', () => {
      const m1 = Modelo.criar('Onix')
      const m2 = Modelo.criar('Cruze')
      expect(m1.equals(m2)).toBe(false)
    })
  })
})
