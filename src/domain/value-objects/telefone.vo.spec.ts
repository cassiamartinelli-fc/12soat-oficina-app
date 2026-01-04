import { Telefone } from './telefone.vo'

describe('Telefone Value Object', () => {
  describe('Telefone fixo válido', () => {
    it('deve criar telefone fixo válido', () => {
      const telefone = Telefone.criar('1133334444')
      expect(telefone.obterValor()).toBe('1133334444')
      expect(telefone.isFixo()).toBe(true)
      expect(telefone.isCelular()).toBe(false)
    })

    it('deve sanitizar telefone fixo com máscara', () => {
      const telefone = Telefone.criar('(11) 3333-4444')
      expect(telefone.obterValor()).toBe('1133334444')
    })

    it('deve formatar telefone fixo', () => {
      const telefone = Telefone.criar('1133334444')
      expect(telefone.obterFormatado()).toBe('(11) 3333-4444')
    })
  })

  describe('Celular válido', () => {
    it('deve criar celular válido com 9', () => {
      const telefone = Telefone.criar('11999887766')
      expect(telefone.obterValor()).toBe('11999887766')
      expect(telefone.isCelular()).toBe(true)
      expect(telefone.isFixo()).toBe(false)
    })

    it('deve criar celular válido com 8', () => {
      const telefone = Telefone.criar('11888776655')
      expect(telefone.obterValor()).toBe('11888776655')
      expect(telefone.isCelular()).toBe(true)
    })

    it('deve sanitizar celular com máscara', () => {
      const telefone = Telefone.criar('(11) 99988-7766')
      expect(telefone.obterValor()).toBe('11999887766')
    })

    it('deve formatar celular', () => {
      const telefone = Telefone.criar('11999887766')
      expect(telefone.obterFormatado()).toBe('(11) 99988-7766')
    })
  })

  describe('Validações', () => {
    it('deve rejeitar telefone muito curto', () => {
      expect(() => Telefone.criar('123456789')).toThrow('Telefone deve ter 10 ou 11 dígitos')
    })

    it('deve rejeitar telefone muito longo', () => {
      expect(() => Telefone.criar('119999887766')).toThrow('Telefone deve ter 10 ou 11 dígitos')
    })

    it('deve rejeitar celular que não começa com 8 ou 9', () => {
      expect(() => Telefone.criar('11777887766')).toThrow('Celular deve começar com 8 ou 9 no terceiro dígito')
    })

    it('deve rejeitar celular que começa com 7', () => {
      expect(() => Telefone.criar('11777887766')).toThrow('Celular deve começar com 8 ou 9 no terceiro dígito')
    })

    it('deve rejeitar telefone vazio', () => {
      expect(() => Telefone.criar('')).toThrow('Telefone deve ter 10 ou 11 dígitos')
    })
  })

  describe('Comparação', () => {
    it('deve comparar telefones corretamente', () => {
      const tel1 = Telefone.criar('(11) 99988-7766')
      const tel2 = Telefone.criar('11999887766')
      expect(tel1.equals(tel2)).toBe(true)
    })

    it('deve comparar telefones diferentes', () => {
      const tel1 = Telefone.criar('11999887766')
      const tel2 = Telefone.criar('11888776655')
      expect(tel1.equals(tel2)).toBe(false)
    })
  })

  describe('Detecção de tipo', () => {
    it('deve identificar telefone fixo', () => {
      const telefone = Telefone.criar('1133334444')
      expect(telefone.isFixo()).toBe(true)
      expect(telefone.isCelular()).toBe(false)
    })

    it('deve identificar celular', () => {
      const telefone = Telefone.criar('11999887766')
      expect(telefone.isCelular()).toBe(true)
      expect(telefone.isFixo()).toBe(false)
    })
  })
})
