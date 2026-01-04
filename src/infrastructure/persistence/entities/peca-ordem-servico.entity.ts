import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { OrdemServico } from './ordem-servico.entity'
import { Peca } from './peca.entity'

@Entity('peca_ordem_servico')
export class PecaOrdemServico {
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

  @Column({ name: 'peca_id' })
  pecaId: string

  @ManyToOne(() => OrdemServico, (ordemServico) => ordemServico.pecas)
  @JoinColumn({ name: 'ordem_servico_id' })
  ordemServico: OrdemServico

  @ManyToOne(() => Peca)
  @JoinColumn({ name: 'peca_id' })
  peca: Peca
}
