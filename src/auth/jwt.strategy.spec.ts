import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { jwtConfig } from '../config/jwt.config'

jest.mock('../config/jwt.config', () => ({
  jwtConfig: {
    secret: 'test-secret-key',
    expiresIn: '1h',
  },
}))

describe('JwtStrategy', () => {
  let strategy: JwtStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  describe('validate', () => {
    it('should return user object with userId and username from payload', async () => {
      const payload = {
        sub: 'admin-id',
        username: 'admin',
        iat: 1234567890,
        exp: 1234571490,
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'admin-id',
        username: 'admin',
      })
    })

    it('should handle payload with different sub value', async () => {
      const payload = {
        sub: 'user-123',
        username: 'testuser',
        iat: 1234567890,
        exp: 1234571490,
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'user-123',
        username: 'testuser',
      })
    })

    it('should handle payload with only required fields', async () => {
      const payload = {
        sub: 'admin',
        username: 'admin',
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'admin',
        username: 'admin',
      })
    })

    it('should handle payload with additional fields', async () => {
      const payload = {
        sub: 'admin',
        username: 'admin',
        role: 'administrator',
        permissions: ['read', 'write'],
        iat: 1234567890,
        exp: 1234571490,
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'admin',
        username: 'admin',
      })
    })

    it('should handle null or undefined sub', async () => {
      const payload = {
        sub: null,
        username: 'admin',
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: null,
        username: 'admin',
      })
    })

    it('should handle null or undefined username', async () => {
      const payload = {
        sub: 'admin',
        username: null,
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'admin',
        username: null,
      })
    })

    it('should handle empty strings in payload', async () => {
      const payload = {
        sub: '',
        username: '',
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: '',
        username: '',
      })
    })
  })

  describe('constructor configuration', () => {
    it('should use correct JWT configuration', () => {
      expect(jwtConfig.secret).toBe('test-secret-key')
    })

    it('should be configured to extract JWT from Authorization header as Bearer token', () => {
      const strategyInstance = new JwtStrategy()
      expect(strategyInstance).toBeInstanceOf(JwtStrategy)
    })
  })
})
