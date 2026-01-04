import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AprovarOrcamentoDto } from '../../application/dto/ordem-servico/aprovar-orcamento.dto'
import { AtualizarStatusDto } from '../../application/dto/ordem-servico/atualizar-status.dto'
import { CreateOrdemServicoV2Dto } from '../../application/dto/ordem-servico/create-ordem-servico-v2.dto'
import { OrdemServicoEmAndamentoDto } from '../../application/dto/ordem-servico/ordem-servico-em-andamento.dto'
import { OrdemServicoResponseDto } from '../../application/dto/ordem-servico/ordem-servico-response.dto'
import { OrdemServicoEmAndamentoMapper } from '../../application/mappers/ordem-servico-em-andamento.mapper'
import { OrdemServicoResponseMapper } from '../../application/mappers/ordem-servico-response.mapper'
import { OrdemServicoQueryFactory, QueryFilters } from '../../application/strategies/ordem-servico-query.factory'
import {
  AprovarOrcamentoUseCase,
  BuscarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
} from '../../application/use-cases/ordem-servico'
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case'
import { CriarOrdemServicoV2UseCase } from '../../application/use-cases/ordem-servico/criar-ordem-servico-v2.use-case'
import { ListarOrdensEmAndamentoUseCase } from '../../application/use-cases/ordem-servico/listar-ordens-em-andamento.use-case'
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo'
import { HandleDomainExceptions } from '../../shared/decorators/handle-domain-exceptions.decorator'

@ApiTags('ordens-servico')
@Controller('ordens-servico')
export class OrdemServicoController {
  constructor(
    private readonly criarOrdemServicoV2UseCase: CriarOrdemServicoV2UseCase,
    private readonly buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase,
    private readonly atualizarStatusOrdemServicoUseCase: AtualizarStatusOrdemServicoUseCase,
    private readonly excluirOrdemServicoUseCase: ExcluirOrdemServicoUseCase,
    private readonly aprovarOrcamentoUseCase: AprovarOrcamentoUseCase,
    private readonly listarOrdensEmAndamentoUseCase: ListarOrdensEmAndamentoUseCase,
    private readonly queryFactory: OrdemServicoQueryFactory,
    private readonly responseMapper: OrdemServicoResponseMapper,
    private readonly ordemServicoEmAndamentoMapper: OrdemServicoEmAndamentoMapper,
  ) {}

