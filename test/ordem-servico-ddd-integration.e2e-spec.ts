import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

// Módulos DDD
import { OrdemServicoDddModule } from '../src/infrastructure/ordem-servico-ddd.module'
import { ClienteDddModule } from '../src/infrastructure/cliente-ddd.module'
import { VeiculoDddModule } from '../src/infrastructure/veiculo-ddd.module'
import { ServicoDddModule } from '../src/infrastructure/servico-ddd.module'
import { PecaDddModule } from '../src/infrastructure/peca-ddd.module'

// Use Cases
import { CriarClienteUseCase, BuscarClienteUseCase } from '../src/application/use-cases/cliente'
import { CriarVeiculoUseCase, BuscarVeiculoUseCase } from '../src/application/use-cases/veiculo'
import { CriarServicoUseCase, BuscarServicoUseCase } from '../src/application/use-cases/servico'
import { CriarPecaUseCase, BuscarPecaUseCase } from '../src/application/use-cases/peca'
import {
  CriarOrdemServicoUseCase,
  BuscarOrdemServicoUseCase,
  AtualizarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
  AdicionarItemServicoUseCase,
  AdicionarItemPecaUseCase,
} from '../src/application/use-cases/ordem-servico'

// Entidades ORM
import { ClienteEntity } from '../src/infrastructure/persistence/entities/cliente.entity'
import { VeiculoEntity } from '../src/infrastructure/persistence/entities/veiculo.entity'
import { ServicoEntity } from '../src/infrastructure/persistence/entities/servico.entity'
import { PecaEntity } from '../src/infrastructure/persistence/entities/peca.entity'
import { OrdemServicoEntity } from '../src/infrastructure/persistence/entities/ordem-servico.entity'
import { ItemServicoEntity } from '../src/infrastructure/persistence/entities/item-servico.entity'
import { ItemPecaEntity } from '../src/infrastructure/persistence/entities/item-peca.entity'

// Domain
import { StatusOrdemServico } from '../src/domain/value-objects/status-ordem-servico.vo'
import { Cliente } from '../src/domain/entities/cliente.entity'
import { Veiculo } from '../src/domain/entities/veiculo.entity'
import { Servico } from '../src/domain/entities/servico.entity'
import { Peca } from '../src/domain/entities/peca.entity'
import { OrdemServico } from '../src/domain/entities/ordem-servico.entity'

