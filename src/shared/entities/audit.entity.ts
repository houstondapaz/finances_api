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
  @Column()
  createdById: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  updatedById: string;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
