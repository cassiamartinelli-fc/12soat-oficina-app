import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import { Veiculo } from '../../../domain/entities/veiculo.entity'
import { VeiculoId, ClienteId } from '../../../shared/types/entity-id'
import { Placa } from '../../../domain/value-objects/placa.vo'
import { Veiculo as VeiculoOrmEntity } from '../entities/veiculo.entity'
import { VeiculoMapper } from '../mappers/veiculo.mapper'

@Injectable()
export class VeiculoRepositoryImpl implements IVeiculoRepository {
  constructor(
    @InjectRepository(VeiculoOrmEntity)
    private readonly ormRepository: Repository<VeiculoOrmEntity>,
    private readonly mapper: VeiculoMapper,
  ) {}

  async salvar(veiculo: Veiculo): Promise<void> {
    const ormEntity = this.mapper.toOrm(veiculo)
    await this.ormRepository.save(ormEntity)
  }

  async buscarPorId(id: VeiculoId): Promise<Veiculo | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id: id.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarPorPlaca(placa: Placa): Promise<Veiculo | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { placa: placa.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarPorClienteId(clienteId: ClienteId): Promise<Veiculo[]> {
    const ormEntities = await this.ormRepository.find({
      where: { clienteId: clienteId.obterValor() },
    })

    return this.mapper.toDomainArray(ormEntities)
  }

  async buscarTodos(): Promise<Veiculo[]> {
    const ormEntities = await this.ormRepository.find()
    return this.mapper.toDomainArray(ormEntities)
  }

  async excluir(id: VeiculoId): Promise<void> {
    await this.ormRepository.delete({ id: id.obterValor() })
  }
}
