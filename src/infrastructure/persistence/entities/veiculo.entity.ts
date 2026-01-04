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
import { OrdemServico } from './ordem-servico.entity'

@Entity('veiculos')
export class Veiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 8 })
  placa: string

  @Column({ length: 50 })
  marca: string

  @Column({ length: 50 })
  modelo: string

  @Column()
  ano: number

  @Column({ name: 'cliente_id' })
  clienteId: string

  @ManyToOne(() => Cliente, (cliente) => cliente.ordensServico)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente

  @OneToMany(() => OrdemServico, (ordemServico) => ordemServico.veiculo)
  ordensServico: OrdemServico[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
