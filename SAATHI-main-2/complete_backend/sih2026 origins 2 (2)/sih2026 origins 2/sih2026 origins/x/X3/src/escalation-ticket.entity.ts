import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BISRegion, EscalationCategory, TicketPriority, TicketStatus } from './escalation.types';

@Entity('bis_escalation_tickets')
export class EscalationTicketEntity {
  @PrimaryColumn({ length: 64 })
  ticketId: string;

  @Column({ nullable: true })
  messageId?: string;

  @Column({ nullable: true })
  conversationId?: string;

  @Column('text')
  userQuery: string;

  @Column({ nullable: true })
  userEmail?: string;

  @Column({ nullable: true })
  userPhone?: string;

  @Column({ nullable: true })
  userState?: string;

  @Column('text')
  reason: string;

  @Column('float', { default: 0 })
  confidenceScore: number;

  @Column({ length: 32, default: 'MEDIUM' })
  priority: TicketPriority;

  @Column({ length: 64, default: 'GENERAL_ENQUIRY' })
  category: EscalationCategory;

  @Column({ length: 64 })
  assignedRegion: BISRegion;

  @Column({ length: 128 })
  assignedDepartment: string;

  @Column({ length: 32, default: 'OPEN' })
  status: TicketStatus;

  @Column('int', { default: 48 })
  slaTargetHours: number;

  @Column('jsonb', { nullable: true })
  nodalContact: any;

  @Column('jsonb', { nullable: true })
  acknowledgementNotice: any;

  @Column('jsonb', { default: () => "'[]'" })
  timelineEvents: any[];

  @Column('text', { nullable: true })
  resolutionNotes?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
