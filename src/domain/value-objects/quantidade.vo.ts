import { DomainException } from '../../shared/exceptions/domain.exception'

export class Quantidade {
  private constructor(private readonly valor: number) {}

  static criar(valor: number): Quantidade {
    if (valor === null || valor === undefined) {
      throw new DomainException('Quantidade é obrigatória')
    }

    if (!Number.isInteger(valor) || valor <= 0) {
      throw new DomainException('Quantidade deve ser um número inteiro positivo')
    }

    return new Quantidade(valor)
  }

  obterValor(): number {
    return this.valor
  }

  // Operações matemáticas
  adicionar(outraQuantidade: Quantidade): Quantidade {
    return new Quantidade(this.valor + outraQuantidade.valor)
  }

  subtrair(outraQuantidade: Quantidade): Quantidade {
    const resultado = this.valor - outraQuantidade.valor

    if (resultado <= 0) {
      throw new DomainException('Quantidade não pode ser zero ou negativa após subtração')
    }

    return new Quantidade(resultado)
  }

  multiplicar(multiplicador: number): Quantidade {
    if (multiplicador <= 0) {
      throw new DomainException('Multiplicador deve ser positivo')
    }

    return new Quantidade(this.valor * multiplicador)
  }

  // Métodos de comparação
  equals(outra: Quantidade): boolean {
    return this.valor === outra.valor
  }

  maiorQue(outra: Quantidade): boolean {
    return this.valor > outra.valor
  }

  menorQue(outra: Quantidade): boolean {
    return this.valor < outra.valor
  }

  toString(): string {
    return this.valor.toString()
  }
}
