import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import {
  CriarClienteUseCase,
  BuscarClienteUseCase,
  AtualizarClienteUseCase,
  ExcluirClienteUseCase,
} from '../../application/use-cases/cliente'
import { CreateClienteDto, UpdateClienteDto, ClienteResponseDto } from '../../application/dto/cliente'
import { ClienteResponseMapper } from '../../application/mappers/cliente-response.mapper'
import { HandleDomainExceptions } from '../../shared/decorators/handle-domain-exceptions.decorator'

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly criarClienteUseCase: CriarClienteUseCase,
    private readonly buscarClienteUseCase: BuscarClienteUseCase,
    private readonly atualizarClienteUseCase: AtualizarClienteUseCase,
    private readonly excluirClienteUseCase: ExcluirClienteUseCase,
    private readonly responseMapper: ClienteResponseMapper,
  ) {}

  @Post()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.', type: ClienteResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado.' })
  async criarCliente(@Body() createClienteDto: CreateClienteDto): Promise<ClienteResponseDto> {
    const cliente = await this.criarClienteUseCase.execute({
      nome: createClienteDto.nome,
      cpfCnpj: createClienteDto.cpfCnpj,
      telefone: createClienteDto.telefone,
    })

    return this.responseMapper.toDto(cliente)
  }

  @Get()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso.', type: [ClienteResponseDto] })
  async listarClientes(): Promise<ClienteResponseDto[]> {
    const clientes = await this.buscarClienteUseCase.buscarTodos()
    return this.responseMapper.toDtoList(clientes)
  }

  @Get(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.', type: ClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async buscarClientePorId(@Param('id') id: string): Promise<ClienteResponseDto> {
    const cliente = await this.buscarClienteUseCase.buscarPorId(id)
    return this.responseMapper.toDto(cliente)
  }

  @Get('cpf-cnpj/:cpfCnpj')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar cliente por CPF/CNPJ' })
  @ApiParam({ name: 'cpfCnpj', description: 'CPF ou CNPJ do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.', type: ClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async buscarClientePorCpfCnpj(@Param('cpfCnpj') cpfCnpj: string): Promise<ClienteResponseDto> {
    const cliente = await this.buscarClienteUseCase.buscarPorCpfCnpj(cpfCnpj)
    return this.responseMapper.toDto(cliente)
  }

  @Patch(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.', type: ClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado.' })
  async atualizarCliente(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    const cliente = await this.atualizarClienteUseCase.execute({
      id,
      nome: updateClienteDto.nome,
      cpfCnpj: updateClienteDto.cpfCnpj,
      telefone: updateClienteDto.telefone,
    })

    return this.responseMapper.toDto(cliente)
  }

  @Delete(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async excluirCliente(@Param('id') id: string): Promise<{ message: string }> {
    await this.excluirClienteUseCase.execute(id)
    return { message: 'Cliente excluído com sucesso' }
  }
}
