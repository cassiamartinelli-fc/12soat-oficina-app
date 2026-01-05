import { Inject, Injectable } from '@nestjs/common'
import { ItemPeca } from '../../../domain/entities/item-peca.entity'
import { ItemServico } from '../../../domain/entities/item-servico.entity'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import type { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import type { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import {
  ORDEM_SERVICO_REPOSITORY_TOKEN,
  PECA_REPOSITORY_TOKEN,
  SERVICO_REPOSITORY_TOKEN,
} from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { MetricsService } from '../../../shared/services/metrics.service'
import { PecaId, ServicoId } from '../../../shared/types/entity-id'
import { ItemPecaCreateDto, ItemServicoCreateDto } from '../../dto/ordem-servico/create-ordem-servico-v2.dto'

export interface CriarOrdemServicoV2Command {
  clienteId: string
  veiculoId: string
  servicos: ItemServicoCreateDto[]
  pecas: ItemPecaCreateDto[]
}

@Injectable()
export class CriarOrdemServicoV2UseCase {
  constructor(
    @Inject(ORDEM_SERVICO_REPOSITORY_TOKEN)
    private readonly ordemServicoRepository: IOrdemServicoRepository,
    @Inject(SERVICO_REPOSITORY_TOKEN)
    private readonly servicoRepository: IServicoRepository,
    @Inject(PECA_REPOSITORY_TOKEN)
    private readonly pecaRepository: IPecaRepository,
    private readonly metricsService: MetricsService,
  ) {}

  async execute(command: CriarOrdemServicoV2Command): Promise<OrdemServico> {
    // 1. Criar e salvar ordem de serviço primeiro (sempre status RECEBIDA)
    const ordemServico = OrdemServico.criar({
      clienteId: command.clienteId,
      veiculoId: command.veiculoId,
    })

    // 2. Calcular valor total
    const valorTotal = await this.calcularValorTotal(command.servicos, command.pecas)
    ordemServico.atualizarValorTotal(valorTotal)

    // 3. Salvar ordem de serviço primeiro para garantir que existe no banco
    await this.ordemServicoRepository.salvar(ordemServico)

    // 4. Buscar preços dos serviços e criar itens
    for (const servicoDto of command.servicos) {
      const servico = await this.servicoRepository.buscarPorId(ServicoId.criar(servicoDto.servicoId))
      if (!servico) {
        throw new EntityNotFoundException('Servico', servicoDto.servicoId)
      }

      const itemServico = ItemServico.criar(
        {
          ordemServicoId: ordemServico.id.obterValor(),
          servicoId: servicoDto.servicoId,
          quantidade: servicoDto.quantidade,
        },
        servico.preco,
      ) // Passa Preco como segundo parâmetro

      await this.ordemServicoRepository.adicionarItemServico(itemServico)
    }

    // 5. Buscar preços das peças e criar itens
    for (const pecaDto of command.pecas) {
      const peca = await this.pecaRepository.buscarPorId(PecaId.criar(pecaDto.pecaId))
      if (!peca) {
        throw new EntityNotFoundException('Peca', pecaDto.pecaId)
      }

      const itemPeca = ItemPeca.criar(
        {
          ordemServicoId: ordemServico.id.obterValor(),
          pecaId: pecaDto.pecaId,
          quantidade: pecaDto.quantidade,
        },
        peca.preco,
      ) // Passa Preco como segundo parâmetro

      await this.ordemServicoRepository.adicionarItemPeca(itemPeca)
    }

    // 6. Registrar métrica de ordem de serviço criada
    this.metricsService.recordOrdemServicoCriada()

    return ordemServico
  }

  private async calcularValorTotal(servicos: ItemServicoCreateDto[], pecas: ItemPecaCreateDto[]): Promise<number> {
    let total = 0

    // Somar serviços
    for (const servicoDto of servicos) {
      const servico = await this.servicoRepository.buscarPorId(ServicoId.criar(servicoDto.servicoId))
      if (servico) {
        total += servico.preco.obterValor() * servicoDto.quantidade
      }
    }

    // Somar peças
    for (const pecaDto of pecas) {
      const peca = await this.pecaRepository.buscarPorId(PecaId.criar(pecaDto.pecaId))
      if (peca) {
        total += peca.preco.obterValor() * pecaDto.quantidade
      }
    }

    return total
  }
}
