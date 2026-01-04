import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities ORM
import { Servico as ServicoOrmEntity } from './persistence/entities/servico.entity'

// Repositories
import { ServicoRepositoryImpl } from './persistence/repositories/servico.repository.impl'

// Mappers
import { ServicoResponseMapper } from '../application/mappers/servico-response.mapper'
import { ServicoMapper } from './persistence/mappers/servico.mapper'

// Use Cases
import {
  AtualizarServicoUseCase,
  BuscarServicoUseCase,
  CriarServicoUseCase,
  ExcluirServicoUseCase,
} from '../application/use-cases/servico'

// Controllers
import { ServicoController } from '../presentation/controllers/servico.controller'

// Tokens
import { SERVICO_REPOSITORY_TOKEN } from './ddd.module'

@Module({
  imports: [TypeOrmModule.forFeature([ServicoOrmEntity])],
  providers: [
    // Mappers
    ServicoMapper,
    ServicoResponseMapper,

    // Repositories
    {
      provide: SERVICO_REPOSITORY_TOKEN,
      useClass: ServicoRepositoryImpl,
    },

    // Use Cases
    CriarServicoUseCase,
    BuscarServicoUseCase,
    AtualizarServicoUseCase,
    ExcluirServicoUseCase,
  ],
  controllers: [ServicoController],
  exports: [
    SERVICO_REPOSITORY_TOKEN,
    CriarServicoUseCase,
    BuscarServicoUseCase,
    AtualizarServicoUseCase,
    ExcluirServicoUseCase,
  ],
})
export class ServicoDddModule {}
