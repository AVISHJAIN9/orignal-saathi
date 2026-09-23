import { Controller, Post, Body, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface SandboxSimulateRequest {
  standardNumber?: string;
  productSpec: Record<string, any> | Array<{ field: string; value: any }>;
}

export interface RequirementEvaluation {
  parameter: string;
  measuredValue: any;
  operator: string;
  threshold: any;
  unit: string;
  passed: boolean;
  clauseNumber: string;
  standardNumber: string;
  deviation?: string;
}

export interface SandboxSimulateResponse {
  standardNumber: string;
  overallCompliance: boolean;
  totalEvaluated: number;
  passedCount: number;
  failedCount: number;
  evaluations: RequirementEvaluation[];
  executionTimeMs: number;
}

@ApiTags('Tier 1: Regulatory Sandbox')
@Controller('api/v1/sandbox')
export class T110SandboxController {
  private readonly logger = new Logger(T110SandboxController.name);

  constructor(private readonly db: DatabaseService) {}

  @Post('simulate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-10] What-if regulatory sandbox simulator (stateless, p95 < 200ms)' })
  @ApiResponse({ status: 200, description: 'Live parameter pass/fail evaluation' })
  simulate(@Body() body: SandboxSimulateRequest): SandboxSimulateResponse {
    const startTime = performance.now();
    const { standardNumber, productSpec } = body;

    // Convert productSpec into standard key-value map
    const specMap: Record<string, any> = {};
    if (Array.isArray(productSpec)) {
      productSpec.forEach((item) => {
        if (item && item.field !== undefined) {
          specMap[item.field] = item.value;
        }
      });
    } else if (typeof productSpec === 'object' && productSpec !== null) {
      Object.assign(specMap, productSpec);
    } else {
      throw new BadRequestException('productSpec must be an object or array of { field, value } objects.');
    }

    const allRequirements = this.db.getTable('standard_requirements');
    const targetStd = standardNumber ? standardNumber.replace(/:.*/, '').trim().toUpperCase() : null;

    // Filter requirements matching target standard and parameters provided in productSpec
    const matchingReqs = allRequirements.filter((r: any) => {
      const stdMatch = targetStd ? r.standardNumber.toUpperCase().includes(targetStd) : true;
      const paramMatch = Object.keys(specMap).some(
        (k) => k.toLowerCase() === r.parameter.toLowerCase() || r.parameter.toLowerCase().includes(k.toLowerCase())
      );
      return stdMatch && paramMatch;
    });

    const evaluations: RequirementEvaluation[] = [];

    // Evaluate each requirement against provided spec
    for (const req of matchingReqs) {
      const paramName = req.parameter;
      // Match case-insensitively against user spec keys
      const matchedKey = Object.keys(specMap).find(
        (k) => k.toLowerCase() === paramName.toLowerCase() || paramName.toLowerCase().includes(k.toLowerCase())
      );

      const val = matchedKey ? specMap[matchedKey] : undefined;
      const numericVal = typeof val === 'number' ? val : parseFloat(val);

      let passed = false;
      let deviation: string | undefined = undefined;

      if (val === undefined || isNaN(numericVal)) {
        // If not specified in product spec, check if boolean or string comparison applies
        if (typeof val === 'string' && req.operator === '==') {
          passed = val.toLowerCase() === String(req.threshold).toLowerCase();
        } else {
          // If not provided in simulation spec, mark false with unprovided note
          passed = false;
          deviation = `Parameter '${paramName}' not specified in productSpec.`;
        }
      } else {
        switch (req.operator) {
          case '<=':
            passed = numericVal <= Number(req.threshold);
            if (!passed) deviation = `Exceeds max permissible limit ${req.threshold} ${req.unit} by ${numericVal - Number(req.threshold)} ${req.unit}`;
            break;
          case '>=':
            passed = numericVal >= Number(req.threshold);
            if (!passed) deviation = `Below mandatory threshold ${req.threshold} ${req.unit} by ${Number(req.threshold) - numericVal} ${req.unit}`;
            break;
          case '<':
            passed = numericVal < Number(req.threshold);
            break;
          case '>':
            passed = numericVal > Number(req.threshold);
            break;
          case '==':
            passed = numericVal === Number(req.threshold);
            break;
          case 'range':
            if (Array.isArray(req.threshold) && req.threshold.length === 2) {
              const [min, max] = req.threshold;
              passed = numericVal >= min && numericVal <= max;
              if (!passed) deviation = `Outside allowed statutory range [${min}, ${max}] ${req.unit}`;
            }
            break;
          default:
            passed = true;
        }
      }

      evaluations.push({
        parameter: req.parameter,
        measuredValue: val ?? null,
        operator: req.operator,
        threshold: req.threshold,
        unit: req.unit,
        passed,
        clauseNumber: req.clauseNumber,
        standardNumber: req.standardNumber,
        deviation
      });
    }

    const passedCount = evaluations.filter((e) => e.passed).length;
    const failedCount = evaluations.length - passedCount;
    const overallCompliance = failedCount === 0 && evaluations.length > 0;
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      standardNumber: standardNumber || 'ALL_STANDARDS',
      overallCompliance,
      totalEvaluated: evaluations.length,
      passedCount,
      failedCount,
      evaluations,
      executionTimeMs
    };
  }
}
