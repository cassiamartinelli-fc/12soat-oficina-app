import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { ItemServico as DomainItemServico } from '../../../domain/entities/item-servico.entity'
import { ItemOrdemServico as OrmItemOrdemServico } from '../entities/item-ordem-servico.entity'
import { ServicoId, OrdemServicoId } from '../../../shared/types/entity-id'
import { Quantidade } from '../../../domain/value-objects/quantidade.vo'
import { Preco } from '../../../domain/value-objects/preco.vo'

@Injectable()
export class ItemServicoMapper extends BaseMapper<DomainItemServico, OrmItemOrdemServico> {
  toDomain(ormEntity: OrmItemOrdemServico): DomainItemServico {
    return DomainItemServico.reconstituir({
      servicoId: ServicoId.criar(ormEntity.servicoId),
      ordemServicoId: OrdemServicoId.criar(ormEntity.ordemServicoId),
      quantidade: Quantidade.criar(ormEntity.quantidade),
      precoUnitario: Preco.criar(ormEntity.precoUnitario),
    })
  }

  toOrm(domainEntity: DomainItemServico): OrmItemOrdemServico {
    const ormEntity = new OrmItemOrdemServico()

    ormEntity.servicoId = domainEntity.servicoId.obterValor()
    ormEntity.ordemServicoId = domainEntity.ordemServicoId.obterValor()
    ormEntity.quantidade = domainEntity.quantidade.obterValor()
    ormEntity.precoUnitario = domainEntity.precoUnitario.obterValor()
    ormEntity.subtotal = domainEntity.calcularSubtotal().obterValor()

    return ormEntity
  }
}
