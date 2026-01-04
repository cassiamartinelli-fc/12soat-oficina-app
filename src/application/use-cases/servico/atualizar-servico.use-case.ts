import { Inject, Injectable } from '@nestjs/common'
import type { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { Servico } from '../../../domain/entities/servico.entity'
import { ServicoId } from '../../../shared/types/entity-id'
import { SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'

export interface AtualizarServicoCommand {
  id: string
  nome?: string
  preco?: number
}

@Injectable()
export class AtualizarServicoUseCase {
  constructor(
    @Inject(SERVICO_REPOSITORY_TOKEN)
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async execute(command: AtualizarServicoCommand): Promise<Servico> {
    const servicoId = ServicoId.criar(command.id)
    const servico = await this.servicoRepository.buscarPorId(servicoId)

    if (!servico) {
      throw new EntityNotFoundException('Serviço', command.id)
    }

    // Atualizar campos conforme necessário
    if (command.nome !== undefined) {
      servico.atualizarNome(command.nome)
    }

    if (command.preco !== undefined) {
      servico.atualizarPreco(command.preco)
    }

    // Salvar alterações
    await this.servicoRepository.salvar(servico)

    return servico
  }
}
