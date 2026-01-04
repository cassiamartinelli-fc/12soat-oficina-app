export class Ano {
  private constructor(private readonly valor: number) {
    this.validar()
  }

  static criar(valor: number): Ano {
    return new Ano(valor)
  }

  private validar(): void {
    const anoAtual = new Date().getFullYear()
    const anoMinimo = 1950

    if (!Number.isInteger(this.valor)) {
      throw new Error('Ano deve ser um número inteiro')
    }

    if (this.valor < anoMinimo) {
      throw new Error(`Ano deve ser maior ou igual a ${anoMinimo}`)
    }

    if (this.valor > anoAtual + 1) {
      throw new Error(`Ano não pode ser maior que ${anoAtual + 1}`)
    }
  }

  obterValor(): number {
    return this.valor
  }

  isClassico(): boolean {
    const anoAtual = new Date().getFullYear()
    return this.valor <= anoAtual - 30
  }

  isAntigo(): boolean {
    const anoAtual = new Date().getFullYear()
    return this.valor <= anoAtual - 20
  }

  isRecente(): boolean {
    const anoAtual = new Date().getFullYear()
    return this.valor >= anoAtual - 5
  }

  equals(outro: Ano): boolean {
    return this.valor === outro.valor
  }
}
