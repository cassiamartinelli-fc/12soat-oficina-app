import { IsString, IsNotEmpty, Length, IsNumber, Min, Max, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsPlacaVeiculo } from '../../../shared/validators/placa.validator'

export class CreateVeiculoDto {
  @ApiProperty({
    description: 'Placa do veículo (formato antigo ABC1234 ou Mercosul ABC1A23)',
    example: 'ABC1234',
  })
  @IsString()
  @IsNotEmpty()
  @IsPlacaVeiculo()
  placa: string

  @ApiProperty({
    description: 'Marca do veículo',
    example: 'Toyota',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  marca: string

  @ApiProperty({
    description: 'Modelo do veículo',
    example: 'Corolla',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  modelo: string

  @ApiProperty({
    description: 'Ano de fabricação do veículo',
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number

  @ApiProperty({
    description: 'ID do cliente proprietário do veículo',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  clienteId: string
}
