import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { OrdemServico } from './ordem-servico.entity'

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  nome: string

  @Column({ length: 18, unique: true })
  cpfCnpj: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone?: string

  @OneToMany(() => OrdemServico, (ordemServico) => ordemServico.cliente)
  ordensServico: OrdemServico[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
