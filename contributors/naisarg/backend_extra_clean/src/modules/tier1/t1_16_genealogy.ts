import { Controller, Get, Param, HttpCode, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';

export interface GraphNode {
  id: string;
  label: string;
  standardNumber: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'WITHDRAWN';
  isTarget: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'SUPERSEDES' | 'SUPERSEDED_BY' | 'AMENDS';
  effectiveDate?: string;
}

export interface GenealogyGraphResponse {
  standardId: string;
  standardNumber: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  lineageDepth: number;
}

@ApiTags('Tier 1: Standards')
@Controller('api/v1/standards')
export class T116GenealogyController {
  private readonly logger = new Logger(T116GenealogyController.name);

  constructor(private readonly db: DatabaseService) {}

  @Get(':id/genealogy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-16] Standard genealogy/version graph explorer' })
  @ApiParam({ name: 'id', description: 'Standard ID or Standard Number (e.g. std-is-10500-2012 or IS 10500:2012)' })
  @ApiResponse({ status: 200, description: 'Nodes and edges graph of standard version lineage' })
  getGenealogy(@Param('id') targetId: string): GenealogyGraphResponse {
    const supersessions = this.db.getTable('standard_supersessions');
    const standards = this.db.getTable('standards');

    // Locate target standard or entry in supersessions
    const cleanId = decodeURIComponent(targetId).trim();
    const entry = supersessions.find(
      (s: any) =>
        s.standardId === cleanId ||
        s.standardNumber === cleanId ||
        s.standardNumber.replace(/:.*/, '').trim().toUpperCase() === cleanId.replace(/:.*/, '').trim().toUpperCase()
    );

    const standardDef = standards.find(
      (s: any) => s.standardId === cleanId || s.standardNumber === cleanId
    );

    const standardNumber = entry ? entry.standardNumber : standardDef ? standardDef.standardNumber : cleanId;

    const nodesMap = new Map<string, GraphNode>();
    const edgesList: GraphEdge[] = [];

    // Add target root node
    nodesMap.set(standardNumber, {
      id: standardNumber,
      label: standardNumber,
      standardNumber,
      effectiveDate: entry ? entry.effectiveDate : standardDef ? standardDef.effectiveDate : '2015-01-01',
      status: entry && entry.supersededBy ? 'SUPERSEDED' : 'ACTIVE',
      isTarget: true
    });

    // Recursive / BFS search of supersessions lineage
    const visited = new Set<string>();
    const queue: string[] = [standardNumber];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      // Find supersession entries where current is target
      const directMatches = supersessions.filter(
        (s: any) => s.standardNumber === current || s.supersedes === current || s.supersededBy === current
      );

      for (const m of directMatches) {
        // If m supersedes an older version
        if (m.supersedes) {
          if (!nodesMap.has(m.supersedes)) {
            nodesMap.set(m.supersedes, {
              id: m.supersedes,
              label: m.supersedes,
              standardNumber: m.supersedes,
              effectiveDate: '1991-03-01',
              status: 'SUPERSEDED',
              isTarget: false
            });
            queue.push(m.supersedes);
          }
          const edgeId = `edge-${m.standardNumber}-supersedes-${m.supersedes}`;
          if (!edgesList.some((e) => e.id === edgeId)) {
            edgesList.push({
              id: edgeId,
              source: m.standardNumber,
              target: m.supersedes,
              relationship: 'SUPERSEDES',
              effectiveDate: m.effectiveDate
            });
          }
        }

        // If m was superseded by a newer version
        if (m.supersededBy) {
          if (!nodesMap.has(m.supersededBy)) {
            nodesMap.set(m.supersededBy, {
              id: m.supersededBy,
              label: m.supersededBy,
              standardNumber: m.supersededBy,
              effectiveDate: '2026-01-01',
              status: 'ACTIVE',
              isTarget: false
            });
            queue.push(m.supersededBy);
          }
          const edgeId = `edge-${m.standardNumber}-superseded_by-${m.supersededBy}`;
          if (!edgesList.some((e) => e.id === edgeId)) {
            edgesList.push({
              id: edgeId,
              source: m.standardNumber,
              target: m.supersededBy,
              relationship: 'SUPERSEDED_BY'
            });
          }
        }
      }
    }

    return {
      standardId: entry ? entry.standardId : cleanId,
      standardNumber,
      nodes: Array.from(nodesMap.values()),
      edges: edgesList,
      lineageDepth: nodesMap.size
    };
  }
}
