import { CriarClienteUseCase } from './criar-cliente.use-case'
import { IClienteRepository } from '../../../domain/repositories/cliente.repository.interface'
import { Cliente } from '../../../domain/entities/cliente.entity'
import { CpfCnpj } from '../../../domain/value-objects/cpf-cnpj.vo'
import { BusinessRuleException } from '../../../shared/exceptions/domain.exception'

describe('CriarClienteUseCase', () => {
  let useCase: CriarClienteUseCase
  let mockRepository: jest.Mocked<IClienteRepository>

  beforeEach(() => {
    mockRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorCpfCnpj: jest.fn(),
      buscarTodos: jest.fn(),
      excluir: jest.fn(),
    }

    useCase = new CriarClienteUseCase(mockRepository)
  })

  describe('execute', () => {
    it('deve criar cliente com sucesso', async () => {
      // Arrange
      const command = {
        nome: 'João Silva',
        cpfCnpj: '50982686056',
        telefone: '11999887766',
      }

      mockRepository.buscarPorCpfCnpj.mockResolvedValue(null)
      mockRepository.salvar.mockResolvedValue()

      // Act
      const resultado = await useCase.execute(command)

      // Assert
      expect(resultado).toBeInstanceOf(Cliente)
      expect(resultado.nome.obterValor()).toBe(command.nome)
      expect(resultado.cpfCnpj.obterValor()).toBe(command.cpfCnpj)
      expect(resultado.telefone?.obterValor()).toBe(command.telefone)

      expect(mockRepository.buscarPorCpfCnpj).toHaveBeenCalledWith(expect.any(CpfCnpj))
      expect(mockRepository.salvar).toHaveBeenCalledWith(resultado)
    })

    it('deve criar cliente sem telefone', async () => {
      // Arrange
      const command = {
        nome: 'João Silva',
        cpfCnpj: '50982686056',
      }

      mockRepository.buscarPorCpfCnpj.mockResolvedValue(null)
      mockRepository.salvar.mockResolvedValue()

      // Act
      const resultado = await useCase.execute(command)

      // Assert
      expect(resultado.telefone).toBeUndefined()
      expect(resultado.possuiTelefone()).toBe(false)
    })

    it('deve rejeitar CPF/CNPJ já existente', async () => {
      // Arrange
      const command = {
        nome: 'João Silva',
        cpfCnpj: '50982686056',
      }

      const clienteExistente = Cliente.criar({
        nome: 'Outro Cliente',
        cpfCnpj: '50982686056',
      })

      mockRepository.buscarPorCpfCnpj.mockResolvedValue(clienteExistente)

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(BusinessRuleException)

      expect(mockRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve rejeitar dados inválidos', async () => {
      // Arrange
      const command = {
        nome: 'A', // Nome muito curto
        cpfCnpj: '50982686056',
      }

      mockRepository.buscarPorCpfCnpj.mockResolvedValue(null)

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Nome deve ter pelo menos 2 caracteres')

      expect(mockRepository.salvar).not.toHaveBeenCalled()
    })
  })
})
