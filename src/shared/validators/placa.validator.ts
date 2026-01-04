import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsPlacaVeiculo(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlacaVeiculo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false

          const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

          // Placa antiga: AAA0000
          const oldFormat = /^[A-Z]{3}[0-9]{4}$/
          // Placa Mercosul: AAA0A00
          const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

          return oldFormat.test(cleaned) || mercosulFormat.test(cleaned)
        },
        defaultMessage() {
          return 'Placa de veículo inválida'
        },
      },
    })
  }
}
