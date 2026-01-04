export class Marca {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Marca {
    const normalizada = this.normalizar(valor)
    return new Marca(normalizada)
  }

  private static normalizar(valor: string): string {
    return valor.trim().toUpperCase()
  }

  private validar(): void {
    if (!this.valor || this.valor.length === 0) {
      throw new Error('Marca não pode estar vazia')
    }

    if (this.valor.length > 50) {
      throw new Error('Marca deve ter no máximo 50 caracteres')
    }

    if (!/^[A-Z0-9\s\-&]+$/.test(this.valor)) {
      throw new Error('Marca deve conter apenas letras, números, espaços e hífens')
    }
  }

  obterValor(): string {
    return this.valor
  }

  equals(outra: Marca): boolean {
    return this.valor === outra.valor
  }
}
