import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

// T1-02: Standard Diffs Cache
@Entity('standard_diffs')
export class StandardDiffEntity {
  @PrimaryColumn('varchar', { length: 128 })
  diffKey: string; // `${oldStandardId}_${newStandardId}`

  @Column('varchar', { length: 64 })
  oldStandardId: string;

  @Column('varchar', { length: 64 })
  newStandardId: string;

  @Column('jsonb')
  diffResults: any;

  @CreateDateColumn()
  createdAt: Date;
}

// T1-10: Standard Requirements (for "what-if" regulatory sandbox)
@Entity('standard_requirements')
export class StandardRequirementEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('varchar', { length: 64 })
  clauseNumber: string;

  @Column('varchar', { length: 128 })
  parameter: string;

  @Column('varchar', { length: 16 })
  operator: string; // '<=', '>=', '==', '<', '>', 'range'

  @Column('jsonb')
  threshold: any; // number or [min, max]

  @Column('varchar', { length: 32 })
  unit: string;
}

// T1-15: Certification Paths
@Entity('certification_paths')
export class CertificationPathEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 128 })
  productCategory: string;

  @Column('varchar', { length: 128 })
  pathType: string;

  @Column('int')
  avgCostINR: number;

  @Column('int')
  avgDays: number;

  @Column('jsonb')
  applicableCategories: string[];

  @Column('boolean', { default: false })
  requiresFactoryAudit: boolean;

  @Column('boolean', { default: true })
  requiresLabTest: boolean;
}

// T1-16: Standard Supersessions
@Entity('standard_supersessions')
export class StandardSupersessionEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  standardId: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('varchar', { length: 64, nullable: true })
  supersedes: string;

  @Column('varchar', { length: 64, nullable: true })
  supersededBy: string;

  @Column('varchar', { length: 32 })
  effectiveDate: string;
}

// T1-13/20 & T1-25: Licenses
@Entity('licenses')
export class LicenseEntity {
  @PrimaryColumn('varchar', { length: 64 })
  licenseId: string;

  @Column('varchar', { length: 255 })
  holder: string;

  @Column('varchar', { length: 64 })
  standardId: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('varchar', { length: 255 })
  productName: string;

  @Column('varchar', { length: 32, default: 'ACTIVE' })
  status: string;

  @Column('date')
  issueDate: string;

  @Column('date')
  expiryDate: string;

  @Column('text', { nullable: true })
  factoryAddress: string;

  @Column('varchar', { length: 64, default: 'usr-default' })
  userId: string;
}

// T1-21: Label Rules
@Entity('label_rules')
export class LabelRuleEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 128 })
  productCategory: string;

  @Column('varchar', { length: 128 })
  ruleName: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('varchar', { length: 255, nullable: true })
  regexPattern: string;

  @Column('boolean', { default: true })
  isMandatory: boolean;
}

// T1-23 & T1-24: Gazette Notifications & Regulatory Alerts
@Entity('gazette_notifications')
export class GazetteNotificationEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 128 })
  gazetteNumber: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('jsonb')
  extractedStandards: string[];

  @Column('date')
  publicationDate: string;

  @Column('date')
  enforcementDate: string;

  @Column('varchar', { length: 64 })
  amendmentType: string; // 'NEW_QCO', 'AMENDMENT', 'EXTENSION', 'REVISION'

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('regulatory_alerts')
export class RegulatoryAlertEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 128 })
  title: string;

  @Column('text')
  summary: string;

  @Column('varchar', { length: 32 })
  severity: string; // 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'

  @Column('varchar', { length: 64 })
  relatedStandard: string;

  @CreateDateColumn()
  createdAt: Date;
}

// T1-29 & T2-31: Self-Audit Checklist Items
@Entity('audit_checklist_items')
export class AuditChecklistItemEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  productId: string;

  @Column('varchar', { length: 128 })
  category: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('boolean', { default: true })
  isMandatory: boolean;

  @Column('boolean', { default: false })
  completed: boolean;

  @Column('varchar', { length: 255, nullable: true })
  evidenceUrl: string;

  @Column('varchar', { length: 64, default: 'usr-default' })
  userId: string;
}

