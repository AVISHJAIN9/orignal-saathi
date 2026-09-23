import { Controller, Get, Post, Param, HttpCode, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface RenewalStatusResponse {
  licenseId: string;
  holder: string;
  productName: string;
  standardNumber: string;
  issueDate: string;
  expiryDate: string;
  daysToExpiry: number;
  renewalTier: 'URGENT' | 'UPCOMING' | 'OK' | 'EXPIRED';
  actionRecommended: string;
  renewalFeeEstimateINR: number;
}

export interface RenewalDraftResponse {
  draftId: string;
  licenseId: string;
  applicantName: string;
  companyName: string;
  factoryAddress: string;
  standardNumber: string;
  currentValidity: {
    from: string;
    to: string;
  };
  requestedRenewalPeriodYears: number;
  prefilledFormFields: {
    formCode: string;
    applicantDeclaration: string;
    productionQuantityPastYear: string;
    stiComplianceConfirmation: boolean;
    markingFeePaid: boolean;
  };
  generatedAt: string;
}

@ApiTags('Tier 1: License Renewal')
@Controller('api/v1/licenses')
export class T11320RenewalController {
  private readonly logger = new Logger(T11320RenewalController.name);

  constructor(private readonly db: DatabaseService) {}

  @Get(':id/renewal-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-13/20] License renewal status dashboard' })
  @ApiParam({ name: 'id', description: 'License ID (e.g. CM/L-7200192984)' })
  @ApiResponse({ status: 200, description: 'Renewal status calculation and urgency tier' })
  getRenewalStatus(@Param('id') rawId: string): RenewalStatusResponse {
    const licenseId = decodeURIComponent(rawId).trim();
    const license = this.db.findOne('licenses', (l: any) => l.licenseId.toUpperCase() === licenseId.toUpperCase());

    if (!license) {
      throw new NotFoundException(`License ${licenseId} not found in database.`);
    }

    const expiry = new Date(license.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let renewalTier: 'URGENT' | 'UPCOMING' | 'OK' | 'EXPIRED' = 'OK';
    let actionRecommended = 'License is in good standing. No immediate action required.';

    if (daysToExpiry <= 0) {
      renewalTier = 'EXPIRED';
      actionRecommended = 'CRITICAL: License is expired. Stop marking immediately and apply for late renewal under Section 15.';
    } else if (daysToExpiry <= 30) {
      renewalTier = 'URGENT';
      actionRecommended = 'URGENT: Submit Form-VII renewal application within 7 days to avoid punitive late fees or stop-marking order.';
    } else if (daysToExpiry <= 90) {
      renewalTier = 'UPCOMING';
      actionRecommended = 'Upcoming renewal: Prepare audit calibration logs and submit renewal draft.';
    }

    return {
      licenseId: license.licenseId,
      holder: license.holder,
      productName: license.productName,
      standardNumber: license.standardNumber,
      issueDate: license.issueDate,
      expiryDate: license.expiryDate,
      daysToExpiry,
      renewalTier,
      actionRecommended,
      renewalFeeEstimateINR: 45000
    };
  }

  @Post(':id/renewal-draft')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[T1-13/20] Pre-filled license renewal application draft' })
  @ApiParam({ name: 'id', description: 'License ID (e.g. CM/L-7200192984)' })
  @ApiResponse({ status: 201, description: 'Pre-filled renewal application draft' })
  createRenewalDraft(@Param('id') rawId: string): RenewalDraftResponse {
    const licenseId = decodeURIComponent(rawId).trim();
    const license = this.db.findOne('licenses', (l: any) => l.licenseId.toUpperCase() === licenseId.toUpperCase());

    if (!license) {
      throw new NotFoundException(`License ${licenseId} not found in database.`);
    }

    return {
      draftId: `DRAFT-REN-${Date.now()}`,
      licenseId: license.licenseId,
      applicantName: 'Authorized Factory In-Charge',
      companyName: license.holder,
      factoryAddress: license.factoryAddress || 'Factory Premises Registered with BIS',
      standardNumber: license.standardNumber,
      currentValidity: {
        from: license.issueDate,
        to: license.expiryDate
      },
      requestedRenewalPeriodYears: 2,
      prefilledFormFields: {
        formCode: 'BIS-FORM-V-RENEWAL',
        applicantDeclaration: `I hereby confirm that production and testing have continuously complied with Scheme of Testing and Inspection (STI) for ${license.standardNumber}.`,
        productionQuantityPastYear: '125,000 units marked with Standard Mark',
        stiComplianceConfirmation: true,
        markingFeePaid: true
      },
      generatedAt: new Date().toISOString()
    };
  }
}
