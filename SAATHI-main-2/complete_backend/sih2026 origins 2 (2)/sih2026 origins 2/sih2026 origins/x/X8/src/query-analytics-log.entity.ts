import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('bis_query_analytics_logs')
export class QueryAnalyticsLogEntity {
  @PrimaryColumn({ length: 64 })
  queryId: string;

  @Column('text')
  sanitizedQueryText: string;

  @Column({ length: 64, nullable: true })
  matchedStandardNumber?: string;

  @Column({ length: 64, default: 'UNMATCHED_GAP' })
  matchedIntent: string;

  @Column('float')
  confidenceScore: number;

  @Column('boolean', { default: false })
  wasDeclined: boolean;

  @Column({ length: 64, nullable: true })
  userState?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
