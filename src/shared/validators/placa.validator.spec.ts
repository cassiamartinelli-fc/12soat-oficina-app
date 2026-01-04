import { IsPlacaVeiculo } from './placa.validator'
import { validate } from 'class-validator'

// Classe de teste para testar o decorator
class TestVeiculo {
  @IsPlacaVeiculo({ message: 'Placa inválida' })
  placa: string

  constructor(placa: string) {
    this.placa = placa
  }
}

describe('Placa Validator', () => {
  describe('IsPlacaVeiculo decorator', () => {
    it('deve validar placa formato antigo válida', async () => {
      const placasValidas = ['ABC1234', 'XYZ9876', 'AAA0000', 'ZZZ9999']

      for (const placa of placasValidas) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors).toHaveLength(0)
      }
    })

    it('deve validar placa formato Mercosul válida', async () => {
      const placasMercosul = ['ABC1D23', 'BRA2E19', 'XYZ9A87', 'AAA0Z00']

      for (const placa of placasMercosul) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors).toHaveLength(0)
      }
    })

    it('deve aceitar placas com formatação e converter para maiúsculo', async () => {
      const placasFormatadas = ['abc-1234', 'ABC-1234', 'abc1d23', 'BRA-2E19']

      for (const placa of placasFormatadas) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors).toHaveLength(0)
      }
    })

    it('deve rejeitar placas com formato incorreto', async () => {
      const placasInvalidas = [
        '1234ABC', // números antes das letras
        'AB1234', // muito poucas letras
        'ABCD1234', // muitas letras
        'ABC12345', // muitos números
        'ABC123', // poucos números
        '123ABCD', // formato totalmente errado
        'A1B2C3D', // misturado
      ]

      for (const placa of placasInvalidas) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
        expect(errors[0].constraints?.isPlacaVeiculo).toBe('Placa inválida')
      }
    })

    it('deve rejeitar placas com caracteres especiais que tornam formato inválido', async () => {
      const placasInvalidas = [
        '@#$%', // só caracteres especiais - vira string vazia após limpeza
        '123@ABC', // números primeiro mesmo após limpeza - vira 123ABC
        'A@B1234', // só 2 letras após limpeza - vira AB1234
      ]

      for (const placa of placasInvalidas) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
      }
    })

    it('deve rejeitar tipos não string', async () => {
      const testObj = new TestVeiculo(123456 as any)
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('deve rejeitar string vazia', async () => {
      const testObj = new TestVeiculo('')
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('deve usar mensagem padrão quando não especificada', async () => {
      class TestDefaultMessage {
        @IsPlacaVeiculo()
        placa: string

        constructor(placa: string) {
          this.placa = placa
        }
      }

      const testObj = new TestDefaultMessage('123456')
      const errors = await validate(testObj)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].constraints?.isPlacaVeiculo).toBe('Placa de veículo inválida')
    })

    it('deve validar placas com espaços e remover', async () => {
      const testObj = new TestVeiculo('ABC 1234')
      const errors = await validate(testObj)
      expect(errors).toHaveLength(0)
    })

    it('deve funcionar com letras minúsculas', async () => {
      const testObj = new TestVeiculo('abc1234')
      const errors = await validate(testObj)
      expect(errors).toHaveLength(0)
    })

    it('deve rejeitar placas com tamanho incorreto após limpeza', async () => {
      const placasInvalidas = [
        'ABC12', // muito curta
        'ABC12345', // muito longa (formato antigo)
        'ABC1D234', // muito longa (formato Mercosul)
        'AB1D23', // muito curta (formato Mercosul)
      ]

      for (const placa of placasInvalidas) {
        const testObj = new TestVeiculo(placa)
        const errors = await validate(testObj)
        expect(errors.length).toBeGreaterThan(0)
      }
    })
  })
})
