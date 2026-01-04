import { IsString, IsNotEmpty, Length, IsNumber, Min, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePecaDto {
  @ApiProperty({
    description: 'Nome da peça',
    example: 'Óleo Motor 5W30',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nome: string

  @ApiProperty({
    description: 'Código da peça (opcional)',
    example: 'OL5W30',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  codigo?: string

  @ApiProperty({
    description: 'Preço unitário da peça em reais',
    example: 45.9,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  preco: number

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantidadeEstoque: number
}
