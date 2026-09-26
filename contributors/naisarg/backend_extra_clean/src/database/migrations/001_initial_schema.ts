import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1727000000000 implements MigrationInterface {
  name = 'InitialSchema1727000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS standard_diffs (
        "diffKey" VARCHAR(128) PRIMARY KEY,
        "oldStandardId" VARCHAR(64) NOT NULL,
        "newStandardId" VARCHAR(64) NOT NULL,
        "diffResults" JSONB NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS standard_requirements (
        "id" VARCHAR(64) PRIMARY KEY,
        "standardNumber" VARCHAR(64) NOT NULL,
        "clauseNumber" VARCHAR(64) NOT NULL,
        "parameter" VARCHAR(128) NOT NULL,
        "operator" VARCHAR(16) NOT NULL,
        "threshold" JSONB NOT NULL,
        "unit" VARCHAR(32) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS certification_paths (
        "id" VARCHAR(64) PRIMARY KEY,
        "productCategory" VARCHAR(128) NOT NULL,
        "pathType" VARCHAR(128) NOT NULL,
        "avgCostINR" INT NOT NULL,
        "avgDays" INT NOT NULL,
        "applicableCategories" JSONB NOT NULL,
        "requiresFactoryAudit" BOOLEAN DEFAULT FALSE,
        "requiresLabTest" BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS standard_supersessions (
        "id" VARCHAR(64) PRIMARY KEY,
        "standardId" VARCHAR(64) NOT NULL,
        "standardNumber" VARCHAR(64) NOT NULL,
        "supersedes" VARCHAR(64),
        "supersededBy" VARCHAR(64),
        "effectiveDate" VARCHAR(32) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS licenses (
        "licenseId" VARCHAR(64) PRIMARY KEY,
        "holder" VARCHAR(255) NOT NULL,
        "standardId" VARCHAR(64) NOT NULL,
        "standardNumber" VARCHAR(64) NOT NULL,
        "productName" VARCHAR(255) NOT NULL,
        "status" VARCHAR(32) DEFAULT 'ACTIVE',
        "issueDate" DATE NOT NULL,
        "expiryDate" DATE NOT NULL,
        "factoryAddress" TEXT,
        "userId" VARCHAR(64) DEFAULT 'usr-default'
      );

      CREATE TABLE IF NOT EXISTS label_rules (
        "id" VARCHAR(64) PRIMARY KEY,
        "productCategory" VARCHAR(128) NOT NULL,
        "ruleName" VARCHAR(128) NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "regexPattern" VARCHAR(255),
        "isMandatory" BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS gazette_notifications (
        "id" VARCHAR(64) PRIMARY KEY,
        "gazetteNumber" VARCHAR(128) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "extractedStandards" JSONB NOT NULL,
        "publicationDate" DATE NOT NULL,
        "enforcementDate" DATE NOT NULL,
        "amendmentType" VARCHAR(64) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS regulatory_alerts (
        "id" VARCHAR(64) PRIMARY KEY,
        "title" VARCHAR(128) NOT NULL,
        "summary" TEXT NOT NULL,
        "severity" VARCHAR(32) NOT NULL,
        "relatedStandard" VARCHAR(64) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_checklist_items (
        "id" VARCHAR(64) PRIMARY KEY,
        "productId" VARCHAR(64) NOT NULL,
        "category" VARCHAR(128) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "isMandatory" BOOLEAN DEFAULT TRUE,
        "completed" BOOLEAN DEFAULT FALSE,
        "evidenceUrl" VARCHAR(255),
        "userId" VARCHAR(64) DEFAULT 'usr-default'
      );

      CREATE TABLE IF NOT EXISTS state_regulations (
        "id" VARCHAR(64) PRIMARY KEY,
        "state" VARCHAR(64) NOT NULL,
        "standardId" VARCHAR(64) NOT NULL,
        "standardNumber" VARCHAR(64) NOT NULL,
        "additionalRequirement" TEXT NOT NULL,
        "effectiveDate" DATE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS consumer_complaints (
        "id" VARCHAR(64) PRIMARY KEY,
        "standardNumber" VARCHAR(64) NOT NULL,
        "category" VARCHAR(128) NOT NULL,
        "date" DATE NOT NULL,
        "severity" VARCHAR(32) NOT NULL,
        "summary" TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cross_ministry_mappings (
        "id" VARCHAR(64) PRIMARY KEY,
        "standardId" VARCHAR(64) NOT NULL,
        "standardNumber" VARCHAR(64) NOT NULL,
        "otherMinistry" VARCHAR(255) NOT NULL,
        "otherRegulationRef" VARCHAR(255) NOT NULL,
        "conflictType" VARCHAR(128) NOT NULL,
        "notes" TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS counterfeit_reports (
        "id" VARCHAR(64) PRIMARY KEY,
        "lat" FLOAT NOT NULL,
        "lng" FLOAT NOT NULL,
        "city" VARCHAR(64) NOT NULL,
        "state" VARCHAR(64) NOT NULL,
        "productCategory" VARCHAR(128) NOT NULL,
        "standardNumber" VARCHAR(64) NOT NULL,
        "seizureDate" DATE NOT NULL,
        "quantitySeized" INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS dev_api_keys (
        "id" VARCHAR(64) PRIMARY KEY,
        "keyHash" VARCHAR(128) NOT NULL,
        "clientName" VARCHAR(64) NOT NULL,
        "scopes" JSONB NOT NULL,
        "rateLimitPerMinute" INT DEFAULT 100,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dev_webhooks (
        "id" VARCHAR(64) PRIMARY KEY,
        "url" VARCHAR(255) NOT NULL,
        "secret" VARCHAR(128) NOT NULL,
        "events" JSONB NOT NULL,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS component_hierarchy (
        "id" VARCHAR(64) PRIMARY KEY,
        "parentProductId" VARCHAR(64) NOT NULL,
        "componentId" VARCHAR(64) NOT NULL,
        "componentName" VARCHAR(128) NOT NULL,
        "componentStandardId" VARCHAR(64) NOT NULL,
        "licenseId" VARCHAR(64),
        "isCertified" BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS support_tickets (
        "id" VARCHAR(64) PRIMARY KEY,
        "userId" VARCHAR(64) NOT NULL,
        "context" TEXT NOT NULL,
        "status" VARCHAR(32) DEFAULT 'QUEUED',
        "assignedOfficer" VARCHAR(64),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS grievances (
        "id" VARCHAR(64) PRIMARY KEY,
        "userId" VARCHAR(64) NOT NULL,
        "subject" VARCHAR(255) NOT NULL,
        "details" TEXT NOT NULL,
        "status" VARCHAR(32) DEFAULT 'FILED',
        "resolutionNotes" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS grievance_status_history (
        "id" VARCHAR(64) PRIMARY KEY,
        "grievanceId" VARCHAR(64) NOT NULL,
        "previousStatus" VARCHAR(32) NOT NULL,
        "newStatus" VARCHAR(32) NOT NULL,
        "changedBy" VARCHAR(64) NOT NULL,
        "remarks" TEXT,
        "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS grievance_status_history;
      DROP TABLE IF EXISTS grievances;
      DROP TABLE IF EXISTS support_tickets;
      DROP TABLE IF EXISTS component_hierarchy;
      DROP TABLE IF EXISTS dev_webhooks;
      DROP TABLE IF EXISTS dev_api_keys;
      DROP TABLE IF EXISTS counterfeit_reports;
      DROP TABLE IF EXISTS cross_ministry_mappings;
      DROP TABLE IF EXISTS consumer_complaints;
      DROP TABLE IF EXISTS state_regulations;
      DROP TABLE IF EXISTS audit_checklist_items;
      DROP TABLE IF EXISTS regulatory_alerts;
      DROP TABLE IF EXISTS gazette_notifications;
      DROP TABLE IF EXISTS label_rules;
      DROP TABLE IF EXISTS licenses;
      DROP TABLE IF EXISTS standard_supersessions;
      DROP TABLE IF EXISTS certification_paths;
      DROP TABLE IF EXISTS standard_requirements;
      DROP TABLE IF EXISTS standard_diffs;
    `);
  }
}
