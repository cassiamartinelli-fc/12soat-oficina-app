import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export default registerAs('database', (): TypeOrmModuleOptions => {
  // Usar PostgreSQL (Neon) em todos os ambientes
  return {
    type: 'postgres',
    url: process.env.NEON_DATABASE_URL,
    entities: [__dirname + '/../infrastructure/persistence/entities/*.entity{.ts,.js}'],
    synchronize: true, // TypeORM criará as tabelas automaticamente
    logging: process.env.NODE_ENV !== 'production',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }
})
