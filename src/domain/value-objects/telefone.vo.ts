export class Telefone {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Telefone {
    const sanitizado = this.sanitizar(valor)
    return new Telefone(sanitizado)
  }

  private static sanitizar(valor: string): string {
    return valor.replace(/\D/g, '')
  }

  private validar(): void {
    if (this.valor.length < 10 || this.valor.length > 11) {
      throw new Error('Telefone deve ter 10 ou 11 dígitos')
    }

    if (this.valor.length === 11 && !['8', '9'].includes(this.valor.charAt(2))) {
      throw new Error('Celular deve começar com 8 ou 9 no terceiro dígito')
    }
  }

  obterValor(): string {
    return this.valor
  }

  obterFormatado(): string {
    if (this.valor.length === 10) {
      return `(${this.valor.substring(0, 2)}) ${this.valor.substring(2, 6)}-${this.valor.substring(6)}`
    }
    return `(${this.valor.substring(0, 2)}) ${this.valor.substring(2, 7)}-${this.valor.substring(7)}`
  }

  isCelular(): boolean {
    return this.valor.length === 11
  }

  isFixo(): boolean {
    return this.valor.length === 10
  }

  equals(outro: Telefone): boolean {
    return this.valor === outro.valor
  }
}
