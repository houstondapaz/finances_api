import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'category' })
export class Category extends AuditEntity {
  @Column()
  name: string;
  @Column()
  icon: string;
}
