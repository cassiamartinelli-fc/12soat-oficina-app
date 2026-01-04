import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { Peca as DomainPeca } from '../../../domain/entities/peca.entity'
import { Peca as OrmPeca } from '../entities/peca.entity'
import { PecaId } from '../../../shared/types/entity-id'
import { Nome } from '../../../domain/value-objects/nome.vo'
import { Codigo } from '../../../domain/value-objects/codigo.vo'
import { Preco } from '../../../domain/value-objects/preco.vo'
import { Estoque } from '../../../domain/value-objects/estoque.vo'

@Injectable()
export class PecaMapper extends BaseMapper<DomainPeca, OrmPeca> {
  toDomain(ormEntity: OrmPeca): DomainPeca {
    return DomainPeca.reconstituir({
      id: PecaId.criar(ormEntity.id),
      nome: Nome.criar(ormEntity.nome),
      codigo: ormEntity.codigo ? Codigo.criar(ormEntity.codigo) : undefined,
      preco: Preco.criar(ormEntity.preco),
      estoque: Estoque.criar(ormEntity.quantidadeEstoque),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    })
  }

  toOrm(domainEntity: DomainPeca): OrmPeca {
    const ormEntity = new OrmPeca()

    ormEntity.id = domainEntity.id.obterValor()
    ormEntity.nome = domainEntity.nome.obterValor()
    ormEntity.codigo = domainEntity.codigo ? domainEntity.codigo.obterValor() : undefined
    ormEntity.preco = domainEntity.preco.obterValor()
    ormEntity.quantidadeEstoque = domainEntity.estoque.obterQuantidade()
    ormEntity.createdAt = domainEntity.createdAt
    ormEntity.updatedAt = domainEntity.updatedAt

    return ormEntity
  }
}
