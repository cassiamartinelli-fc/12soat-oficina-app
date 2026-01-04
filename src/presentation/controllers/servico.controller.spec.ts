import { Test, TestingModule } from '@nestjs/testing'
import { ServicoController } from './servico.controller'
import {
  CriarServicoUseCase,
  BuscarServicoUseCase,
  AtualizarServicoUseCase,
  ExcluirServicoUseCase,
} from '../../application/use-cases/servico'
import { ServicoResponseMapper } from '../../application/mappers/servico-response.mapper'

describe('ServicoController', () => {
  let controller: ServicoController
  let criarServicoUseCase: jest.Mocked<CriarServicoUseCase>
  let buscarServicoUseCase: jest.Mocked<BuscarServicoUseCase>
  let atualizarServicoUseCase: jest.Mocked<AtualizarServicoUseCase>
  let excluirServicoUseCase: jest.Mocked<ExcluirServicoUseCase>
  let responseMapper: jest.Mocked<ServicoResponseMapper>

  const mockServico = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'Troca de Óleo' },
    preco: { obterValor: () => 85.5 },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any

  const mockServicoResponse = {
    id: 'test-id',
    nome: 'Troca de Óleo',
    preco: 85.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockCriarServicoUseCase = {
      execute: jest.fn(),
    }
    const mockBuscarServicoUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
    }
    const mockAtualizarServicoUseCase = {
      execute: jest.fn(),
    }
    const mockExcluirServicoUseCase = {
      execute: jest.fn(),
    }
    const mockResponseMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicoController],
      providers: [
        { provide: CriarServicoUseCase, useValue: mockCriarServicoUseCase },
        { provide: BuscarServicoUseCase, useValue: mockBuscarServicoUseCase },
        { provide: AtualizarServicoUseCase, useValue: mockAtualizarServicoUseCase },
        { provide: ExcluirServicoUseCase, useValue: mockExcluirServicoUseCase },
        { provide: ServicoResponseMapper, useValue: mockResponseMapper },
      ],
    }).compile()

    controller = module.get<ServicoController>(ServicoController)
    criarServicoUseCase = module.get(CriarServicoUseCase)
    buscarServicoUseCase = module.get(BuscarServicoUseCase)
    atualizarServicoUseCase = module.get(AtualizarServicoUseCase)
    excluirServicoUseCase = module.get(ExcluirServicoUseCase)
    responseMapper = module.get(ServicoResponseMapper)
  })

  it('deve estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('criarServico', () => {
    it('deve criar um serviço com sucesso', async () => {
      const createDto = {
        nome: 'Troca de Óleo',
        preco: 85.5,
      }

      criarServicoUseCase.execute.mockResolvedValue(mockServico)
      responseMapper.toDto.mockReturnValue(mockServicoResponse)

      const result = await controller.criarServico(createDto)

      expect(criarServicoUseCase.execute).toHaveBeenCalledWith(createDto)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockServico)
      expect(result).toEqual(mockServicoResponse)
    })
  })

  describe('listarServicos', () => {
    it('deve listar todos os serviços', async () => {
      const servicos = [mockServico]
      const responses = [mockServicoResponse]

      buscarServicoUseCase.buscarTodos.mockResolvedValue(servicos)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarServicos()

      expect(buscarServicoUseCase.buscarTodos).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(servicos)
      expect(result).toEqual(responses)
    })
  })

  describe('buscarServicoPorId', () => {
    it('deve buscar serviço por id', async () => {
      const id = 'test-id'

      buscarServicoUseCase.buscarPorId.mockResolvedValue(mockServico)
      responseMapper.toDto.mockReturnValue(mockServicoResponse)

      const result = await controller.buscarServicoPorId(id)

      expect(buscarServicoUseCase.buscarPorId).toHaveBeenCalledWith(id)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockServico)
      expect(result).toEqual(mockServicoResponse)
    })
  })

  describe('atualizarServico', () => {
    it('deve atualizar serviço com sucesso', async () => {
      const id = 'test-id'
      const updateDto = {
        nome: 'Troca de Óleo Completa',
        preco: 120.0,
      }

      atualizarServicoUseCase.execute.mockResolvedValue(mockServico)
      responseMapper.toDto.mockReturnValue(mockServicoResponse)

      const result = await controller.atualizarServico(id, updateDto)

      expect(atualizarServicoUseCase.execute).toHaveBeenCalledWith({
        id,
        ...updateDto,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockServico)
      expect(result).toEqual(mockServicoResponse)
    })
  })

  describe('excluirServico', () => {
    it('deve excluir serviço com sucesso', async () => {
      const id = 'test-id'

      excluirServicoUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.excluirServico(id)

      expect(excluirServicoUseCase.execute).toHaveBeenCalledWith(id)
      expect(result).toEqual({ message: 'Serviço excluído com sucesso' })
    })
  })
})
