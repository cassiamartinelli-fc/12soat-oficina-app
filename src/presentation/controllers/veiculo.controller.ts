import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import {
  CriarVeiculoUseCase,
  BuscarVeiculoUseCase,
  AtualizarVeiculoUseCase,
  ExcluirVeiculoUseCase,
} from '../../application/use-cases/veiculo'
import { CreateVeiculoDto, UpdateVeiculoDto, VeiculoResponseDto } from '../../application/dto/veiculo'
import { VeiculoResponseMapper } from '../../application/mappers/veiculo-response.mapper'
import { HandleDomainExceptions } from '../../shared/decorators/handle-domain-exceptions.decorator'

@ApiTags('veiculos')
@Controller('veiculos')
export class VeiculoController {
  constructor(
    private readonly criarVeiculoUseCase: CriarVeiculoUseCase,
    private readonly buscarVeiculoUseCase: BuscarVeiculoUseCase,
    private readonly atualizarVeiculoUseCase: AtualizarVeiculoUseCase,
    private readonly excluirVeiculoUseCase: ExcluirVeiculoUseCase,
    private readonly responseMapper: VeiculoResponseMapper,
  ) {}

  @Post()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({ status: 201, description: 'Veículo criado com sucesso.', type: VeiculoResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @ApiResponse({ status: 409, description: 'Placa já cadastrada.' })
  async criarVeiculo(@Body() createVeiculoDto: CreateVeiculoDto): Promise<VeiculoResponseDto> {
    const veiculo = await this.criarVeiculoUseCase.execute({
      placa: createVeiculoDto.placa,
      marca: createVeiculoDto.marca,
      modelo: createVeiculoDto.modelo,
      ano: createVeiculoDto.ano,
      clienteId: createVeiculoDto.clienteId,
    })

    return this.responseMapper.toDto(veiculo)
  }

  @Get()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @ApiResponse({ status: 200, description: 'Lista de veículos retornada com sucesso.', type: [VeiculoResponseDto] })
  async listarVeiculos(): Promise<VeiculoResponseDto[]> {
    const veiculos = await this.buscarVeiculoUseCase.buscarTodos()
    return this.responseMapper.toDtoList(veiculos)
  }

  @Get(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo encontrado.', type: VeiculoResponseDto })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  async buscarVeiculoPorId(@Param('id') id: string): Promise<VeiculoResponseDto> {
    const veiculo = await this.buscarVeiculoUseCase.buscarPorId(id)
    return this.responseMapper.toDto(veiculo)
  }

  @Get('placa/:placa')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar veículo por placa' })
  @ApiParam({ name: 'placa', description: 'Placa do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo encontrado.', type: VeiculoResponseDto })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  async buscarVeiculoPorPlaca(@Param('placa') placa: string): Promise<VeiculoResponseDto> {
    const veiculo = await this.buscarVeiculoUseCase.buscarPorPlaca(placa)
    return this.responseMapper.toDto(veiculo)
  }

  @Get('cliente/:clienteId')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar veículos por cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Veículos encontrados.', type: [VeiculoResponseDto] })
  async buscarVeiculosPorCliente(@Param('clienteId') clienteId: string): Promise<VeiculoResponseDto[]> {
    const veiculos = await this.buscarVeiculoUseCase.buscarPorClienteId(clienteId)
    return this.responseMapper.toDtoList(veiculos)
  }

  @Patch(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Atualizar veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo atualizado com sucesso.', type: VeiculoResponseDto })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  @ApiResponse({ status: 409, description: 'Placa já cadastrada.' })
  async atualizarVeiculo(
    @Param('id') id: string,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ): Promise<VeiculoResponseDto> {
    const veiculo = await this.atualizarVeiculoUseCase.execute({
      id,
      placa: updateVeiculoDto.placa,
      marca: updateVeiculoDto.marca,
      modelo: updateVeiculoDto.modelo,
      ano: updateVeiculoDto.ano,
      clienteId: updateVeiculoDto.clienteId,
    })

    return this.responseMapper.toDto(veiculo)
  }

  @Delete(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Excluir veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  async excluirVeiculo(@Param('id') id: string): Promise<{ message: string }> {
    await this.excluirVeiculoUseCase.execute(id)
    return { message: 'Veículo excluído com sucesso' }
  }
}
