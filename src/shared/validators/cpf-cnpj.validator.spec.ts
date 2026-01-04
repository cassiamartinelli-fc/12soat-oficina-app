import { IsCpfCnpj } from './cpf-cnpj.validator'
import { validate } from 'class-validator'

// Classe de teste para testar o decorator
class TestDocument {
  @IsCpfCnpj({ message: 'Documento inválido' })
  documento: string

  constructor(documento: string) {
    this.documento = documento
  }
}

describe('CPF/CNPJ Validator', () => {
  describe('IsCpfCnpj decorator', () => {
    it('deve validar CPF válido', async () => {
      const cpfsValidos = ['11144477735', '12345678909', '98765432100']

      for (const cpf of cpfsValidos) {
        const testObj = new TestDocument(cpf)
        const errors = await validate(testObj)
        expect(errors).toHaveLength(0)
      }
    })

    it('deve validar CNPJ válido', async () => {
      const cnpjsValidos = ['11222333000181', '12345678000195']

      for (const cnpj of cnpjsValidos) {
        const testObj = new TestDocument(cnpj)
        const errors = await validate(testObj)
        expect(errors).toHaveLength(0)
      }
    })

    it('deve rejeitar CPF inválido', async () => {
      const cpfsInvalidos = [
        '12345678901', // dígitos verificadores incorretos
        '11111111111', // dígitos repetidos
        '123456789', // muito curto
        '00000000000', // zeros
      ]

      for (const cpf of cpfsInvalidos) {
        const testObj = new TestDocument(cpf)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
        expect(errors[0].constraints?.isCpfCnpj).toBe('Documento inválido')
      }
    })

    it('deve rejeitar CNPJ inválido', async () => {
      const cnpjsInvalidos = [
        '11222333000180', // dígito verificador incorreto
        '00000000000000', // zeros
        '11111111111111', // dígitos repetidos
        '123456780001', // muito curto
      ]

      for (const cnpj of cnpjsInvalidos) {
        const testObj = new TestDocument(cnpj)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
        expect(errors[0].constraints?.isCpfCnpj).toBe('Documento inválido')
      }
    })

    it('deve aceitar CPF com formatação e remover caracteres especiais', async () => {
      const testObj = new TestDocument('111.444.777-35')
      const errors = await validate(testObj)
      expect(errors).toHaveLength(0)
    })

    it('deve aceitar CNPJ com formatação e remover caracteres especiais', async () => {
      const testObj = new TestDocument('11.222.333/0001-81')
      const errors = await validate(testObj)
      expect(errors).toHaveLength(0)
    })

    it('deve rejeitar tipos não string', async () => {
      const testObj = new TestDocument(12345678909 as any)
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('deve rejeitar documentos com tamanho incorreto', async () => {
      const documentosInvalidos = [
        '123456789', // 9 dígitos
        '123456789012', // 12 dígitos
        '12345678901234', // 13 dígitos
        '123456789012345', // 15 dígitos
      ]

      for (const doc of documentosInvalidos) {
        const testObj = new TestDocument(doc)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
      }
    })

    it('deve usar mensagem padrão quando não especificada', async () => {
      class TestDefaultMessage {
        @IsCpfCnpj()
        documento: string

        constructor(documento: string) {
          this.documento = documento
        }
      }

      const testObj = new TestDefaultMessage('12345678901')
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].constraints?.isCpfCnpj).toBe('CPF ou CNPJ inválido')
    })

    it('deve rejeitar string vazia', async () => {
      const testObj = new TestDocument('')
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('deve rejeitar documento com apenas caracteres especiais', async () => {
      const testObj = new TestDocument('...-/')
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
