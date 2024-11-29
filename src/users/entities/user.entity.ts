import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class User extends AuditEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  thumbURL?: string;
}
