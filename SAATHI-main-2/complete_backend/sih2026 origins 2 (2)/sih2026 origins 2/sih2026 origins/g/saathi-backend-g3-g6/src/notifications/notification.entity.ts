import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

export enum NotificationType {
  ESCALATION_TICKET_UPDATE = 'escalation_ticket_update',
  SESSION_ACTIVITY = 'session_activity',
  SYSTEM = 'system'
}

@Entity(
  'notifications'
)
@Index(
  [
    'userId',
    'createdAt'
  ]
)
export class Notification {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Index(
  )
  @Column(
    {
      type: 'uuid',
      name: 'user_id'
    }
  )
  userId!: string;

  @Column(
    {
      type: 'enum',
      enum: NotificationType
    }
  )
  type!: NotificationType;

  @Column(
    {
      type: 'text'
    }
  )
  message!: string;

  @Column(
    {
      type: 'jsonb',
      nullable: true
    }
  )
  metadata!: Record<
    string,
    unknown
  > | null;

  @Column(
    {
      type: 'timestamptz',
      name: 'read_at',
      nullable: true
    }
  )
  readAt!: Date | null;

  @CreateDateColumn(
    {
      name: 'created_at'
    }
  )
  createdAt!: Date;

}
