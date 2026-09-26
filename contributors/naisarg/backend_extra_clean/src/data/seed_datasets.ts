export const SEED_LICENSES = [
  {
    licenseId: 'CM/L-7200192984',
    holder: 'UltraBuild Cements Ltd',
    standardId: 'std-is-269-2015',
    standardNumber: 'IS 269:2015',
    productName: 'Ordinary Portland Cement 53 Grade',
    status: 'ACTIVE',
    issueDate: '2023-11-15',
    expiryDate: '2026-11-14',
    factoryAddress: 'Plot 44, MIDC Industrial Area, Nagpur, Maharashtra'
  },
  {
    licenseId: 'CM/L-8392019283',
    holder: 'Apex Polymers India Pvt Ltd',
    standardId: 'std-is-4984-2016',
    standardNumber: 'IS 4984:2016',
    productName: 'High Density Polyethylene Pipes PE-100',
    status: 'ACTIVE',
    issueDate: '2023-10-05',
    expiryDate: '2026-10-04',
    factoryAddress: 'GIDC Sanand Phase II, Ahmedabad, Gujarat'
  },
  {
    licenseId: 'CM/L-9102938475',
    holder: 'Zenith Electronics LLP',
    standardId: 'std-is-13252-2010',
    standardNumber: 'IS 13252 (Part 1):2010',
    productName: 'Switching Mode Power Adapter 65W',
    status: 'ACTIVE',
    issueDate: '2024-04-10',
    expiryDate: '2027-04-09',
    factoryAddress: 'Sector 63, Noida, Uttar Pradesh'
  },
  {
    licenseId: 'CM/L-5491029384',
    holder: 'SafeGrip Switchgear Corp',
    standardId: 'std-is-1293-2019',
    standardNumber: 'IS 1293:2019',
    productName: '3-Pin Shuttered Socket 16A',
    status: 'EXPIRED',
    issueDate: '2021-08-01',
    expiryDate: '2024-07-31',
    factoryAddress: 'Peenya Industrial Area, Bengaluru, Karnataka'
  }
];

export const SEED_CERTIFICATION_PATHS = [
  {
    id: 'path-01',
    productCategory: 'Electrical',
    pathType: 'Domestic Manufacturing (ISI Scheme-I)',
    avgCostINR: 85000,
    avgDays: 45,
    applicableCategories: ['Electrical', 'Appliances', 'Cables'],
    requiresFactoryAudit: true,
    requiresLabTest: true
  },
  {
    id: 'path-02',
    productCategory: 'Electrical',
    pathType: 'Self-Declaration (CRS Scheme-II)',
    avgCostINR: 42000,
    avgDays: 20,
    applicableCategories: ['Electrical', 'IT Equipment', 'Electronics'],
    requiresFactoryAudit: false,
    requiresLabTest: true
  },
  {
    id: 'path-03',
    productCategory: 'Electronics',
    pathType: 'Compulsory Registration (CRS)',
    avgCostINR: 55000,
    avgDays: 25,
    applicableCategories: ['Electronics', 'Power Supplies', 'Mobiles'],
    requiresFactoryAudit: false,
    requiresLabTest: true
  },
  {
    id: 'path-04',
    productCategory: 'Construction Materials',
    pathType: 'Domestic Standard ISI Scheme-I',
    avgCostINR: 120000,
    avgDays: 60,
    applicableCategories: ['Construction Materials', 'Cement', 'Steel'],
    requiresFactoryAudit: true,
    requiresLabTest: true
  },
  {
    id: 'path-05',
    productCategory: 'Construction Materials',
    pathType: 'Foreign Manufacturers Scheme (FMCS Scheme-IV)',
    avgCostINR: 350000,
    avgDays: 120,
    applicableCategories: ['Construction Materials', 'Steel', 'Automotive'],
    requiresFactoryAudit: true,
    requiresLabTest: true
  }
];

