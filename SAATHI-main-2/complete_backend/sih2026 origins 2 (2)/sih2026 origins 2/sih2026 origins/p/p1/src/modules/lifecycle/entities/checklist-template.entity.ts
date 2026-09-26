import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'checklist_templates' })
export class ChecklistTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  license_type: string; // ISI, CRS, FMCS, HALLMARKING

  @Column({ type: 'varchar', length: 128, default: 'ALL' })
  product_category: string;

  @Column({ type: 'jsonb' })
  mandatory_documents: Array<{
    code: string;
    name: string;
    description: string;
    is_required: boolean;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  technical_requirements?: Array<{
    clause: string;
    requirement: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  statutory_forms?: Array<{
    form_number: string;
    title: string;
  }>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
