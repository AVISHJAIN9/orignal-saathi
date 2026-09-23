import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface TenderStandardMatchItem {
  standardNumber: string;
  title: string;
  mandatoryUnderQCO: boolean;
  isCompliant: boolean;
  matchingCertificationId: string | null;
  complianceStatus: 'COMPLIANT' | 'GAP_CERTIFICATION_REQUIRED' | 'UNDER_REVIEW';
  actionRequired?: string;
}

export interface TenderMatchResponse {
  tenderId: string;
  extractedStandards: string[];
  totalStandardsRequired: number;
  compliantCount: number;
  gapCount: number;
  eligibilityPercentage: number;
  tenderMatrix: TenderStandardMatchItem[];
  timestamp: string;
}

@ApiTags('Tier 1: GeM Tender Matching')
@Controller('api/v1/tenders')
export class T109GemMatcherController {
  private readonly logger = new Logger(T109GemMatcherController.name);

  constructor(private readonly db: DatabaseService) {}

  @Post('match')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '[T1-09] GeM tender compliance matcher' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Tender compliance matrix with gap analysis' })
  async matchTender(
    @UploadedFile() file?: Express.Multer.File,
    @Body('tenderText') tenderTextParam?: string,
    @Body('declaredCertIds') declaredCertIdsParam?: string | string[]
  ): Promise<TenderMatchResponse> {
    let rawText = tenderTextParam || '';

    if (file && file.buffer) {
      const bufferText = file.buffer.toString('utf-8');
      rawText += ' ' + bufferText;
    }

    // Default sample tender text if empty (demo-safe on seeded data)
    if (!rawText.trim()) {
      rawText = `Government e-Marketplace (GeM) Bid Notification No. GEM/2026/B/891230.
      Supply of High Density Polyethylene (HDPE) Pipes conforming strictly to IS 4984:2016 for Smart Cities Water Mission.
      All domestic switchboard components must comply with IS 1293:2019 with mandatory BIS ISI Mark.
      Ordinary Portland Cement bags supplied must adhere to IS 269:2015 specifications.`;
    }

    // Extract mentioned IS standard numbers using regex patterns
    // e.g. IS 10500:2012, IS 4984:2016, IS 1293, IS 269, IS 13252
    const regex = /\bIS\s+(\d{3,5}(?:\s*\([^)]+\))?(?::\d{4})?)\b/gi;
    const matches = rawText.match(regex) || [];

    const extractedStandards = Array.from(
      new Set(
        matches.map((m) => {
          let clean = m.replace(/\s+/g, ' ').toUpperCase();
          return clean;
        })
      )
    );

    // If no regex match found in custom text, default to at least one standard
    if (extractedStandards.length === 0) {
      extractedStandards.push('IS 4984:2016', 'IS 1293:2019');
    }

    // Parse declared certifications
    let declaredCerts: string[] = [];
    if (typeof declaredCertIdsParam === 'string') {
      try {
        declaredCerts = JSON.parse(declaredCertIdsParam);
      } catch {
        declaredCerts = declaredCertIdsParam.split(',').map((s) => s.trim());
      }
    } else if (Array.isArray(declaredCertIdsParam)) {
      declaredCerts = declaredCertIdsParam;
    }

    // Lookup user licenses from database
    const allLicenses = this.db.getTable('licenses');
    const activeLicenses = allLicenses.filter((l: any) => l.status === 'ACTIVE');

    const tenderMatrix: TenderStandardMatchItem[] = [];

    for (const rawStd of extractedStandards) {
      const cleanStdPrefix = rawStd.split(':')[0].trim();
      const matchedLicense = activeLicenses.find((l: any) => {
        const licStd = l.standardNumber.split(':')[0].trim();
        const matchesStd = licStd === cleanStdPrefix;
        const matchesDeclared = declaredCerts.length > 0 ? declaredCerts.includes(l.licenseId) : true;
        return matchesStd && matchesDeclared;
      });

      const isCompliant = Boolean(matchedLicense);
      tenderMatrix.push({
        standardNumber: rawStd,
        title: this.getStandardTitle(cleanStdPrefix),
        mandatoryUnderQCO: true,
        isCompliant,
        matchingCertificationId: matchedLicense ? matchedLicense.licenseId : null,
        complianceStatus: isCompliant ? 'COMPLIANT' : 'GAP_CERTIFICATION_REQUIRED',
        actionRequired: isCompliant
          ? 'Attach valid BIS Certificate to GeM technical bid portal.'
          : 'Apply for BIS ISI Certification Scheme-I or procure from a certified OEM supplier.'
      });
    }

    const compliantCount = tenderMatrix.filter((t) => t.isCompliant).length;
    const gapCount = tenderMatrix.length - compliantCount;
    const eligibilityPercentage = tenderMatrix.length > 0 ? Math.round((compliantCount / tenderMatrix.length) * 100) : 0;

    return {
      tenderId: `GEM-BID-${Date.now()}`,
      extractedStandards,
      totalStandardsRequired: tenderMatrix.length,
      compliantCount,
      gapCount,
      eligibilityPercentage,
      tenderMatrix,
      timestamp: new Date().toISOString()
    };
  }

  private getStandardTitle(stdPrefix: string): string {
    if (stdPrefix.includes('10500')) return 'Drinking Water Specification';
    if (stdPrefix.includes('4984')) return 'High Density Polyethylene (HDPE) Pipes';
    if (stdPrefix.includes('1293')) return 'Plugs and Socket-Outlets up to 250V';
    if (stdPrefix.includes('269')) return 'Ordinary Portland Cement 53 Grade';
    if (stdPrefix.includes('13252')) return 'Information Technology Equipment — Safety';
    return 'BIS Indian Standard Specification';
  }
}
