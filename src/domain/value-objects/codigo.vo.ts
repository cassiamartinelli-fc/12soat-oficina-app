export class Codigo {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Codigo {
    const normalizado = this.normalizar(valor)
    return new Codigo(normalizado)
  }

  static criarOpcional(valor?: string | null): Codigo | undefined {
    if (!valor || valor.trim().length === 0) {
      return undefined
    }
    return this.criar(valor)
  }

  private static normalizar(valor: string): string {
    return valor.trim().toUpperCase()
  }

  private validar(): void {
    if (!this.valor || this.valor.length === 0) {
      throw new Error('Código não pode estar vazio')
    }

    if (this.valor.length > 50) {
      throw new Error('Código deve ter no máximo 50 caracteres')
    }

    if (!/^[A-Z0-9\-_]+$/.test(this.valor)) {
      throw new Error('Código deve conter apenas letras, números, hífens e underscores')
    }
  }

  obterValor(): string {
    return this.valor
  }

  equals(outro: Codigo): boolean {
    return this.valor === outro.valor
  }
}
