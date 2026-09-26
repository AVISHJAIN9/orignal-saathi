/**
 * Master I-Series Database Engine & Statutory Seed Registry
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Provides relational database persistence for International Trust & Transparency (I1–I25).
 * Supports Postgres connection pool when DATABASE_URL is present, with in-memory fallback.
 */

let Pool;
try {
  Pool = require('pg').Pool;
} catch (e) {
  Pool = null;
}

const SEED_DATA = {
  // I1: Public Search Directory of Certified Products
  certified_products: [
    {
      id: 'prod_1',
      cml_no: 'CML-8400192831',
      company_name: 'Bharat Cement & Minerals Ltd.',
      brand: 'BHARAT-SHAKTI',
      product: 'Ordinary Portland Cement 43 Grade',
      standard: 'IS 269:2015',
      factory_city: 'Nagpur',
      factory_state: 'Maharashtra',
      status: 'OPERATIVE_VALID',
      valid_until: '2026-06-14',
      gem_portal_eligible: true,
      eco_mark_certified: true,
      foreign_mark_equivalents: ['EN 197-1 (CEM I 42.5N)', 'ASTM C150 Type I']
    },
    {
      id: 'prod_2',
      cml_no: 'CML-7200451920',
      company_name: 'AquaPure Himalayan Springs Pvt Ltd',
      brand: 'HIMALAYAN-DROP',
      product: 'Packaged Drinking Water',
      standard: 'IS 14543:2016',
      factory_city: 'Dehradun',
      factory_state: 'Uttarakhand',
      status: 'OPERATIVE_VALID',
      valid_until: '2025-11-30',
      gem_portal_eligible: true,
      eco_mark_certified: false,
      foreign_mark_equivalents: ['Codex Stan 227-2001']
    },
    {
      id: 'prod_3',
      cml_no: 'CML-9100223344',
      company_name: 'Apex Electrical Innovations India Ltd',
      brand: 'APEX-POWER',
      product: 'Plugs and Socket Outlets 16A',
      standard: 'IS 1293:2019',
      factory_city: 'Pune',
      factory_state: 'Maharashtra',
      status: 'SUSPENDED',
      valid_until: '2025-01-15',
      gem_portal_eligible: false,
      eco_mark_certified: false,
      foreign_mark_equivalents: ['IEC 60884-1']
    }
  ],

  // I4: Nationwide Searchable Directory of Accredited Labs
  accredited_testing_laboratories: [
    {
      lab_id: 'LAB-NABL-01',
      name: 'National Test House (WR)',
      city: 'Mumbai',
      state: 'Maharashtra',
      accredited_standards: ['IS 269:2015', 'IS 1293:2019'],
      average_tat_days: 7,
      accreditation_number: 'TC-5481',
      status: 'ACTIVE'
    },
    {
      lab_id: 'LAB-NABL-02',
      name: 'Shriram Institute for Industrial Research',
      city: 'Delhi',
      state: 'Delhi',
      accredited_standards: ['IS 10500:2012', 'IS 14543:2016'],
      average_tat_days: 5,
      accreditation_number: 'TC-6102',
      status: 'ACTIVE'
    },
    {
      lab_id: 'LAB-NABL-03',
      name: 'Central Power Research Institute (CPRI)',
      city: 'Bengaluru',
      state: 'Karnataka',
      accredited_standards: ['IS 1293:2019', 'IS 3854:1997'],
      average_tat_days: 9,
      accreditation_number: 'TC-7044',
      status: 'ACTIVE'
    }
  ],

  // I12: Unified Recall Feed
  unified_recalls: [
    {
      recall_id: 'RCL-2024-001',
      authority: 'BIS',
      product_name: 'Domestic Electric Iron 1000W',
      brand: 'SafeHeat',
      batch_number: 'SH-2023-B4',
      standard: 'IS 302 (Part 2/Sec 3):2007',
      hazard_description: 'Risk of electric shock due to inadequate creepage distance and insulation breakdown.',
      action_required: 'Immediate consumer return for full refund; retailer stock recall.',
      published_date: '2024-05-18',
      status: 'ACTIVE'
    },
    {
      recall_id: 'RCL-2024-002',
      authority: 'CCPA',
      product_name: 'Pressure Cooker 5 Litre',
      brand: 'QuickCook Pro',
      batch_number: 'QC-23-OCT',
      standard: 'IS 2347:2017',
      hazard_description: 'Gasket release mechanism non-conformance under sudden thermal load.',
      action_required: 'Voluntary replacement of lid assembly at authorized service centers.',
      published_date: '2024-06-02',
      status: 'ACTIVE'
    }
  ],

  // I19: Cross-Mark Equivalence
  cross_mark_equivalences: [
    {
      id: 'eq_1',
      indian_standard: 'IS 269:2015',
      international_mark: 'EN 197-1 (CEM I 42.5N)',
      jurisdiction: 'EU',
      equivalence_grade: 'SUBSTANTIALLY_EQUIVALENT',
      delta_requirements: 'BIS mandates additional Soundness by Le Chatelier method (Clause 6.2).'
    },
    {
      id: 'eq_2',
      indian_standard: 'IS 1293:2019',
      international_mark: 'IEC 60884-1',
      jurisdiction: 'GLOBAL',
      equivalence_grade: 'MODIFIED_ADOPTION',
      delta_requirements: 'Specific pin dimensions and shutter test criteria unique to Indian socket topology (Type D / M).'
    }
  ]
};

