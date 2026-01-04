import { Codigo } from './codigo.vo'

describe('Codigo', () => {
  describe('criar()', () => {
    it('deve criar instância válida com valor normalizado', () => {
      const codigo = Codigo.criar(' abc123 ')
      expect(codigo.obterValor()).toBe('ABC123')
    })

    it('deve lançar erro se valor for vazio', () => {
      expect(() => Codigo.criar('')).toThrow('Código não pode estar vazio')
    })

    it('deve lançar erro se valor tiver mais de 50 caracteres', () => {
      const valorLongo = 'A'.repeat(51)
      expect(() => Codigo.criar(valorLongo)).toThrow('Código deve ter no máximo 50 caracteres')
    })

    it('deve lançar erro se valor contiver caracteres inválidos', () => {
      expect(() => Codigo.criar('ABC@123')).toThrow('Código deve conter apenas letras, números, hífens e underscores')
    })

    it('deve aceitar letras, números, hífens e underscores', () => {
      const codigo = Codigo.criar('abc-123_xyz')
      expect(codigo.obterValor()).toBe('ABC-123_XYZ')
    })
  })

  describe('criarOpcional()', () => {
    it('deve retornar undefined se valor for null', () => {
      expect(Codigo.criarOpcional(null)).toBeUndefined()
    })

    it('deve retornar undefined se valor for undefined', () => {
      expect(Codigo.criarOpcional(undefined)).toBeUndefined()
    })

    it('deve retornar undefined se valor for string vazia', () => {
      expect(Codigo.criarOpcional('   ')).toBeUndefined()
    })

    it('deve criar instância válida se valor for informado', () => {
      const codigo = Codigo.criarOpcional('abc')
      expect(codigo).toBeInstanceOf(Codigo)
      expect(codigo?.obterValor()).toBe('ABC')
    })
  })

  describe('obterValor()', () => {
    it('deve retornar o valor armazenado', () => {
      const codigo = Codigo.criar('teste')
      expect(codigo.obterValor()).toBe('TESTE')
    })
  })

  describe('equals()', () => {
    it('deve retornar true para códigos iguais', () => {
      const c1 = Codigo.criar('abc')
      const c2 = Codigo.criar('ABC')
      expect(c1.equals(c2)).toBe(true)
    })

    it('deve retornar false para códigos diferentes', () => {
      const c1 = Codigo.criar('abc')
      const c2 = Codigo.criar('xyz')
      expect(c1.equals(c2)).toBe(false)
    })
  })
})
