import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export interface CitationPayload {
  claim: string;
  source_chunk_id: string;
  document_id: string;
  section_title?: string;
  source_url?: string;
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  sender: 'user' | 'assistant';

  /**
   * Virtual getter/setter mapping `sender` ('user' | 'assistant') to `role` ('user' | 'assistant' | 'system')
   * ensures interoperability between M9 and D4 without modifying database column types.
   */
  get role(): 'user' | 'assistant' | 'system' {
    return this.sender as 'user' | 'assistant';
  }

  set role(value: 'user' | 'assistant' | 'system') {
    if (value === 'system') {
      this.sender = 'assistant';
    } else {
      this.sender = value;
    }
  }

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  citations: CitationPayload[];

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @Column({ type: 'boolean', default: false })
  isDeclined: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
