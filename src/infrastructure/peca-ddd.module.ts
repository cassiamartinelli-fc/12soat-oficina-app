import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities ORM
import { Peca as PecaOrmEntity } from './persistence/entities/peca.entity'

// Repositories
import { PecaRepositoryImpl } from './persistence/repositories/peca.repository.impl'

// Mappers
import { PecaResponseMapper } from '../application/mappers/peca-response.mapper'
import { PecaMapper } from './persistence/mappers/peca.mapper'

// Use Cases
import {
  AtualizarPecaUseCase,
  BuscarPecaUseCase,
  CriarPecaUseCase,
  ExcluirPecaUseCase,
} from '../application/use-cases/peca'

// Controllers
import { PecaController } from '../presentation/controllers/peca.controller'

// Tokens
import { PECA_REPOSITORY_TOKEN } from './ddd.module'

@Module({
  imports: [TypeOrmModule.forFeature([PecaOrmEntity])],
  providers: [
    // Mappers
    PecaMapper,
    PecaResponseMapper,

    // Repositories
    {
      provide: PECA_REPOSITORY_TOKEN,
      useClass: PecaRepositoryImpl,
    },

    // Use Cases
    CriarPecaUseCase,
    BuscarPecaUseCase,
    AtualizarPecaUseCase,
    ExcluirPecaUseCase,
  ],
  controllers: [PecaController],
  exports: [PECA_REPOSITORY_TOKEN, CriarPecaUseCase, BuscarPecaUseCase, AtualizarPecaUseCase, ExcluirPecaUseCase],
})
export class PecaDddModule {}
