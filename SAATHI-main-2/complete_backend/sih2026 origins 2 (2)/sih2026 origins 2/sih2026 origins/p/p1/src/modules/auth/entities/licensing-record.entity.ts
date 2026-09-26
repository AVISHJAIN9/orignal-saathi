import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'licensing_records' })
export class LicensingRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  license_id: string; // e.g. "CM/L-8400192831"

  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'varchar', length: 64 })
  standard_number: string; // e.g. "IS 269:2015"

  @Column({ type: 'varchar', length: 128 })
  product_name: string;

  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string; // ACTIVE, EXPIRED, SUSPENDED, SURRENDERED

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'date' })
  valid_till: Date;

  @Column({ type: 'text', nullable: true })
  factory_address: string;

  @OneToMany(() => User, (user) => user.licensing_record)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
