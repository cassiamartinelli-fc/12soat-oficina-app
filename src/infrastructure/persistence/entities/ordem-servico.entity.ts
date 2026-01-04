import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Cliente } from './cliente.entity'
import { Veiculo } from './veiculo.entity'
import { ItemOrdemServico } from './item-ordem-servico.entity'
import { PecaOrdemServico } from './peca-ordem-servico.entity'

export enum StatusOrdemServico {
  RECEBIDA = 'recebida',
  EM_DIAGNOSTICO = 'em_diagnostico',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  EM_EXECUCAO = 'em_execucao',
  CANCELADA = 'cancelada',
  FINALIZADA = 'finalizada',
  ENTREGUE = 'entregue',
}

@Entity('ordens_servico')
export class OrdemServico {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', default: StatusOrdemServico.RECEBIDA })
  status: StatusOrdemServico

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valorTotal: number

  @Column({ name: 'cliente_id', nullable: true })
  clienteId: string | null

  @Column({ name: 'veiculo_id', nullable: true })
  veiculoId: string | null

  @Column({ name: 'data_inicio', nullable: true })
  dataInicio?: Date

  @Column({ name: 'data_fim', nullable: true })
  dataFim?: Date

  @Column({ type: 'integer', name: 'tempo_execucao_minutos', nullable: true })
  tempoExecucaoMinutos?: number

  @ManyToOne(() => Cliente, (cliente) => cliente.ordensServico)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.ordensServico)
  @JoinColumn({ name: 'veiculo_id' })
  veiculo: Veiculo

  @OneToMany(() => ItemOrdemServico, (item) => item.ordemServico)
  servicos: ItemOrdemServico[]

  @OneToMany(() => PecaOrdemServico, (peca) => peca.ordemServico)
  pecas: PecaOrdemServico[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
