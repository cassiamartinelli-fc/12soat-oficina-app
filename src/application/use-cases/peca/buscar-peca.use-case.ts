import { Inject, Injectable } from '@nestjs/common'
import type { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { Peca } from '../../../domain/entities/peca.entity'
import { PecaId } from '../../../shared/types/entity-id'
import { PECA_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class BuscarPecaUseCase {
  constructor(
    @Inject(PECA_REPOSITORY_TOKEN)
    private readonly pecaRepository: IPecaRepository,
  ) {}

  async buscarPorId(id: string): Promise<Peca> {
    const pecaId = PecaId.criar(id)
    const peca = await this.pecaRepository.buscarPorId(pecaId)

    if (!peca) {
      throw new EntityNotFoundException('Peça', id)
    }

    return peca
  }

  async buscarTodos(): Promise<Peca[]> {
    return await this.pecaRepository.buscarTodos()
  }
}
