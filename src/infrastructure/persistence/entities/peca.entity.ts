import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('pecas')
export class Peca {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  nome: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo?: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number

  @Column({ default: 0 })
  quantidadeEstoque: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
