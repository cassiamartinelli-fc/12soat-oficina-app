import { Inject, Injectable } from '@nestjs/common'
import type { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { PecaId } from '../../../shared/types/entity-id'
import { PECA_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class ExcluirPecaUseCase {
  constructor(
    @Inject(PECA_REPOSITORY_TOKEN)
    private readonly pecaRepository: IPecaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const pecaId = PecaId.criar(id)

    // Verificar se a peça existe antes de excluir
    const peca = await this.pecaRepository.buscarPorId(pecaId)

    if (!peca) {
      throw new EntityNotFoundException('Peça', id)
    }

    await this.pecaRepository.excluir(pecaId)
  }
}
