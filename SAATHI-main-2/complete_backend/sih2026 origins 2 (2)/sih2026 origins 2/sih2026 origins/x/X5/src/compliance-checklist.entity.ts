import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnterpriseScale } from './checklist.types';

@Entity('bis_compliance_checklists')
export class ComplianceChecklistEntity {
  @PrimaryColumn({ length: 64 })
  checklistId: string;

  @Column({ length: 64 })
  standardNumber: string;

  @Column('text')
  productName: string;

  @Column({ length: 32 })
  enterpriseScale: EnterpriseScale;

  @Column('int', { default: 0 })
  completedItemsCount: number;

  @Column('int', { default: 0 })
  totalItemsCount: number;

  @Column('int', { default: 0 })
  progressPercentage: number;

  @Column('jsonb')
  feeStructure: any;

  @Column('jsonb', { default: () => "'[]'" })
  documentationItems: any[];

  @Column('jsonb', { default: () => "'[]'" })
  testingParameters: any[];

  @Column('jsonb', { default: () => "'[]'" })
  factoryRequirements: any[];

  @Column('jsonb', { default: () => "'[]'" })
  licensingSteps: any[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
