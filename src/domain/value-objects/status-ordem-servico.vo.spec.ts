import { DomainException } from '../../shared/exceptions/domain.exception'
import { StatusOrdemServico, StatusOrdemServicoVO } from './status-ordem-servico.vo'

describe('StatusOrdemServicoVO', () => {
  describe('criação', () => {
    it('deve criar status inicial como RECEBIDA', () => {
      const status = StatusOrdemServicoVO.inicial()
      expect(status.obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(status.isRecebida()).toBe(true)
    })

    it('deve reconstituir status válido existente', () => {
      const status = StatusOrdemServicoVO.reconstituir('finalizada')
      expect(status.obterValor()).toBe(StatusOrdemServico.FINALIZADA)
      expect(status.isFinalizada()).toBe(true)
    })

    it('deve reconstituir todos os status válidos', () => {
      Object.values(StatusOrdemServico).forEach((valor) => {
        const status = StatusOrdemServicoVO.reconstituir(valor)
        expect(status.obterValor()).toBe(valor)
      })
    })

    it('deve lançar erro ao reconstituir sem valor', () => {
      expect(() => StatusOrdemServicoVO.reconstituir('')).toThrow(DomainException)
      expect(() => StatusOrdemServicoVO.reconstituir('')).toThrow('Status da ordem de serviço é obrigatório')
    })

    it('deve lançar erro ao reconstituir com null', () => {
      expect(() => StatusOrdemServicoVO.reconstituir(null as any)).toThrow(DomainException)
      expect(() => StatusOrdemServicoVO.reconstituir(null as any)).toThrow('Status da ordem de serviço é obrigatório')
    })

    it('deve lançar erro ao reconstituir com undefined', () => {
      expect(() => StatusOrdemServicoVO.reconstituir(undefined as any)).toThrow(DomainException)
      expect(() => StatusOrdemServicoVO.reconstituir(undefined as any)).toThrow(
        'Status da ordem de serviço é obrigatório',
      )
    })

    it('deve lançar erro ao reconstituir com valor inválido', () => {
      expect(() => StatusOrdemServicoVO.reconstituir('invalido')).toThrow(DomainException)
      expect(() => StatusOrdemServicoVO.reconstituir('invalido')).toThrow('Status inválido: invalido')
    })

    it('deve lançar erro para status em maiúscula', () => {
      expect(() => StatusOrdemServicoVO.reconstituir('RECEBIDA')).toThrow(DomainException)
      expect(() => StatusOrdemServicoVO.reconstituir('RECEBIDA')).toThrow('Status inválido: RECEBIDA')
    })
  })

  describe('transições automáticas', () => {
    describe('transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo', () => {
      it('deve transicionar RECEBIDA para EM_DIAGNOSTICO', () => {
        const status = StatusOrdemServicoVO.inicial()
        const novoStatus = status.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()

        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
        expect(novoStatus.isEmDiagnostico()).toBe(true)
        expect(status.isRecebida()).toBe(true) // original não muda
      })

      it('deve lançar erro se não estiver RECEBIDA', () => {
        const emDiagnostico = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
        expect(() => emDiagnostico.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()).toThrow(DomainException)
        expect(() => emDiagnostico.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()).toThrow(
          'Só pode transicionar para EM_DIAGNOSTICO quando status é RECEBIDA',
        )
      })

      it('deve lançar erro para cada status diferente de RECEBIDA', () => {
        const statusList = [
          StatusOrdemServico.EM_DIAGNOSTICO,
          StatusOrdemServico.AGUARDANDO_APROVACAO,
          StatusOrdemServico.EM_EXECUCAO,
          StatusOrdemServico.FINALIZADA,
          StatusOrdemServico.CANCELADA,
          StatusOrdemServico.ENTREGUE,
        ]

        statusList.forEach((statusValue) => {
          const status = StatusOrdemServicoVO.reconstituir(statusValue)
          expect(() => status.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()).toThrow(DomainException)
        })
      })
    })

    describe('transicionarParaAguardandoAprovacaoAoAdicionarItens', () => {
      it('deve transicionar EM_DIAGNOSTICO para AGUARDANDO_APROVACAO', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
        const novoStatus = status.transicionarParaAguardandoAprovacaoAoAdicionarItens()

        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
        expect(novoStatus.isAguardandoAprovacao()).toBe(true)
        expect(status.isEmDiagnostico()).toBe(true) // original não muda
      })

      it('deve lançar erro se não estiver EM_DIAGNOSTICO', () => {
        const recebida = StatusOrdemServicoVO.inicial()
        expect(() => recebida.transicionarParaAguardandoAprovacaoAoAdicionarItens()).toThrow(DomainException)
        expect(() => recebida.transicionarParaAguardandoAprovacaoAoAdicionarItens()).toThrow(
          'Só pode transicionar para AGUARDANDO_APROVACAO quando status é EM_DIAGNOSTICO',
        )
      })

      it('deve lançar erro para cada status diferente de EM_DIAGNOSTICO', () => {
        const statusList = [
          StatusOrdemServico.RECEBIDA,
          StatusOrdemServico.AGUARDANDO_APROVACAO,
          StatusOrdemServico.EM_EXECUCAO,
          StatusOrdemServico.FINALIZADA,
          StatusOrdemServico.CANCELADA,
          StatusOrdemServico.ENTREGUE,
        ]

        statusList.forEach((statusValue) => {
          const status = StatusOrdemServicoVO.reconstituir(statusValue)
          expect(() => status.transicionarParaAguardandoAprovacaoAoAdicionarItens()).toThrow(DomainException)
        })
      })
    })
  })

  describe('transições manuais', () => {
    describe('transições válidas', () => {
      it('deve permitir RECEBIDA → EM_DIAGNOSTICO', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.EM_DIAGNOSTICO)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
      })

      it('deve permitir EM_DIAGNOSTICO → AGUARDANDO_APROVACAO', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.AGUARDANDO_APROVACAO)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
      })

      it('deve permitir AGUARDANDO_APROVACAO → EM_EXECUCAO (aprovado)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      })

      it('deve permitir AGUARDANDO_APROVACAO → CANCELADA (rejeitado)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.CANCELADA)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.CANCELADA)
      })

      it('deve permitir EM_EXECUCAO → FINALIZADA', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.FINALIZADA)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.FINALIZADA)
      })

      it('deve permitir FINALIZADA → ENTREGUE', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.ENTREGUE)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.ENTREGUE)
      })

      it('deve permitir CANCELADA → ENTREGUE', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA)
        const novoStatus = status.transicionarManualmentePara(StatusOrdemServico.ENTREGUE)
        expect(novoStatus.obterValor()).toBe(StatusOrdemServico.ENTREGUE)
      })
    })

    describe('transições inválidas', () => {
      it('deve lançar erro para RECEBIDA → EM_EXECUCAO (pula etapas)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA)
        expect(() => status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)).toThrow(DomainException)
        expect(() => status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)).toThrow(
          'Transição manual inválida de recebida para em_execucao',
        )
      })

      it('deve lançar erro para EM_DIAGNOSTICO → EM_EXECUCAO (pula aprovação)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
        expect(() => status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)).toThrow(DomainException)
      })

      it('deve lançar erro para EM_EXECUCAO → CANCELADA (não pode cancelar em execução)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO)
        expect(() => status.transicionarManualmentePara(StatusOrdemServico.CANCELADA)).toThrow(DomainException)
      })

      it('deve lançar erro para FINALIZADA → EM_EXECUCAO (volta inválida)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA)
        expect(() => status.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)).toThrow(DomainException)
      })

      it('deve lançar erro para ENTREGUE → qualquer status (terminal)', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE)

        Object.values(StatusOrdemServico).forEach((novoStatus) => {
          if (novoStatus !== StatusOrdemServico.ENTREGUE) {
            expect(() => status.transicionarManualmentePara(novoStatus)).toThrow(DomainException)
          }
        })
      })
    })
  })

  describe('métodos de query', () => {
    describe('identificação individual de status', () => {
      it('deve identificar RECEBIDA corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA)
        expect(status.isRecebida()).toBe(true)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar EM_DIAGNOSTICO corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(true)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar AGUARDANDO_APROVACAO corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(true)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar EM_EXECUCAO corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(true)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar FINALIZADA corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(true)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar CANCELADA corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(true)
        expect(status.isEntregue()).toBe(false)
      })

      it('deve identificar ENTREGUE corretamente', () => {
        const status = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE)
        expect(status.isRecebida()).toBe(false)
        expect(status.isEmDiagnostico()).toBe(false)
        expect(status.isAguardandoAprovacao()).toBe(false)
        expect(status.isEmExecucao()).toBe(false)
        expect(status.isFinalizada()).toBe(false)
        expect(status.isCancelada()).toBe(false)
        expect(status.isEntregue()).toBe(true)
      })
    })

    describe('identificação de grupos de status', () => {
      it('deve identificar status em andamento corretamente', () => {
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA).isEmAndamento()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO).isEmAndamento()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO).isEmAndamento()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO).isEmAndamento()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA).isEmAndamento()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA).isEmAndamento()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE).isEmAndamento()).toBe(false)
      })

      it('deve identificar status concluída corretamente', () => {
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA).isConcluida()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO).isConcluida()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO).isConcluida()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO).isConcluida()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA).isConcluida()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA).isConcluida()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE).isConcluida()).toBe(true)
      })
    })

    describe('regras de negócio', () => {
      it('deve indicar corretamente quando pode adicionar itens', () => {
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA).podeAdicionarItens()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO).podeAdicionarItens()).toBe(true)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO).podeAdicionarItens()).toBe(
          false,
        )
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO).podeAdicionarItens()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA).podeAdicionarItens()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA).podeAdicionarItens()).toBe(false)
        expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE).podeAdicionarItens()).toBe(false)
      })
    })
  })

  describe('comparação e conversão', () => {
    it('equals deve retornar true para status iguais', () => {
      const status1 = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA)
      const status2 = StatusOrdemServicoVO.inicial()
      expect(status1.equals(status2)).toBe(true)
    })

    it('equals deve retornar false para status diferentes', () => {
      const status1 = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA)
      const status2 = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(status1.equals(status2)).toBe(false)
    })

    it('equals deve funcionar para todos os status', () => {
      Object.values(StatusOrdemServico).forEach((valor) => {
        const status1 = StatusOrdemServicoVO.reconstituir(valor)
        const status2 = StatusOrdemServicoVO.reconstituir(valor)
        expect(status1.equals(status2)).toBe(true)
      })
    })

    it('toString deve retornar string do status', () => {
      Object.values(StatusOrdemServico).forEach((valor) => {
        const status = StatusOrdemServicoVO.reconstituir(valor)
        expect(status.toString()).toBe(valor)
      })
    })
  })

  describe('imutabilidade', () => {
    it('transições devem retornar nova instância sem modificar a original', () => {
      const original = StatusOrdemServicoVO.inicial()
      const transicionado = original.transicionarParaEmDiagnosticoAoAdicionarClienteVeiculo()

      expect(original.isRecebida()).toBe(true)
      expect(transicionado.isEmDiagnostico()).toBe(true)
      expect(original).not.toBe(transicionado)
    })

    it('transições manuais devem retornar nova instância', () => {
      const original = StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO)
      const transicionado = original.transicionarManualmentePara(StatusOrdemServico.EM_EXECUCAO)

      expect(original.isAguardandoAprovacao()).toBe(true)
      expect(transicionado.isEmExecucao()).toBe(true)
      expect(original).not.toBe(transicionado)
    })
  })

  describe('prioridade', () => {
    it('deve retornar prioridade correta para cada status', () => {
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO).getPrioridade()).toBe(1)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO).getPrioridade()).toBe(2)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO).getPrioridade()).toBe(3)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA).getPrioridade()).toBe(4)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA).getPrioridade()).toBe(999)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE).getPrioridade()).toBe(999)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA).getPrioridade()).toBe(999)
    })

    it('deve ordenar por prioridade corretamente', () => {
      const statuses = [
        StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA),
        StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO),
        StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO),
        StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO),
        StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA),
      ]

      const statusesOrdenados = statuses.sort((a, b) => a.getPrioridade() - b.getPrioridade())

      expect(statusesOrdenados[0].obterValor()).toBe(StatusOrdemServico.EM_EXECUCAO)
      expect(statusesOrdenados[1].obterValor()).toBe(StatusOrdemServico.AGUARDANDO_APROVACAO)
      expect(statusesOrdenados[2].obterValor()).toBe(StatusOrdemServico.EM_DIAGNOSTICO)
      expect(statusesOrdenados[3].obterValor()).toBe(StatusOrdemServico.RECEBIDA)
      expect(statusesOrdenados[4].obterValor()).toBe(StatusOrdemServico.FINALIZADA)
    })
  })

  describe('status em andamento', () => {
    it('deve identificar status em andamento corretamente', () => {
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.RECEBIDA).isEmAndamento()).toBe(true)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_DIAGNOSTICO).isEmAndamento()).toBe(true)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.AGUARDANDO_APROVACAO).isEmAndamento()).toBe(true)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.EM_EXECUCAO).isEmAndamento()).toBe(true)
    })

    it('deve identificar status não em andamento corretamente', () => {
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.FINALIZADA).isEmAndamento()).toBe(false)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.ENTREGUE).isEmAndamento()).toBe(false)
      expect(StatusOrdemServicoVO.reconstituir(StatusOrdemServico.CANCELADA).isEmAndamento()).toBe(false)
    })

    it('deve filtrar apenas status em andamento', () => {
      const todosOsStatus = Object.values(StatusOrdemServico).map((status) => StatusOrdemServicoVO.reconstituir(status))

      const statusEmAndamento = todosOsStatus.filter((status) => status.isEmAndamento())

      expect(statusEmAndamento).toHaveLength(4)
      expect(statusEmAndamento.every((status) => status.isEmAndamento())).toBe(true)
      expect(statusEmAndamento.map((s) => s.obterValor())).toEqual([
        StatusOrdemServico.RECEBIDA,
        StatusOrdemServico.EM_DIAGNOSTICO,
        StatusOrdemServico.AGUARDANDO_APROVACAO,
        StatusOrdemServico.EM_EXECUCAO,
      ])
    })
  })
})