class FatalDatabaseError extends Error {
  constructor(msg) { super(msg); this.name = 'FatalDatabaseError'; }
}

class RelationalDatabase {
  constructor() {
    this.usePostgres = false;
    this.pool = null;
    this.memoryStore = {};
    this._devMode = false;
  }

  async initialize() {
    const dbUrl = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalDev = process.env.LOCAL_DEV === 'true';

    if (Pool && dbUrl && !dbUrl.includes('CHANGE_ME') && !dbUrl.includes('your_postgres_password_here')) {
      try {
        this.pool = new Pool({
          connectionString: dbUrl,
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          max: parseInt(process.env.DB_POOL_MAX || '20'),
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
        const client = await this.pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        this.usePostgres = true;
        console.log('✅ I-Series DB: PostgreSQL connected');
        return this;
      } catch (err) {
        if (isProduction) {
          console.error(`🔴 FATAL: I-Series DB unreachable: ${err.message}`);
          throw new FatalDatabaseError(`I-Series PostgreSQL unreachable: ${err.message}`);
        }
require('dotenv').config();
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
} catch (e) {}

        console.warn(`⚠️  [LOCAL-DEV ONLY] I-Series DB unreachable (${err.message}). Using in-memory seed store.`);
      }
    }

    console.warn('ℹ️  I-Series: in-memory seed store active.');
    this._devMode = true;
    for (const [table, rows] of Object.entries(SEED_DATA)) {
      this.memoryStore[table] = JSON.parse(JSON.stringify(rows));
    }
    return this;
  }

  _initMemoryStore() {
    for (const [table, rows] of Object.entries(SEED_DATA)) {
      this.memoryStore[table] = JSON.parse(JSON.stringify(rows));
    }
  }

  async getTable(tableName) {
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(`SELECT * FROM "${tableName}"`);
      return res.rows;
    }
    if (this._devMode) return this.memoryStore[tableName] || [];
    throw new FatalDatabaseError('I-Series DB not initialized. Call iDb.initialize() at startup.');
  }

  async insert(tableName, row) {
    if (this.usePostgres && this.pool) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const cols = keys.map(k => `"${k}"`).join(', ');
      const res = await this.pool.query(
        `INSERT INTO "${tableName}" (${cols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING RETURNING *`,
        values
      );
      return res.rows[0] || row;
    }
    if (this._devMode) {
      if (!this.memoryStore[tableName]) this.memoryStore[tableName] = [];
      const cloned = { ...row };
      this.memoryStore[tableName].push(cloned);
      return cloned;
    }
    throw new FatalDatabaseError('I-Series DB not initialized.');
  }

  async findOne(tableName, filterFn) {
    const table = await this.getTable(tableName);
    return table.find(filterFn) || null;
  }

  async update(tableName, filterFn, patch) {
    if (this.usePostgres && this.pool) {
      const all = await this.getTable(tableName);
      const item = all.find(filterFn);
      if (!item || !item.id) return null;
      const sets = Object.keys(patch).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await this.pool.query(
        `UPDATE "${tableName}" SET ${sets} WHERE id = $${Object.keys(patch).length + 1}`,
        [...Object.values(patch), item.id]
      );
      return { ...item, ...patch };
    }
    if (this._devMode) {
      const table = this.memoryStore[tableName] || [];
      const item = table.find(filterFn);
      if (item) { Object.assign(item, patch); return item; }
      return null;
    }
    throw new FatalDatabaseError('I-Series DB not initialized.');
  }

  async query(filterFn, tableName) {
    const all = await this.getTable(tableName);
    return all.filter(filterFn);
  }
}

const iDb = new RelationalDatabase();

(async () => {
  try {
    await iDb.initialize();
  } catch (err) {
    if (err.name === 'FatalDatabaseError') {
      console.error(`🔴 FATAL DB ERROR: ${err.message}`);
      if (process.env.NODE_ENV === 'production') process.exit(1);
    }
  }
})();

module.exports = {
  iDb,
  SEED_DATA,
  FatalDatabaseError
};

