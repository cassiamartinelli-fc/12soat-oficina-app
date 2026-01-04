import { CpfCnpj } from './cpf-cnpj.vo'

describe('CpfCnpj Value Object', () => {
  describe('CPF válido', () => {
    it('deve criar CPF válido sem máscara', () => {
      const cpf = CpfCnpj.criar('50982686056')
      expect(cpf.obterValor()).toBe('50982686056')
      expect(cpf.isCpf()).toBe(true)
      expect(cpf.isCnpj()).toBe(false)
    })

    it('deve criar CPF válido com máscara', () => {
      const cpf = CpfCnpj.criar('509.826.860-56')
      expect(cpf.obterValor()).toBe('50982686056')
    })
  })

  describe('CNPJ válido', () => {
    it('deve criar CNPJ válido sem máscara', () => {
      const cnpj = CpfCnpj.criar('70894785000179')
      expect(cnpj.obterValor()).toBe('70894785000179')
      expect(cnpj.isCnpj()).toBe(true)
      expect(cnpj.isCpf()).toBe(false)
    })

    it('deve criar CNPJ válido com máscara', () => {
      const cnpj = CpfCnpj.criar('70.894.785/0001-79')
      expect(cnpj.obterValor()).toBe('70894785000179')
    })
  })

  describe('Validações', () => {
    it('deve rejeitar CPF com número incorreto de dígitos', () => {
      expect(() => CpfCnpj.criar('123456789')).toThrow('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos')
    })

    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(() => CpfCnpj.criar('11111111111')).toThrow('CPF inválido')
    })

    it('deve rejeitar CNPJ com todos os dígitos iguais', () => {
      expect(() => CpfCnpj.criar('11111111111111')).toThrow('CNPJ inválido')
    })
  })

  describe('Comparação', () => {
    it('deve comparar CPFs corretamente', () => {
      const cpf1 = CpfCnpj.criar('509.826.860-56')
      const cpf2 = CpfCnpj.criar('50982686056')
      expect(cpf1.equals(cpf2)).toBe(true)
    })
  })
})
