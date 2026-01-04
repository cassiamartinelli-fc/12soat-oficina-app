export class EntityId {
  constructor(private readonly valor: string) {
    this.validar()
  }

  static criar(valor: string): EntityId {
    return new EntityId(valor)
  }

  static gerar(): EntityId {
    // Para compatibilidade com UUIDs do TypeORM
    return new EntityId(crypto.randomUUID())
  }

  private validar(): void {
    if (!this.valor || this.valor.length === 0) {
      throw new Error('ID não pode estar vazio')
    }
  }

  obterValor(): string {
    return this.valor
  }

  equals(outro: EntityId): boolean {
    return this.valor === outro.valor
  }
}

export class ClienteId extends EntityId {}
export class VeiculoId extends EntityId {}
export class PecaId extends EntityId {}
export class ServicoId extends EntityId {}
export class OrdemServicoId extends EntityId {}
