export class Nome {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Nome {
    const normalizado = this.normalizar(valor)
    return new Nome(normalizado)
  }

  private static normalizar(valor: string): string {
    return valor.trim().replace(/\s+/g, ' ')
  }

  private validar(): void {
    if (!this.valor || this.valor.length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres')
    }

    if (this.valor.length > 100) {
      throw new Error('Nome deve ter no máximo 100 caracteres')
    }

    if (!/^[a-zA-ZÀ-ÿ0-9\s\-'&()./,+%º°#]+$/.test(this.valor)) {
      throw new Error('Nome contém caracteres não permitidos')
    }
  }

  obterValor(): string {
    return this.valor
  }

  obterPrimeiroNome(): string {
    return this.valor.split(' ')[0]
  }

  obterUltimoNome(): string {
    const partes = this.valor.split(' ')
    return partes[partes.length - 1]
  }

  equals(outro: Nome): boolean {
    return this.valor === outro.valor
  }
}
