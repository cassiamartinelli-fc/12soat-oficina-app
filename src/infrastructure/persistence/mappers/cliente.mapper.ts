import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { Cliente as DomainCliente } from '../../../domain/entities/cliente.entity'
import { Cliente as OrmCliente } from '../entities/cliente.entity'
import { ClienteId } from '../../../shared/types/entity-id'
import { CpfCnpj, Nome, Telefone } from '../../../domain/value-objects'

@Injectable()
export class ClienteMapper extends BaseMapper<DomainCliente, OrmCliente> {
  toDomain(ormEntity: OrmCliente): DomainCliente {
    return DomainCliente.reconstituir({
      id: ClienteId.criar(ormEntity.id),
      nome: Nome.criar(ormEntity.nome),
      cpfCnpj: CpfCnpj.criar(ormEntity.cpfCnpj),
      telefone: ormEntity.telefone ? Telefone.criar(ormEntity.telefone) : undefined,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    })
  }

  toOrm(domainEntity: DomainCliente): OrmCliente {
    const ormEntity = new OrmCliente()

    ormEntity.id = domainEntity.id.obterValor()
    ormEntity.nome = domainEntity.nome.obterValor()
    ormEntity.cpfCnpj = domainEntity.cpfCnpj.obterValor()
    ormEntity.telefone = domainEntity.telefone ? domainEntity.telefone.obterValor() : undefined
    ormEntity.createdAt = domainEntity.createdAt
    ormEntity.updatedAt = domainEntity.updatedAt

    return ormEntity
  }
}
