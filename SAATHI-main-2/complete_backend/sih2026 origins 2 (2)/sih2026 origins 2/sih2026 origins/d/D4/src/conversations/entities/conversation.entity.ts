import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {
  Message
} from './message.entity';

// Saved chat session entity scoped per user
@Entity(
  {
    name: 'conversations'
  }
)
export class Conversation {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Column(
    {
      name: 'user_id',
      type: 'varchar',
      length: 128
    }
  )
  userId!: string;

  @Column(
    {
      type: 'varchar',
      length: 512,
      nullable: true
    }
  )
  title!: string | null;

  @CreateDateColumn(
    {
      name: 'created_at',
      type: 'timestamptz'
    }
  )
  createdAt!: Date;

  @UpdateDateColumn(
    {
      name: 'updated_at',
      type: 'timestamptz'
    }
  )
  updatedAt!: Date;

  @OneToMany(
    (
    ) => Message,
    (
      messageEntityRecord
    ) => messageEntityRecord.conversation
  )
  messages!: Message[];

}
