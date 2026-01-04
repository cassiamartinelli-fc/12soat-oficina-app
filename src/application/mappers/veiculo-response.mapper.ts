import { Injectable } from '@nestjs/common'
import { Veiculo } from '../../domain/entities'
import { VeiculoResponseDto } from '../dto/veiculo/veiculo-response.dto'

@Injectable()
export class VeiculoResponseMapper {
  toDto(veiculo: Veiculo): VeiculoResponseDto {
    return {
      id: veiculo.id.obterValor(),
      placa: veiculo.placa.obterValor(),
      marca: veiculo.marca.obterValor(),
      modelo: veiculo.modelo.obterValor(),
      ano: veiculo.ano.obterValor(),
      clienteId: veiculo.clienteId.obterValor(),
      descricaoCompleta: veiculo.obterDescricaoCompleta(),
      placaMercosul: veiculo.isPlacaMercosul(),
      createdAt: veiculo.createdAt,
      updatedAt: veiculo.updatedAt,
    }
  }

  toDtoList(veiculos: Veiculo[]): VeiculoResponseDto[] {
    return veiculos.map((veiculo) => this.toDto(veiculo))
  }
}
