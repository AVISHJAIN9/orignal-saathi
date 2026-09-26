import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../common/enums/role.enum';

/**
 * Mirrors P1's credentials table plus the single column D10 owns
 * ("Role field on user table" per the Feature Matrix). Deliberately
 * minimal - password hash, session/JWT fields, and 2FA secrets live in
 * P1's module, not here. When linking into the real app, either:
 *   (a) point this @Entity at the same 'users' table P1 already
 *       defines and drop this duplicate entity in favor of P1's, or
 *   (b) keep this as the single User entity and let P1 add its
 *       auth-specific columns onto it.
 * Either way, `role` is the column this feature is responsible for -
 * see database/migrations for the additive ALTER TABLE.
 */
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PUBLIC,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
