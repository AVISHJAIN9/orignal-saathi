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

@Entity({ name: 'payments_fees' })
export class PaymentFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, name: 'license_id' })
  license_id: string;

  @ManyToOne(() => LicensingRecord, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'license_id', referencedColumnName: 'license_id' })
  licensing_record?: LicensingRecord;

  @Column({ type: 'varchar', length: 64, nullable: true })
  applicant_id?: string;

  @Column({ type: 'varchar', length: 64 })
  fee_type: string; // APPLICATION_FEE, ANNUAL_LICENSE_FEE, INSPECTION_FEE, MARKING_FEE

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  gst_amount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_amount: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'varchar', length: 32, default: 'PENDING' })
  status: string; // PENDING, PAID, OVERDUE, RECONCILED

  @Column({ type: 'varchar', length: 128, nullable: true })
  payment_gateway_ref?: string; // Razorpay payment ID e.g. pay_N239kdj3

  @Column({ type: 'timestamptz', nullable: true })
  paid_at?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
