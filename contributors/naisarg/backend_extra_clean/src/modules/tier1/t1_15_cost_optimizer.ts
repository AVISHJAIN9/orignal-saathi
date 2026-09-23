import { Controller, Get, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface CertificationPathComparison {
  id: string;
  pathType: string;
  productCategory: string;
  avgCostINR: number;
  avgDays: number;
  costRank: number;
  timeRank: number;
  requiresFactoryAudit: boolean;
  requiresLabTest: boolean;
  recommendationTag?: 'FASTEST' | 'LOWEST_COST' | 'BALANCED' | 'MANDATORY_FOR_IMPORTS';
}

@ApiTags('Tier 1: Certification Paths')
@Controller('api/v1/certification')
export class T115CostOptimizerController {
  private readonly logger = new Logger(T115CostOptimizerController.name);

  constructor(private readonly db: DatabaseService) {}

  @Get('paths')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-15] Certification-path cost/time optimizer' })
  @ApiQuery({ name: 'productCategory', required: false, description: 'Product Category (e.g. Electrical, Electronics, Construction Materials)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['cost', 'time', 'balanced'], description: 'Sort criteria' })
  @ApiResponse({ status: 200, description: 'Sorted comparison array of certification routes' })
  getCertificationPaths(
    @Query('productCategory') productCategory?: string,
    @Query('sortBy') sortBy?: 'cost' | 'time' | 'balanced'
  ): { productCategory: string; totalPathsFound: number; paths: CertificationPathComparison[] } {
    const allPaths = this.db.getTable('certification_paths');
    const categoryFilter = (productCategory || 'Electrical').toLowerCase().trim();

    let filtered = allPaths.filter((p: any) => {
      const matchCat = p.productCategory.toLowerCase().includes(categoryFilter);
      const matchApp = Array.isArray(p.applicableCategories) &&
        p.applicableCategories.some((c: string) => c.toLowerCase().includes(categoryFilter));
      return matchCat || matchApp;
    });

    if (filtered.length === 0) {
      filtered = allPaths;
    }

    // Sort by cost, days, or balanced
    const sortCriterion = sortBy || 'cost';
    if (sortCriterion === 'cost') {
      filtered.sort((a: any, b: any) => a.avgCostINR - b.avgCostINR);
    } else if (sortCriterion === 'time') {
      filtered.sort((a: any, b: any) => a.avgDays - b.avgDays);
    } else {
      filtered.sort((a: any, b: any) => a.avgCostINR * a.avgDays - b.avgCostINR * b.avgDays);
    }

    const minCost = Math.min(...filtered.map((p: any) => p.avgCostINR));
    const minDays = Math.min(...filtered.map((p: any) => p.avgDays));

    const paths: CertificationPathComparison[] = filtered.map((p: any, idx: number) => {
      let recommendationTag: 'FASTEST' | 'LOWEST_COST' | 'BALANCED' | 'MANDATORY_FOR_IMPORTS' = 'BALANCED';
      if (p.avgCostINR === minCost) recommendationTag = 'LOWEST_COST';
      else if (p.avgDays === minDays) recommendationTag = 'FASTEST';
      else if (p.pathType.includes('Foreign') || p.pathType.includes('FMCS')) recommendationTag = 'MANDATORY_FOR_IMPORTS';

      return {
        id: p.id,
        pathType: p.pathType,
        productCategory: p.productCategory,
        avgCostINR: p.avgCostINR,
        avgDays: p.avgDays,
        costRank: idx + 1,
        timeRank: filtered.slice().sort((x: any, y: any) => x.avgDays - y.avgDays).findIndex((x: any) => x.id === p.id) + 1,
        requiresFactoryAudit: Boolean(p.requiresFactoryAudit),
        requiresLabTest: Boolean(p.requiresLabTest),
        recommendationTag
      };
    });

    return {
      productCategory: productCategory || 'All Categories',
      totalPathsFound: paths.length,
      paths
    };
  }
}
