import { IsString, IsNotEmpty, Length, IsNumber, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateServicoDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Troca de Óleo',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nome: string

  @ApiProperty({
    description: 'Preço do serviço em reais',
    example: 85.5,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  preco: number

  @ApiProperty({
    description: 'Tempo estimado em minutos',
    example: 30,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  tempoEstimadoMinutos: number
}
