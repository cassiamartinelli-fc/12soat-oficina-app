import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { Peca } from '../../../domain/entities/peca.entity'
import { PecaId } from '../../../shared/types/entity-id'
import { Peca as PecaOrmEntity } from '../entities/peca.entity'
import { PecaMapper } from '../mappers/peca.mapper'

@Injectable()
export class PecaRepositoryImpl implements IPecaRepository {
  constructor(
    @InjectRepository(PecaOrmEntity)
    private readonly ormRepository: Repository<PecaOrmEntity>,
    private readonly mapper: PecaMapper,
  ) {}

  async salvar(peca: Peca): Promise<void> {
    const ormEntity = this.mapper.toOrm(peca)
    await this.ormRepository.save(ormEntity)
  }

  async buscarPorId(id: PecaId): Promise<Peca | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id: id.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarTodos(): Promise<Peca[]> {
    const ormEntities = await this.ormRepository.find()
    return this.mapper.toDomainArray(ormEntities)
  }

  async excluir(id: PecaId): Promise<void> {
    await this.ormRepository.delete({ id: id.obterValor() })
  }
}
