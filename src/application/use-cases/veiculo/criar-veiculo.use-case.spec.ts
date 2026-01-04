import { Veiculo } from '../../../domain/entities/veiculo.entity'
import { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { IVeiculoRepository } from '../../../domain/repositories/veiculo.repository.interface'
import { BusinessRuleException, EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { CriarVeiculoUseCase } from './criar-veiculo.use-case'

describe('CriarVeiculoUseCase', () => {
  let useCase: CriarVeiculoUseCase
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>
  let mockClienteRepository: jest.Mocked<IClienteRepository>

  const mockCliente = {
    id: { obterValor: () => 'cliente-id' },
    nome: { obterValor: () => 'João Silva' },
    cpfCnpj: { obterValor: () => '11144477735' },
    telefone: { obterValor: () => '11999887766' },
  } as any

  beforeEach(() => {
    mockVeiculoRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorPlaca: jest.fn(),
      buscarPorClienteId: jest.fn(),
      excluir: jest.fn(),
    }

    mockClienteRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorCpfCnpj: jest.fn(),
      excluir: jest.fn(),
    }

    useCase = new CriarVeiculoUseCase(mockVeiculoRepository, mockClienteRepository)
  })

  describe('execute', () => {
    it('deve criar um veículo com sucesso', async () => {
      const command = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-id',
      }

      mockClienteRepository.buscarPorId.mockResolvedValue(mockCliente)
      mockVeiculoRepository.buscarPorPlaca.mockResolvedValue(null)
      mockVeiculoRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(resultado).toBeInstanceOf(Veiculo)
      expect(resultado.placa.obterValor()).toBe('ABC1234')
      expect(resultado.marca.obterValor()).toBe('TOYOTA')
      expect(resultado.modelo.obterValor()).toBe('Corolla')
      expect(resultado.ano.obterValor()).toBe(2020)
      expect(resultado.clienteId.obterValor()).toBe('cliente-id')
      expect(mockVeiculoRepository.salvar).toHaveBeenCalledWith(resultado)
    })

    it('deve lançar erro se cliente não existir', async () => {
      const command = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-inexistente',
      }

      mockClienteRepository.buscarPorId.mockResolvedValue(null)

      await expect(useCase.execute(command)).rejects.toThrow(EntityNotFoundException)
      expect(mockVeiculoRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve lançar erro se placa já existir', async () => {
      const command = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-id',
      }

      const mockVeiculoExistente = {
        id: { obterValor: () => 'veiculo-id' },
        placa: { obterValor: () => 'ABC1234' },
      } as any

      mockClienteRepository.buscarPorId.mockResolvedValue(mockCliente)
      mockVeiculoRepository.buscarPorPlaca.mockResolvedValue(mockVeiculoExistente)

      await expect(useCase.execute(command)).rejects.toThrow(BusinessRuleException)
      expect(mockVeiculoRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve validar cliente antes de verificar placa', async () => {
      const command = {
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        clienteId: 'cliente-inexistente',
      }

      mockClienteRepository.buscarPorId.mockResolvedValue(null)

      await expect(useCase.execute(command)).rejects.toThrow(EntityNotFoundException)
      expect(mockVeiculoRepository.buscarPorPlaca).not.toHaveBeenCalled()
    })
  })
})
