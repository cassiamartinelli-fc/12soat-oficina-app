import { Test, TestingModule } from '@nestjs/testing'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import type { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { BusinessRuleException, EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { OrdemServicoId } from '../../../shared/types/entity-id'
import { AprovarOrcamentoCommand, AprovarOrcamentoUseCase } from './aprovar-orcamento.use-case'

describe('AprovarOrcamentoUseCase', () => {
  let useCase: AprovarOrcamentoUseCase
  let ordemServicoRepository: jest.Mocked<IOrdemServicoRepository>
  let mockOrdemServico: jest.Mocked<OrdemServico>

  beforeEach(async () => {
    const mockRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorClienteId: jest.fn(),
      excluir: jest.fn(),
      adicionarItemServico: jest.fn(),
      adicionarItemPeca: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [AprovarOrcamentoUseCase, { provide: ORDEM_SERVICO_REPOSITORY_TOKEN, useValue: mockRepository }],
    }).compile()

    useCase = module.get<AprovarOrcamentoUseCase>(AprovarOrcamentoUseCase)
    ordemServicoRepository = module.get(ORDEM_SERVICO_REPOSITORY_TOKEN)

    // Mock da OrdemServico
    mockOrdemServico = {
      id: { obterValor: () => 'ordem-id' },
      status: {
        isAguardandoAprovacao: jest.fn(),
      },
      aprovarOrcamento: jest.fn(),
      rejeitarOrcamento: jest.fn(),
    } as any
  })

  describe('execute', () => {
    it('deve aprovar orçamento com sucesso', async () => {
      const command: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-id',
        aprovado: true,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(true)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)
      ordemServicoRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledWith(
        expect.objectContaining({
          obterValor: expect.any(Function),
        }),
      )
      expect(resultado).toBe(mockOrdemServico)
      expect(mockOrdemServico.aprovarOrcamento).toHaveBeenCalledTimes(1)
      expect(mockOrdemServico.rejeitarOrcamento).not.toHaveBeenCalled()
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(mockOrdemServico)
    })

    it('deve rejeitar orçamento com sucesso', async () => {
      const command: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-id',
        aprovado: false,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(true)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)
      ordemServicoRepository.salvar.mockResolvedValue(undefined)

      const resultado = await useCase.execute(command)

      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledWith(
        expect.objectContaining({
          obterValor: expect.any(Function),
        }),
      )
      expect(resultado).toBe(mockOrdemServico)
      expect(mockOrdemServico.rejeitarOrcamento).toHaveBeenCalledTimes(1)
      expect(mockOrdemServico.aprovarOrcamento).not.toHaveBeenCalled()
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(mockOrdemServico)
    })

    it('deve lançar EntityNotFoundException quando ordem não existe', async () => {
      const command: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-inexistente',
        aprovado: true,
      }

      ordemServicoRepository.buscarPorId.mockResolvedValue(null)

      await expect(useCase.execute(command)).rejects.toThrow(
        new EntityNotFoundException('OrdemServico', 'ordem-inexistente'),
      )
      expect(ordemServicoRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve lançar BusinessRuleException quando ordem não está aguardando aprovação', async () => {
      const command: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-id',
        aprovado: true,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(false)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)

      await expect(useCase.execute(command)).rejects.toThrow(
        new BusinessRuleException(
          'Apenas ordens de serviço com status AGUARDANDO_APROVACAO podem ser aprovadas ou rejeitadas',
        ),
      )
      expect(mockOrdemServico.aprovarOrcamento).not.toHaveBeenCalled()
      expect(mockOrdemServico.rejeitarOrcamento).not.toHaveBeenCalled()
      expect(ordemServicoRepository.salvar).not.toHaveBeenCalled()
    })

    it('deve criar OrdemServicoId corretamente a partir do string ID', async () => {
      const command: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-específica',
        aprovado: true,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(true)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)
      ordemServicoRepository.salvar.mockResolvedValue(undefined)

      // Spy no método OrdemServicoId.criar
      const createSpy = jest.spyOn(OrdemServicoId, 'criar')

      await useCase.execute(command)

      expect(createSpy).toHaveBeenCalledWith('ordem-específica')
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledTimes(1)

      createSpy.mockRestore()
    })

    it('deve preservar a lógica de aprovação e rejeição independentemente', async () => {
      // Teste aprovação
      const commandAprovacao: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-id',
        aprovado: true,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(true)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)
      ordemServicoRepository.salvar.mockResolvedValue(undefined)

      await useCase.execute(commandAprovacao)

      expect(mockOrdemServico.aprovarOrcamento).toHaveBeenCalledTimes(1)
      expect(mockOrdemServico.rejeitarOrcamento).not.toHaveBeenCalled()

      // Reset mocks
      jest.clearAllMocks()

      // Teste rejeição
      const commandRejeicao: AprovarOrcamentoCommand = {
        ordemServicoId: 'ordem-id',
        aprovado: false,
      }

      mockOrdemServico.status.isAguardandoAprovacao.mockReturnValue(true)
      ordemServicoRepository.buscarPorId.mockResolvedValue(mockOrdemServico)
      ordemServicoRepository.salvar.mockResolvedValue(undefined)

      await useCase.execute(commandRejeicao)

      expect(mockOrdemServico.rejeitarOrcamento).toHaveBeenCalledTimes(1)
      expect(mockOrdemServico.aprovarOrcamento).not.toHaveBeenCalled()
    })
  })
})
