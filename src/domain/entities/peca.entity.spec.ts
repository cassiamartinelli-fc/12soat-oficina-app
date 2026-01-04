import { Peca, CreatePecaProps } from './peca.entity'
import { EntityId, PecaId } from '../../shared/types/entity-id'
import { Nome } from '../value-objects/nome.vo'
import { Codigo } from '../value-objects/codigo.vo'
import { Preco } from '../value-objects/preco.vo'
import { Estoque } from '../value-objects/estoque.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

describe('Peca Entity', () => {
  const validCreateProps: CreatePecaProps = {
    nome: 'Filtro de Óleo',
    codigo: 'FO-001',
    preco: 25.9,
    quantidadeEstoque: 100,
  }

  describe('Criação', () => {
    it('deve criar uma peça com dados válidos', () => {
      const peca = Peca.criar(validCreateProps)

      expect(peca.id).toBeInstanceOf(EntityId)
      expect(peca.nome.obterValor()).toBe('Filtro de Óleo')
      expect(peca.codigo?.obterValor()).toBe('FO-001')
      expect(peca.preco.obterValor()).toBe(25.9)
      expect(peca.estoque.obterQuantidade()).toBe(100)
      expect(peca.createdAt).toBeInstanceOf(Date)
      expect(peca.updatedAt).toBeInstanceOf(Date)
    })

    it('deve criar uma peça sem código', () => {
      const props = { ...validCreateProps }
      delete props.codigo

      const peca = Peca.criar(props)

      expect(peca.codigo).toBeUndefined()
      expect(peca.possuiCodigo()).toBe(false)
    })

    it('deve criar uma peça com estoque zero por padrão', () => {
      const props = { ...validCreateProps }
      delete props.quantidadeEstoque

      const peca = Peca.criar(props)

      expect(peca.estoque.obterQuantidade()).toBe(0)
      expect(peca.temEstoque()).toBe(false)
    })

    it('deve lançar exceção para nome vazio', () => {
      const props = { ...validCreateProps, nome: '' }

      expect(() => Peca.criar(props)).toThrow(Error)
      expect(() => Peca.criar(props)).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve lançar exceção para preço inválido', () => {
      const props = { ...validCreateProps, preco: -10 }

      expect(() => Peca.criar(props)).toThrow(Error)
      expect(() => Peca.criar(props)).toThrow('Preço não pode ser negativo')
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir uma peça a partir de props', () => {
      const id = PecaId.gerar()
      const agora = new Date()

      const peca = Peca.reconstituir({
        id,
        nome: Nome.criar('Pastilha de Freio'),
        codigo: Codigo.criar('PF-002'),
        preco: Preco.criar(89.5),
        estoque: Estoque.criar(50),
        createdAt: agora,
        updatedAt: agora,
      })

      expect(peca.id).toBe(id)
      expect(peca.nome.obterValor()).toBe('Pastilha de Freio')
      expect(peca.codigo?.obterValor()).toBe('PF-002')
      expect(peca.preco.obterValor()).toBe(89.5)
      expect(peca.estoque.obterQuantidade()).toBe(50)
    })
  })

  describe('Métodos de Negócio', () => {
    let peca: Peca

    beforeEach(() => {
      peca = Peca.criar(validCreateProps)
    })

    describe('Atualização de Dados', () => {
      it('deve atualizar o nome', () => {
        const nomeAnterior = peca.nome.obterValor()
        const updatedAtAnterior = peca.updatedAt

        // Pequena pausa para garantir diferença no timestamp
        setTimeout(() => {
          peca.atualizarNome('Filtro de Ar')

          expect(peca.nome.obterValor()).toBe('Filtro de Ar')
          expect(peca.nome.obterValor()).not.toBe(nomeAnterior)
          expect(peca.updatedAt).not.toEqual(updatedAtAnterior)
        }, 1)
      })

      it('deve atualizar o código', () => {
        peca.atualizarCodigo('FA-001')

        expect(peca.codigo?.obterValor()).toBe('FA-001')
        expect(peca.possuiCodigo()).toBe(true)
      })

      it('deve remover o código', () => {
        peca.atualizarCodigo()

        expect(peca.codigo).toBeUndefined()
        expect(peca.possuiCodigo()).toBe(false)
      })

      it('deve atualizar o preço', () => {
        peca.atualizarPreco(35.5)

        expect(peca.preco.obterValor()).toBe(35.5)
      })
    })

    describe('Gestão de Estoque', () => {
      it('deve repor estoque', () => {
        const estoqueAnterior = peca.estoque.obterQuantidade()

        peca.reporEstoque(50)

        expect(peca.estoque.obterQuantidade()).toBe(estoqueAnterior + 50)
      })

      it('deve baixar estoque quando há quantidade suficiente', () => {
        peca.reporEstoque(50) // Total: 150
        const estoqueAnterior = peca.estoque.obterQuantidade()

        peca.baixarEstoque(30)

        expect(peca.estoque.obterQuantidade()).toBe(estoqueAnterior - 30)
      })

      it('deve lançar exceção ao baixar estoque insuficiente', () => {
        expect(() => peca.baixarEstoque(200)).toThrow(BusinessRuleException)
        expect(() => peca.baixarEstoque(200)).toThrow(/Estoque insuficiente/)
      })

      it('deve verificar se tem estoque', () => {
        expect(peca.temEstoque()).toBe(true)

        const pecaSemEstoque = Peca.criar({
          ...validCreateProps,
          quantidadeEstoque: 0,
        })

        expect(pecaSemEstoque.temEstoque()).toBe(false)
      })

      it('deve verificar se tem estoque suficiente', () => {
        expect(peca.temEstoqueSuficiente(50)).toBe(true)
        expect(peca.temEstoqueSuficiente(100)).toBe(true)
        expect(peca.temEstoqueSuficiente(150)).toBe(false)
      })
    })

    describe('Cálculos', () => {
      it('deve calcular valor total para quantidade', () => {
        const valorTotal = peca.calcularValorTotal(3)

        expect(valorTotal.obterValor()).toBe(77.7)
      })
    })

    describe('Comparação', () => {
      it('deve comparar peças pela identidade', () => {
        const outraPeca = Peca.criar({
          nome: 'Outra Peça',
          preco: 50.0,
        })

        expect(peca.equals(outraPeca)).toBe(false)
        expect(peca.equals(peca)).toBe(true)
      })
    })

    describe('Serialização', () => {
      it('deve gerar snapshot dos dados', () => {
        const snapshot = peca.toSnapshot()

        expect(snapshot).toHaveProperty('id')
        expect(snapshot).toHaveProperty('nome')
        expect(snapshot).toHaveProperty('codigo')
        expect(snapshot).toHaveProperty('preco')
        expect(snapshot).toHaveProperty('estoque')
        expect(snapshot).toHaveProperty('createdAt')
        expect(snapshot).toHaveProperty('updatedAt')
      })
    })
  })

  describe('Validações de Regras de Negócio', () => {
    it('deve validar nome obrigatório', () => {
      expect(() => {
        Peca.reconstituir({
          id: PecaId.gerar(),
          nome: null as any,
          preco: Preco.criar(10),
          estoque: Estoque.criar(1),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow(BusinessRuleException)
    })

    it('deve validar preço obrigatório', () => {
      expect(() => {
        Peca.reconstituir({
          id: PecaId.gerar(),
          nome: Nome.criar('Teste'),
          preco: null as any,
          estoque: Estoque.criar(1),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow(BusinessRuleException)
    })
  })
})
