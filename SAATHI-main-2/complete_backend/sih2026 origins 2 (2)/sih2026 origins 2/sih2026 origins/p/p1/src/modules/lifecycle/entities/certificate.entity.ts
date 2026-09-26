import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LicensingRecord } from '../../auth/entities/licensing-record.entity';

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, name: 'license_id' })
  license_id: string;

  @ManyToOne(() => LicensingRecord, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'license_id', referencedColumnName: 'license_id' })
  licensing_record?: LicensingRecord;

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'date' })
  valid_till: Date;

  @Column({ type: 'varchar', length: 32, default: 'VALID' })
  status: string; // VALID, EXPIRED, SUSPENDED, REVOKED

  @Column({ type: 'varchar', length: 512, nullable: true })
  file_reference: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  pdf_url: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  qr_code_hash?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
