import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsCpfCnpj } from '../../../shared/validators/cpf-cnpj.validator'

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nome: string

  @ApiProperty({
    description: 'CPF ou CNPJ do cliente (apenas números)',
    example: '12345678901',
    minLength: 11,
    maxLength: 14,
  })
  @IsString()
  @IsNotEmpty()
  @IsCpfCnpj()
  cpfCnpj: string

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '11999887766',
    required: false,
    minLength: 10,
    maxLength: 15,
  })
  @IsString()
  @IsOptional()
  @Length(10, 15)
  telefone?: string
}
