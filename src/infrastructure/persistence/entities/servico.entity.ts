import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  nome: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number

  @Column({ default: 60 })
  tempoEstimadoMinutos: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
