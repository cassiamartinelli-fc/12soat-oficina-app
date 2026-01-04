import { ItemServico, CreateItemServicoProps } from './item-servico.entity'
import { ServicoId, OrdemServicoId } from '../../shared/types/entity-id'
import { Quantidade } from '../value-objects/quantidade.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException, DomainException } from '../../shared/exceptions/domain.exception'

describe('ItemServico Entity', () => {
  const servicoId = 'service-123'
  const ordemServicoId = 'order-456'
  const precoUnitario = Preco.criar(85.5)

  const validCreateProps: CreateItemServicoProps = {
    servicoId,
    ordemServicoId,
    quantidade: 2,
  }

  describe('Criação', () => {
    it('deve criar um item de serviço com dados válidos', () => {
      const item = ItemServico.criar(validCreateProps, precoUnitario)

      expect(item.servicoId.obterValor()).toBe(servicoId)
      expect(item.ordemServicoId.obterValor()).toBe(ordemServicoId)
      expect(item.quantidade.obterValor()).toBe(2)
      expect(item.precoUnitario.obterValor()).toBe(85.5)
    })

    it('deve lançar exceção para quantidade inválida', () => {
      const props = { ...validCreateProps, quantidade: 0 }

      expect(() => ItemServico.criar(props, precoUnitario)).toThrow(DomainException)
    })

    it('deve lançar exceção para quantidade negativa', () => {
      const props = { ...validCreateProps, quantidade: -1 }

      expect(() => ItemServico.criar(props, precoUnitario)).toThrow(DomainException)
    })

    it('deve aceitar quantidade inteira válida', () => {
      const props = { ...validCreateProps, quantidade: 3 }

      const item = ItemServico.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(3)
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir um item de serviço a partir de props', () => {
      const item = ItemServico.reconstituir({
        servicoId: ServicoId.criar(servicoId),
        ordemServicoId: OrdemServicoId.criar(ordemServicoId),
        quantidade: Quantidade.criar(3),
        precoUnitario: Preco.criar(120.0),
      })

      expect(item.servicoId.obterValor()).toBe(servicoId)
      expect(item.ordemServicoId.obterValor()).toBe(ordemServicoId)
      expect(item.quantidade.obterValor()).toBe(3)
      expect(item.precoUnitario.obterValor()).toBe(120.0)
    })
  })

  describe('Métodos de Negócio', () => {
    let item: ItemServico

    beforeEach(() => {
      item = ItemServico.criar(validCreateProps, precoUnitario)
    })

    describe('Cálculos', () => {
      it('deve calcular subtotal corretamente', () => {
        const subtotal = item.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(85.5 * 2) // 171.00
      })

      it('deve calcular subtotal para quantidade maior', () => {
        const itemMaior = ItemServico.criar(
          {
            ...validCreateProps,
            quantidade: 5,
          },
          precoUnitario,
        )

        const subtotal = itemMaior.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(85.5 * 5) // 427.50
      })

      it('deve calcular subtotal para valores com 2 casas decimais', () => {
        const precoComplexo = Preco.criar(33.33)
        const itemComplexo = ItemServico.criar(
          {
            ...validCreateProps,
            quantidade: 3,
          },
          precoComplexo,
        )

        const subtotal = itemComplexo.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(33.33 * 3) // 99.99
      })
    })

    describe('Atualização', () => {
      it('deve criar nova instância com quantidade atualizada', () => {
        const quantidadeAnterior = item.quantidade.obterValor()

        const itemAtualizado = item.atualizarQuantidade(5)

        expect(itemAtualizado.quantidade.obterValor()).toBe(5)
        expect(itemAtualizado.quantidade.obterValor()).not.toBe(quantidadeAnterior)
        expect(item.quantidade.obterValor()).toBe(quantidadeAnterior) // Original não muda
      })

      it('deve lançar exceção ao atualizar quantidade inválida', () => {
        expect(() => item.atualizarQuantidade(0)).toThrow(DomainException)
        expect(() => item.atualizarQuantidade(-1)).toThrow(DomainException)
      })
    })

    describe('Validações', () => {
      it('deve validar se pertence à ordem de serviço', () => {
        const ordemServicoIdObj = OrdemServicoId.criar(ordemServicoId)
        const outraOrdemIdObj = OrdemServicoId.criar('outra-ordem')

        expect(item.pertenceAOrdemServico(ordemServicoIdObj)).toBe(true)
        expect(item.pertenceAOrdemServico(outraOrdemIdObj)).toBe(false)
      })
    })

    describe('Comparação', () => {
      it('deve comparar itens pela identidade composta', () => {
        const outroItem = ItemServico.criar(
          {
            servicoId: 'outro-servico',
            ordemServicoId,
            quantidade: 1,
          },
          precoUnitario,
        )

        const itemIgual = ItemServico.criar(validCreateProps, precoUnitario)

        expect(item.equals(outroItem)).toBe(false)
        expect(item.equals(itemIgual)).toBe(true)
      })
    })
  })

  describe('Validações de Regras de Negócio', () => {
    it('deve validar servicoId obrigatório', () => {
      expect(() => {
        ItemServico.reconstituir({
          servicoId: null as any,
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(1),
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar ordemServicoId obrigatório', () => {
      expect(() => {
        ItemServico.reconstituir({
          servicoId: ServicoId.criar(servicoId),
          ordemServicoId: null as any,
          quantidade: Quantidade.criar(1),
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar quantidade obrigatória', () => {
      expect(() => {
        ItemServico.reconstituir({
          servicoId: ServicoId.criar(servicoId),
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: null as any,
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar precoUnitario obrigatório', () => {
      expect(() => {
        ItemServico.reconstituir({
          servicoId: ServicoId.criar(servicoId),
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(1),
          precoUnitario: null as any,
        })
      }).toThrow(BusinessRuleException)
    })
  })

  describe('Casos Extremos', () => {
    it('deve aceitar quantidade mínima válida', () => {
      const props = { ...validCreateProps, quantidade: 1 }

      const item = ItemServico.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(1)
    })

    it('deve aceitar quantidade muito grande', () => {
      const props = { ...validCreateProps, quantidade: 1000 }

      const item = ItemServico.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(1000)
    })
  })
})
