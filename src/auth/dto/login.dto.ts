import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário administrativo',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: 'Senha administrativa',
    example: 'admin123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
