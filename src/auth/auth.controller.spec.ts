import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { LoginDto } from './dto/login.dto'

describe('AuthController', () => {
  let controller: AuthController
  let jwtService: JwtService

  const mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      }

      const expectedToken = 'mock-jwt-token'
      mockJwtService.sign.mockReturnValue(expectedToken)

      const result = await controller.login(loginDto)

      expect(result).toEqual({
        access_token: expectedToken,
        expires_in: '1h',
      })

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 'admin',
      })
    })

    it('should throw UnauthorizedException for invalid username', async () => {
      const loginDto: LoginDto = {
        username: 'invalid',
        password: 'admin123',
      }

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)

      expect(jwtService.sign).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'invalid',
      }

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)

      expect(jwtService.sign).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for both invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'invalid',
        password: 'invalid',
      }

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)

      expect(jwtService.sign).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException with correct message', async () => {
      const loginDto: LoginDto = {
        username: 'invalid',
        password: 'invalid',
      }

      try {
        await controller.login(loginDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
        expect(error.message).toBe('Credenciais inválidas')
      }
    })

    it('should handle empty username', async () => {
      const loginDto: LoginDto = {
        username: '',
        password: 'admin123',
      }

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should handle empty password', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: '',
      }

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should call jwtService.sign with correct payload structure', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      }

      mockJwtService.sign.mockReturnValue('token')

      await controller.login(loginDto)

      expect(jwtService.sign).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 'admin',
      })
    })
  })
})
