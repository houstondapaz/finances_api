import { Category } from 'src/category/entities/category.entity';
import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Transaction extends AuditEntity {
  @Column({ type: 'float' })
  value: number;

  @ManyToOne(() => Category, { nullable: false })
  category: Category;

  @Column()
  description?: string;
}
