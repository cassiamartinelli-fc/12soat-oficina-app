import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Cliente } from '../../../domain/entities/cliente.entity'
import { ClienteId } from '../../../shared/types/entity-id'
import { CpfCnpj } from '../../../domain/value-objects/cpf-cnpj.vo'
import { Cliente as ClienteOrmEntity } from '../entities/cliente.entity'
import { ClienteMapper } from '../mappers/cliente.mapper'

@Injectable()
export class ClienteRepositoryImpl implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteOrmEntity)
    private readonly ormRepository: Repository<ClienteOrmEntity>,
    private readonly mapper: ClienteMapper,
  ) {}

  async salvar(cliente: Cliente): Promise<void> {
    const ormEntity = this.mapper.toOrm(cliente)
    await this.ormRepository.save(ormEntity)
  }

  async buscarPorId(id: ClienteId): Promise<Cliente | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id: id.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarPorCpfCnpj(cpfCnpj: CpfCnpj): Promise<Cliente | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { cpfCnpj: cpfCnpj.obterValor() },
    })

    if (!ormEntity) {
      return null
    }

    return this.mapper.toDomain(ormEntity)
  }

  async buscarTodos(): Promise<Cliente[]> {
    const ormEntities = await this.ormRepository.find()
    return this.mapper.toDomainArray(ormEntities)
  }

  async excluir(id: ClienteId): Promise<void> {
    await this.ormRepository.delete({ id: id.obterValor() })
  }
}
