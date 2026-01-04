import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { ItemServico } from '../../../domain/entities/item-servico.entity'
import { ItemPeca } from '../../../domain/entities/item-peca.entity'
import { OrdemServicoId, ClienteId, VeiculoId } from '../../../shared/types/entity-id'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import { OrdemServico as OrdemServicoOrmEntity } from '../entities/ordem-servico.entity'
import { ItemOrdemServico as ItemOrdemServicoOrmEntity } from '../entities/item-ordem-servico.entity'
import { PecaOrdemServico as PecaOrdemServicoOrmEntity } from '../entities/peca-ordem-servico.entity'
import { OrdemServicoMapper } from '../mappers/ordem-servico.mapper'
import { ItemServicoMapper } from '../mappers/item-servico.mapper'
import { ItemPecaMapper } from '../mappers/item-peca.mapper'

@Injectable()
export class OrdemServicoRepositoryImpl implements IOrdemServicoRepository {
  constructor(
    @InjectRepository(OrdemServicoOrmEntity)
    private readonly ordemServicoOrmRepository: Repository<OrdemServicoOrmEntity>,
    @InjectRepository(ItemOrdemServicoOrmEntity)
    private readonly itemServicoOrmRepository: Repository<ItemOrdemServicoOrmEntity>,
    @InjectRepository(PecaOrdemServicoOrmEntity)
    private readonly itemPecaOrmRepository: Repository<PecaOrdemServicoOrmEntity>,
    private readonly ordemServicoMapper: OrdemServicoMapper,
    private readonly itemServicoMapper: ItemServicoMapper,
    private readonly itemPecaMapper: ItemPecaMapper,
  ) {}

  async salvar(ordemServico: OrdemServico): Promise<void> {
    const ormEntity = this.ordemServicoMapper.toOrm(ordemServico)
    await this.ordemServicoOrmRepository.save(ormEntity)
  }

  async buscarPorId(id: OrdemServicoId): Promise<OrdemServico | null> {
    const ormEntity = await this.ordemServicoOrmRepository.findOne({
      where: { id: id.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.ordemServicoMapper.toDomain(ormEntity)
  }

  async buscarTodos(): Promise<OrdemServico[]> {
    const ormEntities = await this.ordemServicoOrmRepository.find()
    return this.ordemServicoMapper.toDomainArray(ormEntities)
  }

  async buscarPorCliente(clienteId: ClienteId): Promise<OrdemServico[]> {
    const ormEntities = await this.ordemServicoOrmRepository.find({
      where: { clienteId: clienteId.obterValor() },
    })
    return this.ordemServicoMapper.toDomainArray(ormEntities)
  }

  async buscarPorVeiculo(veiculoId: VeiculoId): Promise<OrdemServico[]> {
    const ormEntities = await this.ordemServicoOrmRepository.find({
      where: { veiculoId: veiculoId.obterValor() },
    })
    return this.ordemServicoMapper.toDomainArray(ormEntities)
  }

  async buscarPorStatus(status: StatusOrdemServico): Promise<OrdemServico[]> {
    const ormEntities = await this.ordemServicoOrmRepository.find({
      where: { status },
    })
    return this.ordemServicoMapper.toDomainArray(ormEntities)
  }

  async excluir(id: OrdemServicoId): Promise<void> {
    await this.ordemServicoOrmRepository.delete({ id: id.obterValor() })
  }

  async buscarOrdensEmAndamento(): Promise<OrdemServico[]> {
    const ormEntities = await this.ordemServicoOrmRepository
      .createQueryBuilder('os')
      .where('os.status IN (:...statuses)', {
        statuses: ['recebida', 'em_diagnostico', 'aguardando_aprovacao', 'em_execucao'],
      })
      .orderBy(
        `
        CASE os.status
          WHEN 'em_execucao' THEN 1
          WHEN 'aguardando_aprovacao' THEN 2
          WHEN 'em_diagnostico' THEN 3
          WHEN 'recebida' THEN 4
        END`,
        'ASC',
      )
      .addOrderBy('os.createdAt', 'ASC')
      .getMany()

    return this.ordemServicoMapper.toDomainArray(ormEntities)
  }

  // Métodos para gerenciar itens
  async adicionarItemServico(item: ItemServico): Promise<void> {
    const ormEntity = this.itemServicoMapper.toOrm(item)
    await this.itemServicoOrmRepository.save(ormEntity)
  }

  async adicionarItemPeca(item: ItemPeca): Promise<void> {
    const ormEntity = this.itemPecaMapper.toOrm(item)
    await this.itemPecaOrmRepository.save(ormEntity)
  }

  async buscarItensServico(ordemServicoId: OrdemServicoId): Promise<ItemServico[]> {
    const ormEntities = await this.itemServicoOrmRepository.find({
      where: { ordemServicoId: ordemServicoId.obterValor() },
    })
    return this.itemServicoMapper.toDomainArray(ormEntities)
  }

  async buscarItensPeca(ordemServicoId: OrdemServicoId): Promise<ItemPeca[]> {
    const ormEntities = await this.itemPecaOrmRepository.find({
      where: { ordemServicoId: ordemServicoId.obterValor() },
    })
    return this.itemPecaMapper.toDomainArray(ormEntities)
  }

  async removerItemServico(ordemServicoId: OrdemServicoId, servicoId: string): Promise<void> {
    await this.itemServicoOrmRepository.delete({
      ordemServicoId: ordemServicoId.obterValor(),
      servicoId,
    })
  }

  async removerItemPeca(ordemServicoId: OrdemServicoId, pecaId: string): Promise<void> {
    await this.itemPecaOrmRepository.delete({
      ordemServicoId: ordemServicoId.obterValor(),
      pecaId,
    })
  }
}
