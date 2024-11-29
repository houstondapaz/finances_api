import { Category } from 'src/category/entities/category.entity';
import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'transaction' })
export class Transaction extends AuditEntity {
  @Column()
  value: number;
  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;
  @Column()
  description?: string;
}
