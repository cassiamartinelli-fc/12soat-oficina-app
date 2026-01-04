import { Cliente } from './cliente.entity'

describe('Cliente Entity', () => {
  describe('Criação', () => {
    it('deve criar cliente válido com CPF', () => {
      const cliente = Cliente.criar({
        nome: 'João Silva',
        cpfCnpj: '50982686056',
        telefone: '11999887766',
      })

      expect(cliente.nome.obterValor()).toBe('João Silva')
      expect(cliente.cpfCnpj.obterValor()).toBe('50982686056')
      expect(cliente.telefone?.obterValor()).toBe('11999887766')
      expect(cliente.isPessoaFisica()).toBe(true)
      expect(cliente.isPessoaJuridica()).toBe(false)
      expect(cliente.possuiTelefone()).toBe(true)
    })

    it('deve criar cliente válido com CNPJ', () => {
      const cliente = Cliente.criar({
        nome: 'Empresa ABC Ltda',
        cpfCnpj: '70894785000179',
      })

      expect(cliente.nome.obterValor()).toBe('Empresa ABC Ltda')
      expect(cliente.cpfCnpj.obterValor()).toBe('70894785000179')
      expect(cliente.telefone).toBeUndefined()
      expect(cliente.isPessoaJuridica()).toBe(true)
      expect(cliente.isPessoaFisica()).toBe(false)
      expect(cliente.possuiTelefone()).toBe(false)
    })

    it('deve criar cliente sem telefone', () => {
      const cliente = Cliente.criar({
        nome: 'Maria Santos',
        cpfCnpj: '50982686056',
      })

      expect(cliente.telefone).toBeUndefined()
      expect(cliente.possuiTelefone()).toBe(false)
    })

    it('deve definir datas de criação e atualização', () => {
      const antes = new Date()
      const cliente = Cliente.criar({
        nome: 'João Silva',
        cpfCnpj: '50982686056',
      })
      const depois = new Date()

      expect(cliente.createdAt.getTime()).toBeGreaterThanOrEqual(antes.getTime())
      expect(cliente.createdAt.getTime()).toBeLessThanOrEqual(depois.getTime())
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(antes.getTime())
      expect(cliente.updatedAt.getTime()).toBeLessThanOrEqual(depois.getTime())
    })
  })

  describe('Reconstituição', () => {
    it('deve reconstituir cliente a partir de dados existentes', () => {
      const props = {
        id: { obterValor: () => '123e4567-e89b-12d3-a456-426614174000' },
        nome: { obterValor: () => 'João Silva' },
        cpfCnpj: { obterValor: () => '50982686056', isCpf: () => true, isCnpj: () => false },
        telefone: { obterValor: () => '11999887766' },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      }

      const cliente = Cliente.reconstituir(props as any)

      expect(cliente.id).toBe(props.id)
      expect(cliente.nome).toBe(props.nome)
      expect(cliente.cpfCnpj).toBe(props.cpfCnpj)
      expect(cliente.telefone).toBe(props.telefone)
      expect(cliente.createdAt).toBe(props.createdAt)
      expect(cliente.updatedAt).toBe(props.updatedAt)
    })
  })

  describe('Métodos de negócio', () => {
    let cliente: Cliente

    beforeEach(() => {
      cliente = Cliente.criar({
        nome: 'João Silva',
        cpfCnpj: '50982686056',
        telefone: '11999887766',
      })
    })

    it('deve atualizar nome', () => {
      const updatedAtAntes = cliente.updatedAt

      // Pequeno delay para garantir diferença no timestamp
      setTimeout(() => {
        cliente.atualizarNome('João Santos')

        expect(cliente.nome.obterValor()).toBe('João Santos')
        expect(cliente.updatedAt.getTime()).toBeGreaterThan(updatedAtAntes.getTime())
      }, 1)
    })

    it('deve atualizar telefone', () => {
      cliente.atualizarTelefone('11888776655')

      expect(cliente.telefone?.obterValor()).toBe('11888776655')
      expect(cliente.possuiTelefone()).toBe(true)
    })

    it('deve remover telefone', () => {
      cliente.atualizarTelefone()

      expect(cliente.telefone).toBeUndefined()
      expect(cliente.possuiTelefone()).toBe(false)
    })

    it('deve atualizar CPF/CNPJ', () => {
      cliente.atualizarCpfCnpj('70894785000179')

      expect(cliente.cpfCnpj.obterValor()).toBe('70894785000179')
      expect(cliente.isPessoaJuridica()).toBe(true)
      expect(cliente.isPessoaFisica()).toBe(false)
    })
  })

  describe('Validações', () => {
    it('deve rejeitar nome inválido', () => {
      expect(() =>
        Cliente.criar({
          nome: 'A',
          cpfCnpj: '50982686056',
        }),
      ).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve rejeitar CPF inválido', () => {
      expect(() =>
        Cliente.criar({
          nome: 'João Silva',
          cpfCnpj: '12345678901',
        }),
      ).toThrow('CPF inválido')
    })

    it('deve rejeitar telefone inválido', () => {
      expect(() =>
        Cliente.criar({
          nome: 'João Silva',
          cpfCnpj: '50982686056',
          telefone: '123',
        }),
      ).toThrow('Telefone deve ter 10 ou 11 dígitos')
    })
  })

  describe('Comparação', () => {
    it('deve comparar clientes pelo ID', () => {
      const cliente1 = Cliente.criar({
        nome: 'João Silva',
        cpfCnpj: '50982686056',
      })

      const cliente2 = Cliente.criar({
        nome: 'Maria Santos',
        cpfCnpj: '70894785000179',
      })

      expect(cliente1.equals(cliente1)).toBe(true)
      expect(cliente1.equals(cliente2)).toBe(false)
    })
  })

  describe('Snapshot', () => {
    it('deve retornar snapshot das propriedades', () => {
      const cliente = Cliente.criar({
        nome: 'João Silva',
        cpfCnpj: '50982686056',
        telefone: '11999887766',
      })

      const snapshot = cliente.toSnapshot()

      expect(snapshot.id).toBe(cliente.id)
      expect(snapshot.nome).toBe(cliente.nome)
      expect(snapshot.cpfCnpj).toBe(cliente.cpfCnpj)
      expect(snapshot.telefone).toBe(cliente.telefone)
      expect(snapshot.createdAt).toBe(cliente.createdAt)
      expect(snapshot.updatedAt).toBe(cliente.updatedAt)
    })
  })
})