describe('OrdemServico DDD Integration Tests', () => {
  let app: INestApplication

  // Use Cases
  let criarOrdemServicoUseCase: CriarOrdemServicoUseCase
  let buscarOrdemServicoUseCase: BuscarOrdemServicoUseCase
  let atualizarOrdemServicoUseCase: AtualizarOrdemServicoUseCase
  let excluirOrdemServicoUseCase: ExcluirOrdemServicoUseCase
  let adicionarItemServicoUseCase: AdicionarItemServicoUseCase
  let adicionarItemPecaUseCase: AdicionarItemPecaUseCase

  let criarClienteUseCase: CriarClienteUseCase
  let criarVeiculoUseCase: CriarVeiculoUseCase
  let criarServicoUseCase: CriarServicoUseCase
  let criarPecaUseCase: CriarPecaUseCase
  let buscarPecaUseCase: BuscarPecaUseCase

  // Test Data
  let cliente: Cliente
  let veiculo: Veiculo
  let servico1: Servico
  let servico2: Servico
  let peca1: Peca

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            ClienteEntity,
            VeiculoEntity,
            ServicoEntity,
            PecaEntity,
            OrdemServicoEntity,
            ItemServicoEntity,
            ItemPecaEntity,
          ],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        ClienteDddModule,
        VeiculoDddModule,
        ServicoDddModule,
        PecaDddModule,
        OrdemServicoDddModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const connection = moduleFixture.get(DataSource)
    await connection.query('PRAGMA foreign_keys = OFF')

    // Initialize use cases
    criarOrdemServicoUseCase = moduleFixture.get<CriarOrdemServicoUseCase>(CriarOrdemServicoUseCase)
    buscarOrdemServicoUseCase = moduleFixture.get<BuscarOrdemServicoUseCase>(BuscarOrdemServicoUseCase)
    atualizarOrdemServicoUseCase = moduleFixture.get<AtualizarOrdemServicoUseCase>(AtualizarOrdemServicoUseCase)
    excluirOrdemServicoUseCase = moduleFixture.get<ExcluirOrdemServicoUseCase>(ExcluirOrdemServicoUseCase)
    adicionarItemServicoUseCase = moduleFixture.get<AdicionarItemServicoUseCase>(AdicionarItemServicoUseCase)
    adicionarItemPecaUseCase = moduleFixture.get<AdicionarItemPecaUseCase>(AdicionarItemPecaUseCase)

    criarClienteUseCase = moduleFixture.get<CriarClienteUseCase>(CriarClienteUseCase)
    buscarClienteUseCase = moduleFixture.get<BuscarClienteUseCase>(BuscarClienteUseCase)
    criarVeiculoUseCase = moduleFixture.get<CriarVeiculoUseCase>(CriarVeiculoUseCase)
    buscarVeiculoUseCase = moduleFixture.get<BuscarVeiculoUseCase>(BuscarVeiculoUseCase)
    criarServicoUseCase = moduleFixture.get<CriarServicoUseCase>(CriarServicoUseCase)
    buscarServicoUseCase = moduleFixture.get<BuscarServicoUseCase>(BuscarServicoUseCase)
    criarPecaUseCase = moduleFixture.get<CriarPecaUseCase>(CriarPecaUseCase)
    buscarPecaUseCase = moduleFixture.get<BuscarPecaUseCase>(BuscarPecaUseCase)
  })

  beforeEach(async () => {
    // Clear database
    const connection = moduleFixture.get(DataSource)
    await connection.query('DELETE FROM item_peca_entity')
    await connection.query('DELETE FROM item_servico_entity')
    await connection.query('DELETE FROM ordem_servico_entity')
    await connection.query('DELETE FROM veiculo_entity')
    await connection.query('DELETE FROM cliente_entity')
    await connection.query('DELETE FROM servico_entity')
    await connection.query('DELETE FROM peca_entity')

    // Create test data
    cliente = await criarClienteUseCase.execute({
      nome: 'João Silva',
      cpfCnpj: '12345678901',
      telefone: '11999999999',
    })

    veiculo = await criarVeiculoUseCase.execute({
      placa: 'ABC1234',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2022,
      clienteId: cliente.id.obterValor(),
    })

    servico1 = await criarServicoUseCase.execute({
      nome: 'Troca de Óleo',
      preco: 150.0,
    })

    servico2 = await criarServicoUseCase.execute({
      nome: 'Alinhamento',
      preco: 80.0,
    })

    peca1 = await criarPecaUseCase.execute({
      nome: 'Filtro de Óleo',
      preco: 25.0,
      quantidadeEstoque: 100,
    })

    peca2 = await criarPecaUseCase.execute({
      nome: 'Óleo Motor 5W30',
      preco: 45.0,
      quantidadeEstoque: 50,
    })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('1. Criação de Ordem de Serviço', () => {
    it('deve criar ordem de serviço básica', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      expect(ordemServico).toBeDefined()
      expect(ordemServico.id).toBeDefined()
      expect(ordemServico.clienteId?.obterValor()).toBe(cliente.id.obterValor())
      expect(ordemServico.veiculoId?.obterValor()).toBe(veiculo.id.obterValor())
      expect(ordemServico.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordemServico.valorTotal.obterValor()).toBe(0)
    })

    it('deve criar ordem de serviço sem cliente e veículo', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({})

      expect(ordemServico).toBeDefined()
      expect(ordemServico.clienteId).toBeUndefined()
      expect(ordemServico.veiculoId).toBeUndefined()
      expect(ordemServico.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
    })

    it('deve falhar ao criar ordem apenas com veículo', async () => {
      await expect(
        criarOrdemServicoUseCase.execute({
          veiculoId: veiculo.id.obterValor(),
        }),
      ).rejects.toThrow('Não é possível ter veículo sem cliente')
    })
  })

  describe('2. Adição de Itens', () => {
    let ordemServico: OrdemServico

    beforeEach(async () => {
      ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })
    })

    it('deve adicionar item de serviço', async () => {
      const ordemAtualizada = await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        servicoId: servico1.id.obterValor(),
        quantidade: 1,
        precoUnitario: servico1.preco.obterValor(),
      })

      expect(ordemAtualizada).toBeDefined()
      expect(ordemAtualizada.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
    })

    it('deve adicionar item de peça', async () => {
      const pecaAntes = await buscarPecaUseCase.buscarPorId(peca1.id.obterValor())
      const estoqueAntes = pecaAntes.estoque.obterQuantidade()

      const ordemAtualizada = await adicionarItemPecaUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        pecaId: peca1.id.obterValor(),
        quantidade: 2,
        precoUnitario: peca1.preco.obterValor(),
      })

      expect(ordemAtualizada).toBeDefined()
      expect(ordemAtualizada.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)

      // Verificar se estoque foi reduzido
      const pecaDepois = await buscarPecaUseCase.buscarPorId(peca1.id.obterValor())
      expect(pecaDepois.estoque.obterQuantidade()).toBe(estoqueAntes - 2)
    })

    it('deve falhar ao adicionar peça com estoque insuficiente', async () => {
      await expect(
        adicionarItemPecaUseCase.execute({
          ordemServicoId: ordemServico.id.obterValor(),
          pecaId: peca1.id.obterValor(),
          quantidade: 200, // Mais que o estoque disponível
          precoUnitario: peca1.preco.obterValor(),
        }),
      ).rejects.toThrow()
    })
  })

  describe('3. Transições de Status', () => {
    let ordemServico: OrdemServico

    beforeEach(async () => {
      ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      // Adicionar itens para transicionar para AGUARDANDO_APROVACAO
      await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        servicoId: servico1.id.obterValor(),
        quantidade: 1,
        precoUnitario: servico1.preco.obterValor(),
      })
    })

    it('deve permitir transição válida para EM_EXECUCAO', async () => {
      const ordemAtualizada = await atualizarOrdemServicoUseCase.execute({
        id: ordemServico.id.obterValor(),
        status: StatusOrdemServico.EM_EXECUCAO,
      })

      expect(ordemAtualizada.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(ordemAtualizada.periodoExecucao.isIniciado()).toBe(true)
    })

    it('deve permitir transição completa do fluxo', async () => {
      // EM_EXECUCAO
      let ordem = await atualizarOrdemServicoUseCase.execute({
        id: ordemServico.id.obterValor(),
        status: StatusOrdemServico.EM_EXECUCAO,
      })
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)

      // Aguardar um pouco para simular tempo de execução
      await new Promise((resolve) => setTimeout(resolve, 10))

      // FINALIZADA
      ordem = await atualizarOrdemServicoUseCase.execute({
        id: ordemServico.id.obterValor(),
        status: StatusOrdemServico.FINALIZADA,
      })
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.FINALIZADA)
      expect(ordem.periodoExecucao.isFinalizado()).toBe(true)

      // ENTREGUE
      ordem = await atualizarOrdemServicoUseCase.execute({
        id: ordemServico.id.obterValor(),
        status: StatusOrdemServico.ENTREGUE,
      })
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.ENTREGUE)
    })

    it('deve falhar em transição inválida', async () => {
      await expect(
        atualizarOrdemServicoUseCase.execute({
          id: ordemServico.id.obterValor(),
          status: StatusOrdemServico.FINALIZADA, // Pular EM_EXECUCAO
        }),
      ).rejects.toThrow()
    })
  })

  describe('4. Busca e Consultas', () => {
    beforeEach(async () => {
      // Criar algumas ordens para teste
      const ordem1 = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      // Adicionar itens na primeira ordem
      await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordem1.id.obterValor(),
        servicoId: servico1.id.obterValor(),
        quantidade: 1,
        precoUnitario: servico1.preco.obterValor(),
      })
    })

    it('deve buscar todas as ordens', async () => {
      const ordens = await buscarOrdemServicoUseCase.buscarTodas()

      expect(ordens).toHaveLength(2)
      expect(ordens.every((ordem) => ordem.id)).toBe(true)
    })

    it('deve buscar ordens por cliente', async () => {
      const ordens = await buscarOrdemServicoUseCase.buscarPorClienteId(cliente.id.obterValor())

      expect(ordens).toHaveLength(1)
      expect(ordens[0].clienteId?.obterValor()).toBe(cliente.id.obterValor())
    })

    it('deve buscar ordens por status', async () => {
      const ordensRecebidas = await buscarOrdemServicoUseCase.buscarPorStatus(StatusOrdemServico.RECEBIDA)
      const ordensAguardando = await buscarOrdemServicoUseCase.buscarPorStatus(StatusOrdemServico.AGUARDANDO_APROVACAO)

      expect(ordensRecebidas).toHaveLength(1)
      expect(ordensAguardando).toHaveLength(1)
    })
  })

  describe('5. Remoção de Ordem', () => {
    it('deve permitir remoção em status inicial', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      await excluirOrdemServicoUseCase.execute(ordemServico.id.obterValor())

      await expect(buscarOrdemServicoUseCase.buscarPorId(ordemServico.id.obterValor())).rejects.toThrow()
    })

    it('deve impedir remoção em execução', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      // Adicionar item e transicionar para execução
      await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        servicoId: servico1.id.obterValor(),
        quantidade: 1,
        precoUnitario: servico1.preco.obterValor(),
      })

      await atualizarOrdemServicoUseCase.execute({
        id: ordemServico.id.obterValor(),
        status: StatusOrdemServico.EM_EXECUCAO,
      })

      await expect(excluirOrdemServicoUseCase.execute(ordemServico.id.obterValor())).rejects.toThrow()
    })
  })

  describe('6. Regras de Negócio Complexas', () => {
    it('deve calcular valor total corretamente', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      // Adicionar serviços
      await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        servicoId: servico1.id.obterValor(),
        quantidade: 1,
        precoUnitario: 150.0,
      })

      await adicionarItemServicoUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        servicoId: servico2.id.obterValor(),
        quantidade: 2,
        precoUnitario: 80.0,
      })

      // Adicionar peças
      await adicionarItemPecaUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        pecaId: peca1.id.obterValor(),
        quantidade: 3,
        precoUnitario: 25.0,
      })

      // Buscar ordem atualizada
      const ordemAtualizada = await buscarOrdemServicoUseCase.buscarPorId(ordemServico.id.obterValor())

      // Valor total esperado: (1 * 150) + (2 * 80) + (3 * 25) = 150 + 160 + 75 = 385
      expect(ordemAtualizada.valorTotal.obterValor()).toBe(385.0)
    })

    it('deve controlar estoque corretamente', async () => {
      const ordemServico = await criarOrdemServicoUseCase.execute({
        clienteId: cliente.id.obterValor(),
        veiculoId: veiculo.id.obterValor(),
      })

      // Verificar estoque inicial
      const pecaInicial = await buscarPecaUseCase.buscarPorId(peca1.id.obterValor())
      expect(pecaInicial.estoque.obterQuantidade()).toBe(100)

      // Adicionar peça à ordem
      await adicionarItemPecaUseCase.execute({
        ordemServicoId: ordemServico.id.obterValor(),
        pecaId: peca1.id.obterValor(),
        quantidade: 5,
        precoUnitario: peca1.preco.obterValor(),
      })

      // Verificar estoque após adição
      const pecaFinal = await buscarPecaUseCase.buscarPorId(peca1.id.obterValor())
      expect(pecaFinal.estoque.obterQuantidade()).toBe(95)
    })
  })
})
