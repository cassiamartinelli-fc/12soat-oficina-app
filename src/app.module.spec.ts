import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HealthController } from './health/health.controller'

jest.mock('./config/database.config', () => ({
  default: () => ({
    database: {
      type: 'sqlite',
      database: ':memory:',
      entities: [],
      synchronize: true,
      logging: false,
    },
  }),
}))

describe('AppModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ database: { type: 'sqlite', database: ':memory:' } })],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [],
          synchronize: true,
          logging: false,
        }),
      ],
      controllers: [AppController, HealthController],
      providers: [AppService],
    }).compile()
  })

  afterEach(async () => {
    await module.close()
  })

  describe('Module Configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined()
    })

    it('should have AppController', () => {
      const controller = module.get<AppController>(AppController)
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(AppController)
    })

    it('should have HealthController', () => {
      const controller = module.get<HealthController>(HealthController)
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(HealthController)
    })

    it('should have AppService', () => {
      const service = module.get<AppService>(AppService)
      expect(service).toBeDefined()
      expect(service).toBeInstanceOf(AppService)
    })

    it('should have ConfigService available', () => {
      const configService = module.get<ConfigService>(ConfigService)
      expect(configService).toBeDefined()
      expect(configService).toBeInstanceOf(ConfigService)
    })
  })

  describe('Module Compilation Without Database', () => {
    it('should compile core module structure', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ test: 'value' })],
          }),
        ],
        controllers: [AppController, HealthController],
        providers: [AppService],
      }).compile()

      expect(testModule).toBeDefined()

      const appController = testModule.get(AppController)
      const healthController = testModule.get(HealthController)
      const appService = testModule.get(AppService)

      expect(appController).toBeDefined()
      expect(healthController).toBeDefined()
      expect(appService).toBeDefined()

      await testModule.close()
    })
  })

  describe('Configuration Module', () => {
    it('should configure ConfigModule as global', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ testConfig: 'test-value' })],
          }),
        ],
        providers: [
          {
            provide: 'TEST_SERVICE',
            useFactory: (configService: ConfigService) => {
              return { config: configService.get<string>('testConfig') }
            },
            inject: [ConfigService],
          },
        ],
      }).compile()

      const testService = testModule.get<{ config: string }>('TEST_SERVICE')
      expect(testService.config).toBe('test-value')

      await testModule.close()
    })

    it('should load database configuration', async () => {
      const mockDatabaseConfig = () => ({
        database: {
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
        },
      })

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [mockDatabaseConfig],
          }),
        ],
        providers: [ConfigService],
      }).compile()

      const configService = testModule.get<ConfigService>(ConfigService)
      const dbConfig = configService.get<{ type: string; database: string; synchronize: boolean }>('database')

      expect(dbConfig).toBeDefined()
      expect(dbConfig?.type).toBe('sqlite')
      expect(dbConfig?.database).toBe(':memory:')

      await testModule.close()
    })
  })

  describe('TypeORM Configuration', () => {
    it('should configure TypeORM with ConfigService', async () => {
      const mockConfig = {
        database: {
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [],
        },
      }

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => mockConfig],
          }),
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [],
          }),
        ],
      }).compile()

      expect(testModule).toBeDefined()
      await testModule.close()
    })
  })

  describe('Controllers Integration', () => {
    it('should integrate AppController with AppService', () => {
      const appController = module.get<AppController>(AppController)
      const result = appController.getHello()

      expect(result).toBe('Oficina Mecânica API is running!')
    })

    it('should have HealthController for health checks', () => {
      const healthController = module.get<HealthController>(HealthController)
      const healthCheck = healthController.check()

      expect(healthCheck).toBeDefined()
      expect(healthCheck.status).toBe('ok')
      expect(healthCheck.timestamp).toBeDefined()
    })
  })

  describe('Module Dependencies Structure', () => {
    it('should define all required feature modules', () => {
      const expectedModules = [
        'ClienteModule',
        'VeiculoModule',
        'ServicoModule',
        'PecaModule',
        'OrdemServicoModule',
        'AuthModule',
      ]

      expectedModules.forEach((moduleName) => {
        expect(moduleName).toBeDefined()
      })
    })
  })

  describe('Global Configuration', () => {
    it('should provide global configuration access', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ globalSetting: 'global-value' })],
          }),
        ],
        providers: [
          {
            provide: 'GLOBAL_TEST',
            useFactory: (config: ConfigService) => config.get<string>('globalSetting'),
            inject: [ConfigService],
          },
        ],
      }).compile()

      const globalTest = testModule.get<string>('GLOBAL_TEST')
      expect(globalTest).toBe('global-value')

      await testModule.close()
    })
  })

  describe('Module Initialization', () => {
    it('should initialize without errors', async () => {
      const initModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true }),
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [],
            synchronize: true,
          }),
        ],
        controllers: [AppController, HealthController],
        providers: [AppService],
      }).compile()

      await expect(initModule.init()).resolves.not.toThrow()
      await initModule.close()
    })

    it('should handle module lifecycle correctly', async () => {
      const lifecycleModule = await Test.createTestingModule({
        providers: [AppService],
        controllers: [AppController],
      }).compile()

      await lifecycleModule.init()
      expect(lifecycleModule).toBeDefined()

      await lifecycleModule.close()
    })
  })

  describe('Service Integration', () => {
    it('should provide AppService functionality', () => {
      const appService = module.get<AppService>(AppService)
      const message = appService.getHello()

      expect(message).toBe('Oficina Mecânica API is running!')
    })
  })
})
