import { Test, TestingModule } from '@nestjs/testing'
import { ListarOrdensEmAndamentoUseCase } from './listar-ordens-em-andamento.use-case'
import { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from '../../../infrastructure/ddd.module'
import { OrdemServico, OrdemServicoProps } from '../../../domain/entities/ordem-servico.entity'
import { StatusOrdemServico, StatusOrdemServicoVO } from '../../../domain/value-objects/status-ordem-servico.vo'
import { OrdemServicoId } from '../../../shared/types/entity-id'
import { Preco } from '../../../domain/value-objects/preco.vo'
import { PeriodoExecucao } from '../../../domain/value-objects/periodo-execucao.vo'

describe('ListarOrdensEmAndamentoUseCase', () => {
  let useCase: ListarOrdensEmAndamentoUseCase
  let repository: jest.Mocked<IOrdemServicoRepository>

  const createMockOrdemServico = (id: string, status: StatusOrdemServico, dataCriacao: Date): OrdemServico => {
    const props: OrdemServicoProps = {
      id: OrdemServicoId.criar(id),
      status: StatusOrdemServicoVO.reconstituir(status),
      valorTotal: Preco.zero(),
      periodoExecucao: PeriodoExecucao.criar(),
      createdAt: dataCriacao,
      updatedAt: dataCriacao,
    }
    return OrdemServico.reconstituir(props)
  }

  beforeEach(async () => {
    const mockRepository = {
      buscarOrdensEmAndamento: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarOrdensEmAndamentoUseCase,
        {
          provide: ORDEM_SERVICO_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<ListarOrdensEmAndamentoUseCase>(ListarOrdensEmAndamentoUseCase)
    repository = module.get(ORDEM_SERVICO_REPOSITORY_TOKEN)
  })

  describe('execute', () => {
    it('deve retornar ordens em andamento ordenadas por prioridade e data', async () => {
      const now = new Date()
      const ontemMeiaNoite = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const hoje = new Date(now.getTime() - 2 * 60 * 60 * 1000)

      const ordensServico = [
        createMockOrdemServico('1', StatusOrdemServico.RECEBIDA, ontemMeiaNoite),
        createMockOrdemServico('2', StatusOrdemServico.EM_EXECUCAO, hoje),
        createMockOrdemServico('3', StatusOrdemServico.AGUARDANDO_APROVACAO, ontemMeiaNoite),
        createMockOrdemServico('4', StatusOrdemServico.EM_DIAGNOSTICO, hoje),
        createMockOrdemServico('5', StatusOrdemServico.RECEBIDA, hoje),
      ]

      repository.buscarOrdensEmAndamento.mockResolvedValue(ordensServico)

      const resultado = await useCase.execute()

      expect(repository.buscarOrdensEmAndamento).toHaveBeenCalledTimes(1)
      expect(resultado).toHaveLength(5)

      // Verificar ordenação: primeiro por prioridade, depois por data
      expect(resultado[0].id.obterValor()).toBe('2') // EM_EXECUCAO, hoje
      expect(resultado[1].id.obterValor()).toBe('3') // AGUARDANDO_APROVACAO, ontem
      expect(resultado[2].id.obterValor()).toBe('4') // EM_DIAGNOSTICO, hoje
      expect(resultado[3].id.obterValor()).toBe('1') // RECEBIDA, ontem (mais antiga)
      expect(resultado[4].id.obterValor()).toBe('5') // RECEBIDA, hoje
    })

    it('deve retornar lista vazia quando não há ordens em andamento', async () => {
      repository.buscarOrdensEmAndamento.mockResolvedValue([])

      const resultado = await useCase.execute()

      expect(repository.buscarOrdensEmAndamento).toHaveBeenCalledTimes(1)
      expect(resultado).toEqual([])
    })

    it('deve ordenar corretamente ordens com mesmo status por data', async () => {
      const base = new Date('2025-01-15T10:00:00Z')
      const ordem1 = createMockOrdemServico('1', StatusOrdemServico.EM_EXECUCAO, new Date(base.getTime() + 60000)) // +1 min
      const ordem2 = createMockOrdemServico('2', StatusOrdemServico.EM_EXECUCAO, base) // base
      const ordem3 = createMockOrdemServico('3', StatusOrdemServico.EM_EXECUCAO, new Date(base.getTime() + 120000)) // +2 min

      repository.buscarOrdensEmAndamento.mockResolvedValue([ordem1, ordem2, ordem3])

      const resultado = await useCase.execute()

      // Deve ordenar por data crescente (mais antigas primeiro)
      expect(resultado[0].id.obterValor()).toBe('2') // base
      expect(resultado[1].id.obterValor()).toBe('1') // +1 min
      expect(resultado[2].id.obterValor()).toBe('3') // +2 min
    })

    it('deve preservar ordem do repository quando já está correta', async () => {
      const base = new Date('2025-01-15T10:00:00Z')
      const ordensJaOrdenadas = [
        createMockOrdemServico('1', StatusOrdemServico.EM_EXECUCAO, base),
        createMockOrdemServico('2', StatusOrdemServico.AGUARDANDO_APROVACAO, base),
        createMockOrdemServico('3', StatusOrdemServico.EM_DIAGNOSTICO, base),
        createMockOrdemServico('4', StatusOrdemServico.RECEBIDA, base),
      ]

      repository.buscarOrdensEmAndamento.mockResolvedValue(ordensJaOrdenadas)

      const resultado = await useCase.execute()

      expect(resultado.map((os) => os.id.obterValor())).toEqual(['1', '2', '3', '4'])
    })

    it('deve lidar com erro do repository', async () => {
      const erro = new Error('Erro na consulta do banco')
      repository.buscarOrdensEmAndamento.mockRejectedValue(erro)

      await expect(useCase.execute()).rejects.toThrow('Erro na consulta do banco')
    })
  })
})
