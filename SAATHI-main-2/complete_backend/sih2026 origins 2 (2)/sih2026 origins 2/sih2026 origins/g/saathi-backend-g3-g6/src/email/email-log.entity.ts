import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

export enum EmailStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed'
}

export enum EmailTemplateName {
  PASSWORD_RESET = 'password_reset',
  ESCALATION_TICKET_CONFIRMATION = 'escalation_ticket_confirmation',
  ADMIN_INGESTION_FAILURE = 'admin_ingestion_failure'
}

@Entity(
  'email_logs'
)
export class EmailLog {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Index(
  )
  @Column(
    {
      type: 'varchar',
      length: 320
    }
  )
  to!: string;

  @Column(
    {
      type: 'enum',
      enum: EmailTemplateName
    }
  )
  template!: EmailTemplateName;

  @Column(
    {
      type: 'jsonb'
    }
  )
  payload!: Record<
    string,
    unknown
  >;

  @Index(
  )
  @Column(
    {
      type: 'enum',
      enum: EmailStatus,
      default: EmailStatus.QUEUED
    }
  )
  status!: EmailStatus;

  @Column(
    {
      type: 'varchar',
      length: 255,
      nullable: true
    }
  )
  providerMessageId!: string | null;

  @Column(
    {
      type: 'text',
      nullable: true
    }
  )
  error!: string | null;

  @CreateDateColumn(
    {
      name: 'created_at'
    }
  )
  createdAt!: Date;

  @Column(
    {
      type: 'timestamptz',
      nullable: true,
      name: 'sent_at'
    }
  )
  sentAt!: Date | null;

}
