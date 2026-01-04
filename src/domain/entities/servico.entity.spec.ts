import { Servico, CreateServicoProps } from './servico.entity'
import { EntityId, ServicoId } from '../../shared/types/entity-id'
import { Nome } from '../value-objects/nome.vo'
import { Preco } from '../value-objects/preco.vo'
import { BusinessRuleException } from '../../shared/exceptions/domain.exception'

describe('Servico Entity', () => {
  const validCreateProps: CreateServicoProps = {
    nome: 'Troca de Óleo',
    preco: 85.5,
  }

  describe('Criação', () => {
    it('deve criar um serviço com dados válidos', () => {
      const servico = Servico.criar(validCreateProps)

      expect(servico.id).toBeInstanceOf(EntityId)
      expect(servico.nome.obterValor()).toBe('Troca de Óleo')
      expect(servico.preco.obterValor()).toBe(85.5)
      expect(servico.createdAt).toBeInstanceOf(Date)
      expect(servico.updatedAt).toBeInstanceOf(Date)
    })

    it('deve lançar exceção para nome vazio', () => {
      const props = { ...validCreateProps, nome: '' }

      expect(() => Servico.criar(props)).toThrow(Error)
      expect(() => Servico.criar(props)).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve lançar exceção para preço inválido', () => {
      const props = { ...validCreateProps, preco: -50 }

      expect(() => Servico.criar(props)).toThrow(Error)
      expect(() => Servico.criar(props)).toThrow('Preço não pode ser negativo')
    })

    it('deve lançar exceção para preço zero', () => {
      const props = { ...validCreateProps, preco: 0 }

      expect(() => Servico.criar(props)).toThrow(Error)
      expect(() => Servico.criar(props)).toThrow('Preço não pode ser zero')
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir um serviço a partir de props', () => {
      const id = ServicoId.gerar()
      const agora = new Date()

      const servico = Servico.reconstituir({
        id,
        nome: Nome.criar('Alinhamento'),
        preco: Preco.criar(120.0),
        createdAt: agora,
        updatedAt: agora,
      })

      expect(servico.id).toBe(id)
      expect(servico.nome.obterValor()).toBe('Alinhamento')
      expect(servico.preco.obterValor()).toBe(120.0)
      expect(servico.createdAt).toBe(agora)
      expect(servico.updatedAt).toBe(agora)
    })
  })

  describe('Métodos de Negócio', () => {
    let servico: Servico

    beforeEach(() => {
      servico = Servico.criar(validCreateProps)
    })

    describe('Atualização de Dados', () => {
      it('deve atualizar o nome', () => {
        const nomeAnterior = servico.nome.obterValor()
        const updatedAtAnterior = servico.updatedAt

        // Pequena pausa para garantir diferença no timestamp
        setTimeout(() => {
          servico.atualizarNome('Balanceamento')

          expect(servico.nome.obterValor()).toBe('Balanceamento')
          expect(servico.nome.obterValor()).not.toBe(nomeAnterior)
          expect(servico.updatedAt).not.toEqual(updatedAtAnterior)
        }, 1)
      })

      it('deve atualizar o preço', () => {
        const precoAnterior = servico.preco.obterValor()
        const updatedAtAnterior = servico.updatedAt

        setTimeout(() => {
          servico.atualizarPreco(95.0)

          expect(servico.preco.obterValor()).toBe(95.0)
          expect(servico.preco.obterValor()).not.toBe(precoAnterior)
          expect(servico.updatedAt).not.toEqual(updatedAtAnterior)
        }, 1)
      })

      it('deve lançar exceção ao atualizar nome vazio', () => {
        expect(() => servico.atualizarNome('')).toThrow(Error)
        expect(() => servico.atualizarNome('')).toThrow('Nome deve ter pelo menos 2 caracteres')
      })

      it('deve lançar exceção ao atualizar preço inválido', () => {
        expect(() => servico.atualizarPreco(-10)).toThrow(Error)
        expect(() => servico.atualizarPreco(-10)).toThrow('Preço não pode ser negativo')
      })
    })

    describe('Cálculos', () => {
      it('deve calcular valor total para quantidade', () => {
        const valorTotal = servico.calcularValorTotal(2)

        expect(valorTotal.obterValor()).toBe(85.5 * 2)
      })

      it('deve calcular valor total para quantidade decimal', () => {
        const valorTotal = servico.calcularValorTotal(1.5)

        expect(valorTotal.obterValor()).toBe(85.5 * 1.5)
      })
    })

    describe('Comparação', () => {
      it('deve comparar serviços pela identidade', () => {
        const outroServico = Servico.criar({
          nome: 'Outro Serviço',
          preco: 100.0,
        })

        expect(servico.equals(outroServico)).toBe(false)
        expect(servico.equals(servico)).toBe(true)
      })
    })

    describe('Serialização', () => {
      it('deve gerar snapshot dos dados', () => {
        const snapshot = servico.toSnapshot()

        expect(snapshot).toHaveProperty('id')
        expect(snapshot).toHaveProperty('nome')
        expect(snapshot).toHaveProperty('preco')
        expect(snapshot).toHaveProperty('createdAt')
        expect(snapshot).toHaveProperty('updatedAt')

        expect(snapshot.id).toBe(servico.id)
        expect(snapshot.nome).toBe(servico.nome)
        expect(snapshot.preco).toBe(servico.preco)
        expect(snapshot.createdAt).toBe(servico.createdAt)
        expect(snapshot.updatedAt).toBe(servico.updatedAt)
      })
    })
  })

  describe('Validações de Regras de Negócio', () => {
    it('deve validar nome obrigatório na criação', () => {
      expect(() => {
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: null as any,
          preco: Preco.criar(100),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow(BusinessRuleException)
      expect(() => {
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: null as any,
          preco: Preco.criar(100),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow('Serviço deve ter um nome')
    })

    it('deve validar preço obrigatório na criação', () => {
      expect(() => {
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: Nome.criar('Teste'),
          preco: null as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow(BusinessRuleException)
      expect(() => {
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: Nome.criar('Teste'),
          preco: null as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }).toThrow('Serviço deve ter um preço')
    })
  })

  describe('Casos Extremos', () => {
    it('deve aceitar preço com muitas casas decimais', () => {
      const servico = Servico.criar({
        nome: 'Serviço Teste',
        preco: 123.45,
      })

      expect(servico.preco.obterValor()).toBe(123.45)
    })

    it('deve aceitar nome com caracteres especiais', () => {
      const servico = Servico.criar({
        nome: 'Troca de Óleo e Filtro',
        preco: 150.0,
      })

      expect(servico.nome.obterValor()).toBe('Troca de Óleo e Filtro')
    })
  })
})
