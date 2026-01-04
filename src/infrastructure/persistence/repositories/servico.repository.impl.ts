import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { Servico } from '../../../domain/entities/servico.entity'
import { ServicoId } from '../../../shared/types/entity-id'
import { Servico as ServicoOrmEntity } from '../entities/servico.entity'
import { ServicoMapper } from '../mappers/servico.mapper'

@Injectable()
export class ServicoRepositoryImpl implements IServicoRepository {
  constructor(
    @InjectRepository(ServicoOrmEntity)
    private readonly ormRepository: Repository<ServicoOrmEntity>,
    private readonly mapper: ServicoMapper,
  ) {}

  async salvar(servico: Servico): Promise<void> {
    const ormEntity = this.mapper.toOrm(servico)
    await this.ormRepository.save(ormEntity)
  }

  async buscarPorId(id: ServicoId): Promise<Servico | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id: id.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarTodos(): Promise<Servico[]> {
    const ormEntities = await this.ormRepository.find()
    return this.mapper.toDomainArray(ormEntities)
  }

  async excluir(id: ServicoId): Promise<void> {
    await this.ormRepository.delete({ id: id.obterValor() })
  }
}
