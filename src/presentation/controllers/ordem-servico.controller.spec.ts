import { Test, TestingModule } from '@nestjs/testing'
import { OrdemServicoController } from './ordem-servico.controller'
import {
  BuscarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
  AprovarOrcamentoUseCase,
} from '../../application/use-cases/ordem-servico'
import { CriarOrdemServicoV2UseCase } from '../../application/use-cases/ordem-servico/criar-ordem-servico-v2.use-case'
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case'
import { ListarOrdensEmAndamentoUseCase } from '../../application/use-cases/ordem-servico/listar-ordens-em-andamento.use-case'
import { OrdemServicoQueryFactory } from '../../application/strategies/ordem-servico-query.factory'
import { OrdemServicoResponseMapper } from '../../application/mappers/ordem-servico-response.mapper'
import { OrdemServicoEmAndamentoMapper } from '../../application/mappers/ordem-servico-em-andamento.mapper'
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo'

describe('OrdemServicoController', () => {
  let controller: OrdemServicoController
  let criarOrdemServicoV2UseCase: jest.Mocked<CriarOrdemServicoV2UseCase>
  let buscarOrdemServicoUseCase: jest.Mocked<BuscarOrdemServicoUseCase>
  let atualizarStatusOrdemServicoUseCase: jest.Mocked<AtualizarStatusOrdemServicoUseCase>
  let excluirOrdemServicoUseCase: jest.Mocked<ExcluirOrdemServicoUseCase>
  let aprovarOrcamentoUseCase: jest.Mocked<AprovarOrcamentoUseCase>
  let listarOrdensEmAndamentoUseCase: jest.Mocked<ListarOrdensEmAndamentoUseCase>
  let queryFactory: jest.Mocked<OrdemServicoQueryFactory>
  let responseMapper: jest.Mocked<OrdemServicoResponseMapper>
  let ordemServicoEmAndamentoMapper: jest.Mocked<OrdemServicoEmAndamentoMapper>

  const mockOrdemServico = {
    id: { obterValor: () => 'test-id' },
    status: { obterValor: () => StatusOrdemServico.RECEBIDA },
    valorTotal: { obterValor: () => 150.0 },
    clienteId: { obterValor: () => 'cliente-id' },
    veiculoId: { obterValor: () => 'veiculo-id' },
    periodoExecucao: {
      obterDataInicio: () => null,
      obterDataFim: () => null,
    },
    calcularDuracaoExecucao: () => null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any

  const mockOrdemServicoResponse = {
    id: 'test-id',
    status: StatusOrdemServico.RECEBIDA,
    valorTotal: 150.0,
    clienteId: 'cliente-id',
    veiculoId: 'veiculo-id',
    dataInicio: null,
    dataFim: null,
    duracaoDias: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockStrategy = {
    execute: jest.fn(),
  }

  beforeEach(async () => {
    const mockCriarOrdemServicoV2UseCase = {
      execute: jest.fn(),
    }
    const mockBuscarOrdemServicoUseCase = {
      buscarPorId: jest.fn(),
    }
    const mockAtualizarStatusOrdemServicoUseCase = {
      execute: jest.fn(),
    }
    const mockExcluirOrdemServicoUseCase = {
      execute: jest.fn(),
    }
    const mockAprovarOrcamentoUseCase = {
      execute: jest.fn(),
    }
    const mockListarOrdensEmAndamentoUseCase = {
      execute: jest.fn(),
    }
    const mockQueryFactory = {
      createStrategy: jest.fn(),
    }
    const mockResponseMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }
    const mockOrdemServicoEmAndamentoMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdemServicoController],
      providers: [
        { provide: CriarOrdemServicoV2UseCase, useValue: mockCriarOrdemServicoV2UseCase },
        { provide: BuscarOrdemServicoUseCase, useValue: mockBuscarOrdemServicoUseCase },
        { provide: AtualizarStatusOrdemServicoUseCase, useValue: mockAtualizarStatusOrdemServicoUseCase },
        { provide: ExcluirOrdemServicoUseCase, useValue: mockExcluirOrdemServicoUseCase },
        { provide: AprovarOrcamentoUseCase, useValue: mockAprovarOrcamentoUseCase },
        { provide: ListarOrdensEmAndamentoUseCase, useValue: mockListarOrdensEmAndamentoUseCase },
        { provide: OrdemServicoQueryFactory, useValue: mockQueryFactory },
        { provide: OrdemServicoResponseMapper, useValue: mockResponseMapper },
        { provide: OrdemServicoEmAndamentoMapper, useValue: mockOrdemServicoEmAndamentoMapper },
      ],
    }).compile()

    controller = module.get<OrdemServicoController>(OrdemServicoController)
    criarOrdemServicoV2UseCase = module.get(CriarOrdemServicoV2UseCase)
    buscarOrdemServicoUseCase = module.get(BuscarOrdemServicoUseCase)
    atualizarStatusOrdemServicoUseCase = module.get(AtualizarStatusOrdemServicoUseCase)
    excluirOrdemServicoUseCase = module.get(ExcluirOrdemServicoUseCase)
    aprovarOrcamentoUseCase = module.get(AprovarOrcamentoUseCase)
    listarOrdensEmAndamentoUseCase = module.get(ListarOrdensEmAndamentoUseCase)
    queryFactory = module.get(OrdemServicoQueryFactory)
    responseMapper = module.get(OrdemServicoResponseMapper)
    ordemServicoEmAndamentoMapper = module.get(OrdemServicoEmAndamentoMapper)
  })

  it('deve estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('criarOrdemServico', () => {
    it('deve criar uma ordem de serviço completa com sucesso', async () => {
      const createDto = {
        clienteId: 'cliente-id',
        veiculoId: 'veiculo-id',
        servicos: [
          {
            servicoId: 'servico-id',
            quantidade: 1,
          },
        ],
        pecas: [
          {
            pecaId: 'peca-id',
            quantidade: 2,
          },
        ],
      }

      criarOrdemServicoV2UseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      const result = await controller.criarOrdemServico(createDto)

      expect(criarOrdemServicoV2UseCase.execute).toHaveBeenCalledWith(createDto)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockOrdemServico)
      expect(result).toEqual(mockOrdemServicoResponse)
    })

    it('deve criar ordem de serviço só com serviços', async () => {
      const createDto = {
        clienteId: 'cliente-id',
        veiculoId: 'veiculo-id',
        servicos: [
          {
            servicoId: 'servico-id',
            quantidade: 1,
          },
        ],
        pecas: [],
      }

      criarOrdemServicoV2UseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      const result = await controller.criarOrdemServico(createDto)

      expect(criarOrdemServicoV2UseCase.execute).toHaveBeenCalledWith(createDto)
      expect(result).toEqual(mockOrdemServicoResponse)
    })

    it('deve criar ordem de serviço só com peças', async () => {
      const createDto = {
        clienteId: 'cliente-id',
        veiculoId: 'veiculo-id',
        servicos: [],
        pecas: [
          {
            pecaId: 'peca-id',
            quantidade: 3,
          },
        ],
      }

      criarOrdemServicoV2UseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      const result = await controller.criarOrdemServico(createDto)

      expect(criarOrdemServicoV2UseCase.execute).toHaveBeenCalledWith(createDto)
      expect(result).toEqual(mockOrdemServicoResponse)
    })
  })

  describe('listarOrdensServico', () => {
    it('deve listar todas as ordens de serviço', async () => {
      const ordensServico = [mockOrdemServico]
      const responses = [mockOrdemServicoResponse]

      queryFactory.createStrategy.mockReturnValue(mockStrategy)
      mockStrategy.execute.mockResolvedValue(ordensServico)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarOrdensServico()

      expect(queryFactory.createStrategy).toHaveBeenCalledWith({})
      expect(mockStrategy.execute).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(ordensServico)
      expect(result).toEqual(responses)
    })

    it('deve listar ordens de serviço filtradas por cliente', async () => {
      const clienteId = 'cliente-id'
      const ordensServico = [mockOrdemServico]
      const responses = [mockOrdemServicoResponse]

      queryFactory.createStrategy.mockReturnValue(mockStrategy)
      mockStrategy.execute.mockResolvedValue(ordensServico)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarOrdensServico(clienteId)

      expect(queryFactory.createStrategy).toHaveBeenCalledWith({ clienteId })
      expect(mockStrategy.execute).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(ordensServico)
      expect(result).toEqual(responses)
    })

    it('deve listar ordens de serviço filtradas por status', async () => {
      const status = StatusOrdemServico.EM_EXECUCAO
      const ordensServico = [mockOrdemServico]
      const responses = [mockOrdemServicoResponse]

      queryFactory.createStrategy.mockReturnValue(mockStrategy)
      mockStrategy.execute.mockResolvedValue(ordensServico)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarOrdensServico(undefined, undefined, status)

      expect(queryFactory.createStrategy).toHaveBeenCalledWith({ status })
      expect(result).toEqual(responses)
    })
  })

  describe('listarOrdensEmAndamento', () => {
    it('deve listar ordens em andamento com sucesso', async () => {
      const ordensEmAndamento = [mockOrdemServico]
      const mockEmAndamentoDto = {
        id: 'test-id',
        status: StatusOrdemServico.EM_EXECUCAO,
        dataCriacao: new Date(),
      }
      const mockEmAndamentoDtoList = [mockEmAndamentoDto]

      listarOrdensEmAndamentoUseCase.execute.mockResolvedValue(ordensEmAndamento)
      ordemServicoEmAndamentoMapper.toDtoList.mockReturnValue(mockEmAndamentoDtoList)

      const result = await controller.listarOrdensEmAndamento()

      expect(listarOrdensEmAndamentoUseCase.execute).toHaveBeenCalledWith()
      expect(ordemServicoEmAndamentoMapper.toDtoList).toHaveBeenCalledWith(ordensEmAndamento)
      expect(result).toEqual(mockEmAndamentoDtoList)
    })

    it('deve retornar lista vazia quando não há ordens em andamento', async () => {
      listarOrdensEmAndamentoUseCase.execute.mockResolvedValue([])
      ordemServicoEmAndamentoMapper.toDtoList.mockReturnValue([])

      const result = await controller.listarOrdensEmAndamento()

      expect(result).toEqual([])
    })
  })

  describe('buscarOrdemServicoPorId', () => {
    it('deve buscar ordem de serviço por id', async () => {
      const id = 'test-id'

      buscarOrdemServicoUseCase.buscarPorId.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      const result = await controller.buscarOrdemServicoPorId(id)

      expect(buscarOrdemServicoUseCase.buscarPorId).toHaveBeenCalledWith(id)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockOrdemServico)
      expect(result).toEqual(mockOrdemServicoResponse)
    })
  })

  describe('excluirOrdemServico', () => {
    it('deve excluir ordem de serviço com sucesso', async () => {
      const id = 'test-id'

      excluirOrdemServicoUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.excluirOrdemServico(id)

      expect(excluirOrdemServicoUseCase.execute).toHaveBeenCalledWith(id)
      expect(result).toEqual({ message: 'Ordem de serviço excluída com sucesso' })
    })
  })

  describe('atualizarStatus', () => {
    it('deve atualizar status da ordem de serviço com sucesso', async () => {
      const id = 'test-id'
      const atualizarStatusDto = {
        status: StatusOrdemServico.EM_DIAGNOSTICO,
      }

      atualizarStatusOrdemServicoUseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      const result = await controller.atualizarStatus(id, atualizarStatusDto)

      expect(atualizarStatusOrdemServicoUseCase.execute).toHaveBeenCalledWith({
        ordemServicoId: id,
        novoStatus: atualizarStatusDto.status,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockOrdemServico)
      expect(result).toEqual(mockOrdemServicoResponse)
    })

    it('deve transicionar para AGUARDANDO_APROVACAO', async () => {
      const id = 'test-id'
      const atualizarStatusDto = {
        status: StatusOrdemServico.AGUARDANDO_APROVACAO,
      }

      const mockOrdemServicoAtualizada = {
        ...mockOrdemServico,
        status: { obterValor: () => StatusOrdemServico.AGUARDANDO_APROVACAO },
      }

      const mockResponseAtualizada = {
        ...mockOrdemServicoResponse,
        status: StatusOrdemServico.AGUARDANDO_APROVACAO,
      }

      atualizarStatusOrdemServicoUseCase.execute.mockResolvedValue(mockOrdemServicoAtualizada)
      responseMapper.toDto.mockReturnValue(mockResponseAtualizada)

      const result = await controller.atualizarStatus(id, atualizarStatusDto)

      expect(result.status).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
    })

    it('deve transicionar para FINALIZADA', async () => {
      const id = 'test-id'
      const atualizarStatusDto = {
        status: StatusOrdemServico.FINALIZADA,
      }

      atualizarStatusOrdemServicoUseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      await controller.atualizarStatus(id, atualizarStatusDto)

      expect(atualizarStatusOrdemServicoUseCase.execute).toHaveBeenCalledWith({
        ordemServicoId: id,
        novoStatus: StatusOrdemServico.FINALIZADA,
      })
    })
  })

  describe('aprovarOrcamento', () => {
    it('deve aprovar orçamento com sucesso', async () => {
      const id = 'test-id'
      const aprovarOrcamentoDto = {
        aprovado: true,
      }

      const mockOrdemServicoAprovada = {
        ...mockOrdemServico,
        status: { obterValor: () => StatusOrdemServico.EM_EXECUCAO },
      }

      const mockResponseAprovada = {
        ...mockOrdemServicoResponse,
        status: StatusOrdemServico.EM_EXECUCAO,
      }

      aprovarOrcamentoUseCase.execute.mockResolvedValue(mockOrdemServicoAprovada)
      responseMapper.toDto.mockReturnValue(mockResponseAprovada)

      const result = await controller.aprovarOrcamento(id, aprovarOrcamentoDto)

      expect(aprovarOrcamentoUseCase.execute).toHaveBeenCalledWith({
        ordemServicoId: id,
        aprovado: true,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockOrdemServicoAprovada)
      expect(result).toEqual(mockResponseAprovada)
      expect(result.status).toBe(StatusOrdemServico.EM_EXECUCAO)
    })

    it('deve rejeitar orçamento com sucesso (status → CANCELADA)', async () => {
      const id = 'test-id'
      const aprovarOrcamentoDto = {
        aprovado: false,
      }

      const mockOrdemServicoRejeitada = {
        ...mockOrdemServico,
        status: { obterValor: () => StatusOrdemServico.CANCELADA },
      }

      const mockResponseRejeitada = {
        ...mockOrdemServicoResponse,
        status: StatusOrdemServico.CANCELADA,
      }

      aprovarOrcamentoUseCase.execute.mockResolvedValue(mockOrdemServicoRejeitada)
      responseMapper.toDto.mockReturnValue(mockResponseRejeitada)

      const result = await controller.aprovarOrcamento(id, aprovarOrcamentoDto)

      expect(aprovarOrcamentoUseCase.execute).toHaveBeenCalledWith({
        ordemServicoId: id,
        aprovado: false,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockOrdemServicoRejeitada)
      expect(result).toEqual(mockResponseRejeitada)
      expect(result.status).toBe(StatusOrdemServico.CANCELADA)
    })

    it('deve chamar use case com parâmetros corretos', async () => {
      const id = 'ordem-123'
      const aprovarOrcamentoDto = {
        aprovado: true,
      }

      aprovarOrcamentoUseCase.execute.mockResolvedValue(mockOrdemServico)
      responseMapper.toDto.mockReturnValue(mockOrdemServicoResponse)

      await controller.aprovarOrcamento(id, aprovarOrcamentoDto)

      expect(aprovarOrcamentoUseCase.execute).toHaveBeenCalledTimes(1)
      expect(aprovarOrcamentoUseCase.execute).toHaveBeenCalledWith({
        ordemServicoId: 'ordem-123',
        aprovado: true,
      })
    })
  })
})
