import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities ORM
import { Veiculo as VeiculoOrmEntity } from './persistence/entities/veiculo.entity'

// Repositories
import { VeiculoRepositoryImpl } from './persistence/repositories/veiculo.repository.impl'

// Mappers
import { VeiculoResponseMapper } from '../application/mappers/veiculo-response.mapper'
import { VeiculoMapper } from './persistence/mappers/veiculo.mapper'

// Use Cases
import {
  AtualizarVeiculoUseCase,
  BuscarVeiculoUseCase,
  CriarVeiculoUseCase,
  ExcluirVeiculoUseCase,
} from '../application/use-cases/veiculo'

// Controllers
import { VeiculoController } from '../presentation/controllers/veiculo.controller'

// Tokens
import { VEICULO_REPOSITORY_TOKEN } from './ddd.module'

// Import Cliente module for dependency
import { ClienteDddModule } from './cliente-ddd.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([VeiculoOrmEntity]),
    ClienteDddModule, // Para injetar ClienteRepository
  ],
  providers: [
    // Mappers
    VeiculoMapper,
    VeiculoResponseMapper,

    // Repositories
    {
      provide: VEICULO_REPOSITORY_TOKEN,
      useClass: VeiculoRepositoryImpl,
    },

    // Use Cases
    CriarVeiculoUseCase,
    BuscarVeiculoUseCase,
    AtualizarVeiculoUseCase,
    ExcluirVeiculoUseCase,
  ],
  controllers: [VeiculoController],
  exports: [
    VEICULO_REPOSITORY_TOKEN,
    CriarVeiculoUseCase,
    BuscarVeiculoUseCase,
    AtualizarVeiculoUseCase,
    ExcluirVeiculoUseCase,
  ],
})
export class VeiculoDddModule {}
