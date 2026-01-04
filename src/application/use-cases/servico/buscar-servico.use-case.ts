import { Inject, Injectable } from '@nestjs/common'
import type { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { Servico } from '../../../domain/entities/servico.entity'
import { ServicoId } from '../../../shared/types/entity-id'
import { SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class BuscarServicoUseCase {
  constructor(
    @Inject(SERVICO_REPOSITORY_TOKEN)
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async buscarPorId(id: string): Promise<Servico> {
    const servicoId = ServicoId.criar(id)
    const servico = await this.servicoRepository.buscarPorId(servicoId)

    if (!servico) {
      throw new EntityNotFoundException('Serviço', id)
    }

    return servico
  }

  async buscarTodos(): Promise<Servico[]> {
    return await this.servicoRepository.buscarTodos()
  }
}
