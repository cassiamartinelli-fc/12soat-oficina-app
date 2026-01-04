import { Inject, Injectable } from '@nestjs/common'
import type { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import { VeiculoId } from '../../../shared/types/entity-id'
import { VEICULO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

@Injectable()
export class ExcluirVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY_TOKEN)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar se veículo existe
    const veiculoId = VeiculoId.criar(id)
    const veiculo = await this.veiculoRepository.buscarPorId(veiculoId)

    if (!veiculo) {
      throw new EntityNotFoundException('Veículo', id)
    }

    // Aqui poderiam ser adicionadas validações de negócio
    // Ex: verificar se veículo possui ordens de serviço pendentes

    // Excluir veículo
    await this.veiculoRepository.excluir(veiculoId)
  }
}
