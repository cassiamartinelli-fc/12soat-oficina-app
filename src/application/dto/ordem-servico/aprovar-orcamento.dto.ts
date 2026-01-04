import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AprovarOrcamentoDto {
  @ApiProperty({
    description: 'Indica se o orçamento foi aprovado ou rejeitado',
    example: true,
    type: Boolean,
  })
  @IsBoolean({ message: 'aprovado deve ser um valor booleano' })
  aprovado: boolean
}
