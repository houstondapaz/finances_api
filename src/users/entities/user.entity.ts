import { AuditEntity } from 'src/shared/entities/audit.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AuditEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  thumbURL?: string;
}
