import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ChecklistTemplate,
  ComplianceChecklistInstance,
  EnterpriseScale,
  GenerateChecklistDto,
} from './checklist.types';
import { CHECKLIST_TEMPLATES } from './checklist-templates';

@Injectable()
export class ChecklistGeneratorService {
  private readonly generatedChecklists: Map<string, ComplianceChecklistInstance> = new Map();

  public findTemplate(standardNumberOrProduct: string): ChecklistTemplate | null {
    if (!standardNumberOrProduct || typeof standardNumberOrProduct !== 'string') {
      return null;
    }

    const cleanInput = standardNumberOrProduct.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const [key, template] of Object.entries(CHECKLIST_TEMPLATES)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanStd = template.standardNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanProduct = template.productName.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (
        cleanInput.includes(cleanKey) ||
        cleanInput.includes(cleanStd) ||
        cleanInput.includes(cleanProduct) ||
        cleanKey.includes(cleanInput)
      ) {
        return template;
      }
    }

    return null;
  }

  public calculateFees(
    template: ChecklistTemplate,
    scale: EnterpriseScale
  ) {
    let concessionPct = 0;
    let concessionLabel = 'Large / General Enterprise (0% Concession)';

    if (scale === 'MICRO') {
      concessionPct = 50;
      concessionLabel = 'Micro Enterprise (50% Statutory BIS Concession)';
    } else if (scale === 'SMALL') {
      concessionPct = 20;
      concessionLabel = 'Small Enterprise (20% Statutory BIS Concession)';
    } else if (scale === 'MEDIUM') {
      concessionPct = 0;
      concessionLabel = 'Medium Enterprise (Standard Fees)';
    }

    const multiplier = (100 - concessionPct) / 100;
    const applicationFee = Math.round(template.baseApplicationFeeInr * multiplier);
    const annualLicenseFee = Math.round(template.baseAnnualLicenseFeeInr * multiplier);
    const minimumMarkingFee = Math.round(template.baseMinimumMarkingFeeInr * multiplier);
    const totalEstimatedInitialCostInr = applicationFee + annualLicenseFee + minimumMarkingFee;

    return {
      enterpriseScale: scale,
      concessionPercentage: concessionPct,
      concessionDescription: concessionLabel,
      applicationFeeInr: applicationFee,
      annualLicenseFeeInr: annualLicenseFee,
      minimumMarkingFeeInr: minimumMarkingFee,
      totalEstimatedInitialCostInr,
    };
  }

  public generateChecklist(dto: GenerateChecklistDto): ComplianceChecklistInstance {
    const template = this.findTemplate(dto.standardNumberOrProduct);

    if (!template) {
      throw new NotFoundException(
        `No standardized compliance checklist template found for "${dto.standardNumberOrProduct}". ` +
        `Available automated templates include: ${Object.keys(CHECKLIST_TEMPLATES).join(', ')}. ` +
        `Please consult the BIS Technical Committee via Module X3 for custom standards.`
      );
    }

    const scale = dto.enterpriseScale || 'MICRO';
    const feeStructure = this.calculateFees(template, scale);
    const checklistId = `CHK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const documentationItems = template.documentationRequirements.map((d) => ({
      ...d,
      completed: false,
    }));

    const testingParameters = template.testingParameters.map((t) => ({
      ...t,
      verifiedInHouse: false,
    }));

    const factoryRequirements = template.factoryRequirements.map((f) => ({
      ...f,
      installed: false,
    }));

    const licensingSteps = template.licensingSteps.map((s) => ({
      ...s,
      isCompleted: false,
    }));

    const totalItemsCount =
      documentationItems.length +
      testingParameters.length +
      factoryRequirements.length +
      licensingSteps.length;

    const checklist: ComplianceChecklistInstance = {
      checklistId,
      standardNumber: template.standardNumber,
      productName: template.productName,
      schemeType: template.schemeType,
      isMandatoryQCO: template.isMandatoryQCO,
      enterpriseScale: scale,
      feeStructure,
      documentationRequirements: documentationItems,
      testingParameters,
      factoryRequirements,
      licensingSteps,
      completedItemsCount: 0,
      totalItemsCount,
      progressPercentage: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.generatedChecklists.set(checklistId, checklist);
    return JSON.parse(JSON.stringify(checklist));
  }

  public toggleItemCompleted(
    checklistId: string,
    itemId: string,
    completed: boolean
  ): ComplianceChecklistInstance | null {
    const checklist = this.generatedChecklists.get(checklistId);
    if (!checklist) return null;

    let found = false;

    for (const doc of checklist.documentationRequirements) {
      if (doc.id === itemId) {
        doc.completed = completed;
        found = true;
        break;
      }
    }
    if (!found) {
      for (const tst of checklist.testingParameters) {
        if (tst.id === itemId) {
          tst.verifiedInHouse = completed;
          found = true;
          break;
        }
      }
    }
    if (!found) {
      for (const fac of checklist.factoryRequirements) {
        if (fac.id === itemId) {
          fac.installed = completed;
          found = true;
          break;
        }
      }
    }

    let completedCount = 0;
    completedCount += checklist.documentationRequirements.filter((d) => d.completed).length;
    completedCount += checklist.testingParameters.filter((t) => t.verifiedInHouse).length;
    completedCount += checklist.factoryRequirements.filter((f) => f.installed).length;
    completedCount += checklist.licensingSteps.filter((s) => s.isCompleted).length;

    checklist.completedItemsCount = completedCount;
    checklist.progressPercentage = Math.round((completedCount / checklist.totalItemsCount) * 100);
    checklist.updatedAt = new Date().toISOString();

    this.generatedChecklists.set(checklistId, checklist);
    return JSON.parse(JSON.stringify(checklist));
  }

  public getChecklistById(checklistId: string): ComplianceChecklistInstance | null {
    const cl = this.generatedChecklists.get(checklistId);
    return cl ? JSON.parse(JSON.stringify(cl)) : null;
  }
}
