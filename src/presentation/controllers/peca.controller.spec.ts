import { Test, TestingModule } from '@nestjs/testing'
import { PecaController } from './peca.controller'
import {
  CriarPecaUseCase,
  BuscarPecaUseCase,
  AtualizarPecaUseCase,
  ExcluirPecaUseCase,
} from '../../application/use-cases/peca'
import { PecaResponseMapper } from '../../application/mappers/peca-response.mapper'

describe('PecaController', () => {
  let controller: PecaController
  let criarPecaUseCase: jest.Mocked<CriarPecaUseCase>
  let buscarPecaUseCase: jest.Mocked<BuscarPecaUseCase>
  let atualizarPecaUseCase: jest.Mocked<AtualizarPecaUseCase>
  let excluirPecaUseCase: jest.Mocked<ExcluirPecaUseCase>
  let responseMapper: jest.Mocked<PecaResponseMapper>

  const mockPeca = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'Filtro de Óleo' },
    codigo: { obterValor: () => 'FOL001' },
    preco: { obterValor: () => 45.9 },
    estoque: { obterQuantidade: () => 50 },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any

  const mockPecaResponse = {
    id: 'test-id',
    nome: 'Filtro de Óleo',
    codigo: 'FOL001',
    preco: 45.9,
    quantidadeEstoque: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockCriarPecaUseCase = {
      execute: jest.fn(),
    }
    const mockBuscarPecaUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
    }
    const mockAtualizarPecaUseCase = {
      execute: jest.fn(),
    }
    const mockExcluirPecaUseCase = {
      execute: jest.fn(),
    }
    const mockResponseMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PecaController],
      providers: [
        { provide: CriarPecaUseCase, useValue: mockCriarPecaUseCase },
        { provide: BuscarPecaUseCase, useValue: mockBuscarPecaUseCase },
        { provide: AtualizarPecaUseCase, useValue: mockAtualizarPecaUseCase },
        { provide: ExcluirPecaUseCase, useValue: mockExcluirPecaUseCase },
        { provide: PecaResponseMapper, useValue: mockResponseMapper },
      ],
    }).compile()

    controller = module.get<PecaController>(PecaController)
    criarPecaUseCase = module.get(CriarPecaUseCase)
    buscarPecaUseCase = module.get(BuscarPecaUseCase)
    atualizarPecaUseCase = module.get(AtualizarPecaUseCase)
    excluirPecaUseCase = module.get(ExcluirPecaUseCase)
    responseMapper = module.get(PecaResponseMapper)
  })

  it('deve estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('criarPeca', () => {
    it('deve criar uma peça com sucesso', async () => {
      const createDto = {
        nome: 'Filtro de Óleo',
        codigo: 'FOL001',
        preco: 45.9,
        quantidadeEstoque: 50,
      }

      criarPecaUseCase.execute.mockResolvedValue(mockPeca)
      responseMapper.toDto.mockReturnValue(mockPecaResponse)

      const result = await controller.criarPeca(createDto)

      expect(criarPecaUseCase.execute).toHaveBeenCalledWith(createDto)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockPeca)
      expect(result).toEqual(mockPecaResponse)
    })
  })

  describe('listarPecas', () => {
    it('deve listar todas as peças', async () => {
      const pecas = [mockPeca]
      const responses = [mockPecaResponse]

      buscarPecaUseCase.buscarTodos.mockResolvedValue(pecas)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarPecas()

      expect(buscarPecaUseCase.buscarTodos).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(pecas)
      expect(result).toEqual(responses)
    })
  })

  describe('buscarPecaPorId', () => {
    it('deve buscar peça por id', async () => {
      const id = 'test-id'

      buscarPecaUseCase.buscarPorId.mockResolvedValue(mockPeca)
      responseMapper.toDto.mockReturnValue(mockPecaResponse)

      const result = await controller.buscarPecaPorId(id)

      expect(buscarPecaUseCase.buscarPorId).toHaveBeenCalledWith(id)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockPeca)
      expect(result).toEqual(mockPecaResponse)
    })
  })

  describe('atualizarPeca', () => {
    it('deve atualizar peça com sucesso', async () => {
      const id = 'test-id'
      const updateDto = {
        nome: 'Filtro de Óleo Premium',
        codigo: 'FOL001P',
        preco: 65.9,
        quantidadeEstoque: 30,
      }

      atualizarPecaUseCase.execute.mockResolvedValue(mockPeca)
      responseMapper.toDto.mockReturnValue(mockPecaResponse)

      const result = await controller.atualizarPeca(id, updateDto)

      expect(atualizarPecaUseCase.execute).toHaveBeenCalledWith({
        id,
        ...updateDto,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockPeca)
      expect(result).toEqual(mockPecaResponse)
    })
  })

  describe('excluirPeca', () => {
    it('deve excluir peça com sucesso', async () => {
      const id = 'test-id'

      excluirPecaUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.excluirPeca(id)

      expect(excluirPecaUseCase.execute).toHaveBeenCalledWith(id)
      expect(result).toEqual({ message: 'Peça excluída com sucesso' })
    })
  })
})
