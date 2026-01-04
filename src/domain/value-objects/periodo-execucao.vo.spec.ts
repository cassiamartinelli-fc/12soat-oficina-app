import { PeriodoExecucao } from './periodo-execucao.vo'

describe('PeriodoExecucao', () => {
  const hoje = new Date(2025, 0, 1)
  const amanha = new Date(2025, 0, 2)

  describe('criar()', () => {
    it('deve criar período válido com início e fim', () => {
      const periodo = PeriodoExecucao.criar(hoje, amanha)
      expect(periodo.obterDataInicio()).toEqual(hoje)
      expect(periodo.obterDataFim()).toEqual(amanha)
    })

    it('deve criar período válido apenas com início', () => {
      const periodo = PeriodoExecucao.criar(hoje)
      expect(periodo.obterDataInicio()).toEqual(hoje)
      expect(periodo.obterDataFim()).toBeNull()
    })

    it('deve lançar erro se início for posterior ao fim', () => {
      expect(() => PeriodoExecucao.criar(amanha, hoje)).toThrow('Data de início não pode ser posterior à data de fim')
    })

    it('deve lançar erro se tiver fim sem início', () => {
      expect(() => PeriodoExecucao.criar(undefined, amanha)).toThrow(
        'Não é possível definir data de fim sem data de início',
      )
    })
  })

  describe('iniciar()', () => {
    it('deve criar período iniciado sem fim', () => {
      const periodo = PeriodoExecucao.iniciar(hoje)
      expect(periodo.isIniciado()).toBe(true)
      expect(periodo.isFinalizado()).toBe(false)
    })

    it('deve lançar erro se data de início for nula', () => {
      // @ts-expect-error para simular passagem inválida
      expect(() => PeriodoExecucao.iniciar(null)).toThrow('Data de início é obrigatória')
    })
  })

  describe('finalizar() (estático)', () => {
    it('deve criar período finalizado', () => {
      const periodo = PeriodoExecucao.finalizar(hoje, amanha)
      expect(periodo.isFinalizado()).toBe(true)
    })

    it('deve lançar erro se faltar datas', () => {
      // @ts-expect-error para simular passagem inválida
      expect(() => PeriodoExecucao.finalizar(null, amanha)).toThrow('Datas de início e fim são obrigatórias')
    })

    it('deve lançar erro se início for posterior ao fim', () => {
      expect(() => PeriodoExecucao.finalizar(amanha, hoje)).toThrow(
        'Data de início não pode ser posterior à data de fim',
      )
    })
  })

  describe('finalizar() (instância)', () => {
    it('deve finalizar período iniciado', () => {
      const periodo = PeriodoExecucao.iniciar(hoje).finalizar(amanha)
      expect(periodo.isFinalizado()).toBe(true)
    })

    it('deve lançar erro se tentar finalizar sem iniciar', () => {
      const periodo = PeriodoExecucao.criar()
      expect(() => periodo.finalizar(hoje)).toThrow('Não é possível finalizar um período que não foi iniciado')
    })

    it('deve lançar erro se já finalizado', () => {
      const periodo = PeriodoExecucao.finalizar(hoje, amanha)
      expect(() => periodo.finalizar(amanha)).toThrow('Período já foi finalizado')
    })

    it('deve lançar erro se data de fim for anterior ao início', () => {
      const periodo = PeriodoExecucao.iniciar(hoje)
      expect(() => periodo.finalizar(new Date(2024, 11, 31))).toThrow(
        'Data de fim não pode ser anterior à data de início',
      )
    })
  })

  describe('calcularDuracaoDias()', () => {
    it('deve retornar null se não iniciado', () => {
      const periodo = PeriodoExecucao.criar()
      expect(periodo.calcularDuracaoDias()).toBeNull()
    })

    it('deve retornar null se iniciado mas não finalizado', () => {
      const periodo = PeriodoExecucao.iniciar(hoje)
      expect(periodo.calcularDuracaoDias()).toBeNull()
    })

    it('deve retornar duração correta', () => {
      const inicio = new Date(2025, 0, 1)
      const fim = new Date(2025, 0, 3)
      const periodo = PeriodoExecucao.finalizar(inicio, fim)
      expect(periodo.calcularDuracaoDias()).toBe(2)
    })
  })

  describe('equals()', () => {
    it('deve retornar true para períodos iguais', () => {
      const p1 = PeriodoExecucao.finalizar(hoje, amanha)
      const p2 = PeriodoExecucao.finalizar(hoje, amanha)
      expect(p1.equals(p2)).toBe(true)
    })

    it('deve retornar false para períodos diferentes', () => {
      const p1 = PeriodoExecucao.finalizar(hoje, amanha)
      const p2 = PeriodoExecucao.finalizar(hoje, new Date(2025, 0, 3))
      expect(p1.equals(p2)).toBe(false)
    })
  })

  describe('toString()', () => {
    it('deve retornar "Não iniciado" se não iniciado', () => {
      expect(PeriodoExecucao.criar().toString()).toBe('Não iniciado')
    })

    it('deve retornar string com data de início se iniciado mas não finalizado', () => {
      const periodo = PeriodoExecucao.iniciar(hoje)
      expect(periodo.toString()).toContain('Iniciado em:')
    })

    it('deve retornar string com início, fim e duração se finalizado', () => {
      const periodo = PeriodoExecucao.finalizar(hoje, amanha)
      const str = periodo.toString()
      expect(str).toContain(hoje.toLocaleDateString())
      expect(str).toContain(amanha.toLocaleDateString())
      expect(str).toMatch(/\(\d+ dias\)/)
    })
  })
})
