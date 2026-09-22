import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LicensingRecord } from './licensing-record.entity';

export enum UserRole {
  PUBLIC = 'public',
  INDUSTRY = 'industry',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PUBLIC,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'license_id' })
  license_id?: string;

  @ManyToOne(() => LicensingRecord, (record) => record.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'license_id', referencedColumnName: 'license_id' })
  licensing_record?: LicensingRecord;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
