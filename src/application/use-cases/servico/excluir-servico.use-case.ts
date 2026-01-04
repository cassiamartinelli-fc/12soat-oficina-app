import { Inject, Injectable } from '@nestjs/common'
import type { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { ServicoId } from '../../../shared/types/entity-id'
import { SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class ExcluirServicoUseCase {
  constructor(
    @Inject(SERVICO_REPOSITORY_TOKEN)
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const servicoId = ServicoId.criar(id)

    // Verificar se o serviço existe antes de excluir
    const servico = await this.servicoRepository.buscarPorId(servicoId)

    if (!servico) {
      throw new EntityNotFoundException('Serviço', id)
    }

    await this.servicoRepository.excluir(servicoId)
  }
}