// T2-07: State Regulations
@Entity('state_regulations')
export class StateRegulationEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  state: string;

  @Column('varchar', { length: 64 })
  standardId: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('text')
  additionalRequirement: string;

  @Column('date')
  effectiveDate: string;
}

// T2-12: Consumer Complaints
@Entity('consumer_complaints')
export class ConsumerComplaintEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('varchar', { length: 128 })
  category: string;

  @Column('date')
  date: string;

  @Column('varchar', { length: 32 })
  severity: string;

  @Column('text')
  summary: string;
}

// T2-19: Cross-Ministry Mappings
@Entity('cross_ministry_mappings')
export class CrossMinistryMappingEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  standardId: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('varchar', { length: 255 })
  otherMinistry: string;

  @Column('varchar', { length: 255 })
  otherRegulationRef: string;

  @Column('varchar', { length: 128 })
  conflictType: string;

  @Column('text')
  notes: string;
}

// T2-30: Counterfeit Reports
@Entity('counterfeit_reports')
export class CounterfeitReportEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column('varchar', { length: 64 })
  city: string;

  @Column('varchar', { length: 64 })
  state: string;

  @Column('varchar', { length: 128 })
  productCategory: string;

  @Column('varchar', { length: 64 })
  standardNumber: string;

  @Column('date')
  seizureDate: string;

  @Column('int', { default: 0 })
  quantitySeized: number;
}

// T3-06: Developer Platform API Keys & Webhooks
@Entity('dev_api_keys')
export class DevApiKeyEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 128 })
  keyHash: string;

  @Column('varchar', { length: 64 })
  clientName: string;

  @Column('jsonb')
  scopes: string[];

  @Column('int', { default: 100 })
  rateLimitPerMinute: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('dev_webhooks')
export class DevWebhookEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 255 })
  url: string;

  @Column('varchar', { length: 128 })
  secret: string;

  @Column('jsonb')
  events: string[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// T3-08: Component Hierarchy
@Entity('component_hierarchy')
export class ComponentHierarchyEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  parentProductId: string;

  @Column('varchar', { length: 64 })
  componentId: string;

  @Column('varchar', { length: 128 })
  componentName: string;

  @Column('varchar', { length: 64 })
  componentStandardId: string;

  @Column('varchar', { length: 64, nullable: true })
  licenseId: string;

  @Column('boolean', { default: false })
  isCertified: boolean;
}

// T3-33: Officer Escalation Support Tickets
@Entity('support_tickets')
export class SupportTicketEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  userId: string;

  @Column('text')
  context: string;

  @Column('varchar', { length: 32, default: 'QUEUED' })
  status: string; // 'QUEUED', 'ASSIGNED', 'IN_REVIEW', 'RESOLVED'

  @Column('varchar', { length: 64, nullable: true })
  assignedOfficer: string;

  @CreateDateColumn()
  createdAt: Date;
}

// T3-34: Dispute / Grievance Tracker
@Entity('grievances')
export class GrievanceEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  userId: string;

  @Column('varchar', { length: 255 })
  subject: string;

  @Column('text')
  details: string;

  @Column('varchar', { length: 32, default: 'FILED' })
  status: string; // 'FILED' -> 'UNDER_REVIEW' -> 'RESOLVED' / 'REJECTED'

  @Column('text', { nullable: true })
  resolutionNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('grievance_status_history')
export class GrievanceStatusHistoryEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('varchar', { length: 64 })
  grievanceId: string;

  @Column('varchar', { length: 32 })
  previousStatus: string;

  @Column('varchar', { length: 32 })
  newStatus: string;

  @Column('varchar', { length: 64 })
  changedBy: string;

  @Column('text', { nullable: true })
  remarks: string;

  @CreateDateColumn()
  timestamp: Date;
}
