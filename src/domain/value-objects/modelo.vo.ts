export class Modelo {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Modelo {
    const normalizado = this.normalizar(valor)
    return new Modelo(normalizado)
  }

  private static normalizar(valor: string): string {
    return valor.trim().replace(/\s+/g, ' ')
  }

  private validar(): void {
    if (!this.valor || this.valor.length === 0) {
      throw new Error('Modelo não pode estar vazio')
    }

    if (this.valor.length > 50) {
      throw new Error('Modelo deve ter no máximo 50 caracteres')
    }

    if (!/^[a-zA-Z0-9\s\-./]+$/.test(this.valor)) {
      throw new Error('Modelo deve conter apenas letras, números, espaços, hífens, pontos e barras')
    }
  }

  obterValor(): string {
    return this.valor
  }

  equals(outro: Modelo): boolean {
    return this.valor === outro.valor
  }
}
