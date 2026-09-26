import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('document_chunks')
export class DocumentChunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_chunks_document_id')
  @Column({ name: 'document_id', type: 'text' })
  documentId: string;

  @Index('idx_chunks_standard_number')
  @Column({ name: 'standard_number', type: 'text', nullable: true })
  standardNumber: string | null;

  @Column({ name: 'doc_type', type: 'text', default: 'standard', nullable: true })
  docType: string | null;

  @Column({ name: 'category', type: 'text', nullable: true })
  category: string | null;

  @Column({ name: 'section_title', type: 'text', nullable: true })
  sectionTitle: string | null;

  @Column({ name: 'section_number', type: 'text', nullable: true })
  sectionNumber: string | null;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'source_url', type: 'text', nullable: true })
  sourceUrl: string | null;

  @Column({ name: 'publication_date', type: 'date', nullable: true })
  publicationDate: string | null;

  @Column({ name: 'metadata', type: 'jsonb', default: () => "'{}'::jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;
}
