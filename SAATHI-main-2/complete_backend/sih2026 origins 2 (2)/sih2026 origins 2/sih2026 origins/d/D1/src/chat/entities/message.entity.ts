import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface CitationItem {
  claim: string;
  source_chunk_id?: string;
  document_id: string;
  section_title?: string;
  source_url?: string;
}

@Entity({ name: 'messages' })
@Index(['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'conversation_id',
    type: 'uuid',
  })
  conversationId!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;

  @Column({
    type: 'varchar',
    length: 16,
  })
  role!: MessageRole;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  citations!: CitationItem[] | null;

  @Column({
    type: 'float',
    nullable: true,
  })
  confidence!: number | null;

  @Column({
    name: 'is_declined',
    type: 'boolean',
    default: false,
  })
  isDeclined!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}
