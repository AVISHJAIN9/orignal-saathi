import { Controller, Post, Body, HttpCode, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface StandardDiffClause {
  clauseId: string;
  clauseNumber: string;
  oldText: string | null;
  newText: string | null;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  similarityScore: number;
}

export interface StandardDiffResponse {
  oldStandardId: string;
  newStandardId: string;
  differences: StandardDiffClause[];
  summary: {
    totalClausesCompared: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
  };
  cached: boolean;
}

@ApiTags('Tier 1: Standards')
@Controller('api/v1/standards')
export class T102DiffController {
  private readonly logger = new Logger(T102DiffController.name);

  constructor(private readonly db: DatabaseService) {}

  @Post('diff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-02] Clause-level standard diff engine' })
  @ApiResponse({ status: 200, description: 'Clause-by-clause standard diff' })
  async diffStandards(@Body() body: { oldStandardId: string; newStandardId: string }): Promise<StandardDiffResponse> {
    const { oldStandardId, newStandardId } = body;
    if (!oldStandardId || !newStandardId) {
      throw new NotFoundException('Both oldStandardId and newStandardId are required.');
    }

    const diffKey = `${oldStandardId}_${newStandardId}`;

    // Check cached diff in standard_diffs table
    const cachedDiff = this.db.findOne('standard_diffs', (d: any) => d.diffKey === diffKey);
    if (cachedDiff) {
      return {
        ...cachedDiff.diffResults,
        cached: true
      };
    }

    const standards = this.db.getTable('standards');
    const oldStd = standards.find((s: any) => s.standardId === oldStandardId || s.standardNumber === oldStandardId);
    const newStd = standards.find((s: any) => s.standardId === newStandardId || s.standardNumber === newStandardId);

    if (!oldStd || !newStd) {
      throw new NotFoundException(`One or both standards (${oldStandardId}, ${newStandardId}) could not be located in registry.`);
    }

    const oldClauses = oldStd.clauses || [];
    const newClauses = newStd.clauses || [];

    const differences: StandardDiffClause[] = [];
    const oldMap = new Map(oldClauses.map((c: any) => [c.clauseNumber, c]));
    const newMap = new Map(newClauses.map((c: any) => [c.clauseNumber, c]));

    // Check all old clauses against new
    for (const [clauseNum, oldC] of oldMap.entries() as any) {
      const newC = newMap.get(clauseNum) as any;
      if (!newC) {
        differences.push({
          clauseId: oldC.clauseId,
          clauseNumber: clauseNum,
          oldText: oldC.content,
          newText: null,
          changeType: 'removed',
          similarityScore: 0.0
        });
      } else {
        const sim = this.calculateSequenceSimilarity(oldC.content, newC.content);
        const changeType = sim >= 0.99 ? 'unchanged' : 'modified';
        differences.push({
          clauseId: newC.clauseId,
          clauseNumber: clauseNum,
          oldText: oldC.content,
          newText: newC.content,
          changeType,
          similarityScore: Math.round(sim * 100) / 100
        });
      }
    }

    // Check newly added clauses
    for (const [clauseNum, newC] of newMap.entries() as any) {
      if (!oldMap.has(clauseNum)) {
        differences.push({
          clauseId: newC.clauseId,
          clauseNumber: clauseNum,
          oldText: null,
          newText: newC.content,
          changeType: 'added',
          similarityScore: 0.0
        });
      }
    }

    const summary = {
      totalClausesCompared: differences.length,
      addedCount: differences.filter((d) => d.changeType === 'added').length,
      removedCount: differences.filter((d) => d.changeType === 'removed').length,
      modifiedCount: differences.filter((d) => d.changeType === 'modified').length,
      unchangedCount: differences.filter((d) => d.changeType === 'unchanged').length
    };

    const diffResult: StandardDiffResponse = {
      oldStandardId,
      newStandardId,
      differences,
      summary,
      cached: false
    };

    // Store in standard_diffs table cache
    this.db.insert('standard_diffs', {
      diffKey,
      oldStandardId,
      newStandardId,
      diffResults: diffResult,
      createdAt: new Date()
    });

    return diffResult;
  }

  private calculateSequenceSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    const words1 = s1.toLowerCase().split(/\s+/);
    const words2 = s2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    let intersection = 0;
    for (const w of set1) {
      if (set2.has(w)) intersection++;
    }

    const union = new Set([...words1, ...words2]).size;
    return union === 0 ? 1.0 : intersection / union;
  }
}
