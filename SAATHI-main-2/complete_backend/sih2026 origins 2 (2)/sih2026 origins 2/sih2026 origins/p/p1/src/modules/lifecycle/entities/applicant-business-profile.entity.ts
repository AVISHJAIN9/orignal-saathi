import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'applicant_business_profiles' })
export class ApplicantBusinessProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  business_name: string;

  @Column({ type: 'varchar', length: 64 })
  registration_number: string; // PAN / CIN / Udyam

  @Column({ type: 'varchar', length: 64, default: 'PRIVATE_LTD' })
  business_type: string; // PRIVATE_LTD, PROPRIETORSHIP, PARTNERSHIP, LLP

  @Column({ type: 'varchar', length: 32, default: 'SMALL' })
  business_size: string; // MICRO, SMALL, MEDIUM, LARGE

  @Column({ type: 'varchar', length: 128 })
  product_category: string;

  @Column({ type: 'varchar', length: 128 })
  contact_email: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  contact_phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  state?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
