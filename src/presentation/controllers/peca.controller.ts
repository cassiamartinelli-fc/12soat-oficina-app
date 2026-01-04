import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import {
  CriarPecaUseCase,
  BuscarPecaUseCase,
  AtualizarPecaUseCase,
  ExcluirPecaUseCase,
} from '../../application/use-cases/peca'
import { CreatePecaDto, UpdatePecaDto, PecaResponseDto } from '../../application/dto/peca'
import { PecaResponseMapper } from '../../application/mappers/peca-response.mapper'
import { HandleDomainExceptions } from '../../shared/decorators/handle-domain-exceptions.decorator'

@ApiTags('pecas')
@Controller('pecas')
export class PecaController {
  constructor(
    private readonly criarPecaUseCase: CriarPecaUseCase,
    private readonly buscarPecaUseCase: BuscarPecaUseCase,
    private readonly atualizarPecaUseCase: AtualizarPecaUseCase,
    private readonly excluirPecaUseCase: ExcluirPecaUseCase,
    private readonly responseMapper: PecaResponseMapper,
  ) {}

  @Post()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Criar uma nova peça' })
  @ApiResponse({ status: 201, description: 'Peça criada com sucesso.', type: PecaResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async criarPeca(@Body() createPecaDto: CreatePecaDto): Promise<PecaResponseDto> {
    const peca = await this.criarPecaUseCase.execute({
      nome: createPecaDto.nome,
      codigo: createPecaDto.codigo,
      preco: createPecaDto.preco,
      quantidadeEstoque: createPecaDto.quantidadeEstoque,
    })

    return this.responseMapper.toDto(peca)
  }

  @Get()
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Listar todas as peças' })
  @ApiResponse({ status: 200, description: 'Lista de peças retornada com sucesso.', type: [PecaResponseDto] })
  async listarPecas(): Promise<PecaResponseDto[]> {
    const pecas = await this.buscarPecaUseCase.buscarTodos()
    return this.responseMapper.toDtoList(pecas)
  }

  @Get(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Buscar peça por ID' })
  @ApiParam({ name: 'id', description: 'ID da peça' })
  @ApiResponse({ status: 200, description: 'Peça encontrada.', type: PecaResponseDto })
  @ApiResponse({ status: 404, description: 'Peça não encontrada.' })
  async buscarPecaPorId(@Param('id') id: string): Promise<PecaResponseDto> {
    const peca = await this.buscarPecaUseCase.buscarPorId(id)
    return this.responseMapper.toDto(peca)
  }

  @Patch(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Atualizar peça' })
  @ApiParam({ name: 'id', description: 'ID da peça' })
  @ApiResponse({ status: 200, description: 'Peça atualizada com sucesso.', type: PecaResponseDto })
  @ApiResponse({ status: 404, description: 'Peça não encontrada.' })
  async atualizarPeca(@Param('id') id: string, @Body() updatePecaDto: UpdatePecaDto): Promise<PecaResponseDto> {
    const peca = await this.atualizarPecaUseCase.execute({
      id,
      nome: updatePecaDto.nome,
      codigo: updatePecaDto.codigo,
      preco: updatePecaDto.preco,
      quantidadeEstoque: updatePecaDto.quantidadeEstoque,
    })

    return this.responseMapper.toDto(peca)
  }

  @Delete(':id')
  @HandleDomainExceptions()
  @ApiOperation({ summary: 'Excluir peça' })
  @ApiParam({ name: 'id', description: 'ID da peça' })
  @ApiResponse({ status: 200, description: 'Peça excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Peça não encontrada.' })
  async excluirPeca(@Param('id') id: string): Promise<{ message: string }> {
    await this.excluirPecaUseCase.execute(id)
    return { message: 'Peça excluída com sucesso' }
  }
}
