import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { Veiculo as DomainVeiculo } from '../../../domain/entities/veiculo.entity'
import { Veiculo as OrmVeiculo } from '../entities/veiculo.entity'
import { VeiculoId, ClienteId } from '../../../shared/types/entity-id'
import { Placa } from '../../../domain/value-objects/placa.vo'
import { Marca } from '../../../domain/value-objects/marca.vo'
import { Modelo } from '../../../domain/value-objects/modelo.vo'
import { Ano } from '../../../domain/value-objects/ano.vo'

@Injectable()
export class VeiculoMapper extends BaseMapper<DomainVeiculo, OrmVeiculo> {
  toDomain(ormEntity: OrmVeiculo): DomainVeiculo {
    return DomainVeiculo.reconstituir({
      id: VeiculoId.criar(ormEntity.id),
      placa: Placa.criar(ormEntity.placa),
      marca: Marca.criar(ormEntity.marca),
      modelo: Modelo.criar(ormEntity.modelo),
      ano: Ano.criar(ormEntity.ano),
      clienteId: ClienteId.criar(ormEntity.clienteId),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    })
  }

  toOrm(domainEntity: DomainVeiculo): OrmVeiculo {
    const ormEntity = new OrmVeiculo()

    ormEntity.id = domainEntity.id.obterValor()
    ormEntity.placa = domainEntity.placa.obterValor()
    ormEntity.marca = domainEntity.marca.obterValor()
    ormEntity.modelo = domainEntity.modelo.obterValor()
    ormEntity.ano = domainEntity.ano.obterValor()
    ormEntity.clienteId = domainEntity.clienteId.obterValor()
    ormEntity.createdAt = domainEntity.createdAt
    ormEntity.updatedAt = domainEntity.updatedAt

    return ormEntity
  }
}
