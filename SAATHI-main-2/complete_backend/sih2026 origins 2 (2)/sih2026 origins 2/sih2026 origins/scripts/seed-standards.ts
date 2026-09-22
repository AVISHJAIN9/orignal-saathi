import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export interface GoldenStandard {
  standardNumber: string;
  title: string;
  category: string;
  division: string;
  status: string;
  scope: string;
  clauses: Array<{
    clauseNumber: string;
    title: string;
    content: string;
    isMandatory: boolean;
  }>;
}

export const GOLDEN_STANDARDS: GoldenStandard[] = [
  {
    standardNumber: 'IS 10500:2012',
    title: 'Drinking Water — Specification (Second Revision)',
    category: 'Water Quality & Environment',
    division: 'Food and Agriculture Division (FAD)',
    status: 'ACTIVE',
    scope: 'Prescribes the quality requirements and permissible limits for drinking water intended for human consumption.',
    clauses: [
      {
        clauseNumber: 'Clause 4.1',
        title: 'Essential Requirements (Table 1)',
        content: 'pH value must be between 6.5 and 8.5 without relaxation. Total Dissolved Solids (TDS) acceptable limit is 500 mg/l, permissible up to 2000 mg/l in the absence of an alternate source.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 4.2',
        title: 'Bacteriological Quality',
        content: 'All water intended for drinking shall not contain E. coli or thermotolerant coliform bacteria in any 100 ml sample.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 4.3',
        title: 'Toxic Substances (Table 2)',
        content: 'Lead (as Pb) max 0.01 mg/l, Arsenic (as As) max 0.01 mg/l, Fluoride (as F) max 1.0 mg/l (permissible up to 1.5 mg/l).',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 4984:2016',
    title: 'High Density Polyethylene (HDPE) Pipes for Water Supply — Specification',
    category: 'Piping & Civil Infrastructure',
    division: 'Civil Engineering Division (CED)',
    status: 'ACTIVE',
    scope: 'Covers requirements for HDPE pipes from 16 mm to 1000 mm nominal outer diameter for water conveyance.',
    clauses: [
      {
        clauseNumber: 'Clause 5.1',
        title: 'Raw Material Classification',
        content: 'Pipes shall be manufactured from virgin polyethylene material of designation PE-63, PE-80, or PE-100 containing 2.0 to 2.5% carbon black.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Hydrostatic Strength Test',
        content: 'Pipes must withstand internal hydrostatic pressure test at 80°C for 165 hours without failure or leakage.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 2062:2011',
    title: 'Hot Rolled Medium and High Tensile Structural Steel — Specification',
    category: 'Metallurgy & Heavy Engineering',
    division: 'Metallurgical Engineering Division (MTD)',
    status: 'ACTIVE',
    scope: 'Prescribes requirements for structural steel plates, sections, flats, and bars for welded, bolted, and riveted structures.',
    clauses: [
      {
        clauseNumber: 'Clause 6.1',
        title: 'Chemical Composition',
        content: 'Carbon content shall not exceed 0.20% for Grade E250 Quality A, with Carbon Equivalent (CE) max 0.42%.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 9.1',
        title: 'Tensile Strength and Yield Stress',
        content: 'Minimum yield stress for Grade E250 is 250 MPa for thickness < 20 mm; minimum tensile strength is 410 MPa with 23% elongation.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 14543:2004',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification',
    category: 'Packaged Beverages',
    division: 'Food and Agriculture Division (FAD)',
    status: 'ACTIVE (MANDATORY CERTIFICATION)',
    scope: 'Mandatory ISI certification scheme for commercially bottled and packaged drinking water.',
    clauses: [
      {
        clauseNumber: 'Clause 3.2',
        title: 'Treatment Processes',
        content: 'Water must be subjected to treatment such as decantation, filtration, demineralization, reverse osmosis, and disinfection via ozonation or UV irradiation.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 5.1',
        title: 'Packaging Containers',
        content: 'Shall be packed in clean, hygienic, colorless transparent containers made of food-grade PET or Polycarbonate conforming to IS 12252.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 694:2010',
    title: 'Polyvinyl Chloride (PVC) Insulated Unsheathed and Sheathed Cables up to 1100 V',
    category: 'Electrical Safety & Appliances',
    division: 'Electrotechnical Division (ETD)',
    status: 'ACTIVE',
    scope: 'Requirements for single core and multicore PVC insulated cables for domestic and industrial wiring.',
    clauses: [
      {
        clauseNumber: 'Clause 7.2',
        title: 'Conductor Resistance Test',
        content: 'Conductor DC resistance at 20°C must comply with IS 8130 for plain electrolytic copper conductors.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 12.1',
        title: 'Spark Test',
        content: 'Core insulation must pass spark test voltage of 6 kV AC (rms) during manufacture without insulation puncture.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment — Safety (General Requirements)',
    category: 'Electronics & IT (Compulsory Registration Scheme - CRS)',
    division: 'Electronics & Information Technology Division (LITD)',
    status: 'ACTIVE (CRS MANDATORY)',
    scope: 'Mandatory registration for laptops, mobile phones, power adapters, smart watches, and server equipment.',
    clauses: [
      {
        clauseNumber: 'Clause 1.5',
        title: 'Components & Insulation',
        content: 'Safety-critical components such as power supply cords, bridge rectifiers, and optocouplers must be BIS approved or IEC recognized.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 5.1',
        title: 'Touch Current and Protective Conductor Current',
        content: 'Touch current under normal operating conditions must not exceed 0.25 mA for Class II equipment.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets of Rated Voltage up to and including 250 Volts',
    category: 'Electrical Wiring Accessories',
    division: 'Electrotechnical Division (ETD)',
    status: 'ACTIVE (QCO MANDATORY)',
    scope: 'Specifications for 6A and 16A two-pole with earthing pin plugs and socket-outlets.',
    clauses: [
      {
        clauseNumber: 'Clause 8.1',
        title: 'Marking and ISI Logo',
        content: 'Must be permanently marked with manufacturer name/trademark, rated current (6A/16A), rated voltage (250V), and ISI Standard Mark.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 13.1',
        title: 'Withdrawal Force Measurement',
        content: 'The force required to withdraw the gauge plug from the socket-outlet must fall within minimum 1.5 N and maximum 50 N.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT)',
    category: 'Construction Materials',
    division: 'Civil Engineering Division (CED)',
    status: 'ACTIVE',
    scope: 'Covers Thermo-Mechanically Treated (TMT) rebars for reinforced concrete construction (Fe 415, Fe 500, Fe 550, Fe 600).',
    clauses: [
      {
        clauseNumber: 'Clause 4.2',
        title: 'Chemical Composition Limits',
        content: 'For Fe 500D: Carbon max 0.25%, Sulphur max 0.040%, Phosphorus max 0.040%, S+P max 0.075%.',
        isMandatory: true,
      },
      {
        clauseNumber: 'Clause 8.2',
        title: 'Bend and Rebend Test',
        content: 'Test specimen shall show no rupture or cracks visible to unaided eye on transverse bending around mandatory mandrel diameter.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 814:2004',
    title: 'Covered Electrodes for Manual Metal Arc Welding of Carbon Steel — Specification',
    category: 'Welding & Fabrication',
    division: 'Metallurgical Engineering Division (MTD)',
    status: 'ACTIVE',
    scope: 'Classification and quality requirements for flux-coated electrodes for shielded metal arc welding.',
    clauses: [
      {
        clauseNumber: 'Clause 6.1',
        title: 'Electrode Identification Code',
        content: 'Classification designation consists of prefix letter E followed by 6 digits indicating tensile strength, coating type, and welding position.',
        isMandatory: true,
      },
    ],
  },
  {
    standardNumber: 'IS 15885 (Part 2/Sec 13):2012',
    title: 'Lamp Controlgear — AC/DC Supplied Electronic Controlgear for LED Modules',
    category: 'Lighting & LEDs',
    division: 'Electrotechnical Division (ETD)',
    status: 'ACTIVE (CRS MANDATORY)',
    scope: 'Safety specifications for LED drivers and electronic power supplies operating LED luminaires.',
    clauses: [
      {
        clauseNumber: 'Clause 14.1',
        title: 'Fault Condition Safety',
        content: 'Controlgear must not produce flames or molten material during short-circuit or open-circuit failure mode testing.',
        isMandatory: true,
      },
    ],
  },
];

async function runSeed() {
  console.log('====================================================');
  console.log('🌱 SAATHI — Seeding Top 10 Golden Indian Standards');
  console.log('====================================================');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'saathi_db',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to PostgreSQL database.');

    // Ensure standards catalog table exists
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS standards_catalog (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        standard_number VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(512) NOT NULL,
        category VARCHAR(256),
        division VARCHAR(256),
        status VARCHAR(64) DEFAULT 'ACTIVE',
        scope TEXT,
        clauses JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    for (const std of GOLDEN_STANDARDS) {
      await dataSource.query(
        `
        INSERT INTO standards_catalog (standard_number, title, category, division, status, scope, clauses, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (standard_number) DO UPDATE
        SET title = EXCLUDED.title,
            category = EXCLUDED.category,
            division = EXCLUDED.division,
            scope = EXCLUDED.scope,
            clauses = EXCLUDED.clauses,
            updated_at = NOW();
      `,
        [
          std.standardNumber,
          std.title,
          std.category,
          std.division,
          std.status,
          std.scope,
          JSON.stringify(std.clauses),
        ],
      );
      console.log(`  ✓ Seeded: [${std.standardNumber}] ${std.title}`);
    }

    console.log('====================================================');
    console.log('🎉 Successfully seeded 10 golden standards into PostgreSQL!');
    console.log('====================================================');
  } catch (err: any) {
    console.error('❌ Error during seeding:', err.message);
    console.log('ℹ️ Tip: Ensure PostgreSQL is running on DB_HOST/DB_PORT');
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();
