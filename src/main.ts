// eslint-disable-next-line @typescript-eslint/no-require-imports
require('newrelic')

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalInterceptors(new LoggingInterceptor())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Oficina Mecânica API')
    .setDescription('Sistema de gestão para oficina mecânica - MVP')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação administrativa')
    .addTag('clientes', 'Operações relacionadas a clientes')
    .addTag('veiculos', 'Operações relacionadas a veículos')
    .addTag('servicos', 'Operações relacionadas a serviços')
    .addTag('pecas', 'Operações relacionadas a peças')
    .addTag('ordens-servico', 'Operações relacionadas a ordens de serviço')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
  console.log('🚀 Servidor rodando em: http://localhost:3000')
  console.log('📚 Swagger docs em: http://localhost:3000/api-docs')
}
void bootstrap()
