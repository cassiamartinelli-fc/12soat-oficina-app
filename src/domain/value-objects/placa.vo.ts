export class Placa {
  private constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): Placa {
    const sanitizada = this.sanitizar(valor)
    return new Placa(sanitizada)
  }

  private static sanitizar(valor: string): string {
    return valor.toUpperCase().replace(/[^A-Z0-9]/g, '')
  }

  private validar(): void {
    const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/
    const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

    if (!formatoAntigo.test(this.valor) && !formatoMercosul.test(this.valor)) {
      throw new Error('Placa deve seguir formato AAA0000 ou AAA0A00')
    }
  }

  obterValor(): string {
    return this.valor
  }

  obterFormatada(): string {
    if (this.isFormatoMercosul()) {
      return `${this.valor.substring(0, 3)}-${this.valor.substring(3)}`
    }
    return `${this.valor.substring(0, 3)}-${this.valor.substring(3)}`
  }

  isFormatoAntigo(): boolean {
    return /^[A-Z]{3}[0-9]{4}$/.test(this.valor)
  }

  isFormatoMercosul(): boolean {
    return /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(this.valor)
  }

  equals(outra: Placa): boolean {
    return this.valor === outra.valor
  }
}