  @Post()
  @HandleDomainExceptions()
  @ApiOperation({
    summary: 'Criar uma nova ordem de serviço completa',
    description:
      'Cria uma ordem de serviço com cliente, veículo, serviços e peças. Preços são calculados automaticamente.',
  })
  @ApiResponse({ status: 201, description: 'Ordem de serviço criada com sucesso.', type: OrdemServicoResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async criarOrdemServico(@Body() createOrdemServicoDto: CreateOrdemServicoV2Dto): Promise<OrdemServicoResponseDto> {
    const ordemServico = await this.criarOrdemServicoV2UseCase.execute(createOrdemServicoDto)
    return this.responseMapper.toDto(ordemServico)
  }

  @Get()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Listar todas as ordens de serviço' })
  @ApiQuery({ name: 'clienteId', required: false, description: 'Filtrar por cliente' })
  @ApiQuery({ name: 'veiculoId', required: false, description: 'Filtrar por veículo' })
  @ApiQuery({ name: 'status', required: false, enum: StatusOrdemServico, description: 'Filtrar por status' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso.',
    type: [OrdemServicoResponseDto],
  })
  async listarOrdensServico(
    @Query('clienteId') clienteId?: string,
    @Query('veiculoId') veiculoId?: string,
    @Query('status') status?: StatusOrdemServico,
  ): Promise<OrdemServicoResponseDto[]> {
    const filters: QueryFilters = { clienteId, veiculoId, status }
    const strategy = this.queryFactory.createStrategy(filters)
    const ordensServico = await strategy.execute()

    return this.responseMapper.toDtoList(ordensServico)
  }

  @Get('em-andamento')
  @HandleDomainExceptions()
  @ApiOperation({
    summary: 'Listar ordens de serviço em andamento',
    description:
      'Retorna ordens com status ativo (RECEBIDA, EM_DIAGNOSTICO, AGUARDANDO_APROVACAO, EM_EXECUCAO) ordenadas por prioridade e data de criação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens em andamento retornada com sucesso.',
    type: [OrdemServicoEmAndamentoDto],
  })
  async listarOrdensEmAndamento(): Promise<OrdemServicoEmAndamentoDto[]> {
    const ordensEmAndamento = await this.listarOrdensEmAndamentoUseCase.execute()
    return this.ordemServicoEmAndamentoMapper.toDtoList(ordensEmAndamento)
  }

  @Get(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar ordem de serviço por ID' })
  @ApiParam({ name: 'id', description: 'ID da ordem de serviço' })
  @ApiResponse({ status: 200, description: 'Ordem de serviço encontrada.', type: OrdemServicoResponseDto })
  @ApiResponse({ status: 404, description: 'Ordem de serviço não encontrada.' })
  async buscarOrdemServicoPorId(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    const ordemServico = await this.buscarOrdemServicoUseCase.buscarPorId(id)
    return this.responseMapper.toDto(ordemServico)
  }

  @Delete(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Excluir ordem de serviço' })
  @ApiParam({ name: 'id', description: 'ID da ordem de serviço' })
  @ApiResponse({ status: 200, description: 'Ordem de serviço excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ordem de serviço não encontrada.' })
  async excluirOrdemServico(@Param('id') id: string): Promise<{ message: string }> {
    await this.excluirOrdemServicoUseCase.execute(id)
    return { message: 'Ordem de serviço excluída com sucesso' }
  }

  @Post(':id/aprovacao')
  @HandleDomainExceptions()
  @ApiOperation({
    summary: 'Aprovar ou rejeitar orçamento de uma ordem de serviço',
    description: 'Aprova o orçamento (status → EM_EXECUCAO) ou rejeita (status → RECEBIDA) baseado no campo "aprovado"',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento processado com sucesso. Status da ordem atualizado conforme decisão.',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regra de negócio violada.' })
  @ApiResponse({ status: 404, description: 'Ordem de serviço não encontrada.' })
  @ApiResponse({ status: 409, description: 'Apenas ordens com status AGUARDANDO_APROVACAO podem ser processadas.' })
  async aprovarOrcamento(
    @Param('id') id: string,
    @Body() aprovarOrcamentoDto: AprovarOrcamentoDto,
  ): Promise<OrdemServicoResponseDto> {
    const ordemServico = await this.aprovarOrcamentoUseCase.execute({
      ordemServicoId: id,
      aprovado: aprovarOrcamentoDto.aprovado,
    })

    return this.responseMapper.toDto(ordemServico)
  }

  @Post(':id/status')
  @HandleDomainExceptions()
  @ApiOperation({
    summary: 'Atualizar status da ordem de serviço',
    description:
      'Permite transições manuais de status: RECEBIDA → EM_DIAGNOSTICO → AGUARDANDO_APROVACAO, EM_EXECUCAO → FINALIZADA, FINALIZADA/CANCELADA → ENTREGUE',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Status da ordem atualizado com sucesso.',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Transição de status inválida.' })
  @ApiResponse({ status: 404, description: 'Ordem de serviço não encontrada.' })
  async atualizarStatus(
    @Param('id') id: string,
    @Body() atualizarStatusDto: AtualizarStatusDto,
  ): Promise<OrdemServicoResponseDto> {
    const ordemServico = await this.atualizarStatusOrdemServicoUseCase.execute({
      ordemServicoId: id,
      novoStatus: atualizarStatusDto.status,
    })

    return this.responseMapper.toDto(ordemServico)
  }
}
