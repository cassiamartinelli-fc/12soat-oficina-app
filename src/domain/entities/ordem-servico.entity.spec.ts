import { BusinessRuleException } from '../../shared/exceptions/domain.exception'
import { ClienteId, OrdemServicoId, VeiculoId } from '../../shared/types/entity-id'
import { PeriodoExecucao } from '../value-objects/periodo-execucao.vo'
import { Preco } from '../value-objects/preco.vo'
import { StatusOrdemServico, StatusOrdemServicoVO } from '../value-objects/status-ordem-servico.vo'
import { CreateOrdemServicoProps, OrdemServico, OrdemServicoProps } from './ordem-servico.entity'

describe('OrdemServico Entity', () => {
  const clienteId = 'cliente-123'
  const veiculoId = 'veiculo-456'

  describe('Criação', () => {
    it('deve criar ordem de serviço com cliente e veículo', () => {
      const props: CreateOrdemServicoProps = {
        clienteId,
        veiculoId,
      }

      const ordem = OrdemServico.criar(props)

      expect(ordem.id.obterValor()).toBeDefined()
      expect(ordem.clienteId?.obterValor()).toBe(clienteId)
      expect(ordem.veiculoId?.obterValor()).toBe(veiculoId)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(ordem.valorTotal.obterValor()).toBe(0)
      expect(ordem.periodoExecucao).toBeInstanceOf(PeriodoExecucao)
      expect(ordem.createdAt).toBeInstanceOf(Date)
      expect(ordem.updatedAt).toBeInstanceOf(Date)
    })

    it('deve criar ordem de serviço sem cliente e veículo', () => {
      const props: CreateOrdemServicoProps = {}

      const ordem = OrdemServico.criar(props)

      expect(ordem.clienteId).toBeUndefined()
      expect(ordem.veiculoId).toBeUndefined()
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(ordem.valorTotal.obterValor()).toBe(0)
    })

    it('deve criar ordem apenas com cliente', () => {
      const props: CreateOrdemServicoProps = { clienteId }

      const ordem = OrdemServico.criar(props)

      expect(ordem.clienteId?.obterValor()).toBe(clienteId)
      expect(ordem.veiculoId).toBeUndefined()
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
    })

    it('deve lançar exceção ao tentar criar ordem apenas com veículo (sem cliente)', () => {
      const props: CreateOrdemServicoProps = { veiculoId }

      expect(() => OrdemServico.criar(props)).toThrow(BusinessRuleException)
      expect(() => OrdemServico.criar(props)).toThrow('Não é possível ter veículo sem cliente')
    })

    it('deve inicializar com status RECEBIDA sempre', () => {
      const ordem1 = OrdemServico.criar({})
      const ordem2 = OrdemServico.criar({ clienteId })
      const ordem3 = OrdemServico.criar({ clienteId, veiculoId })

      expect(ordem1.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(ordem2.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(ordem3.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
    })

    it('deve inicializar com valor total zero', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })

      expect(ordem.valorTotal.obterValor()).toBe(0)
    })

    it('deve gerar ID único para cada nova ordem', () => {
      const ordem1 = OrdemServico.criar({ clienteId })
      const ordem2 = OrdemServico.criar({ clienteId })

      expect(ordem1.id.obterValor()).not.toBe(ordem2.id.obterValor())
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir ordem de serviço a partir de props completas', () => {
      const id = OrdemServicoId.gerar()
      const agora = new Date()
      const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO)
      const valorTotal = Preco.criar(350.5)
      const periodoExecucao = PeriodoExecucao.criar()

      const props: OrdemServicoProps = {
        id,
        status,
        valorTotal,
        clienteId: ClienteId.criar(clienteId),
        veiculoId: VeiculoId.criar(veiculoId),
        periodoExecucao,
        createdAt: agora,
        updatedAt: agora,
      }

      const ordem = OrdemServico.reconstituir(props)

      expect(ordem.id).toBe(id)
      expect(ordem.status).toBe(status)
      expect(ordem.valorTotal).toBe(valorTotal)
      expect(ordem.clienteId?.obterValor()).toBe(clienteId)
      expect(ordem.veiculoId?.obterValor()).toBe(veiculoId)
      expect(ordem.createdAt).toBe(agora)
      expect(ordem.updatedAt).toBe(agora)
    })

    it('deve reconstituir ordem sem cliente e veículo', () => {
      const id = OrdemServicoId.gerar()
      const agora = new Date()

      const props: OrdemServicoProps = {
        id,
        status: StatusOrdemServicoVO.inicial(),
        valorTotal: Preco.zero(),
        periodoExecucao: PeriodoExecucao.criar(),
        createdAt: agora,
        updatedAt: agora,
      }

      const ordem = OrdemServico.reconstituir(props)

      expect(ordem.clienteId).toBeUndefined()
      expect(ordem.veiculoId).toBeUndefined()
    })

    it('deve validar regra de negócio ao reconstituir (veículo sem cliente)', () => {
      const id = OrdemServicoId.gerar()
      const agora = new Date()

      const props: OrdemServicoProps = {
        id,
        status: StatusOrdemServicoVO.inicial(),
        valorTotal: Preco.zero(),
        veiculoId: VeiculoId.criar(veiculoId), // Veículo sem cliente
        periodoExecucao: PeriodoExecucao.criar(),
        createdAt: agora,
        updatedAt: agora,
      }

      expect(() => OrdemServico.reconstituir(props)).toThrow(BusinessRuleException)
      expect(() => OrdemServico.reconstituir(props)).toThrow('Não é possível ter veículo sem cliente')
    })
  })

  describe('Gestão de Cliente e Veículo', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({})
    })

    it('deve definir cliente e atualizar updatedAt', () => {
      const updatedAtAntes = ordem.updatedAt

      ordem.definirCliente(clienteId)

      expect(ordem.clienteId?.obterValor()).toBe(clienteId)
      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })

    it('deve definir veículo após definir cliente', () => {
      ordem.definirCliente(clienteId)

      const updatedAtAntes = ordem.updatedAt

      ordem.definirVeiculo(veiculoId)

      expect(ordem.veiculoId?.obterValor()).toBe(veiculoId)
      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })

    it('deve lançar exceção ao definir veículo sem cliente', () => {
      expect(() => ordem.definirVeiculo(veiculoId)).toThrow(BusinessRuleException)
      expect(() => ordem.definirVeiculo(veiculoId)).toThrow('Cliente deve ser definido antes do veículo')
    })

    it('deve transicionar para EM_DIAGNOSTICO ao definir cliente e veículo quando status é RECEBIDA', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      ordem.definirCliente(clienteId)
      ordem.definirVeiculo(veiculoId)

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
    })

    it('deve transicionar para EM_DIAGNOSTICO ao definir veículo quando já tem cliente e status é RECEBIDA', () => {
      ordem.definirCliente(clienteId)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      ordem.definirVeiculo(veiculoId)

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
    })

    it('deve permitir redefinir cliente', () => {
      ordem.definirCliente(clienteId)
      expect(ordem.clienteId?.obterValor()).toBe(clienteId)

      const novoClienteId = 'novo-cliente-789'
      ordem.definirCliente(novoClienteId)

      expect(ordem.clienteId?.obterValor()).toBe(novoClienteId)
    })

    describe('Métodos auxiliares de verificação', () => {
      it('deve verificar se tem cliente', () => {
        expect(ordem.temCliente()).toBe(false)

        ordem.definirCliente(clienteId)
        expect(ordem.temCliente()).toBe(true)
      })

      it('deve verificar se tem veículo', () => {
        expect(ordem.temVeiculo()).toBe(false)

        ordem.definirCliente(clienteId)
        ordem.definirVeiculo(veiculoId)
        expect(ordem.temVeiculo()).toBe(true)
      })

      it('deve verificar se tem cliente e veículo', () => {
        expect(ordem.temClienteEVeiculo()).toBe(false)

        ordem.definirCliente(clienteId)
        expect(ordem.temClienteEVeiculo()).toBe(false)

        ordem.definirVeiculo(veiculoId)
        expect(ordem.temClienteEVeiculo()).toBe(true)
      })
    })
  })

  describe('Gestão de Status', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({ clienteId, veiculoId })
      // Status inicial é sempre RECEBIDA, mas tem cliente e veículo
    })

    it('deve atualizar status manualmente para transições válidas', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)

      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)

      ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.FINALIZADA)

      ordem.atualizarStatusManualmente(StatusOrdemServico.ENTREGUE)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.ENTREGUE)
    })

    it('deve iniciar execução automaticamente ao transicionar para EM_EXECUCAO', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)

      expect(ordem.periodoExecucao.isIniciado()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.periodoExecucao.isIniciado()).toBe(true)
    })

    it('deve finalizar execução automaticamente ao transicionar para FINALIZADA', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(ordem.periodoExecucao.isFinalizado()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.FINALIZADA)
      expect(ordem.periodoExecucao.isFinalizado()).toBe(true)
    })

    it('deve atualizar updatedAt ao atualizar status', () => {
      const updatedAtAntes = ordem.updatedAt

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)

      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })

    it('deve transicionar para AGUARDANDO_APROVACAO ao adicionar itens quando pode adicionar itens', () => {
      // Primeiro precisa estar em EM_DIAGNOSTICO para poder adicionar itens
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordem.podeAdicionarItens()).toBe(true)

      ordem.transicionarParaAguardandoAprovacao()

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
    })

    it('não deve transicionar para AGUARDANDO_APROVACAO quando não pode adicionar itens', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(ordem.podeAdicionarItens()).toBe(false)

      // Não deve lançar erro, mas também não deve transicionar
      ordem.transicionarParaAguardandoAprovacao()

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
    })
  })

  describe('Aprovação de Orçamento', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({ clienteId, veiculoId })
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordem.transicionarParaAguardandoAprovacao()
    })

    it('deve aprovar orçamento quando status é AGUARDANDO_APROVACAO', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(ordem.periodoExecucao.isIniciado()).toBe(false)

      ordem.aprovarOrcamento()

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.periodoExecucao.isIniciado()).toBe(true)
    })

    it('deve rejeitar orçamento quando status é AGUARDANDO_APROVACAO', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)

      ordem.rejeitarOrcamento()

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.CANCELADA)
    })

    it('deve lançar BusinessRuleException ao aprovar orçamento com status incorreto', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(() => ordem.aprovarOrcamento()).toThrow(BusinessRuleException)
      expect(() => ordem.aprovarOrcamento()).toThrow(
        'Apenas ordens com status AGUARDANDO_APROVACAO podem ser aprovadas',
      )
    })

    it('deve lançar BusinessRuleException ao rejeitar orçamento com status incorreto', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(() => ordem.rejeitarOrcamento()).toThrow(BusinessRuleException)
      expect(() => ordem.rejeitarOrcamento()).toThrow(
        'Apenas ordens com status AGUARDANDO_APROVACAO podem ser rejeitadas',
      )
    })

    it('deve atualizar updatedAt ao aprovar orçamento', () => {
      const updatedAtAntes = ordem.updatedAt

      ordem.aprovarOrcamento()

      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })

    it('deve atualizar updatedAt ao rejeitar orçamento', () => {
      const updatedAtAntes = ordem.updatedAt

      ordem.rejeitarOrcamento()

      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })
  })

  describe('Gestão de Execução', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({ clienteId, veiculoId })
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordem.transicionarParaAguardandoAprovacao()
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
    })

    it('deve iniciar execução quando status é EM_EXECUCAO', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.periodoExecucao.isIniciado()).toBe(true)

      // Força iniciar novamente para testar o método explícito
      ordem.iniciarExecucao()

      expect(ordem.periodoExecucao.isIniciado()).toBe(true)
    })

    it('deve lançar BusinessRuleException ao iniciar execução com status incorreto', () => {
      const ordemRecebida = OrdemServico.criar({ clienteId, veiculoId })

      expect(() => ordemRecebida.iniciarExecucao()).toThrow(BusinessRuleException)
      expect(() => ordemRecebida.iniciarExecucao()).toThrow(
        'Ordem de serviço deve estar EM_EXECUCAO para iniciar execução',
      )
    })

    it('deve finalizar execução quando execução foi iniciada', () => {
      expect(ordem.periodoExecucao.isIniciado()).toBe(true)

      ordem.finalizarExecucao()

      expect(ordem.periodoExecucao.isFinalizado()).toBe(true)
    })

    it('deve lançar BusinessRuleException ao finalizar execução não iniciada', () => {
      const ordemNova = OrdemServico.criar({ clienteId, veiculoId })

      expect(() => ordemNova.finalizarExecucao()).toThrow(BusinessRuleException)
      expect(() => ordemNova.finalizarExecucao()).toThrow('Execução deve ser iniciada antes de ser finalizada')
    })

    it('deve calcular duração de execução', () => {
      const duracao = ordem.calcularDuracaoExecucao()

      expect(typeof duracao === 'number' || duracao === null).toBe(true)
    })
  })

  describe('Gestão de Valor Total', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({ clienteId, veiculoId })
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
    })

    it('deve atualizar valor total com valor positivo', () => {
      ordem.atualizarValorTotal(250.75)

      expect(ordem.valorTotal.obterValor()).toBe(250.75)
    })

    it('deve aceitar valor zero', () => {
      ordem.atualizarValorTotal(100)
      ordem.atualizarValorTotal(0)

      expect(ordem.valorTotal.obterValor()).toBe(0)
    })

    it('deve transicionar para AGUARDANDO_APROVACAO quando valor > 0 e pode adicionar itens', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordem.podeAdicionarItens()).toBe(true)

      ordem.atualizarValorTotal(100.5)

      expect(ordem.valorTotal.obterValor()).toBe(100.5)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
    })

    it('não deve transicionar status quando valor é zero', () => {
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)

      ordem.atualizarValorTotal(0)

      expect(ordem.valorTotal.obterValor()).toBe(0)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
    })

    it('não deve transicionar status quando não pode adicionar itens', () => {
      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)

      expect(ordem.podeAdicionarItens()).toBe(false)

      ordem.atualizarValorTotal(150.0)

      expect(ordem.valorTotal.obterValor()).toBe(150.0)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
    })

    it('deve atualizar updatedAt ao atualizar valor total', () => {
      const updatedAtAntes = ordem.updatedAt

      ordem.atualizarValorTotal(100)

      expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedAtAntes.getTime())
    })
  })

  describe('Métodos de Consulta de Estado', () => {
    let ordem: OrdemServico

    beforeEach(() => {
      ordem = OrdemServico.criar({ clienteId, veiculoId })
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
    })

    it('deve verificar se pode adicionar itens', () => {
      // Status inicial: EM_DIAGNOSTICO
      expect(ordem.podeAdicionarItens()).toBe(true)

      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(ordem.podeAdicionarItens()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.podeAdicionarItens()).toBe(false)
    })

    it('deve verificar se está em andamento', () => {
      // Verificar status em andamento (RECEBIDA, EM_DIAGNOSTICO, AGUARDANDO_APROVACAO, EM_EXECUCAO)
      const ordemRecebida = OrdemServico.criar({ clienteId: 'cliente-id', veiculoId: 'veiculo-id' })
      expect(ordemRecebida.isEmAndamento()).toBe(true) // RECEBIDA é em andamento

      // Status inicial da ordem do teste: EM_DIAGNOSTICO
      expect(ordem.isEmAndamento()).toBe(true)

      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(ordem.isEmAndamento()).toBe(true) // AGUARDANDO_APROVACAO é em andamento

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.isEmAndamento()).toBe(true) // EM_EXECUCAO é em andamento

      // Verificar status não em andamento
      ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)
      expect(ordem.isEmAndamento()).toBe(false)
    })

    it('deve verificar se está concluída', () => {
      // Status inicial: EM_DIAGNOSTICO
      expect(ordem.isConcluida()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(ordem.isConcluida()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.isConcluida()).toBe(false)

      ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)
      expect(ordem.isConcluida()).toBe(true)

      // Resetar para testar CANCELADA
      const ordemCancelada = OrdemServico.criar({ clienteId, veiculoId })
      ordemCancelada.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordemCancelada.transicionarParaAguardandoAprovacao()
      ordemCancelada.atualizarStatusManualmente(StatusOrdemServico.CANCELADA)
      expect(ordemCancelada.isConcluida()).toBe(true)

      // Resetar para testar ENTREGUE
      const ordemEntregue = OrdemServico.criar({ clienteId, veiculoId })
      ordemEntregue.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      ordemEntregue.transicionarParaAguardandoAprovacao()
      ordemEntregue.atualizarStatusManualmente(StatusOrdemServico.EM_EXECUCAO)
      ordemEntregue.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)
      ordemEntregue.atualizarStatusManualmente(StatusOrdemServico.ENTREGUE)
      expect(ordemEntregue.isConcluida()).toBe(true)
    })
  })

  describe('Comparação e Identidade', () => {
    it('deve comparar ordens pela identidade (ID)', () => {
      const ordem1 = OrdemServico.criar({ clienteId })
      const ordem2 = OrdemServico.criar({ clienteId })

      expect(ordem1.equals(ordem2)).toBe(false)
      expect(ordem1.equals(ordem1)).toBe(true)
    })

    it('deve ter IDs únicos para diferentes instâncias', () => {
      const ordem1 = OrdemServico.criar({ clienteId })
      const ordem2 = OrdemServico.criar({ clienteId })

      expect(ordem1.id.equals(ordem2.id)).toBe(false)
    })
  })

  describe('Serialização', () => {
    it('deve gerar snapshot completo dos dados', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })
      ordem.atualizarValorTotal(150.0)

      const snapshot = ordem.toSnapshot()

      expect(snapshot).toHaveProperty('id')
      expect(snapshot).toHaveProperty('status')
      expect(snapshot).toHaveProperty('valorTotal')
      expect(snapshot).toHaveProperty('clienteId')
      expect(snapshot).toHaveProperty('veiculoId')
      expect(snapshot).toHaveProperty('periodoExecucao')
      expect(snapshot).toHaveProperty('createdAt')
      expect(snapshot).toHaveProperty('updatedAt')

      expect(snapshot.id).toBe(ordem.id)
      expect(snapshot.status).toBe(ordem.status)
      expect(snapshot.valorTotal).toBe(ordem.valorTotal)
      expect(snapshot.clienteId).toBe(ordem.clienteId)
      expect(snapshot.veiculoId).toBe(ordem.veiculoId)
    })

    it('deve gerar snapshot com campos opcionais undefined', () => {
      const ordem = OrdemServico.criar({})

      const snapshot = ordem.toSnapshot()

      expect(snapshot.clienteId).toBeUndefined()
      expect(snapshot.veiculoId).toBeUndefined()
      expect(snapshot.id).toBeDefined()
      expect(snapshot.status).toBeDefined()
      expect(snapshot.valorTotal).toBeDefined()
    })
  })

  describe('Fluxos Completos', () => {
    it('deve executar fluxo completo de aprovação', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })

      // Status inicial é sempre RECEBIDA
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      // Transicionar para EM_DIAGNOSTICO primeiro
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)

      // Adicionar valor (simula adição de itens)
      ordem.atualizarValorTotal(200.0)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)

      // Aprovar orçamento
      ordem.aprovarOrcamento()
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(ordem.periodoExecucao.isIniciado()).toBe(true)

      // Finalizar
      ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.FINALIZADA)
      expect(ordem.periodoExecucao.isFinalizado()).toBe(true)

      // Entregar
      ordem.atualizarStatusManualmente(StatusOrdemServico.ENTREGUE)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.ENTREGUE)
      expect(ordem.isConcluida()).toBe(true)
    })

    it('deve executar fluxo completo de rejeição', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })

      // Transicionar para EM_DIAGNOSTICO primeiro
      ordem.atualizarStatusManualmente(StatusOrdemServico.EM_DIAGNOSTICO)

      // Adicionar valor para transicionar para AGUARDANDO_APROVACAO
      ordem.atualizarValorTotal(200.0)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)

      // Rejeitar orçamento
      ordem.rejeitarOrcamento()
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.CANCELADA)
      expect(ordem.isConcluida()).toBe(true)
    })

    it('deve executar fluxo sem cliente/veículo inicial', () => {
      const ordem = OrdemServico.criar({})

      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      // Definir cliente
      ordem.definirCliente(clienteId)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)

      // Definir veículo (agora transiciona para EM_DIAGNOSTICO)
      ordem.definirVeiculo(veiculoId)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)

      // Continuar fluxo normal
      ordem.atualizarValorTotal(150.0)
      expect(ordem.status.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
    })
  })

  describe('Casos Extremos e Validações', () => {
    it('deve manter consistência após múltiplas atualizações', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })

      ordem.atualizarValorTotal(100)
      ordem.definirCliente('novo-cliente')
      ordem.atualizarValorTotal(200)

      expect(ordem.valorTotal.obterValor()).toBe(200)
      expect(ordem.clienteId?.obterValor()).toBe('novo-cliente')
      expect(ordem.veiculoId?.obterValor()).toBe(veiculoId)
    })

    it('deve atualizar updatedAt em todas as operações que modificam estado', (done) => {
      const ordem = OrdemServico.criar({})
      const timestampInicial = ordem.updatedAt.getTime()

      // Pequeno delay para garantir diferença de timestamp
      setTimeout(() => {
        ordem.definirCliente(clienteId)
        expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(timestampInicial)

        const timestamp2 = ordem.updatedAt.getTime()

        setTimeout(() => {
          ordem.definirVeiculo(veiculoId)
          expect(ordem.updatedAt.getTime()).toBeGreaterThanOrEqual(timestamp2)
          done()
        }, 1)
      }, 1)
    })

    it('deve preservar createdAt durante todas as operações', () => {
      const ordem = OrdemServico.criar({ clienteId, veiculoId })
      const createdAtOriginal = ordem.createdAt

      ordem.atualizarValorTotal(100)
      ordem.definirCliente('novo-cliente')
      ordem.atualizarStatusManualmente(StatusOrdemServico.AGUARDANDO_APROVACAO)

      expect(ordem.createdAt).toBe(createdAtOriginal)
    })
  })
})
