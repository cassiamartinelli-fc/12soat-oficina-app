import { Injectable } from '@nestjs/common'
import { Cliente } from '../../domain/entities'
import { ClienteResponseDto } from '../dto/cliente/cliente-response.dto'

@Injectable()
export class ClienteResponseMapper {
  toDto(cliente: Cliente): ClienteResponseDto {
    return {
      id: cliente.id.obterValor(),
      nome: cliente.nome.obterValor(),
      cpfCnpj: cliente.cpfCnpj.obterValor(),
      telefone: cliente.telefone?.obterValor(),
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    }
  }

  toDtoList(clientes: Cliente[]): ClienteResponseDto[] {
    return clientes.map((cliente) => this.toDto(cliente))
  }
}
