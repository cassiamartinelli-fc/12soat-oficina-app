import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities ORM
import { ItemOrdemServico as ItemOrdemServicoOrmEntity } from './persistence/entities/item-ordem-servico.entity'
import { OrdemServico as OrdemServicoOrmEntity } from './persistence/entities/ordem-servico.entity'
import { PecaOrdemServico as PecaOrdemServicoOrmEntity } from './persistence/entities/peca-ordem-servico.entity'

// Repositories
import { OrdemServicoRepositoryImpl } from './persistence/repositories/ordem-servico.repository.impl'

// Mappers
import { OrdemServicoResponseMapper } from '../application/mappers/ordem-servico-response.mapper'
import { OrdemServicoEmAndamentoMapper } from '../application/mappers/ordem-servico-em-andamento.mapper'
import { ItemPecaMapper } from './persistence/mappers/item-peca.mapper'
import { ItemServicoMapper } from './persistence/mappers/item-servico.mapper'
import { OrdemServicoMapper } from './persistence/mappers/ordem-servico.mapper'

// Use Cases
import {
  AprovarOrcamentoUseCase,
  BuscarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
} from '../application/use-cases/ordem-servico'
import { CriarOrdemServicoV2UseCase } from '../application/use-cases/ordem-servico/criar-ordem-servico-v2.use-case'
import { AtualizarStatusOrdemServicoUseCase } from '../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case'
import { ListarOrdensEmAndamentoUseCase } from '../application/use-cases/ordem-servico/listar-ordens-em-andamento.use-case'

// Strategies
import { OrdemServicoQueryFactory } from '../application/strategies/ordem-servico-query.factory'

// Controllers
import { OrdemServicoController } from '../presentation/controllers/ordem-servico.controller'

// Tokens
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from './ddd.module'

// Importar módulos DDD necessários para injeção de dependências
import { PecaDddModule } from './peca-ddd.module'
import { ServicoDddModule } from './servico-ddd.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdemServicoOrmEntity, ItemOrdemServicoOrmEntity, PecaOrdemServicoOrmEntity]),
    ServicoDddModule,
    PecaDddModule,
  ],
  providers: [
    // Mappers
    OrdemServicoMapper,
    ItemServicoMapper,
    ItemPecaMapper,
    OrdemServicoResponseMapper,
    OrdemServicoEmAndamentoMapper,

    // Repositories
    {
      provide: ORDEM_SERVICO_REPOSITORY_TOKEN,
      useClass: OrdemServicoRepositoryImpl,
    },

    // Use Cases
    CriarOrdemServicoV2UseCase,
    BuscarOrdemServicoUseCase,
    AtualizarStatusOrdemServicoUseCase,
    ExcluirOrdemServicoUseCase,
    AprovarOrcamentoUseCase,
    ListarOrdensEmAndamentoUseCase,

    // Strategies
    OrdemServicoQueryFactory,
  ],
  controllers: [OrdemServicoController],
  exports: [
    ORDEM_SERVICO_REPOSITORY_TOKEN,
    CriarOrdemServicoV2UseCase,
    BuscarOrdemServicoUseCase,
    AtualizarStatusOrdemServicoUseCase,
    ExcluirOrdemServicoUseCase,
    AprovarOrcamentoUseCase,
  ],
})
export class OrdemServicoDddModule {}
