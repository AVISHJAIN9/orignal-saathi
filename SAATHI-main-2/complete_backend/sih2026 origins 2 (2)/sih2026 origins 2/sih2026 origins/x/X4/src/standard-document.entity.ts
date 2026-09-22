import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentLifecycleStatus } from './crawler.types';

@Entity('bis_standard_document_versions')
export class StandardDocumentEntity {
  @PrimaryColumn({ length: 128 })
  documentId: string;

  @Column({ length: 64 })
  standardNumber: string;

  @Column('text')
  title: string;

  @Column({ length: 64 })
  edition: string;

  @Column('int')
  year: number;

  @Column({ length: 32, default: 'ACTIVE' })
  status: DocumentLifecycleStatus;

  @Column({ nullable: true })
  supersededByDocumentId?: string;

  @Column({ nullable: true })
  supersedesDocumentId?: string;

  @Column({ type: 'date' })
  effectiveFrom: string;

  @Column({ type: 'date', nullable: true })
  withdrawnDate?: string;

  @Column({ length: 64 })
  fullDocumentChecksum: string;

  @Column('jsonb', { default: () => "'[]'" })
  clauses: any[];

  @Column('jsonb', { nullable: true })
  qcoDetails?: any;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
