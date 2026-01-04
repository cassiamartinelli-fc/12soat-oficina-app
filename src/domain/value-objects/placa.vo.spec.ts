import { Placa } from './placa.vo'

describe('Placa Value Object', () => {
  describe('Formato antigo', () => {
    it('deve criar placa formato antigo válida', () => {
      const placa = Placa.criar('ABC1234')
      expect(placa.obterValor()).toBe('ABC1234')
      expect(placa.isFormatoAntigo()).toBe(true)
      expect(placa.isFormatoMercosul()).toBe(false)
    })

    it('deve normalizar placa com hífen', () => {
      const placa = Placa.criar('ABC-1234')
      expect(placa.obterValor()).toBe('ABC1234')
    })

    it('deve normalizar placa minúscula', () => {
      const placa = Placa.criar('abc1234')
      expect(placa.obterValor()).toBe('ABC1234')
    })
  })

  describe('Formato Mercosul', () => {
    it('deve criar placa Mercosul válida', () => {
      const placa = Placa.criar('ABC1A23')
      expect(placa.obterValor()).toBe('ABC1A23')
      expect(placa.isFormatoMercosul()).toBe(true)
      expect(placa.isFormatoAntigo()).toBe(false)
    })

    it('deve normalizar placa Mercosul com hífen', () => {
      const placa = Placa.criar('ABC-1A23')
      expect(placa.obterValor()).toBe('ABC1A23')
    })
  })

  describe('Formatação', () => {
    it('deve formatar placa antiga com hífen', () => {
      const placa = Placa.criar('ABC1234')
      expect(placa.obterFormatada()).toBe('ABC-1234')
    })

    it('deve formatar placa Mercosul com hífen', () => {
      const placa = Placa.criar('ABC1A23')
      expect(placa.obterFormatada()).toBe('ABC-1A23')
    })
  })

  describe('Validações', () => {
    it('deve rejeitar formato inválido', () => {
      expect(() => Placa.criar('AB1234')).toThrow('Placa deve seguir formato AAA0000 ou AAA0A00')
    })

    it('deve rejeitar placa com caracteres especiais', () => {
      expect(() => Placa.criar('ABC@123')).toThrow('Placa deve seguir formato AAA0000 ou AAA0A00')
    })
  })

  describe('Comparação', () => {
    it('deve comparar placas corretamente', () => {
      const placa1 = Placa.criar('ABC-1234')
      const placa2 = Placa.criar('ABC1234')
      expect(placa1.equals(placa2)).toBe(true)
    })
  })
})
