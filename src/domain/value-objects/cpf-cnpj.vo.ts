export class CpfCnpj {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): CpfCnpj {
    const sanitizado = this.sanitizar(valor)
    return new CpfCnpj(sanitizado)
  }

  private static sanitizar(valor: string): string {
    return valor.replace(/\D/g, '')
  }

  private validar(): void {
    if (this.valor.length === 11) {
      this.validarCpf()
    } else if (this.valor.length === 14) {
      this.validarCnpj()
    } else {
      throw new Error('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos')
    }
  }

  private validarCpf(): void {
    if (/^(\d)\1{10}$/.test(this.valor)) {
      throw new Error('CPF inválido')
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(this.valor.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(this.valor.charAt(9))) {
      throw new Error('CPF inválido')
    }

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(this.valor.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(this.valor.charAt(10))) {
      throw new Error('CPF inválido')
    }
  }

  private validarCnpj(): void {
    if (/^(\d)\1{13}$/.test(this.valor)) {
      throw new Error('CNPJ inválido')
    }

    let length = this.valor.length - 2
    let numbers = this.valor.substring(0, length)
    const digits = this.valor.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(0))) {
      throw new Error('CNPJ inválido')
    }

    length = length + 1
    numbers = this.valor.substring(0, length)
    sum = 0
    pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(1))) {
      throw new Error('CNPJ inválido')
    }
  }

  obterValor(): string {
    return this.valor
  }

  isCpf(): boolean {
    return this.valor.length === 11
  }

  isCnpj(): boolean {
    return this.valor.length === 14
  }

  equals(outro: CpfCnpj): boolean {
    return this.valor === outro.valor
  }
}
