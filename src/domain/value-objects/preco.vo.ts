export class Preco {
  private constructor(private readonly valor: number) {
    this.validar()
  }

  static criar(valor: number): Preco {
    return new Preco(valor)
  }

  static criarDe(valorString: string): Preco {
    const valorNumerico = parseFloat(valorString)

    if (isNaN(valorNumerico)) {
      throw new Error('Preço deve ser um número válido')
    }

    return new Preco(valorNumerico)
  }

  static zero(): Preco {
    // Bypassing validation for internal zero creation
    const preco = Object.create(Preco.prototype)
    preco.valor = 0
    return preco
  }

  private validar(): void {
    if (this.valor < 0) {
      throw new Error('Preço não pode ser negativo')
    }

    if (this.valor === 0) {
      throw new Error('Preço não pode ser zero')
    }

    const casasDecimais = (this.valor.toString().split('.')[1] || '').length
    if (casasDecimais > 2) {
      throw new Error('Preço deve ter no máximo 2 casas decimais')
    }
  }

  obterValor(): number {
    return this.valor
  }

  obterFormatado(): string {
    return `R$ ${this.valor.toFixed(2).replace('.', ',')}`
  }

  somar(outro: Preco): Preco {
    const novoValor = this.valor + outro.valor
    return Preco.criar(parseFloat(novoValor.toFixed(2)))
  }

  multiplicar(quantidade: number): Preco {
    if (quantidade < 0) {
      throw new Error('Quantidade deve ser positiva')
    }

    const novoValor = this.valor * quantidade
    return Preco.criar(parseFloat(novoValor.toFixed(2)))
  }

  equals(outro: Preco): boolean {
    return this.valor === outro.valor
  }
}
