import { Nome } from './nome.vo'

describe('Nome', () => {
  describe('criar', () => {
    it('deve criar um nome válido com letras', () => {
      const nome = Nome.criar('João Silva')
      expect(nome.obterValor()).toBe('João Silva')
    })

    it('deve criar um nome válido com acentos', () => {
      const nome = Nome.criar('José María')
      expect(nome.obterValor()).toBe('José María')
    })

    it('deve criar um nome válido com números (para peças automotivas)', () => {
      const nome = Nome.criar('Filtro AR123')
      expect(nome.obterValor()).toBe('Filtro AR123')
    })

    it('deve criar um nome válido com hífen', () => {
      const nome = Nome.criar('Ana-Paula')
      expect(nome.obterValor()).toBe('Ana-Paula')
    })

    it('deve criar um nome válido com apostrofe', () => {
      const nome = Nome.criar("D'Angelo")
      expect(nome.obterValor()).toBe("D'Angelo")
    })

    it('deve criar um nome válido com caracteres especiais automotivos', () => {
      const nome = Nome.criar('Óleo 5W-30 (Motor) 100% Sintético')
      expect(nome.obterValor()).toBe('Óleo 5W-30 (Motor) 100% Sintético')
    })

    it('deve criar um nome válido com ampersand', () => {
      const nome = Nome.criar('Peças & Acessórios')
      expect(nome.obterValor()).toBe('Peças & Acessórios')
    })

    it('deve criar um nome válido com ponto e vírgula', () => {
      const nome = Nome.criar('Filtro 1.0L, 16V')
      expect(nome.obterValor()).toBe('Filtro 1.0L, 16V')
    })

    it('deve criar um nome válido com percentual e graus', () => {
      const nome = Nome.criar('Aditivo 50% - 90°C')
      expect(nome.obterValor()).toBe('Aditivo 50% - 90°C')
    })

    it('deve criar um nome válido com cerquilha', () => {
      const nome = Nome.criar('Peça #123456')
      expect(nome.obterValor()).toBe('Peça #123456')
    })

    it('deve normalizar espaços múltiplos', () => {
      const nome = Nome.criar('João   Silva')
      expect(nome.obterValor()).toBe('João Silva')
    })

    it('deve remover espaços no início e fim', () => {
      const nome = Nome.criar('  João Silva  ')
      expect(nome.obterValor()).toBe('João Silva')
    })

    it('deve normalizar espaços múltiplos e bordas', () => {
      const nome = Nome.criar('  João   Silva  ')
      expect(nome.obterValor()).toBe('João Silva')
    })
  })

  describe('validações', () => {
    it('deve lançar erro para nome vazio', () => {
      expect(() => Nome.criar('')).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve lançar erro para nome apenas com espaços', () => {
      expect(() => Nome.criar('   ')).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve lançar erro para nome com 1 caractere', () => {
      expect(() => Nome.criar('A')).toThrow('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve aceitar nome com exatamente 2 caracteres', () => {
      const nome = Nome.criar('AB')
      expect(nome.obterValor()).toBe('AB')
    })

    it('deve aceitar nome com exatamente 100 caracteres', () => {
      const nomeGrande = 'A'.repeat(100)
      const nome = Nome.criar(nomeGrande)
      expect(nome.obterValor()).toBe(nomeGrande)
    })

    it('deve lançar erro para nome com mais de 100 caracteres', () => {
      const nomeGrande = 'A'.repeat(101)
      expect(() => Nome.criar(nomeGrande)).toThrow('Nome deve ter no máximo 100 caracteres')
    })

    it('deve lançar erro para caracteres não permitidos', () => {
      expect(() => Nome.criar('João@Silva')).toThrow('Nome contém caracteres não permitidos')
    })

    it('deve lançar erro para caracteres especiais não permitidos', () => {
      expect(() => Nome.criar('João$Silva')).toThrow('Nome contém caracteres não permitidos')
    })

    it('deve lançar erro para underline', () => {
      expect(() => Nome.criar('João_Silva')).toThrow('Nome contém caracteres não permitidos')
    })

    it('deve lançar erro para asterisco', () => {
      expect(() => Nome.criar('João*Silva')).toThrow('Nome contém caracteres não permitidos')
    })
  })

  describe('obterPrimeiroNome', () => {
    it('deve retornar o primeiro nome', () => {
      const nome = Nome.criar('João Silva Santos')
      expect(nome.obterPrimeiroNome()).toBe('João')
    })

    it('deve retornar o nome completo se houver apenas uma palavra', () => {
      const nome = Nome.criar('João')
      expect(nome.obterPrimeiroNome()).toBe('João')
    })

    it('deve retornar o primeiro nome com hífen', () => {
      const nome = Nome.criar('Ana-Paula Silva')
      expect(nome.obterPrimeiroNome()).toBe('Ana-Paula')
    })
  })

  describe('obterUltimoNome', () => {
    it('deve retornar o último nome', () => {
      const nome = Nome.criar('João Silva Santos')
      expect(nome.obterUltimoNome()).toBe('Santos')
    })

    it('deve retornar o nome completo se houver apenas uma palavra', () => {
      const nome = Nome.criar('João')
      expect(nome.obterUltimoNome()).toBe('João')
    })

    it('deve retornar o último nome com hífen', () => {
      const nome = Nome.criar('João Silva-Santos')
      expect(nome.obterUltimoNome()).toBe('Silva-Santos')
    })
  })

  describe('equals', () => {
    it('deve retornar true para nomes iguais', () => {
      const nome1 = Nome.criar('João Silva')
      const nome2 = Nome.criar('João Silva')
      expect(nome1.equals(nome2)).toBe(true)
    })

    it('deve retornar false para nomes diferentes', () => {
      const nome1 = Nome.criar('João Silva')
      const nome2 = Nome.criar('Maria Santos')
      expect(nome1.equals(nome2)).toBe(false)
    })

    it('deve retornar true para nomes iguais após normalização', () => {
      const nome1 = Nome.criar('João Silva')
      const nome2 = Nome.criar('  João   Silva  ')
      expect(nome1.equals(nome2)).toBe(true)
    })

    it('deve ser case sensitive', () => {
      const nome1 = Nome.criar('João Silva')
      const nome2 = Nome.criar('joão silva')
      expect(nome1.equals(nome2)).toBe(false)
    })
  })

  describe('casos específicos automotivos', () => {
    it('deve aceitar nomes de peças com códigos', () => {
      const nome = Nome.criar('Pastilha de Freio AK-1234')
      expect(nome.obterValor()).toBe('Pastilha de Freio AK-1234')
    })

    it('deve aceitar especificações técnicas', () => {
      const nome = Nome.criar('Óleo Motor 5W-30 API SN/CF (1L)')
      expect(nome.obterValor()).toBe('Óleo Motor 5W-30 API SN/CF (1L)')
    })

    it('deve aceitar nomes com percentuais e temperaturas', () => {
      const nome = Nome.criar('Aditivo Radiador 50% + Proteção -37°C')
      expect(nome.obterValor()).toBe('Aditivo Radiador 50% + Proteção -37°C')
    })

    it('deve aceitar nomes com múltiplos símbolos', () => {
      const nome = Nome.criar('Kit Embreagem 1.0/1.4 16V (Disco + Platô)')
      expect(nome.obterValor()).toBe('Kit Embreagem 1.0/1.4 16V (Disco + Platô)')
    })
  })
})
