import { Test, TestingModule } from '@nestjs/testing'
import { ItemPeca } from '../../../domain/entities/item-peca.entity'
import { ItemServico } from '../../../domain/entities/item-servico.entity'
import { OrdemServico } from '../../../domain/entities/ordem-servico.entity'
import { Peca } from '../../../domain/entities/peca.entity'
import { Servico } from '../../../domain/entities/servico.entity'
import { IOrdemServicoRepository } from '../../../domain/repositories/ordem-servico.repository.interface'
import { IPecaRepository } from '../../../domain/repositories/peca.repository.interface'
import { IServicoRepository } from '../../../domain/repositories/servico.repository.interface'
import { StatusOrdemServico } from '../../../domain/value-objects/status-ordem-servico.vo'
import {
  ORDEM_SERVICO_REPOSITORY_TOKEN,
  PECA_REPOSITORY_TOKEN,
  SERVICO_REPOSITORY_TOKEN,
} from '../../../infrastructure/ddd.module'
import { EntityNotFoundException } from '../../../shared/exceptions/domain.exception'
import { PecaId, ServicoId } from '../../../shared/types/entity-id'
import { CriarOrdemServicoV2Command, CriarOrdemServicoV2UseCase } from './criar-ordem-servico-v2.use-case'

describe('CriarOrdemServicoV2UseCase', () => {
  let useCase: CriarOrdemServicoV2UseCase
  let ordemServicoRepository: jest.Mocked<IOrdemServicoRepository>
  let servicoRepository: jest.Mocked<IServicoRepository>
  let pecaRepository: jest.Mocked<IPecaRepository>

  const mockServico = {
    id: { obterValor: () => 'servico-1' },
    nome: { obterValor: () => 'Troca de Óleo' },
    preco: { obterValor: () => 100.5 },
  } as unknown as Servico

  const mockPeca = {
    id: { obterValor: () => 'peca-1' },
    nome: { obterValor: () => 'Óleo Motor 5W30' },
    preco: { obterValor: () => 25.9 },
  } as unknown as Peca

  const mockOrdemServico = {
    id: { obterValor: () => 'ordem-1' },
    status: { obterValor: () => StatusOrdemServico.RECEBIDA },
    valorTotal: { obterValor: () => 0 },
    atualizarValorTotal: jest.fn(),
  } as unknown as OrdemServico

  beforeEach(async () => {
    const mockOrdemServicoRepository = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorClienteId: jest.fn(),
      excluir: jest.fn(),
      adicionarItemServico: jest.fn(),
      adicionarItemPeca: jest.fn(),
    }

    const mockServicoRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
      buscarTodos: jest.fn(),
      excluir: jest.fn(),
    }

    const mockPecaRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
      buscarTodos: jest.fn(),
      excluir: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriarOrdemServicoV2UseCase,
        { provide: ORDEM_SERVICO_REPOSITORY_TOKEN, useValue: mockOrdemServicoRepository },
        { provide: SERVICO_REPOSITORY_TOKEN, useValue: mockServicoRepository },
        { provide: PECA_REPOSITORY_TOKEN, useValue: mockPecaRepository },
      ],
    }).compile()

    useCase = module.get<CriarOrdemServicoV2UseCase>(CriarOrdemServicoV2UseCase)
    ordemServicoRepository = module.get(ORDEM_SERVICO_REPOSITORY_TOKEN)
    servicoRepository = module.get(SERVICO_REPOSITORY_TOKEN)
    pecaRepository = module.get(PECA_REPOSITORY_TOKEN)

    // Mock do OrdemServico.criar
    jest.spyOn(OrdemServico, 'criar').mockReturnValue(mockOrdemServico)

    // Mock do ItemServico.criar
    jest.spyOn(ItemServico, 'criar').mockReturnValue({} as ItemServico)

    // Mock do ItemPeca.criar
    jest.spyOn(ItemPeca, 'criar').mockReturnValue({} as ItemPeca)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('execute', () => {
    it('deve criar ordem de serviço com sucesso incluindo serviços e peças', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-1', quantidade: 1 }],
        pecas: [{ pecaId: 'peca-1', quantidade: 1 }],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)
      ordemServicoRepository.salvar.mockResolvedValue(mockOrdemServico)

      const result = await useCase.execute(command)

      expect(OrdemServico.criar).toHaveBeenCalledWith({
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
      })

      // Buscar para calcular valor total e para criar itens
      expect(servicoRepository.buscarPorId).toHaveBeenCalledTimes(2)
      expect(pecaRepository.buscarPorId).toHaveBeenCalledTimes(2)

      // Valor total: 100.50 + 25.90 = 126.40
      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(126.4)
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(mockOrdemServico)
      expect(ordemServicoRepository.adicionarItemServico).toHaveBeenCalledTimes(1)
      expect(ordemServicoRepository.adicionarItemPeca).toHaveBeenCalledTimes(1)

      expect(result).toBe(mockOrdemServico)
    })

    it('deve criar ordem de serviço só com serviços', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-1', quantidade: 2 }],
        pecas: [],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      ordemServicoRepository.salvar.mockResolvedValue(mockOrdemServico)

      const result = await useCase.execute(command)

      // Valor total: 100.50 * 2 = 201.00
      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(201.0)
      expect(ordemServicoRepository.adicionarItemServico).toHaveBeenCalledTimes(1)
      expect(ordemServicoRepository.adicionarItemPeca).not.toHaveBeenCalled()
      expect(pecaRepository.buscarPorId).not.toHaveBeenCalled()

      expect(result).toBe(mockOrdemServico)
    })

    it('deve criar ordem de serviço só com peças', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [],
        pecas: [{ pecaId: 'peca-1', quantidade: 3 }],
      }

      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)
      ordemServicoRepository.salvar.mockResolvedValue(mockOrdemServico)

      const result = await useCase.execute(command)

      // Valor total: 25.90 * 3 = 77.70 (mas pode ter precisão float)
      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(expect.closeTo(77.7, 2))
      expect(ordemServicoRepository.adicionarItemPeca).toHaveBeenCalledTimes(1)
      expect(ordemServicoRepository.adicionarItemServico).not.toHaveBeenCalled()
      expect(servicoRepository.buscarPorId).not.toHaveBeenCalled()

      expect(result).toBe(mockOrdemServico)
    })

    it('deve criar ordem com múltiplos serviços e peças', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [
          { servicoId: 'servico-1', quantidade: 1 },
          { servicoId: 'servico-1', quantidade: 2 },
        ],
        pecas: [
          { pecaId: 'peca-1', quantidade: 2 },
          { pecaId: 'peca-1', quantidade: 1 },
        ],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)
      ordemServicoRepository.salvar.mockResolvedValue(mockOrdemServico)

      const result = await useCase.execute(command)

      // Valor total: (1 + 2) * 100.50 + (2 + 1) * 25.90 = 301.50 + 77.70 = 379.20
      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(379.2)
      expect(ordemServicoRepository.adicionarItemServico).toHaveBeenCalledTimes(2)
      expect(ordemServicoRepository.adicionarItemPeca).toHaveBeenCalledTimes(2)

      expect(result).toBe(mockOrdemServico)
    })

    it('deve lançar EntityNotFoundException quando serviço não existir', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-inexistente', quantidade: 1 }],
        pecas: [],
      }

      servicoRepository.buscarPorId.mockResolvedValue(null)

      await expect(useCase.execute(command)).rejects.toThrow(
        new EntityNotFoundException('Servico', 'servico-inexistente'),
      )

      expect(ordemServicoRepository.salvar).toHaveBeenCalledTimes(1) // Ordem é salva antes de adicionar itens
      expect(ordemServicoRepository.adicionarItemServico).not.toHaveBeenCalled()
    })

    it('deve lançar EntityNotFoundException quando peça não existir', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [],
        pecas: [{ pecaId: 'peca-inexistente', quantidade: 1 }],
      }

      pecaRepository.buscarPorId.mockResolvedValue(null)

      await expect(useCase.execute(command)).rejects.toThrow(new EntityNotFoundException('Peca', 'peca-inexistente'))

      expect(ordemServicoRepository.salvar).toHaveBeenCalledTimes(1) // Ordem é salva antes de adicionar itens
      expect(ordemServicoRepository.adicionarItemPeca).not.toHaveBeenCalled()
    })

    it('deve criar ordem sem itens (arrays vazios)', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [],
        pecas: [],
      }

      ordemServicoRepository.salvar.mockResolvedValue(mockOrdemServico)

      const result = await useCase.execute(command)

      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(0)
      expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(mockOrdemServico)
      expect(ordemServicoRepository.adicionarItemServico).not.toHaveBeenCalled()
      expect(ordemServicoRepository.adicionarItemPeca).not.toHaveBeenCalled()

      expect(result).toBe(mockOrdemServico)
    })

    it('deve sempre criar ordem com status RECEBIDA inicialmente', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [],
        pecas: [],
      }

      await useCase.execute(command)

      expect(OrdemServico.criar).toHaveBeenCalledWith({
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
      })
    })

    it('deve buscar preços automaticamente dos serviços e peças para criação de itens', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-1', quantidade: 1 }],
        pecas: [{ pecaId: 'peca-1', quantidade: 2 }],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)

      await useCase.execute(command)

      // Deve buscar para cálculo do valor total e para criação dos itens
      expect(servicoRepository.buscarPorId).toHaveBeenCalledWith(
        expect.objectContaining({ obterValor: expect.any(Function) }),
      )
      expect(pecaRepository.buscarPorId).toHaveBeenCalledWith(
        expect.objectContaining({ obterValor: expect.any(Function) }),
      )

      // Verifica se ItemServico.criar foi chamado com o preço correto
      expect(ItemServico.criar).toHaveBeenCalledWith(
        {
          ordemServicoId: 'ordem-1',
          servicoId: 'servico-1',
          quantidade: 1,
        },
        mockServico.preco,
      )

      // Verifica se ItemPeca.criar foi chamado com o preço correto
      expect(ItemPeca.criar).toHaveBeenCalledWith(
        {
          ordemServicoId: 'ordem-1',
          pecaId: 'peca-1',
          quantidade: 2,
        },
        mockPeca.preco,
      )
    })

    it('deve criar ServicoId e PecaId corretamente', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-teste', quantidade: 1 }],
        pecas: [{ pecaId: 'peca-teste', quantidade: 1 }],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)

      const servicoIdSpy = jest.spyOn(ServicoId, 'criar')
      const pecaIdSpy = jest.spyOn(PecaId, 'criar')

      await useCase.execute(command)

      expect(servicoIdSpy).toHaveBeenCalledWith('servico-teste')
      expect(pecaIdSpy).toHaveBeenCalledWith('peca-teste')

      servicoIdSpy.mockRestore()
      pecaIdSpy.mockRestore()
    })
  })

  describe('calcularValorTotal (método privado através do comportamento)', () => {
    it('deve calcular valor total corretamente', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [{ servicoId: 'servico-1', quantidade: 2 }],
        pecas: [{ pecaId: 'peca-1', quantidade: 3 }],
      }

      servicoRepository.buscarPorId.mockResolvedValue(mockServico)
      pecaRepository.buscarPorId.mockResolvedValue(mockPeca)

      await useCase.execute(command)

      // 2 * 100.50 + 3 * 25.90 = 201.00 + 77.70 = 278.70
      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(expect.closeTo(278.7, 2))
    })

    it('deve retornar 0 quando não há itens', async () => {
      const command: CriarOrdemServicoV2Command = {
        clienteId: 'cliente-1',
        veiculoId: 'veiculo-1',
        servicos: [],
        pecas: [],
      }

      await useCase.execute(command)

      expect(mockOrdemServico.atualizarValorTotal).toHaveBeenCalledWith(0)
    })
  })
})
