import { CriarPecaUseCase } from './criar-peca.use-case'
import { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { Peca } from '../../../domain/entities/peca.entity'

describe('CriarPecaUseCase', () => {
  let useCase: CriarPecaUseCase
  let mockRepository: jest.Mocked<IPecaRepository>

  beforeEach(() => {
    mockRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      excluir: jest.fn(),
    }

    useCase = new CriarPecaUseCase(mockRepository)
  })

  describe('execute', () => {
    it('deve criar uma peça com sucesso', async () => {
      const command = {
        nome: 'Filtro de Óleo',
        codigo: 'FOL001',
        preco: 45.9,
        quantidadeEstoque: 50,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(resultado).toBeInstanceOf(Peca)
      expect(resultado.nome.obterValor()).toBe('Filtro de Óleo')
      expect(resultado.codigo.obterValor()).toBe('FOL001')
      expect(resultado.preco.obterValor()).toBe(45.9)
      expect(resultado.estoque.obterQuantidade()).toBe(50)
      expect(mockRepository.salvar).toHaveBeenCalledWith(resultado)
    })

    it('deve criar peça sem código', async () => {
      const command = {
        nome: 'Pastilha de Freio',
        preco: 120.0,
        quantidadeEstoque: 20,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(resultado.nome.obterValor()).toBe('Pastilha de Freio')
      expect(resultado.preco.obterValor()).toBe(120.0)
      expect(resultado.estoque.obterQuantidade()).toBe(20)
    })

    it('deve chamar repositório para salvar', async () => {
      const command = {
        nome: 'Amortecedor',
        codigo: 'AMO001',
        preco: 300.0,
        quantidadeEstoque: 10,
      }

      mockRepository.salvar.mockResolvedValue(undefined)

      await useCase.execute(command)

      expect(mockRepository.salvar).toHaveBeenCalledTimes(1)
    })
  })
})
