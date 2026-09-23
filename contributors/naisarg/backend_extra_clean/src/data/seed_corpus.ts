export interface StandardClause {
  clauseId: string;
  clauseNumber: string;
  title: string;
  content: string;
  requirements?: {
    parameter: string;
    operator: '<=' | '>=' | '==' | '<' | '>' | 'range';
    threshold: number | string | [number, number];
    unit: string;
  }[];
}

export interface StandardDefinition {
  standardId: string;
  standardNumber: string;
  title: string;
  division: string;
  publicationYear: number;
  status: 'ACTIVE' | 'SUPERSEDED' | 'WITHDRAWN';
  effectiveDate: string;
  clauses: StandardClause[];
}

export const SEED_STANDARDS: StandardDefinition[] = [
  {
    standardId: 'std-is-10500-2012',
    standardNumber: 'IS 10500:2012',
    title: 'Drinking Water — Specification (Second Revision)',
    division: 'Food and Agriculture Division (FAD)',
    publicationYear: 2012,
    status: 'ACTIVE',
    effectiveDate: '2012-05-01',
    clauses: [
      {
        clauseId: 'IS10500-4.1',
        clauseNumber: '4.1',
        title: 'Essential Chemical Characteristics',
        content: 'pH value shall be between 6.5 and 8.5. Total Dissolved Solids (TDS) shall not exceed 500 mg/L in acceptable limit and 2000 mg/L in permissible limit in the absence of alternate source.',
        requirements: [
          { parameter: 'pH', operator: 'range', threshold: [6.5, 8.5], unit: 'pH' },
          { parameter: 'TDS', operator: '<=', threshold: 500, unit: 'mg/L' },
          { parameter: 'Turbidity', operator: '<=', threshold: 1.0, unit: 'NTU' }
        ]
      },
      {
        clauseId: 'IS10500-4.2',
        clauseNumber: '4.2',
        title: 'Bacteriological Quality',
        content: 'All water intended for drinking shall be free from Escherichia coli or thermotolerant coliform bacteria in any 100 ml sample.',
        requirements: [
          { parameter: 'E.coli', operator: '==', threshold: 0, unit: 'count/100ml' },
          { parameter: 'Coliform', operator: '==', threshold: 0, unit: 'count/100ml' }
        ]
      },
      {
        clauseId: 'IS10500-4.3',
        clauseNumber: '4.3',
        title: 'Toxic Heavy Metals',
        content: 'The concentration of toxic metals shall not exceed: Lead 0.01 mg/L, Arsenic 0.01 mg/L, Cadmium 0.003 mg/L, Fluoride 1.0 mg/L.',
        requirements: [
          { parameter: 'Lead', operator: '<=', threshold: 0.01, unit: 'mg/L' },
          { parameter: 'Arsenic', operator: '<=', threshold: 0.01, unit: 'mg/L' },
          { parameter: 'Fluoride', operator: '<=', threshold: 1.0, unit: 'mg/L' }
        ]
      }
    ]
  },
  {
    standardId: 'std-is-10500-1991',
    standardNumber: 'IS 10500:1991',
    title: 'Drinking Water — Specification (First Revision)',
    division: 'Food and Agriculture Division (FAD)',
    publicationYear: 1991,
    status: 'SUPERSEDED',
    effectiveDate: '1991-03-01',
    clauses: [
      {
        clauseId: 'IS10500-1991-4.1',
        clauseNumber: '4.1',
        title: 'Essential Chemical Characteristics',
        content: 'pH value shall be between 6.5 and 8.5. Total Dissolved Solids (TDS) shall not exceed 500 mg/L (acceptable) and 2000 mg/L (max). Turbidity max 5.0 NTU.',
        requirements: [
          { parameter: 'pH', operator: 'range', threshold: [6.5, 8.5], unit: 'pH' },
          { parameter: 'TDS', operator: '<=', threshold: 500, unit: 'mg/L' },
          { parameter: 'Turbidity', operator: '<=', threshold: 5.0, unit: 'NTU' }
        ]
      },
      {
        clauseId: 'IS10500-1991-4.3',
        clauseNumber: '4.3',
        title: 'Toxic Heavy Metals',
        content: 'The concentration of toxic metals shall not exceed: Lead 0.05 mg/L, Arsenic 0.05 mg/L, Fluoride 1.5 mg/L.',
        requirements: [
          { parameter: 'Lead', operator: '<=', threshold: 0.05, unit: 'mg/L' },
          { parameter: 'Arsenic', operator: '<=', threshold: 0.05, unit: 'mg/L' },
          { parameter: 'Fluoride', operator: '<=', threshold: 1.5, unit: 'mg/L' }
        ]
      }
    ]
  },
  {
    standardId: 'std-is-4984-2016',
    standardNumber: 'IS 4984:2016',
    title: 'High Density Polyethylene (HDPE) Pipes for Water Supply — Specification',
    division: 'Civil Engineering Division (CED)',
    publicationYear: 2016,
    status: 'ACTIVE',
    effectiveDate: '2016-08-15',
    clauses: [
      {
        clauseId: 'IS4984-5.1',
        clauseNumber: '5.1',
        title: 'Raw Material Density & Melt Flow Index',
        content: 'Base density shall be 940.0 to 958.0 kg/m3 at 27 deg C. Melt flow rate (MFR 190C/5kg) shall be between 0.20 to 1.40 g/10 min.',
        requirements: [
          { parameter: 'BaseDensity', operator: 'range', threshold: [940.0, 958.0], unit: 'kg/m3' },
          { parameter: 'MFR', operator: 'range', threshold: [0.20, 1.40], unit: 'g/10 min' }
        ]
      },
      {
        clauseId: 'IS4984-7.3',
        clauseNumber: '7.3',
        title: 'Internal Hydrostatic Pressure Test',
        content: 'Pipes shall withstand 100 hours at 80 deg C with induced circumferential hoop stress of 5.4 MPa without bursting or failure.',
        requirements: [
          { parameter: 'HydrostaticHoldHours', operator: '>=', threshold: 100, unit: 'hours' },
          { parameter: 'TestTemp', operator: '>=', threshold: 80, unit: 'deg C' }
        ]
      }
    ]
  },
  {
    standardId: 'std-is-1293-2019',
    standardNumber: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets for Domestic and Similar Purposes of Rated Voltage up to 250 V',
    division: 'Electrotechnical Division (ETD)',
    publicationYear: 2019,
    status: 'ACTIVE',
    effectiveDate: '2019-11-20',
    clauses: [
      {
        clauseId: 'IS1293-10.1',
        clauseNumber: '10.1',
        title: 'Protection Against Electric Shock',
        content: 'Socket-outlets shall have safety shutters preventing entry of pins into live apertures without earthing pin engagement.',
        requirements: [
          { parameter: 'ShutterEngagementForce', operator: '>=', threshold: 15, unit: 'N' }
        ]
      },
      {
        clauseId: 'IS1293-13.2',
        clauseNumber: '13.2',
        title: 'Temperature Rise of Terminals',
        content: 'Temperature rise of terminals shall not exceed 45 K under test current of 16A for 1 hour duration continuous load.',
        requirements: [
          { parameter: 'TerminalTempRise', operator: '<=', threshold: 45, unit: 'K' },
          { parameter: 'ContinuousLoadAmps', operator: '>=', threshold: 16, unit: 'A' }
        ]
      },
      {
        clauseId: 'IS1293-24.1',
        clauseNumber: '24.1',
        title: 'Mechanical Strength and Drop Test',
        content: 'Plugs shall endure 1000 falls in tumbling barrel from 500 mm height without cracking or exposing live contacts.',
        requirements: [
          { parameter: 'TumbleFalls', operator: '>=', threshold: 1000, unit: 'drops' }
        ]
      }
    ]
  },
  {
    standardId: 'std-is-13252-2010',
    standardNumber: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment — Safety (General Requirements)',
    division: 'Electronics & IT Division (LITD)',
    publicationYear: 2010,
    status: 'ACTIVE',
    effectiveDate: '2010-06-01',
    clauses: [
      {
        clauseId: 'IS13252-2.1.1',
        clauseNumber: '2.1.1',
        title: 'Electric Strength Test (Hi-Pot)',
        content: 'Insulation barrier between primary AC mains and accessible SELV circuits must withstand 3000 V AC dielectric test for 60 seconds with leakage current below 5 mA.',
        requirements: [
          { parameter: 'DielectricVoltage', operator: '>=', threshold: 3000, unit: 'V AC' },
          { parameter: 'LeakageCurrent', operator: '<=', threshold: 5.0, unit: 'mA' }
        ]
      },
      {
        clauseId: 'IS13252-5.3',
        clauseNumber: '5.3',
        title: 'Abnormal Operating and Fault Conditions',
        content: 'Under single fault condition, maximum enclosure temperature shall not exceed 105 deg C and no fire or molten metal ejection shall occur.',
        requirements: [
          { parameter: 'MaxFaultTemp', operator: '<=', threshold: 105, unit: 'deg C' }
        ]
      }
    ]
  },
  {
    standardId: 'std-is-269-2015',
    standardNumber: 'IS 269:2015',
    title: 'Ordinary Portland Cement — Specification (Sixth Revision)',
    division: 'Civil Engineering Division (CED)',
    publicationYear: 2015,
    status: 'ACTIVE',
    effectiveDate: '2015-12-01',
    clauses: [
      {
        clauseId: 'IS269-6.1',
        clauseNumber: '6.1',
        title: 'Compressive Strength Requirements',
        content: 'Compressive strength of 53 Grade OPC shall be: 72h >= 27 MPa, 168h >= 37 MPa, 672h >= 53 MPa.',
        requirements: [
          { parameter: 'CompressiveStrength_3D', operator: '>=', threshold: 27, unit: 'MPa' },
          { parameter: 'CompressiveStrength_7D', operator: '>=', threshold: 37, unit: 'MPa' },
          { parameter: 'CompressiveStrength_28D', operator: '>=', threshold: 53, unit: 'MPa' }
        ]
      },
      {
        clauseId: 'IS269-6.2',
        clauseNumber: '6.2',
        title: 'Setting Time and Fineness',
        content: 'Initial setting time shall not be less than 30 minutes; final setting time shall not be more than 600 minutes. Specific surface fineness >= 225 m2/kg.',
        requirements: [
          { parameter: 'InitialSettingMinutes', operator: '>=', threshold: 30, unit: 'minutes' },
          { parameter: 'FinalSettingMinutes', operator: '<=', threshold: 600, unit: 'minutes' },
          { parameter: 'FinenessBlaine', operator: '>=', threshold: 225, unit: 'm2/kg' }
        ]
      }
    ]
  }
];
