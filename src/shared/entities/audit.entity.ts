import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
export class AuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  createdById?: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ nullable: true })
  updatedById?: string;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ nullable: true })
  deletedBy?: string;
  @DeleteDateColumn()
  deletedAt: Date;
}
