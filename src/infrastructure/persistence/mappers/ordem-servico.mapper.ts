import { Injectable } from '@nestjs/common'
import { BaseMapper } from './base.mapper'
import { OrdemServico as DomainOrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { OrdemServico as OrmOrdemServico } from '../entities/ordem-servico.entity'
import { OrdemServicoId, ClienteId, VeiculoId } from '../../../shared/types/entity-id'
import { StatusOrdemServicoVO } from '../../../domain/value-objects/status-ordem-servico.vo'
import { PeriodoExecucao } from '../../../domain/value-objects/periodo-execucao.vo'
import { Preco } from '../../../domain/value-objects/preco.vo'

@Injectable()
export class OrdemServicoMapper extends BaseMapper<DomainOrdemServico, OrmOrdemServico> {
  toDomain(ormEntity: OrmOrdemServico): DomainOrdemServico {
    return DomainOrdemServico.reconstituir({
      id: OrdemServicoId.criar(ormEntity.id),
      status: StatusOrdemServicoVO.reconstituir(ormEntity.status),
      valorTotal: Preco.criar(ormEntity.valorTotal),
      clienteId: ormEntity.clienteId ? ClienteId.criar(ormEntity.clienteId) : undefined,
      veiculoId: ormEntity.veiculoId ? VeiculoId.criar(ormEntity.veiculoId) : undefined,
      periodoExecucao: PeriodoExecucao.criar(ormEntity.dataInicio || undefined, ormEntity.dataFim || undefined),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    })
  }

  toOrm(domainEntity: DomainOrdemServico): OrmOrdemServico {
    const ormEntity = new OrmOrdemServico()

    ormEntity.id = domainEntity.id.obterValor()
    ormEntity.status = domainEntity.status.obterValor()
    ormEntity.valorTotal = domainEntity.valorTotal.obterValor()
    ormEntity.clienteId = domainEntity.clienteId?.obterValor() || null
    ormEntity.veiculoId = domainEntity.veiculoId?.obterValor() || null
    ormEntity.dataInicio = domainEntity.periodoExecucao.obterDataInicio() || undefined
    ormEntity.dataFim = domainEntity.periodoExecucao.obterDataFim() || undefined

    // Calcular tempo de execução se finalizado
    const duracaoMinutos = domainEntity.calcularDuracaoExecucao()
    ormEntity.tempoExecucaoMinutos = duracaoMinutos ? duracaoMinutos * 24 * 60 : undefined // Converter dias para minutos

    ormEntity.createdAt = domainEntity.createdAt
    ormEntity.updatedAt = domainEntity.updatedAt

    return ormEntity
  }
}