export const SEED_LABS = [
  {
    labId: 'LAB-DEL-01',
    labName: 'National Test House (Northern Region)',
    bisRecognitionNumber: 'BIS-REC-DEL-001',
    nablAccreditationNumber: 'TC-5432',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    supportedStandards: ['IS 10500:2012', 'IS 269:2015', 'IS 4984:2016'],
    turnaroundDays: 7,
    currentBacklog: 14,
    avgProcessingHours: 18
  },
  {
    labId: 'LAB-MUM-02',
    labName: 'Central Institute of Plastics Engineering & Tech (CIPET)',
    bisRecognitionNumber: 'BIS-REC-MUM-018',
    nablAccreditationNumber: 'TC-6721',
    city: 'Mumbai',
    state: 'Maharashtra',
    supportedStandards: ['IS 4984:2016', 'IS 1293:2019'],
    turnaroundDays: 5,
    currentBacklog: 8,
    avgProcessingHours: 12
  },
  {
    labId: 'LAB-BLR-03',
    labName: 'Central Power Research Institute (CPRI)',
    bisRecognitionNumber: 'BIS-REC-BLR-004',
    nablAccreditationNumber: 'TC-1102',
    city: 'Bengaluru',
    state: 'Karnataka',
    supportedStandards: ['IS 1293:2019', 'IS 13252 (Part 1):2010'],
    turnaroundDays: 6,
    currentBacklog: 19,
    avgProcessingHours: 15
  },
  {
    labId: 'LAB-CHN-04',
    labName: 'Electronics Test and Development Centre (ETDC)',
    bisRecognitionNumber: 'BIS-REC-CHN-007',
    nablAccreditationNumber: 'TC-3389',
    city: 'Chennai',
    state: 'Tamil Nadu',
    supportedStandards: ['IS 13252 (Part 1):2010'],
    turnaroundDays: 4,
    currentBacklog: 6,
    avgProcessingHours: 10
  }
];

export const SEED_SUPERSESSIONS = [
  {
    id: 'sup-1',
    standardId: 'std-is-10500-2012',
    standardNumber: 'IS 10500:2012',
    supersedes: 'IS 10500:1991',
    supersededBy: null,
    effectiveDate: '2012-05-01'
  },
  {
    id: 'sup-2',
    standardId: 'std-is-10500-1991',
    standardNumber: 'IS 10500:1991',
    supersedes: 'IS 10500:1983',
    supersededBy: 'IS 10500:2012',
    effectiveDate: '1991-03-01'
  },
  {
    id: 'sup-3',
    standardId: 'std-is-1293-2019',
    standardNumber: 'IS 1293:2019',
    supersedes: 'IS 1293:2005',
    supersededBy: null,
    effectiveDate: '2019-11-20'
  },
  {
    id: 'sup-4',
    standardId: 'std-is-269-2015',
    standardNumber: 'IS 269:2015',
    supersedes: 'IS 269:1989',
    supersededBy: null,
    effectiveDate: '2015-12-01'
  }
];

export const SEED_STATE_REGULATIONS = [
  {
    id: 'sr-01',
    state: 'Maharashtra',
    standardId: 'std-is-4984-2016',
    standardNumber: 'IS 4984:2016',
    additionalRequirement: 'MJP (Maharashtra Jeevan Pradhikaran) third-party inspection mandatory prior to municipal drinking water pipeline dispatch.',
    effectiveDate: '2021-04-01'
  },
  {
    id: 'sr-02',
    state: 'Gujarat',
    standardId: 'std-is-269-2015',
    standardNumber: 'IS 269:2015',
    additionalRequirement: 'GWSSB requires chloride penetration test report for RCC marine and coastal zone constructions within 20km of coastline.',
    effectiveDate: '2020-09-15'
  },
  {
    id: 'sr-03',
    state: 'Delhi',
    standardId: 'std-is-10500-2012',
    standardNumber: 'IS 10500:2012',
    additionalRequirement: 'Delhi Jal Board mandated continuous inline turbidity and residual chlorine logging with automated cloud alert telemetry.',
    effectiveDate: '2022-01-10'
  }
];

export const SEED_CROSS_MINISTRY_MAPPINGS = [
  {
    id: 'cm-01',
    standardId: 'std-is-10500-2012',
    standardNumber: 'IS 10500:2012',
    otherMinistry: 'Ministry of Health and Family Welfare (FSSAI)',
    otherRegulationRef: 'FSS (Food Products Standards and Food Additives) Regulations 2011, Clause 2.10.8',
    conflictType: 'Dual Licensing / Overlapping Permissible Limits',
    notes: 'FSSAI limits on packaging migration substances overlap with BIS IS 10500 / IS 14543 certification requirements.'
  },
  {
    id: 'cm-02',
    standardId: 'std-is-1293-2019',
    standardNumber: 'IS 1293:2019',
    otherMinistry: 'Ministry of Power (Bureau of Energy Efficiency - BEE)',
    otherRegulationRef: 'BEE Star Labeling Notification for Domestic Electrical Appliances 2020',
    conflictType: 'Standby Power & Thermal Loss Limits',
    notes: 'BEE standby power measurement overlaps with BIS temperature rise test duty cycles.'
  },
  {
    id: 'cm-03',
    standardId: 'std-is-13252-2010',
    standardNumber: 'IS 13252 (Part 1):2010',
    otherMinistry: 'Ministry of Electronics and Information Technology (MeitY)',
    otherRegulationRef: 'Electronics and Information Technology Goods (CRO) Order 2021',
    conflictType: 'Exemption Threshold Discrepancy',
    notes: 'MeitY exemption rules for R&D import batches differ from BIS port clearance customs guidelines.'
  }
];

