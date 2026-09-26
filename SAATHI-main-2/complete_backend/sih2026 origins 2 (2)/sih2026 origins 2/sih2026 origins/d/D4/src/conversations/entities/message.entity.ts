import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import {
  Conversation
} from './conversation.entity';

// Enum defining role discriminator for message authors
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

// Conversation message turn entity
@Entity(
  {
    name: 'messages'
  }
)
export class Message {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Column(
    {
      name: 'conversation_id',
      type: 'uuid'
    }
  )
  conversationId!: string;

  @ManyToOne(
    (
    ) => Conversation,
    (
      conversationEntityRecord
    ) => conversationEntityRecord.messages,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn(
    {
      name: 'conversation_id'
    }
  )
  conversation!: Conversation;

  @Column(
    {
      type: 'varchar',
      length: 16
    }
  )
  role!: MessageRole;

  @Column(
    {
      type: 'text'
    }
  )
  content!: string;

  @Column(
    {
      type: 'jsonb',
      nullable: true
    }
  )
  citations!: unknown[] | null;

  @CreateDateColumn(
    {
      name: 'created_at',
      type: 'timestamptz'
    }
  )
  createdAt!: Date;

}
