import { Test, TestingModule } from '@nestjs/testing'
import { VeiculoController } from './veiculo.controller'
import {
  CriarVeiculoUseCase,
  BuscarVeiculoUseCase,
  AtualizarVeiculoUseCase,
  ExcluirVeiculoUseCase,
} from '../../application/use-cases/veiculo'
import { VeiculoResponseMapper } from '../../application/mappers/veiculo-response.mapper'

describe('VeiculoController', () => {
  let controller: VeiculoController
  let criarVeiculoUseCase: jest.Mocked<CriarVeiculoUseCase>
  let buscarVeiculoUseCase: jest.Mocked<BuscarVeiculoUseCase>
  let atualizarVeiculoUseCase: jest.Mocked<AtualizarVeiculoUseCase>
  let excluirVeiculoUseCase: jest.Mocked<ExcluirVeiculoUseCase>
  let responseMapper: jest.Mocked<VeiculoResponseMapper>

  const mockVeiculo = {
    id: { obterValor: () => 'test-id' },
    placa: { obterValor: () => 'ABC1234' },
    marca: { obterValor: () => 'Toyota' },
    modelo: { obterValor: () => 'Corolla' },
    ano: { obterValor: () => 2020 },
    clienteId: { obterValor: () => 'cliente-id' },
    obterDescricaoCompleta: () => 'Toyota Corolla 2020',
    isPlacaMercosul: () => false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any

  const mockVeiculoResponse = {
    id: 'test-id',
    placa: 'ABC1234',
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    clienteId: 'cliente-id',
    descricaoCompleta: 'Toyota Corolla 2020',
    placaMercosul: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockCriarVeiculoUseCase = {
      execute: jest.fn(),
    }
    const mockBuscarVeiculoUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorPlaca: jest.fn(),
      buscarPorClienteId: jest.fn(),
    }
    const mockAtualizarVeiculoUseCase = {
      execute: jest.fn(),
    }
    const mockExcluirVeiculoUseCase = {
      execute: jest.fn(),
    }
    const mockResponseMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeiculoController],
      providers: [
        { provide: CriarVeiculoUseCase, useValue: mockCriarVeiculoUseCase },
        { provide: BuscarVeiculoUseCase, useValue: mockBuscarVeiculoUseCase },
        { provide: AtualizarVeiculoUseCase, useValue: mockAtualizarVeiculoUseCase },
        { provide: ExcluirVeiculoUseCase, useValue: mockExcluirVeiculoUseCase },
        { provide: VeiculoResponseMapper, useValue: mockResponseMapper },
      ],
    }).compile()

    controller = module.get<VeiculoController>(VeiculoController)
    criarVeiculoUseCase = module.get(CriarVeiculoUseCase)
    buscarVeiculoUseCase = module.get(BuscarVeiculoUseCase)
    atualizarVeiculoUseCase = module.get(AtualizarVeiculoUseCase)
    excluirVeiculoUseCase = module.get(ExcluirVeiculoUseCase)
    responseMapper = module.get(VeiculoResponseMapper)
  })

  it('deve estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('criarVeiculo', () => {
    it('deve criar um veículo com sucesso', async () => {
      const createDto = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-id',
      }

      criarVeiculoUseCase.execute.mockResolvedValue(mockVeiculo)
      responseMapper.toDto.mockReturnValue(mockVeiculoResponse)

      const result = await controller.criarVeiculo(createDto)

      expect(criarVeiculoUseCase.execute).toHaveBeenCalledWith(createDto)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockVeiculo)
      expect(result).toEqual(mockVeiculoResponse)
    })
  })

  describe('listarVeiculos', () => {
    it('deve listar todos os veículos', async () => {
      const veiculos = [mockVeiculo]
      const responses = [mockVeiculoResponse]

      buscarVeiculoUseCase.buscarTodos.mockResolvedValue(veiculos)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarVeiculos()

      expect(buscarVeiculoUseCase.buscarTodos).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(veiculos)
      expect(result).toEqual(responses)
    })
  })

  describe('buscarVeiculoPorId', () => {
    it('deve buscar veículo por id', async () => {
      const id = 'test-id'

      buscarVeiculoUseCase.buscarPorId.mockResolvedValue(mockVeiculo)
      responseMapper.toDto.mockReturnValue(mockVeiculoResponse)

      const result = await controller.buscarVeiculoPorId(id)

      expect(buscarVeiculoUseCase.buscarPorId).toHaveBeenCalledWith(id)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockVeiculo)
      expect(result).toEqual(mockVeiculoResponse)
    })
  })

  describe('buscarVeiculoPorPlaca', () => {
    it('deve buscar veículo por placa', async () => {
      const placa = 'ABC1234'

      buscarVeiculoUseCase.buscarPorPlaca.mockResolvedValue(mockVeiculo)
      responseMapper.toDto.mockReturnValue(mockVeiculoResponse)

      const result = await controller.buscarVeiculoPorPlaca(placa)

      expect(buscarVeiculoUseCase.buscarPorPlaca).toHaveBeenCalledWith(placa)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockVeiculo)
      expect(result).toEqual(mockVeiculoResponse)
    })
  })

  describe('buscarVeiculosPorCliente', () => {
    it('deve buscar veículos por cliente', async () => {
      const clienteId = 'cliente-id'
      const veiculos = [mockVeiculo]
      const responses = [mockVeiculoResponse]

      buscarVeiculoUseCase.buscarPorClienteId.mockResolvedValue(veiculos)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.buscarVeiculosPorCliente(clienteId)

      expect(buscarVeiculoUseCase.buscarPorClienteId).toHaveBeenCalledWith(clienteId)
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(veiculos)
      expect(result).toEqual(responses)
    })
  })

  describe('atualizarVeiculo', () => {
    it('deve atualizar veículo com sucesso', async () => {
      const id = 'test-id'
      const updateDto = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla XEI',
        ano: 2021,
        clienteId: 'cliente-id',
      }

      atualizarVeiculoUseCase.execute.mockResolvedValue(mockVeiculo)
      responseMapper.toDto.mockReturnValue(mockVeiculoResponse)

      const result = await controller.atualizarVeiculo(id, updateDto)

      expect(atualizarVeiculoUseCase.execute).toHaveBeenCalledWith({
        id,
        ...updateDto,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockVeiculo)
      expect(result).toEqual(mockVeiculoResponse)
    })
  })

  describe('excluirVeiculo', () => {
    it('deve excluir veículo com sucesso', async () => {
      const id = 'test-id'

      excluirVeiculoUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.excluirVeiculo(id)

      expect(excluirVeiculoUseCase.execute).toHaveBeenCalledWith(id)
      expect(result).toEqual({ message: 'Veículo excluído com sucesso' })
    })
  })
})
