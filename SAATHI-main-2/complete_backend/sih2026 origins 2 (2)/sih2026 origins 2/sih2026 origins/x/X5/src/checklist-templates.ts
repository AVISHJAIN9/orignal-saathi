import { ChecklistTemplate } from './checklist.types';

export const CHECKLIST_TEMPLATES: Record<string, ChecklistTemplate> = {
  'IS 10500': {
    standardNumber: 'IS 10500:2012',
    productName: 'Drinking Water',
    schemeType: 'Scheme-I (Product Certification)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 84000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Factory Layout & Water Source Proof', description: 'Borewell/Municipal NOC & premises ownership', isMandatory: true },
      { id: 'DOC-02', title: 'Manufacturing Process Flowchart', description: 'Filtration, RO, UV, ozonation diagram', isMandatory: true },
      { id: 'DOC-03', title: 'In-House Laboratory Setup', description: 'Testing apparatus for bacteriological & physical parameters', isMandatory: true },
      { id: 'DOC-04', title: 'Quality Control Personnel Credentials', description: 'Degree in Chemistry / Microbiology with experience', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: 'Total Dissolved Solids (TDS)', clauseReference: 'Table 1', acceptableLimit: '500 mg/l (Max 2000 mg/l)', testFrequency: 'Daily per batch', testMethodStandard: 'IS 3025 (Part 16)' },
      { id: 'TST-02', parameterName: 'pH Value', clauseReference: 'Table 1', acceptableLimit: '6.5 to 8.5', testFrequency: 'Daily per batch', testMethodStandard: 'IS 3025 (Part 11)' },
      { id: 'TST-03', parameterName: 'E. Coli / Coliform Bacteria', clauseReference: 'Clause 4.1 Table 2', acceptableLimit: 'Shall not be detectable in 100 ml', testFrequency: 'Every batch', testMethodStandard: 'IS 15185' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'MACHINERY', requirement: 'Reverse Osmosis plant with online TDS meter and UV disinfection system', clauseReference: 'Section 4' },
      { id: 'FAC-02', category: 'CALIBRATION', requirement: 'Calibration of digital pH meter and spectrophotometer every 6 months', clauseReference: 'Section 5' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Portal Registration on Manakonline', estimatedDays: 1 },
      { stepNumber: 2, title: 'Factory Audit & Sample Collection by BIS Officer', estimatedDays: 14 },
      { stepNumber: 3, title: 'Independent BIS Lab Testing', estimatedDays: 21 },
      { stepNumber: 4, title: 'Grant of ISI License', estimatedDays: 7 },
    ],
  },
  'IS 456': {
    standardNumber: 'IS 456:2000',
    productName: 'Plain and Reinforced Concrete',
    schemeType: 'Scheme-I (Code of Practice Certification)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 120000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Concrete Mix Design Report', description: 'Mix calculations for M20, M25, M30 grades', isMandatory: true },
      { id: 'DOC-02', title: 'Batching Plant Calibration Certificate', description: 'NABL certificate for aggregate weigh-batchers', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: '28-Day Compressive Strength (M20)', clauseReference: 'Table 2', acceptableLimit: 'Min 20 N/mm2', testFrequency: 'Per 50m3 batch', testMethodStandard: 'IS 516' },
      { id: 'TST-02', parameterName: 'Workability (Slump Test)', clauseReference: 'Clause 7.1', acceptableLimit: '50 - 100 mm', testFrequency: 'Every transit mixer load', testMethodStandard: 'IS 1199' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'MACHINERY', requirement: 'Computerized automated concrete batching plant with moisture sensors', clauseReference: 'Clause 10.2' },
      { id: 'FAC-02', category: 'LAB_EQUIPMENT', requirement: 'Compression Testing Machine (CTM) 2000 kN calibrated yearly', clauseReference: 'Clause 15' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Submission of Mix Designs & Plant Layout', estimatedDays: 2 },
      { stepNumber: 2, title: 'BIS Plant Inspection & Cube Casting', estimatedDays: 7 },
      { stepNumber: 3, title: '28-Day Strength Verification in BIS Lab', estimatedDays: 30 },
      { stepNumber: 4, title: 'Certification Grant', estimatedDays: 7 },
    ],
  },
  'IS 1293': {
    standardNumber: 'IS 1293:2019',
    productName: 'Plugs and Socket-Outlets (Up to 250V / 16A)',
    schemeType: 'Scheme-I (Product Certification)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 96000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Product Dimension Drawings & Pin Spacing', description: 'Detailed CAD drawings matching gauge dimensions', isMandatory: true },
      { id: 'DOC-02', title: 'Raw Material Test Certificates', description: 'Brass pin composition and flame-retardant polycarbonate test reports', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: 'Insulation Resistance & Electric Strength', clauseReference: 'Clause 17', acceptableLimit: 'Min 5 Mega-ohm at 500V DC; 2000V AC dielectric withstand', testFrequency: '100% routine testing', testMethodStandard: 'IS 1293 Clause 17' },
      { id: 'TST-02', parameterName: 'Glow Wire Test (Fire Hazard)', clauseReference: 'Clause 28.1.1', acceptableLimit: 'No flame at 850°C glow wire contact', testFrequency: 'Type test quarterly', testMethodStandard: 'IS/IEC 60695-2-11' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'MACHINERY', requirement: 'High Voltage Breakdown Tester and Insulation Resistance Tester', clauseReference: 'Annex B' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Application & Gauge Verification Submission', estimatedDays: 3 },
      { stepNumber: 2, title: 'Factory Audit & Sample Drawing', estimatedDays: 14 },
      { stepNumber: 3, title: 'Full Type Testing at Central BIS Laboratory', estimatedDays: 28 },
      { stepNumber: 4, title: 'License Issuance', estimatedDays: 7 },
    ],
  },
  'IS 9873': {
    standardNumber: 'IS 9873 (Part 1):2019',
    productName: 'Safety of Toys (Mechanical & Physical Properties)',
    schemeType: 'Scheme-I (Product Certification under Toys QCO 2020)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 46000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Toy Age-Grading & Design Description', description: 'Specification of age category (<36 months or older) and intended use', isMandatory: true },
      { id: 'DOC-02', title: 'BOM & Material Non-Toxicity Declarations', description: 'Lead, phthalates, and heavy metals compliance declaration', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: 'Small Parts Cylinder Test (Choking Hazard)', clauseReference: 'Clause 5.2', acceptableLimit: 'No parts fit entirely inside cylinder for toys intended for children under 3 years', testFrequency: 'Every production batch', testMethodStandard: 'IS 9873 (Part 1)' },
      { id: 'TST-02', parameterName: 'Drop Test & Impact Resistance', clauseReference: 'Clause 5.24', acceptableLimit: 'No sharp edges or hazardous points produced after 5 drops from 850 mm', testFrequency: 'Weekly sample', testMethodStandard: 'IS 9873 (Part 1)' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'TEST_EQUIPMENT', requirement: 'Small Parts Cylinder, Sharp Edge Tester, Sharp Point Tester, and Torque Gauge', clauseReference: 'Clause 5' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Online Application on Manakonline for Toys', estimatedDays: 2 },
      { stepNumber: 2, title: 'Factory Inspection & Safety Audit', estimatedDays: 10 },
      { stepNumber: 3, title: 'Laboratory Safety Verification Testing', estimatedDays: 20 },
      { stepNumber: 4, title: 'Grant of ISI License with Toy Scheme Marking', estimatedDays: 5 },
    ],
  },
  'IS 15844': {
    standardNumber: 'IS 15844:2010',
    productName: 'Sports Footwear & Leather Shoes',
    schemeType: 'Scheme-I (Footwear QCO)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 65000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Upper and Sole Material Specifications', description: 'Raw material chemical analysis reports', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: 'Upper-to-Sole Adhesion Strength', clauseReference: 'Clause 5.3', acceptableLimit: 'Min 3.0 N/mm', testFrequency: 'Batch test', testMethodStandard: 'IS 15844' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'TEST_EQUIPMENT', requirement: 'Tensile and Peel Strength Testing Machine', clauseReference: 'Annex C' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Portal Application Submission', estimatedDays: 2 },
      { stepNumber: 2, title: 'Factory Inspection', estimatedDays: 14 },
      { stepNumber: 3, title: 'Laboratory Testing', estimatedDays: 21 },
      { stepNumber: 4, title: 'License Grant', estimatedDays: 5 },
    ],
  },
  'IS 16102': {
    standardNumber: 'IS 16102 (Part 1):2012',
    productName: 'Self-Ballasted LED Lamps for General Lighting Services',
    schemeType: 'Scheme-II (Compulsory Registration Scheme - CRS)',
    isMandatoryQCO: true,
    baseApplicationFeeInr: 1000,
    baseAnnualLicenseFeeInr: 1000,
    baseMinimumMarkingFeeInr: 52000,
    documentationRequirements: [
      { id: 'DOC-01', title: 'Critical Component List (CCL)', description: 'LED chip, driver IC, capacitor, and diffuser specifications', isMandatory: true },
    ],
    testingParameters: [
      { id: 'TST-01', parameterName: 'Input Power & Luminous Efficacy', clauseReference: 'Clause 8', acceptableLimit: 'Efficacy not less than 80 lm/W', testFrequency: 'Routine test', testMethodStandard: 'IS 16102' },
    ],
    factoryRequirements: [
      { id: 'FAC-01', category: 'MACHINERY', requirement: 'Integrating Sphere with Spectroradiometer and Digital Power Analyzer', clauseReference: 'Clause 6' },
    ],
    licensingSteps: [
      { stepNumber: 1, title: 'Sample Submission to BIS Recognized Lab', estimatedDays: 15 },
      { stepNumber: 2, title: 'CRS Portal Online Registration Application', estimatedDays: 5 },
      { stepNumber: 3, title: 'Grant of CRS Registration Number', estimatedDays: 7 },
    ],
  },
};
