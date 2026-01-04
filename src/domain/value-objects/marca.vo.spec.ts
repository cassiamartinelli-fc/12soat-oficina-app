import { Marca } from './marca.vo'

describe('Marca', () => {
  describe('criar()', () => {
    it('deve criar instância válida com valor normalizado', () => {
      const marca = Marca.criar(' ford ')
      expect(marca.obterValor()).toBe('FORD')
    })

    it('deve lançar erro se valor for vazio', () => {
      expect(() => Marca.criar('')).toThrow('Marca não pode estar vazia')
    })

    it('deve lançar erro se valor tiver mais de 50 caracteres', () => {
      const valorLongo = 'A'.repeat(51)
      expect(() => Marca.criar(valorLongo)).toThrow('Marca deve ter no máximo 50 caracteres')
    })

    it('deve lançar erro se valor contiver caracteres inválidos', () => {
      expect(() => Marca.criar('Marca@123')).toThrow('Marca deve conter apenas letras, números, espaços e hífens')
    })

    it('deve aceitar letras, números, espaços, hífens e "&"', () => {
      const marca = Marca.criar('FORD - GM & TOYOTA 123')
      expect(marca.obterValor()).toBe('FORD - GM & TOYOTA 123')
    })
  })

  describe('obterValor()', () => {
    it('deve retornar o valor armazenado', () => {
      const marca = Marca.criar('toyota')
      expect(marca.obterValor()).toBe('TOYOTA')
    })
  })

  describe('equals()', () => {
    it('deve retornar true para marcas iguais', () => {
      const m1 = Marca.criar('Honda')
      const m2 = Marca.criar('HONDA')
      expect(m1.equals(m2)).toBe(true)
    })

    it('deve retornar false para marcas diferentes', () => {
      const m1 = Marca.criar('Honda')
      const m2 = Marca.criar('Toyota')
      expect(m1.equals(m2)).toBe(false)
    })
  })
})
