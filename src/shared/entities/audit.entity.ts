import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class AuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  createdById: string;
  @CreateDateColumn()
  createdAt: Date;
  updatedById: string;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
