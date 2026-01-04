import { ItemPeca, CreateItemPecaProps } from './item-peca.entity'
import { PecaId, OrdemServicoId } from '../../shared/types/entity-id'
import { Quantidade } from '../value-objects/quantidade.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException, DomainException } from '../../shared/exceptions/domain.exception'

describe('ItemPeca Entity', () => {
  const pecaId = 'peca-123'
  const ordemServicoId = 'order-456'
  const precoUnitario = Preco.criar(45.9)

  const validCreateProps: CreateItemPecaProps = {
    pecaId,
    ordemServicoId,
    quantidade: 3,
  }

  describe('Criação', () => {
    it('deve criar um item de peça com dados válidos', () => {
      const item = ItemPeca.criar(validCreateProps, precoUnitario)

      expect(item.pecaId.obterValor()).toBe(pecaId)
      expect(item.ordemServicoId.obterValor()).toBe(ordemServicoId)
      expect(item.quantidade.obterValor()).toBe(3)
      expect(item.precoUnitario.obterValor()).toBe(45.9)
    })

    it('deve lançar exceção para quantidade inválida', () => {
      const props = { ...validCreateProps, quantidade: 0 }

      expect(() => ItemPeca.criar(props, precoUnitario)).toThrow(DomainException)
    })

    it('deve lançar exceção para quantidade negativa', () => {
      const props = { ...validCreateProps, quantidade: -2 }

      expect(() => ItemPeca.criar(props, precoUnitario)).toThrow(DomainException)
    })

    it('deve aceitar quantidade inteira positiva', () => {
      const props = { ...validCreateProps, quantidade: 5 }

      const item = ItemPeca.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(5)
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir um item de peça a partir de props', () => {
      const item = ItemPeca.reconstituir({
        pecaId: PecaId.criar(pecaId),
        ordemServicoId: OrdemServicoId.criar(ordemServicoId),
        quantidade: Quantidade.criar(4),
        precoUnitario: Preco.criar(67.8),
      })

      expect(item.pecaId.obterValor()).toBe(pecaId)
      expect(item.ordemServicoId.obterValor()).toBe(ordemServicoId)
      expect(item.quantidade.obterValor()).toBe(4)
      expect(item.precoUnitario.obterValor()).toBe(67.8)
    })
  })

  describe('Métodos de Negócio', () => {
    let item: ItemPeca

    beforeEach(() => {
      item = ItemPeca.criar(validCreateProps, precoUnitario)
    })

    describe('Cálculos', () => {
      it('deve calcular subtotal corretamente', () => {
        const subtotal = item.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(45.9 * 3) // 137.70
      })

      it('deve calcular subtotal para quantidade unitária', () => {
        const itemUnitario = ItemPeca.criar(
          {
            ...validCreateProps,
            quantidade: 1,
          },
          precoUnitario,
        )

        const subtotal = itemUnitario.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(45.9)
      })

      it('deve calcular subtotal para valores com decimais', () => {
        const precoDecimal = Preco.criar(12.34)
        const itemDecimal = ItemPeca.criar(
          {
            ...validCreateProps,
            quantidade: 2,
          },
          precoDecimal,
        )

        const subtotal = itemDecimal.calcularSubtotal()

        expect(subtotal.obterValor()).toBe(12.34 * 2) // 24.68
      })
    })

    describe('Atualização', () => {
      it('deve criar nova instância com quantidade atualizada', () => {
        const quantidadeAnterior = item.quantidade.obterValor()

        const itemAtualizado = item.atualizarQuantidade(7)

        expect(itemAtualizado.quantidade.obterValor()).toBe(7)
        expect(itemAtualizado.quantidade.obterValor()).not.toBe(quantidadeAnterior)
        expect(item.quantidade.obterValor()).toBe(quantidadeAnterior) // Original não muda
      })

      it('deve lançar exceção ao atualizar quantidade inválida', () => {
        expect(() => item.atualizarQuantidade(0)).toThrow(DomainException)
        expect(() => item.atualizarQuantidade(-3)).toThrow(DomainException)
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
        const outroItem = ItemPeca.criar(
          {
            pecaId: 'outra-peca',
            ordemServicoId,
            quantidade: 1,
          },
          precoUnitario,
        )

        const itemIgual = ItemPeca.criar(validCreateProps, precoUnitario)

        expect(item.equals(outroItem)).toBe(false)
        expect(item.equals(itemIgual)).toBe(true)
      })
    })

    describe('Serialização', () => {
      it('deve gerar snapshot dos dados', () => {
        const snapshot = item.toSnapshot()

        expect(snapshot).toHaveProperty('pecaId')
        expect(snapshot).toHaveProperty('ordemServicoId')
        expect(snapshot).toHaveProperty('quantidade')
        expect(snapshot).toHaveProperty('precoUnitario')

        expect(snapshot.pecaId).toBe(item.pecaId)
        expect(snapshot.ordemServicoId).toBe(item.ordemServicoId)
        expect(snapshot.quantidade).toBe(item.quantidade)
        expect(snapshot.precoUnitario).toBe(item.precoUnitario)
      })
    })
  })

  describe('Validações de Regras de Negócio', () => {
    it('deve validar pecaId obrigatório', () => {
      expect(() => {
        ItemPeca.reconstituir({
          pecaId: null as any,
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(1),
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar ordemServicoId obrigatório', () => {
      expect(() => {
        ItemPeca.reconstituir({
          pecaId: PecaId.criar(pecaId),
          ordemServicoId: null as any,
          quantidade: Quantidade.criar(1),
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar quantidade obrigatória', () => {
      expect(() => {
        ItemPeca.reconstituir({
          pecaId: PecaId.criar(pecaId),
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: null as any,
          precoUnitario,
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar precoUnitario obrigatório', () => {
      expect(() => {
        ItemPeca.reconstituir({
          pecaId: PecaId.criar(pecaId),
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(1),
          precoUnitario: null as any,
        })
      }).toThrow(BusinessRuleException)
    })
  })

  describe('Regras Específicas de Peças', () => {
    it('deve aceitar apenas quantidades inteiras', () => {
      // Peças geralmente são vendidas em unidades inteiras
      const props = { ...validCreateProps, quantidade: 2 }

      const item = ItemPeca.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(2)
      expect(Number.isInteger(item.quantidade.obterValor())).toBe(true)
    })

    it('deve calcular subtotal para grandes quantidades', () => {
      const itemGrande = ItemPeca.criar(
        {
          ...validCreateProps,
          quantidade: 100,
        },
        precoUnitario,
      )

      const subtotal = itemGrande.calcularSubtotal()

      expect(subtotal.obterValor()).toBe(45.9 * 100) // 4590.00
    })
  })

  describe('Casos Extremos', () => {
    it('deve aceitar quantidade mínima válida', () => {
      const props = { ...validCreateProps, quantidade: 1 }

      const item = ItemPeca.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(1)
    })

    it('deve aceitar quantidade muito grande', () => {
      const props = { ...validCreateProps, quantidade: 9999 }

      const item = ItemPeca.criar(props, precoUnitario)

      expect(item.quantidade.obterValor()).toBe(9999)
    })

    it('deve lidar com preços muito baixos', () => {
      const precoMinimo = Preco.criar(0.01)
      const item = ItemPeca.criar(validCreateProps, precoMinimo)

      expect(item.precoUnitario.obterValor()).toBe(0.01)
      expect(item.calcularSubtotal().obterValor()).toBe(0.01 * 3)
    })

    it('deve lidar com preços muito altos', () => {
      const precoAlto = Preco.criar(9999.99)
      const item = ItemPeca.criar(validCreateProps, precoAlto)

      expect(item.precoUnitario.obterValor()).toBe(9999.99)
      expect(item.calcularSubtotal().obterValor()).toBe(9999.99 * 3)
    })
  })
})
