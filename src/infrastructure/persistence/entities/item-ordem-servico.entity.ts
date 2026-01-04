import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { OrdemServico } from './ordem-servico.entity'
import { Servico } from './servico.entity'

@Entity('item_ordem_servico')
export class ItemOrdemServico {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantidade: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoUnitario: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number

  @Column({ name: 'ordem_servico_id' })
  ordemServicoId: string

  @Column({ name: 'servico_id' })
  servicoId: string

  @ManyToOne(() => OrdemServico, (ordemServico) => ordemServico.servicos)
  @JoinColumn({ name: 'ordem_servico_id' })
  ordemServico: OrdemServico

  @ManyToOne(() => Servico)
  @JoinColumn({ name: 'servico_id' })
  servico: Servico
}