export const SEED_COMPLAINTS = [
  {
    id: 'comp-01',
    standardNumber: 'IS 1293:2019',
    category: 'Electrical Plugs & Sockets',
    date: '2026-08-14',
    severity: 'HIGH',
    summary: 'Socket terminal melted during 16A continuous geyser operation; shutter jammed open.'
  },
  {
    id: 'comp-02',
    standardNumber: 'IS 1293:2019',
    category: 'Electrical Plugs & Sockets',
    date: '2026-07-22',
    severity: 'MEDIUM',
    summary: 'Pins loose fit in 6A socket causing intermittent sparking.'
  },
  {
    id: 'comp-03',
    standardNumber: 'IS 10500:2012',
    category: 'Drinking Water',
    date: '2026-08-30',
    severity: 'CRITICAL',
    summary: 'Bacteriological contamination found in packaged drinking water batch batch-DW402.'
  },
  {
    id: 'comp-04',
    standardNumber: 'IS 4984:2016',
    category: 'HDPE Pipes',
    date: '2026-06-11',
    severity: 'HIGH',
    summary: 'Pipes burst under 4 bar operating pressure well below declared 10 bar rating.'
  },
  {
    id: 'comp-05',
    standardNumber: 'IS 269:2015',
    category: 'Cement',
    date: '2026-05-18',
    severity: 'LOW',
    summary: 'Bag weight variation of 3.2% beyond legal metrology tolerance.'
  }
];

export const SEED_COUNTERFEIT_REPORTS = [
  {
    id: 'cf-01',
    lat: 28.6448,
    lng: 77.2167,
    city: 'Delhi',
    state: 'Delhi',
    productCategory: 'Electrical',
    standardNumber: 'IS 1293:2019',
    seizureDate: '2026-07-15',
    quantitySeized: 4500
  },
  {
    id: 'cf-02',
    lat: 19.0760,
    lng: 72.8777,
    city: 'Mumbai',
    state: 'Maharashtra',
    productCategory: 'Cement',
    standardNumber: 'IS 269:2015',
    seizureDate: '2026-06-20',
    quantitySeized: 12000
  },
  {
    id: 'cf-03',
    lat: 23.0225,
    lng: 72.5714,
    city: 'Ahmedabad',
    state: 'Gujarat',
    productCategory: 'Pipes',
    standardNumber: 'IS 4984:2016',
    seizureDate: '2026-08-02',
    quantitySeized: 2800
  },
  {
    id: 'cf-04',
    lat: 12.9716,
    lng: 77.5946,
    city: 'Bengaluru',
    state: 'Karnataka',
    productCategory: 'Electronics',
    standardNumber: 'IS 13252 (Part 1):2010',
    seizureDate: '2026-05-10',
    quantitySeized: 6200
  }
];

export const SEED_AUDIT_CHECKLIST_ITEMS = [
  {
    id: 'audit-item-01',
    productId: 'PROD-PLUG-16A',
    category: 'Electrical',
    title: 'Raw Material Virgin Plastic Certificate',
    description: 'Verify polycarbonate / urea formaldehyde flammability rating (UL94 V-0 or equivalent).',
    isMandatory: true,
    completed: false
  },
  {
    id: 'audit-item-02',
    productId: 'PROD-PLUG-16A',
    category: 'Electrical',
    title: 'Calibration Record of High Voltage Dielectric Tester',
    description: 'NABL accredited calibration certificate valid within the last 12 months.',
    isMandatory: true,
    completed: true
  },
  {
    id: 'audit-item-03',
    productId: 'PROD-PLUG-16A',
    category: 'Electrical',
    title: 'Quality Control Manual and Test Personnel Records',
    description: 'Designated certified testing engineer appointed and STI (Scheme of Testing & Inspection) log maintained.',
    isMandatory: true,
    completed: false
  }
];

export const SEED_COMPONENT_HIERARCHIES = [
  {
    productId: 'PROD-KETTLE-01',
    productName: 'Electric Cordless Kettle 1500W',
    components: [
      {
        componentId: 'COMP-PLUG-01',
        componentName: 'Moulded 3-Pin Power Plug',
        componentStandardNumber: 'IS 1293:2019',
        isCertified: true,
        licenseId: 'CM/L-8392019283'
      },
      {
        componentId: 'COMP-CORD-02',
        componentName: 'Flexible Power Cord 3x0.75mm2',
        componentStandardNumber: 'IS 694:2010',
        isCertified: true,
        licenseId: 'CM/L-7200192984'
      },
      {
        componentId: 'COMP-ELEMENT-03',
        componentName: 'Immersion Heating Element',
        componentStandardNumber: 'IS 368:2014',
        isCertified: false,
        licenseId: null
      }
    ]
  }
];
