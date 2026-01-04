import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { ItemPeca as DomainItemPeca } from '../../../domain/entities/item-peca.entity'
import { PecaOrdemServico as OrmPecaOrdemServico } from '../entities/peca-ordem-servico.entity'
import { PecaId, OrdemServicoId } from '../../../shared/types/entity-id'
import { Quantidade } from '../../../domain/value-objects/quantidade.vo'
import { Preco } from '../../../domain/value-objects/preco.vo'

@Injectable()
export class ItemPecaMapper extends BaseMapper<DomainItemPeca, OrmPecaOrdemServico> {
  toDomain(ormEntity: OrmPecaOrdemServico): DomainItemPeca {
    return DomainItemPeca.reconstituir({
      pecaId: PecaId.criar(ormEntity.pecaId),
      ordemServicoId: OrdemServicoId.criar(ormEntity.ordemServicoId),
      quantidade: Quantidade.criar(ormEntity.quantidade),
      precoUnitario: Preco.criar(ormEntity.precoUnitario),
    })
  }

  toOrm(domainEntity: DomainItemPeca): OrmPecaOrdemServico {
    const ormEntity = new OrmPecaOrdemServico()

    ormEntity.pecaId = domainEntity.pecaId.obterValor()
    ormEntity.ordemServicoId = domainEntity.ordemServicoId.obterValor()
    ormEntity.quantidade = domainEntity.quantidade.obterValor()
    ormEntity.precoUnitario = domainEntity.precoUnitario.obterValor()
    ormEntity.subtotal = domainEntity.calcularSubtotal().obterValor()

    return ormEntity
  }
}
