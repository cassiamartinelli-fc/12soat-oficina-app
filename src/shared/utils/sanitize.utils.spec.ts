import { sanitizeCpfCnpj } from './sanitize.utils'

describe('sanitizeCpfCnpj', () => {
  it('should remove all non-digit characters from CPF', () => {
    const cpfWithMask = '123.456.789-01'
    const result = sanitizeCpfCnpj(cpfWithMask)
    expect(result).toBe('12345678901')
  })

  it('should remove all non-digit characters from CNPJ', () => {
    const cnpjWithMask = '12.345.678/0001-90'
    const result = sanitizeCpfCnpj(cnpjWithMask)
    expect(result).toBe('12345678000190')
  })

  it('should return only numbers when input has spaces', () => {
    const cpfWithSpaces = '123 456 789 01'
    const result = sanitizeCpfCnpj(cpfWithSpaces)
    expect(result).toBe('12345678901')
  })

  it('should return empty string for input with no numbers', () => {
    const noNumbers = 'abc-def.ghi/jkl'
    const result = sanitizeCpfCnpj(noNumbers)
    expect(result).toBe('')
  })

  it('should return same string if already sanitized', () => {
    const cleanCpf = '12345678901'
    const result = sanitizeCpfCnpj(cleanCpf)
    expect(result).toBe('12345678901')
  })
})
