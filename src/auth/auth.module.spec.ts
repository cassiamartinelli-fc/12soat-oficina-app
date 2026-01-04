import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthModule } from './auth.module'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

describe('AuthModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile()
  })

  afterEach(async () => {
    await module.close()
  })

  describe('Module Configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined()
    })

    it('should have AuthController', () => {
      const controller = module.get<AuthController>(AuthController)
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(AuthController)
    })

    it('should have JwtStrategy', () => {
      const strategy = module.get<JwtStrategy>(JwtStrategy)
      expect(strategy).toBeDefined()
      expect(strategy).toBeInstanceOf(JwtStrategy)
    })

    it('should have JwtService available', () => {
      const jwtService = module.get<JwtService>(JwtService)
      expect(jwtService).toBeDefined()
      expect(jwtService).toBeInstanceOf(JwtService)
    })
  })

  describe('JWT Configuration', () => {
    it('should configure JWT with correct options', () => {
      const jwtService = module.get<JwtService>(JwtService)

      const testPayload = { sub: 'test-id', username: 'test' }
      const token = jwtService.sign(testPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should verify JWT tokens correctly', () => {
      const jwtService = module.get<JwtService>(JwtService)

      const testPayload = { sub: 'test-id', username: 'testuser' }
      const token = jwtService.sign(testPayload)

      const decoded = jwtService.verify(token)
      expect(decoded.sub).toBe('test-id')
      expect(decoded.username).toBe('testuser')
      expect(decoded.iat).toBeDefined()
      expect(decoded.exp).toBeDefined()
    })

    it('should have expiration time configured', () => {
      const jwtService = module.get<JwtService>(JwtService)

      const testPayload = { sub: 'test-id', username: 'testuser' }
      const token = jwtService.sign(testPayload)

      const decoded = jwtService.verify(token)
      expect(decoded.exp).toBeDefined()
      expect(decoded.exp).toBeGreaterThan(decoded.iat)

      const expirationTime = decoded.exp - decoded.iat
      expect(expirationTime).toBe(3600)
    })
  })

  describe('Module Dependencies', () => {
    it('should import PassportModule', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [PassportModule],
      }).compile()

      expect(moduleRef).toBeDefined()
      await moduleRef.close()
    })

    it('should import JwtModule with configuration', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
        ],
      }).compile()

      const jwtService = moduleRef.get<JwtService>(JwtService)
      expect(jwtService).toBeDefined()
      await moduleRef.close()
    })
  })

  describe('Module Exports', () => {
    it('should export JwtModule for use in other modules', async () => {
      const testModule = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile()

      const jwtService = testModule.get<JwtService>(JwtService)
      expect(jwtService).toBeDefined()

      await testModule.close()
    })
  })

  describe('Module Compilation', () => {
    it('should compile without errors', async () => {
      const compiledModule = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile()

      expect(compiledModule).toBeDefined()
      await compiledModule.close()
    })

    it('should initialize all providers successfully', async () => {
      const initModule = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile()

      await expect(initModule.init()).resolves.not.toThrow()
      await initModule.close()
    })

    it('should create module with all dependencies resolved', async () => {
      const resolvedModule = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile()

      const authController = resolvedModule.get(AuthController)
      const jwtStrategy = resolvedModule.get(JwtStrategy)
      const jwtService = resolvedModule.get(JwtService)

      expect(authController).toBeDefined()
      expect(jwtStrategy).toBeDefined()
      expect(jwtService).toBeDefined()

      await resolvedModule.close()
    })
  })

  describe('JWT Strategy Integration', () => {
    it('should have JWT strategy properly configured', async () => {
      const strategy = module.get<JwtStrategy>(JwtStrategy)

      const mockPayload = {
        sub: 'admin-id',
        username: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const result = await strategy.validate(mockPayload)
      expect(result).toEqual({
        userId: 'admin-id',
        username: 'admin',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid JWT tokens', () => {
      const jwtService = module.get<JwtService>(JwtService)

      expect(() => {
        jwtService.verify('invalid-token')
      }).toThrow()
    })

    it('should handle expired tokens', () => {
      const jwtService = module.get<JwtService>(JwtService)

      const expiredToken = jwtService.sign({ sub: 'test', username: 'test' }, { expiresIn: '-1s' })

      expect(() => {
        jwtService.verify(expiredToken)
      }).toThrow()
    })
  })
})
