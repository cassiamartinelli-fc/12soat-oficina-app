import { OrdemServicoEmAndamentoMapper } from './ordem-servico-em-andamento.mapper'
import { OrdemServico, OrdemServicoProps } from '../../domain/entities/ordem-servico.entity'
import { StatusOrdemServico, StatusOrdemServicoVO } from '../../domain/value-objects/status-ordem-servico.vo'
import { OrdemServicoId } from '../../shared/types/entity-id'
import { Preco } from '../../domain/value-objects/preco.vo'
import { PeriodoExecucao } from '../../domain/value-objects/periodo-execucao.vo'

describe('OrdemServicoEmAndamentoMapper', () => {
  let mapper: OrdemServicoEmAndamentoMapper

  const createMockOrdemServico = (id: string, status: StatusOrdemServico, dataCriacao: Date): OrdemServico => {
    const props: OrdemServicoProps = {
      id: OrdemServicoId.criar(id),
      status: StatusOrdemServicoVO.reconstituir(status),
      valorTotal: Preco.zero(),
      periodoExecucao: PeriodoExecucao.criar(),
      createdAt: dataCriacao,
      updatedAt: dataCriacao,
    }
    return OrdemServico.reconstituir(props)
  }

  beforeEach(() => {
    mapper = new OrdemServicoEmAndamentoMapper()
  })

  describe('toDto', () => {
    it('deve converter OrdemServico para OrdemServicoEmAndamentoDto corretamente', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000'
      const status = StatusOrdemServico.EM_EXECUCAO
      const dataCriacao = new Date('2025-01-15T10:30:00.000Z')

      const ordemServico = createMockOrdemServico(id, status, dataCriacao)

      const resultado = mapper.toDto(ordemServico)

      expect(resultado).toEqual({
        id,
        status,
        dataCriacao,
      })
    })

    it('deve converter todos os status em andamento corretamente', () => {
      const statusEmAndamento = [
        StatusOrdemServico.RECEBIDA,
        StatusOrdemServico.EM_DIAGNOSTICO,
        StatusOrdemServico.AGUARDANDO_APROVACAO,
        StatusOrdemServico.EM_EXECUCAO,
      ]

      const dataCriacao = new Date('2025-01-15T10:30:00.000Z')

      statusEmAndamento.forEach((status, index) => {
        const id = `id-${index}`
        const ordemServico = createMockOrdemServico(id, status, dataCriacao)

        const resultado = mapper.toDto(ordemServico)

        expect(resultado.id).toBe(id)
        expect(resultado.status).toBe(status)
        expect(resultado.dataCriacao).toBe(dataCriacao)
      })
    })

    it('deve preservar a data de criação exata', () => {
      const dataCriacao = new Date('2025-01-15T10:30:25.123Z') // Com milissegundos
      const ordemServico = createMockOrdemServico('id-1', StatusOrdemServico.RECEBIDA, dataCriacao)

      const resultado = mapper.toDto(ordemServico)

      expect(resultado.dataCriacao).toBe(dataCriacao)
      expect(resultado.dataCriacao.getTime()).toBe(dataCriacao.getTime())
    })
  })

  describe('toDtoList', () => {
    it('deve converter lista de OrdemServico para lista de DTOs', () => {
      const dataCriacao = new Date('2025-01-15T10:30:00.000Z')
      const ordensServico = [
        createMockOrdemServico('id-1', StatusOrdemServico.EM_EXECUCAO, dataCriacao),
        createMockOrdemServico('id-2', StatusOrdemServico.AGUARDANDO_APROVACAO, dataCriacao),
        createMockOrdemServico('id-3', StatusOrdemServico.RECEBIDA, dataCriacao),
      ]

      const resultado = mapper.toDtoList(ordensServico)

      expect(resultado).toHaveLength(3)
      expect(resultado[0]).toEqual({
        id: 'id-1',
        status: StatusOrdemServico.EM_EXECUCAO,
        dataCriacao,
      })
      expect(resultado[1]).toEqual({
        id: 'id-2',
        status: StatusOrdemServico.AGUARDANDO_APROVACAO,
        dataCriacao,
      })
      expect(resultado[2]).toEqual({
        id: 'id-3',
        status: StatusOrdemServico.RECEBIDA,
        dataCriacao,
      })
    })

    it('deve retornar lista vazia para entrada vazia', () => {
      const resultado = mapper.toDtoList([])

      expect(resultado).toEqual([])
    })

    it('deve converter lista com uma única ordem', () => {
      const dataCriacao = new Date('2025-01-15T10:30:00.000Z')
      const ordemServico = createMockOrdemServico('id-unico', StatusOrdemServico.EM_DIAGNOSTICO, dataCriacao)

      const resultado = mapper.toDtoList([ordemServico])

      expect(resultado).toHaveLength(1)
      expect(resultado[0]).toEqual({
        id: 'id-unico',
        status: StatusOrdemServico.EM_DIAGNOSTICO,
        dataCriacao,
      })
    })

    it('deve preservar a ordem da lista original', () => {
      const dataCriacao = new Date('2025-01-15T10:30:00.000Z')
      const ordensServico = [
        createMockOrdemServico('terceiro', StatusOrdemServico.RECEBIDA, dataCriacao),
        createMockOrdemServico('primeiro', StatusOrdemServico.EM_EXECUCAO, dataCriacao),
        createMockOrdemServico('segundo', StatusOrdemServico.AGUARDANDO_APROVACAO, dataCriacao),
      ]

      const resultado = mapper.toDtoList(ordensServico)

      expect(resultado.map((dto) => dto.id)).toEqual(['terceiro', 'primeiro', 'segundo'])
    })
  })
})
