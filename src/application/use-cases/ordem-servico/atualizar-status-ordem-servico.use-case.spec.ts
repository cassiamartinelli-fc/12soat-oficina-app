import { Test, TestingModule } from '@nestjs/testing'
import {
  AtualizarStatusOrdemServicoUseCase,
  AtualizarStatusOrdemServicoCommand,
} from './atualizar-status-ordem-servico.use-case'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { OrdemServicoId } from '../../../shared/types/entity-id'

describe('AtualizarStatusOrdemServicoUseCase', () => {
  let useCase: AtualizarStatusOrdemServicoUseCase
  let ordemServicoRepository: jest.Mocked<IOrdemServicoRepository>

  beforeEach(async () => {
    const mockRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorClienteId: jest.fn(),
      excluir: jest.fn(),
      adicionarItemServico: jest.fn(),
      adicionarItemPeca: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarStatusOrdemServicoUseCase,
        {
          provide: ORDEM_SERVICO_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<AtualizarStatusOrdemServicoUseCase>(AtualizarStatusOrdemServicoUseCase)
    ordemServicoRepository = module.get(ORDEM_SERVICO_REPOSITORY_TOKEN)
  })

  describe('execute', () => {
    it('deve atualizar o status da ordem de serviço com sucesso', async () => {
      // Arrange
      const ordemServicoMock = {
        id: { obterValor: () => '123' },
        status: { obterValor: () => StatusOrdemServico.RECEBIDA },
        atualizarStatusManualmente: jest.fn(),
      } as unknown as OrdemServico

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)
      ordemServicoRepository.salvar.mockResolvedValue(ordemServicoMock)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: '123',
        novoStatus: StatusOrdemServico.EM_EXECUCAO,
      }

      // Act
      const result = await useCase.execute(command)

      // Assert
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledTimes(1)
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledWith(
        expect.objectContaining({
          obterValor: expect.any(Function),
        }),
      )
      expect(ordemServicoMock.atualizarStatusManualmente).toHaveBeenCalledWith(StatusOrdemServico.EM_EXECUCAO)
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(ordemServicoMock)
      expect(result).toBe(ordemServicoMock)
    })

    it('deve lançar EntityNotFoundException se a ordem de serviço não existir', async () => {
      // Arrange
      ordemServicoRepository.buscarPorId.mockResolvedValue(null)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: '999',
        novoStatus: StatusOrdemServico.FINALIZADA,
      }

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(new EntityNotFoundException('OrdemServico', '999'))
      expect(ordemServicoRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve criar OrdemServicoId corretamente a partir do string ID', async () => {
      // Arrange
      const ordemServicoMock = {
        id: { obterValor: () => 'ordem-teste' },
        status: { obterValor: () => StatusOrdemServico.RECEBIDA },
        atualizarStatusManualmente: jest.fn(),
      } as unknown as OrdemServico

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)
      ordemServicoRepository.salvar.mockResolvedValue(ordemServicoMock)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: 'ordem-teste',
        novoStatus: StatusOrdemServico.EM_DIAGNOSTICO,
      }

      // Spy no método OrdemServicoId.criar
      const createSpy = jest.spyOn(OrdemServicoId, 'criar')

      // Act
      await useCase.execute(command)

      // Assert
      expect(createSpy).toHaveBeenCalledWith('ordem-teste')
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledTimes(1)

      createSpy.mockRestore()
    })

    it('deve permitir transições válidas de status', async () => {
      // Arrange
      const ordemServicoMock = {
        id: { obterValor: () => 'ordem-id' },
        status: { obterValor: () => StatusOrdemServico.EM_EXECUCAO },
        atualizarStatusManualmente: jest.fn(),
      } as unknown as OrdemServico

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)
      ordemServicoRepository.salvar.mockResolvedValue(ordemServicoMock)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: 'ordem-id',
        novoStatus: StatusOrdemServico.FINALIZADA,
      }

      // Act
      const result = await useCase.execute(command)

      // Assert
      expect(ordemServicoMock.atualizarStatusManualmente).toHaveBeenCalledWith(StatusOrdemServico.FINALIZADA)
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(ordemServicoMock)
      expect(result).toBe(ordemServicoMock)
    })

    it('deve delegar validação de transição para o domínio', async () => {
      // Arrange
      const ordemServicoMock = {
        id: { obterValor: () => 'ordem-id' },
        status: { obterValor: () => StatusOrdemServico.RECEBIDA },
        atualizarStatusManualmente: jest.fn(),
      } as unknown as OrdemServico

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: 'ordem-id',
        novoStatus: StatusOrdemServico.CANCELADA,
      }

      // Act
      await useCase.execute(command)

      // Assert - o use case não valida a transição, delega ao domínio
      expect(ordemServicoMock.atualizarStatusManualmente).toHaveBeenCalledWith(StatusOrdemServico.CANCELADA)
    })

    it('deve testar todos os status válidos', async () => {
      const statusList = [
        StatusOrdemServico.RECEBIDA,
        StatusOrdemServico.EM_DIAGNOSTICO,
        StatusOrdemServico.AGUARDANDO_APROVACAO,
        StatusOrdemServico.EM_EXECUCAO,
        StatusOrdemServico.FINALIZADA,
        StatusOrdemServico.CANCELADA,
        StatusOrdemServico.ENTREGUE,
      ]

      for (const status of statusList) {
        // Arrange
        const ordemServicoMock = {
          id: { obterValor: () => 'ordem-id' },
          status: { obterValor: () => StatusOrdemServico.RECEBIDA },
          atualizarStatusManualmente: jest.fn(),
        } as unknown as OrdemServico

        ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)
        ordemServicoRepository.salvar.mockResolvedValue(ordemServicoMock)

        const command: AtualizarStatusOrdemServicoCommand = {
          ordemServicoId: 'ordem-id',
          novoStatus: status,
        }

        // Act
        await useCase.execute(command)

        // Assert
        expect(ordemServicoMock.atualizarStatusManualmente).toHaveBeenCalledWith(status)

        // Reset mocks para próxima iteração
        jest.clearAllMocks()
      }
    })

    it('deve retornar a ordem de serviço atualizada', async () => {
      // Arrange
      const ordemServicoMock = {
        id: { obterValor: () => 'ordem-id' },
        status: { obterValor: () => StatusOrdemServico.AGUARDANDO_APROVACAO },
        atualizarStatusManualmente: jest.fn(),
      } as unknown as OrdemServico

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemServicoMock)
      ordemServicoRepository.salvar.mockResolvedValue(ordemServicoMock)

      const command: AtualizarStatusOrdemServicoCommand = {
        ordemServicoId: 'ordem-id',
        novoStatus: StatusOrdemServico.EM_EXECUCAO,
      }

      // Act
      const result = await useCase.execute(command)

      // Assert
      expect(result).toBe(ordemServicoMock)
      expect(result).toEqual(ordemServicoMock)
    })
  })
})
