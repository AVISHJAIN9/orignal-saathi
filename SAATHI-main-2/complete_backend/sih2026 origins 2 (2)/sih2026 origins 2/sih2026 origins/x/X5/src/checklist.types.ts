export type EnterpriseScale = 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';

export interface FeeConcessionStructure {
  enterpriseScale: EnterpriseScale;
  concessionPercentage: number;
  concessionDescription: string;
  applicationFeeInr: number;
  annualLicenseFeeInr: number;
  minimumMarkingFeeInr: number;
  totalEstimatedInitialCostInr: number;
}

export interface DocumentationRequirement {
  id: string;
  title: string;
  description: string;
  isMandatory: boolean;
  completed?: boolean;
}

export interface TestingParameter {
  id: string;
  parameterName: string;
  clauseReference: string;
  acceptableLimit: string;
  testFrequency: string;
  testMethodStandard: string;
  verifiedInHouse?: boolean;
}

export interface FactoryRequirement {
  id: string;
  category: string;
  requirement: string;
  clauseReference: string;
  installed?: boolean;
}

export interface LicensingStep {
  stepNumber: number;
  title: string;
  estimatedDays: number;
  isCompleted?: boolean;
}

export interface ChecklistTemplate {
  standardNumber: string;
  productName: string;
  schemeType: string;
  isMandatoryQCO: boolean;
  baseApplicationFeeInr: number;
  baseAnnualLicenseFeeInr: number;
  baseMinimumMarkingFeeInr: number;
  documentationRequirements: DocumentationRequirement[];
  testingParameters: TestingParameter[];
  factoryRequirements: FactoryRequirement[];
  licensingSteps: LicensingStep[];
}

export interface ComplianceChecklistInstance {
  checklistId: string;
  standardNumber: string;
  productName: string;
  schemeType: string;
  isMandatoryQCO: boolean;
  enterpriseScale: EnterpriseScale;
  feeStructure: FeeConcessionStructure;
  documentationRequirements: DocumentationRequirement[];
  testingParameters: TestingParameter[];
  factoryRequirements: FactoryRequirement[];
  licensingSteps: LicensingStep[];
  completedItemsCount: number;
  totalItemsCount: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateChecklistDto {
  standardNumberOrProduct: string;
  enterpriseScale?: EnterpriseScale;
  userEmail?: string;
  companyName?: string;
}
