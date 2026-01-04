export class Estoque {
  private constructor(private readonly quantidade: number) {
    this.validar()
  }

  static criar(quantidade: number): Estoque {
    return new Estoque(quantidade)
  }

  static zero(): Estoque {
    return new Estoque(0)
  }

  private validar(): void {
    if (!Number.isInteger(this.quantidade)) {
      throw new Error('Quantidade em estoque deve ser um número inteiro')
    }

    if (this.quantidade < 0) {
      throw new Error('Quantidade em estoque não pode ser negativa')
    }

    if (this.quantidade > 999999) {
      throw new Error('Quantidade em estoque não pode ser maior que 999.999')
    }
  }

  obterQuantidade(): number {
    return this.quantidade
  }

  temEstoque(): boolean {
    return this.quantidade > 0
  }

  temEstoqueSuficiente(quantidadeNecessaria: number): boolean {
    return this.quantidade >= quantidadeNecessaria
  }

  baixar(quantidadeBaixada: number): Estoque {
    if (quantidadeBaixada <= 0) {
      throw new Error('Quantidade a baixar deve ser positiva')
    }

    if (!this.temEstoqueSuficiente(quantidadeBaixada)) {
      throw new Error('Estoque insuficiente para baixa')
    }

    return new Estoque(this.quantidade - quantidadeBaixada)
  }

  repor(quantidadeReposta: number): Estoque {
    if (quantidadeReposta <= 0) {
      throw new Error('Quantidade a repor deve ser positiva')
    }

    return new Estoque(this.quantidade + quantidadeReposta)
  }

  equals(outro: Estoque): boolean {
    return this.quantidade === outro.quantidade
  }
}
