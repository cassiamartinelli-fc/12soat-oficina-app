import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login administrativo' })
  @ApiResponse({ status: 200, description: 'Token JWT gerado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  // eslint-disable-next-line @typescript-eslint/require-await
  async login(@Body() loginDto: LoginDto) {
    if (loginDto.username === 'admin' && loginDto.password === 'admin123') {
      const payload = { username: loginDto.username, sub: 'admin' }
      return {
        access_token: this.jwtService.sign(payload),
        expires_in: '1h',
      }
    }

    throw new UnauthorizedException('Credenciais inválidas')
  }
}
