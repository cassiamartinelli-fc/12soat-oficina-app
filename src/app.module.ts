import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import databaseConfig from './config/database.config'
import { ClienteDddModule } from './infrastructure/cliente-ddd.module'
import { VeiculoDddModule } from './infrastructure/veiculo-ddd.module'
import { ServicoDddModule } from './infrastructure/servico-ddd.module'
import { PecaDddModule } from './infrastructure/peca-ddd.module'
import { OrdemServicoDddModule } from './infrastructure/ordem-servico-ddd.module'
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health/health.controller'
import { MetricsService } from './shared/services/metrics.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database') as TypeOrmModuleOptions,
    }),
    ClienteDddModule,
    VeiculoDddModule,
    ServicoDddModule,
    PecaDddModule,
    OrdemServicoDddModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, MetricsService],
  exports: [MetricsService],
})
export class AppModule {}
