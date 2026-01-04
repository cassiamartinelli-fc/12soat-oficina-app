import { CriarServicoUseCase } from './criar-servico.use-case'
import { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { Servico } from '../../../domain/entities/servico.entity'

describe('CriarServicoUseCase', () => {
  let useCase: CriarServicoUseCase
  let mockRepository: jest.Mocked<IServicoRepository>

  beforeEach(() => {
    mockRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      excluir: jest.fn(),
    }

    useCase = new CriarServicoUseCase(mockRepository)
  })

  describe('execute', () => {
    it('deve criar um serviço com sucesso', async () => {
      const command = {
        nome: 'Troca de Óleo',
        preco: 50.0,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(resultado).toBeInstanceOf(Servico)
      expect(resultado.nome.obterValor()).toBe('Troca de Óleo')
      expect(resultado.preco.obterValor()).toBe(50.0)
      expect(mockRepository.salvar).toHaveBeenCalledWith(resultado)
    })

    it('deve criar serviço com nome válido', async () => {
      const command = {
        nome: 'Revisão Completa',
        preco: 200.0,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(resultado.nome.obterValor()).toBe('Revisão Completa')
      expect(resultado.preco.obterValor()).toBe(200.0)
    })

    it('deve chamar repositório para salvar', async () => {
      const command = {
        nome: 'Alinhamento',
        preco: 80.0,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      await useCase.execute(command)

      expect(mockRepository.salvar).toHaveBeenCalledTimes(1)
    })
  })
})
