import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { Servico as DomainServico } from '../../../domain/entities/servico.entity'
import { Servico as OrmServico } from '../entities/servico.entity'
import { ServicoId } from '../../../shared/types/entity-id'
import { Nome } from '../../../domain/value-objects/nome.vo'
import { Preco } from '../../../domain/value-objects/preco.vo'

@Injectable()
export class ServicoMapper extends BaseMapper<DomainServico, OrmServico> {
  toDomain(ormEntity: OrmServico): DomainServico {
    return DomainServico.reconstituir({
      id: ServicoId.criar(ormEntity.id),
      nome: Nome.criar(ormEntity.nome),
      preco: Preco.criar(ormEntity.preco),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    })
  }

  toOrm(domainEntity: DomainServico): OrmServico {
    const ormEntity = new OrmServico()

    ormEntity.id = domainEntity.id.obterValor()
    ormEntity.nome = domainEntity.nome.obterValor()
    ormEntity.preco = domainEntity.preco.obterValor()
    ormEntity.createdAt = domainEntity.createdAt
    ormEntity.updatedAt = domainEntity.updatedAt

    return ormEntity
  }
}
