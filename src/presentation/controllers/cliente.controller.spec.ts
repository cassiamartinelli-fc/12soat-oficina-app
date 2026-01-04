import { Test, TestingModule } from '@nestjs/testing'
import { ClienteController } from './cliente.controller'
import {
  CriarClienteUseCase,
  BuscarClienteUseCase,
  AtualizarClienteUseCase,
  ExcluirClienteUseCase,
} from '../../application/use-cases/cliente'
import { ClienteResponseMapper } from '../../application/mappers/cliente-response.mapper'

describe('ClienteController', () => {
  let controller: ClienteController
  let criarClienteUseCase: jest.Mocked<CriarClienteUseCase>
  let buscarClienteUseCase: jest.Mocked<BuscarClienteUseCase>
  let atualizarClienteUseCase: jest.Mocked<AtualizarClienteUseCase>
  let excluirClienteUseCase: jest.Mocked<ExcluirClienteUseCase>
  let responseMapper: jest.Mocked<ClienteResponseMapper>

  const mockCliente = {
    id: { obterValor: () => 'test-id' },
    nome: { obterValor: () => 'João Silva' },
    cpfCnpj: { obterValor: () => '11144477735' },
    telefone: { obterValor: () => '11999999999' },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any

  const mockClienteResponse = {
    id: 'test-id',
    nome: 'João Silva',
    cpfCnpj: '11144477735',
    telefone: '11999999999',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockCriarClienteUseCase = {
      execute: jest.fn(),
    }
    const mockBuscarClienteUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorCpfCnpj: jest.fn(),
    }
    const mockAtualizarClienteUseCase = {
      execute: jest.fn(),
    }
    const mockExcluirClienteUseCase = {
      execute: jest.fn(),
    }
    const mockResponseMapper = {
      toDto: jest.fn(),
      toDtoList: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        { provide: CriarClienteUseCase, useValue: mockCriarClienteUseCase },
        { provide: BuscarClienteUseCase, useValue: mockBuscarClienteUseCase },
        { provide: AtualizarClienteUseCase, useValue: mockAtualizarClienteUseCase },
        { provide: ExcluirClienteUseCase, useValue: mockExcluirClienteUseCase },
        { provide: ClienteResponseMapper, useValue: mockResponseMapper },
      ],
    }).compile()

    controller = module.get<ClienteController>(ClienteController)
    criarClienteUseCase = module.get(CriarClienteUseCase)
    buscarClienteUseCase = module.get(BuscarClienteUseCase)
    atualizarClienteUseCase = module.get(AtualizarClienteUseCase)
    excluirClienteUseCase = module.get(ExcluirClienteUseCase)
    responseMapper = module.get(ClienteResponseMapper)
  })

  it('deve estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('criarCliente', () => {
    it('deve criar um cliente com sucesso', async () => {
      const createDto = {
        nome: 'João Silva',
        cpfCnpj: '11144477735',
        telefone: '11999999999',
      }

      criarClienteUseCase.execute.mockResolvedValue(mockCliente)
      responseMapper.toDto.mockReturnValue(mockClienteResponse)

      const result = await controller.criarCliente(createDto)

      expect(criarClienteUseCase.execute).toHaveBeenCalledWith(createDto)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockCliente)
      expect(result).toEqual(mockClienteResponse)
    })
  })

  describe('listarClientes', () => {
    it('deve listar todos os clientes', async () => {
      const clientes = [mockCliente]
      const responses = [mockClienteResponse]

      buscarClienteUseCase.buscarTodos.mockResolvedValue(clientes)
      responseMapper.toDtoList.mockReturnValue(responses)

      const result = await controller.listarClientes()

      expect(buscarClienteUseCase.buscarTodos).toHaveBeenCalled()
      expect(responseMapper.toDtoList).toHaveBeenCalledWith(clientes)
      expect(result).toEqual(responses)
    })
  })

  describe('buscarClientePorId', () => {
    it('deve buscar cliente por id', async () => {
      const id = 'test-id'

      buscarClienteUseCase.buscarPorId.mockResolvedValue(mockCliente)
      responseMapper.toDto.mockReturnValue(mockClienteResponse)

      const result = await controller.buscarClientePorId(id)

      expect(buscarClienteUseCase.buscarPorId).toHaveBeenCalledWith(id)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockCliente)
      expect(result).toEqual(mockClienteResponse)
    })
  })

  describe('buscarClientePorCpfCnpj', () => {
    it('deve buscar cliente por cpf/cnpj', async () => {
      const cpfCnpj = '11144477735'

      buscarClienteUseCase.buscarPorCpfCnpj.mockResolvedValue(mockCliente)
      responseMapper.toDto.mockReturnValue(mockClienteResponse)

      const result = await controller.buscarClientePorCpfCnpj(cpfCnpj)

      expect(buscarClienteUseCase.buscarPorCpfCnpj).toHaveBeenCalledWith(cpfCnpj)
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockCliente)
      expect(result).toEqual(mockClienteResponse)
    })
  })

  describe('atualizarCliente', () => {
    it('deve atualizar cliente com sucesso', async () => {
      const id = 'test-id'
      const updateDto = {
        nome: 'João Silva Atualizado',
        cpfCnpj: '11144477735',
        telefone: '11888888888',
      }

      atualizarClienteUseCase.execute.mockResolvedValue(mockCliente)
      responseMapper.toDto.mockReturnValue(mockClienteResponse)

      const result = await controller.atualizarCliente(id, updateDto)

      expect(atualizarClienteUseCase.execute).toHaveBeenCalledWith({
        id,
        ...updateDto,
      })
      expect(responseMapper.toDto).toHaveBeenCalledWith(mockCliente)
      expect(result).toEqual(mockClienteResponse)
    })
  })

  describe('excluirCliente', () => {
    it('deve excluir cliente com sucesso', async () => {
      const id = 'test-id'

      excluirClienteUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.excluirCliente(id)

      expect(excluirClienteUseCase.execute).toHaveBeenCalledWith(id)
      expect(result).toEqual({ message: 'Cliente excluído com sucesso' })
    })
  })
})
