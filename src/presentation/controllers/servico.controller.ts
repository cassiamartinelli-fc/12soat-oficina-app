import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import {
  CriarServicoUseCase,
  BuscarServicoUseCase,
  AtualizarServicoUseCase,
  ExcluirServicoUseCase,
} from '../../application/use-cases/servico'
import { CreateServicoDto, UpdateServicoDto, ServicoResponseDto } from '../../application/dto/servico'
import { ServicoResponseMapper } from '../../application/mappers/servico-response.mapper'
import { HandleDomainExceptions } from '../../shared/decorators/handle-domain-exceptions.decorator'

@ApiTags('servicos')
@Controller('servicos')
export class ServicoController {
  constructor(
    private readonly criarServicoUseCase: CriarServicoUseCase,
    private readonly buscarServicoUseCase: BuscarServicoUseCase,
    private readonly atualizarServicoUseCase: AtualizarServicoUseCase,
    private readonly excluirServicoUseCase: ExcluirServicoUseCase,
    private readonly responseMapper: ServicoResponseMapper,
  ) {}

  @Post()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Criar um novo serviço' })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso.', type: ServicoResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async criarServico(@Body() createServicoDto: CreateServicoDto): Promise<ServicoResponseDto> {
    const servico = await this.criarServicoUseCase.execute({
      nome: createServicoDto.nome,
      preco: createServicoDto.preco,
    })

    return this.responseMapper.toDto(servico)
  }

  @Get()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  @ApiResponse({ status: 200, description: 'Lista de serviços retornada com sucesso.', type: [ServicoResponseDto] })
  async listarServicos(): Promise<ServicoResponseDto[]> {
    const servicos = await this.buscarServicoUseCase.buscarTodos()
    return this.responseMapper.toDtoList(servicos)
  }

  @Get(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço encontrado.', type: ServicoResponseDto })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  async buscarServicoPorId(@Param('id') id: string): Promise<ServicoResponseDto> {
    const servico = await this.buscarServicoUseCase.buscarPorId(id)
    return this.responseMapper.toDto(servico)
  }

  @Patch(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço atualizado com sucesso.', type: ServicoResponseDto })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  async atualizarServico(
    @Param('id') id: string,
    @Body() updateServicoDto: UpdateServicoDto,
  ): Promise<ServicoResponseDto> {
    const servico = await this.atualizarServicoUseCase.execute({
      id,
      nome: updateServicoDto.nome,
      preco: updateServicoDto.preco,
    })

    return this.responseMapper.toDto(servico)
  }

  @Delete(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Excluir serviço' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  async excluirServico(@Param('id') id: string): Promise<{ message: string }> {
    await this.excluirServicoUseCase.execute(id)
    return { message: 'Serviço excluído com sucesso' }
  }
}
