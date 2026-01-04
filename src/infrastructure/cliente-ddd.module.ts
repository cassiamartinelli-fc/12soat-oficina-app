import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities ORM
import { Cliente as ClienteOrmEntity } from './persistence/entities/cliente.entity'

// Repositories
import { ClienteRepositoryImpl } from './persistence/repositories/cliente.repository.impl'

// Mappers
import { ClienteMapper } from './persistence/mappers/cliente.mapper'
import { ClienteResponseMapper } from '../application/mappers/cliente-response.mapper'

// Use Cases
import {
  CriarClienteUseCase,
  BuscarClienteUseCase,
  AtualizarClienteUseCase,
  ExcluirClienteUseCase,
} from '../application/use-cases/cliente'

// Controllers
import { ClienteController } from '../presentation/controllers/cliente.controller'

// Tokens
import { CLIENTE_REPOSITORY_TOKEN } from './ddd.module'

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrmEntity])],
  providers: [
    // Mappers
    ClienteMapper,
    ClienteResponseMapper,

    // Repositories
    {
      provide: CLIENTE_REPOSITORY_TOKEN,
      useClass: ClienteRepositoryImpl,
    },

    // Use Cases
    CriarClienteUseCase,
    BuscarClienteUseCase,
    AtualizarClienteUseCase,
    ExcluirClienteUseCase,
  ],
  controllers: [ClienteController],
  exports: [
    CLIENTE_REPOSITORY_TOKEN,
    CriarClienteUseCase,
    BuscarClienteUseCase,
    AtualizarClienteUseCase,
    ExcluirClienteUseCase,
  ],
})
export class ClienteDddModule {}
