import type { Plugin } from 'vite';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

export function bisApiPlugin(): Plugin {
  let db: DatabaseSync | null = null;

  return {
    name: 'bis-standards-api',
    configureServer(server) {
      const dbPath = path.resolve(process.cwd(), 'bis_standards.db');
      if (fs.existsSync(dbPath)) {
        try {
          db = new DatabaseSync(dbPath, { readOnly: true });
          console.log('[BIS API] SQLite database connected at', dbPath);
        } catch (e) {
          console.warn('[BIS API] Could not open SQLite database:', e);
        }
      } else {
        console.warn('[BIS API] Database not found at', dbPath);
      }

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/standards/')) {
          return next();
        }

        const rawKey = req.url.slice('/api/standards/'.length).split('?')[0];
        const key = decodeURIComponent(rawKey);

        if (!db) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Database unavailable' }));
          return;
        }

        try {
          const isExplicitId = /^is-\d+$/i.test(key) || /^\d+$/.test(key);
          const explicitId = isExplicitId ? Number(key.replace(/^is-/i, '')) : -1;
          const clean = key.replace(/^is[-_]?/i, '');

          // Query standards_master
          const master = db.prepare(`
            SELECT * FROM standards_master 
            WHERE 
              (? > 0 AND internal_id = ?)
              OR slug = ?
              OR clean_number = ?
              OR IS_number LIKE ?
            ORDER BY 
              CASE WHEN slug = ? THEN 0 ELSE 1 END,
              CASE WHEN clean_number = ? THEN 0 ELSE 1 END,
              CASE WHEN status = 'Active' THEN 0 ELSE 1 END,
              CASE WHEN IS_number LIKE '%Part 1%' OR IS_number NOT LIKE '%Part%' THEN 0 ELSE 1 END,
              number_of_revisions DESC,
              internal_id DESC
            LIMIT 1
          `).get(
            explicitId, explicitId,
            key,
            clean,
            `IS ${clean}%`,
            key,
            clean
          ) as any;

          if (!master) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Standard not found' }));
            return;
          }

          const iid = master.internal_id;
          const cleanNum = master.clean_number;
          const isNumber = master.IS_number;

          const indRefs = db.prepare('SELECT reference_number, reference_is_number, reference_title, reference_committee FROM indian_references WHERE internal_id = ?').all(iid);
          const crossRefs = db.prepare('SELECT reference_number, reference_is_number, reference_title, reference_committee FROM cross_references WHERE internal_id = ?').all(iid);
          const intlRefs = db.prepare('SELECT reference_number, international_standard FROM international_references WHERE internal_id = ?').all(iid);
          const refBy = db.prepare('SELECT reference_number, reference_is_number, reference_title, reference_committee FROM referred_by WHERE internal_id = ?').all(iid);
          const clauses = db.prepare('SELECT clause_number, title, content, is_mandatory FROM golden_clauses WHERE standard_number LIKE ? OR standard_number LIKE ?').all(`%${cleanNum}%`, `%${isNumber}%`);
          const qco = db.prepare('SELECT qco_id, title, product, scope, effective_date, status, exemptions_json, requirements_json, source_url, source_type FROM qco_orders WHERE standard_number LIKE ? OR standard_number LIKE ?').get(`%${cleanNum}%`, `%${isNumber}%`) as any;

          const result = {
            master,
            indianReferences: indRefs.map((r: any) => ({
              number: r.reference_number,
              isNumber: r.reference_is_number,
              title: r.reference_title,
              committee: r.reference_committee,
            })),
            crossReferences: crossRefs.map((r: any) => ({
              number: r.reference_number,
              isNumber: r.reference_is_number,
              title: r.reference_title,
              committee: r.reference_committee,
            })),
            internationalReferences: intlRefs.map((r: any) => ({
              number: r.reference_number,
              standard: r.international_standard,
            })),
            referredBy: refBy.map((r: any) => ({
              number: r.reference_number,
              isNumber: r.reference_is_number,
              title: r.reference_title,
              committee: r.reference_committee,
            })),
            clauses: clauses.map((c: any) => ({
              clauseNumber: c.clause_number,
              title: c.title,
              content: c.content,
              isMandatory: Boolean(c.is_mandatory),
            })),
            qco: qco ? {
              qcoId: qco.qco_id,
              title: qco.title,
              product: qco.product,
              scope: qco.scope,
              effectiveDate: qco.effective_date,
              status: qco.status,
              exemptions: JSON.parse(qco.exemptions_json || '[]'),
              requirements: JSON.parse(qco.requirements_json || '[]'),
              sourceUrl: qco.source_url,
              sourceType: qco.source_type,
            } : null,
          };

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error('[BIS API Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    },
  };
}
