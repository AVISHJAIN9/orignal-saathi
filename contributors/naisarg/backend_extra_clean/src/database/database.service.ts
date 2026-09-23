import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  SEED_STANDARDS,
  StandardDefinition
} from '../data/seed_corpus';
import {
  SEED_LICENSES,
  SEED_CERTIFICATION_PATHS,
  SEED_LABS,
  SEED_SUPERSESSIONS,
  SEED_STATE_REGULATIONS,
  SEED_CROSS_MINISTRY_MAPPINGS,
  SEED_COMPLAINTS,
  SEED_COUNTERFEIT_REPORTS,
  SEED_AUDIT_CHECKLIST_ITEMS,
  SEED_COMPONENT_HIERARCHIES
} from '../data/seed_datasets';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  // In-memory relational tables pre-seeded with real & synthetic BIS data
  private tables: Record<string, any[]> = {
    standard_diffs: [],
    standard_requirements: [],
    certification_paths: [],
    standard_supersessions: [],
    licenses: [],
    label_rules: [],
    gazette_notifications: [],
    regulatory_alerts: [],
    audit_checklist_items: [],
    state_regulations: [],
    consumer_complaints: [],
    cross_ministry_mappings: [],
    counterfeit_reports: [],
    dev_api_keys: [],
    dev_webhooks: [],
    component_hierarchy: [],
    support_tickets: [],
    grievances: [],
    grievance_status_history: [],
    standards: []
  };

  onModuleInit() {
    this.seedDefaults();
    this.logger.log('DatabaseService initialized with fully seeded relational data.');
  }

  public seedDefaults() {
    // 1. Standards
    this.tables.standards = JSON.parse(JSON.stringify(SEED_STANDARDS));

    // 2. Standard requirements
    this.tables.standard_requirements = [];
    SEED_STANDARDS.forEach((std) => {
      std.clauses.forEach((cls) => {
        if (cls.requirements) {
          cls.requirements.forEach((req, idx) => {
            this.tables.standard_requirements.push({
              id: `req-${std.standardNumber}-${cls.clauseNumber}-${idx}`,
              standardNumber: std.standardNumber,
              clauseNumber: cls.clauseNumber,
              parameter: req.parameter,
              operator: req.operator,
              threshold: req.threshold,
              unit: req.unit
            });
          });
        }
      });
    });

    // 3. Certification paths
    this.tables.certification_paths = JSON.parse(JSON.stringify(SEED_CERTIFICATION_PATHS));

    // 4. Supersessions
    this.tables.standard_supersessions = JSON.parse(JSON.stringify(SEED_SUPERSESSIONS));

    // 5. Licenses
    this.tables.licenses = JSON.parse(JSON.stringify(SEED_LICENSES));

    // 6. Label rules
    this.tables.label_rules = [
      {
        id: 'lr-01',
        productCategory: 'Electrical',
        ruleName: 'ISI Mark Presence',
        description: 'Mandatory standard ISI mark with CM/L license number displayed on body.',
        regexPattern: 'CM/L-\\d{7,10}|IS\\s*1293',
        isMandatory: true
      },
      {
        id: 'lr-02',
        productCategory: 'Electrical',
        ruleName: 'Batch and Rated Voltage',
        description: 'Batch number and rated voltage (250V AC) must be indelibly stamped.',
        regexPattern: '250\\s*V|Batch|B\\.No',
        isMandatory: true
      },
      {
        id: 'lr-03',
        productCategory: 'Cement',
        ruleName: 'Net Quantity Declaration',
        description: 'Net weight 50 kg marked clearly with month and year of manufacture.',
        regexPattern: '50\\s*kg|Net\\s*Quantity',
        isMandatory: true
      }
    ];

    // 7. Gazette notifications
    this.tables.gazette_notifications = [
      {
        id: 'gaz-2026-081',
        gazetteNumber: 'CG-DL-E-14082026-258901',
        title: 'Electrical Accessories (Quality Control) Amendment Order, 2026',
        extractedStandards: ['IS 1293:2019', 'IS 3854:1988'],
        publicationDate: '2026-08-14',
        enforcementDate: '2027-02-14',
        amendmentType: 'AMENDMENT',
        createdAt: new Date('2026-08-14')
      },
      {
        id: 'gaz-2026-072',
        gazetteNumber: 'CG-DL-E-02072026-257120',
        title: 'Potable Water Pipeline Materials Quality Control Order, 2026',
        extractedStandards: ['IS 4984:2016'],
        publicationDate: '2026-07-02',
        enforcementDate: '2027-01-01',
        amendmentType: 'NEW_QCO',
        createdAt: new Date('2026-07-02')
      }
    ];

    // 8. Regulatory alerts
    this.tables.regulatory_alerts = [
      {
        id: 'alert-01',
        title: 'Mandatory QCO Enforcement for Plugs & Sockets Approaching',
        summary: 'Effective Feb 14, 2027, all imported and domestic stock under IS 1293 must bear ISI mark without exception.',
        severity: 'HIGH',
        relatedStandard: 'IS 1293:2019',
        createdAt: new Date('2026-08-15')
      }
    ];

    // 9. Audit checklist items
    this.tables.audit_checklist_items = JSON.parse(JSON.stringify(SEED_AUDIT_CHECKLIST_ITEMS));

    // 10. State regulations
    this.tables.state_regulations = JSON.parse(JSON.stringify(SEED_STATE_REGULATIONS));

    // 11. Consumer complaints
    this.tables.consumer_complaints = JSON.parse(JSON.stringify(SEED_COMPLAINTS));

    // 12. Cross ministry mappings
    this.tables.cross_ministry_mappings = JSON.parse(JSON.stringify(SEED_CROSS_MINISTRY_MAPPINGS));

    // 13. Counterfeit reports
    this.tables.counterfeit_reports = JSON.parse(JSON.stringify(SEED_COUNTERFEIT_REPORTS));

    // 14. Component hierarchies
    this.tables.component_hierarchy = [];
    SEED_COMPONENT_HIERARCHIES.forEach((h) => {
      h.components.forEach((c, idx) => {
        this.tables.component_hierarchy.push({
          id: `comp-node-${h.productId}-${idx}`,
          parentProductId: h.productId,
          componentId: c.componentId,
          componentName: c.componentName,
          componentStandardId: c.componentStandardNumber,
          licenseId: c.licenseId,
          isCertified: c.isCertified
        });
      });
    });

    // 15. Dev API Keys & Webhooks
    this.tables.dev_api_keys = [
      {
        id: 'key-dev-admin',
        keyHash: 'sha256:saathi_prod_secret_key_2026',
        clientName: 'SAATHI Enterprise Client',
        scopes: ['standards:read', 'standards:diff', 'tenders:match', 'webhooks:manage'],
        rateLimitPerMinute: 300,
        isActive: true,
        createdAt: new Date()
      }
    ];
    this.tables.dev_webhooks = [];

    // 16. Support tickets & Grievances
    this.tables.support_tickets = [
      {
        id: 'tkt-001',
        userId: 'usr-101',
        context: 'Sample verification failed at regional lab due to seal tampering.',
        status: 'QUEUED',
        assignedOfficer: null,
        createdAt: new Date()
      }
    ];

    this.tables.grievances = [
      {
        id: 'grv-001',
        userId: 'usr-101',
        subject: 'Delayed Factory Inspection for Cement Licensure',
        details: 'Audit was scheduled for 10th August 2026 but inspecting officer was absent without notification.',
        status: 'FILED',
        resolutionNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.tables.grievance_status_history = [
      {
        id: 'gsh-001',
        grievanceId: 'grv-001',
        previousStatus: 'NONE',
        newStatus: 'FILED',
        changedBy: 'usr-101',
        remarks: 'Initial complaint submission',
        timestamp: new Date()
      }
    ];
  }

  // Repository methods
  public getTable<T = any>(tableName: string): T[] {
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
    }
    return this.tables[tableName] as T[];
  }

  public findOne<T = any>(tableName: string, predicate: (item: T) => boolean): T | null {
    const list = this.getTable<T>(tableName);
    return list.find(predicate) || null;
  }

  public findMany<T = any>(tableName: string, predicate?: (item: T) => boolean): T[] {
    const list = this.getTable<T>(tableName);
    return predicate ? list.filter(predicate) : [...list];
  }

  public insert<T = any>(tableName: string, item: T): T {
    this.getTable<T>(tableName).push(item);
    return item;
  }

  public update<T = any>(tableName: string, predicate: (item: T) => boolean, updates: Partial<T>): T | null {
    const list = this.getTable<T>(tableName);
    const index = list.findIndex(predicate);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      return list[index];
    }
    return null;
  }
}
