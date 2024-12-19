import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Budget extends AuditEntity {
  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'date' })
  date: Date;
}
