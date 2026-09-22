export interface OfflineChunkMock {
  id: string;
  documentId: string;
  standardNumber: string;
  docType: string;
  category: string;
  sectionTitle: string;
  sectionNumber: string;
  content: string;
  sourceUrl: string;
  publicationDate: string;
  metadata: Record<string, any>;
}

export const OFFLINE_CITATION_FIXTURES: Record<string, OfflineChunkMock> = {
  'chunk-10500-table1': {
    id: 'chunk-10500-table1',
    documentId: 'IS 10500:2012',
    standardNumber: 'IS 10500:2012',
    docType: 'standard',
    category: 'Water Quality',
    sectionTitle: 'Table 1 Organoleptic and Physical Parameters',
    sectionNumber: 'Clause 4.1',
    content:
      'According to IS 10500:2012 Table 1: Total Dissolved Solids (TDS) acceptable limit is 500 mg/l, permissible up to 2000 mg/l in the absence of an alternate source. pH value must be 6.5 to 8.5 without relaxation. Turbidity acceptable limit is 1 NTU, permissible up to 5 NTU.',
    sourceUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS10500.pdf',
    publicationDate: '2012-05-15',
    metadata: { isLicensed: true, clauseAnchor: 'clause-4-1', tableNumber: 'Table 1' },
  },
  'chunk-10500-table2': {
    id: 'chunk-10500-table2',
    documentId: 'IS 10500:2012',
    standardNumber: 'IS 10500:2012',
    docType: 'standard',
    category: 'Water Quality',
    sectionTitle: 'Table 2 General Parameters Concerning Substances Undesirable in Excessive Amounts',
    sectionNumber: 'Clause 4.2',
    content:
      'Total Hardness (as CaCO3) acceptable limit is 200 mg/l, permissible up to 600 mg/l. Iron (as Fe) acceptable limit is 1.0 mg/l without relaxation. Chloride (as Cl) acceptable limit is 250 mg/l, permissible up to 1000 mg/l. Fluoride (as F) acceptable limit is 1.0 mg/l, permissible up to 1.5 mg/l.',
    sourceUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS10500.pdf',
    publicationDate: '2012-05-15',
    metadata: { isLicensed: true, clauseAnchor: 'clause-4-2', tableNumber: 'Table 2' },
  },
  'chunk-4984-clause8': {
    id: 'chunk-4984-clause8',
    documentId: 'IS 4984:2016',
    standardNumber: 'IS 4984:2016',
    docType: 'standard',
    category: 'Civil Engineering',
    sectionTitle: 'Mechanical and Hydrostatic Requirements',
    sectionNumber: 'Clause 8.1',
    content:
      'HDPE pipes for water supply shall withstand hydrostatic test pressure for 100 hours at 20°C and 165 hours at 80°C with no failure, ductile burst, or wall rupture.',
    sourceUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS4984.pdf',
    publicationDate: '2016-09-01',
    metadata: { isLicensed: true, clauseAnchor: 'clause-8-1' },
  },
  'chunk-2062-clause6': {
    id: 'chunk-2062-clause6',
    documentId: 'IS 2062:2011',
    standardNumber: 'IS 2062:2011',
    docType: 'standard',
    category: 'Metallurgical Engineering',
    sectionTitle: 'Chemical Composition and Tensile Grade E250',
    sectionNumber: 'Clause 6.1',
    content:
      'Grade E250 structural steel: Maximum Carbon 0.20%, Manganese 1.50%, Sulphur 0.045%, Phosphorus 0.045%. Minimum Yield Strength 250 MPa, Tensile Strength 410 MPa with elongation 23%.',
    sourceUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS2062.pdf',
    publicationDate: '2011-11-20',
    metadata: { isLicensed: true, clauseAnchor: 'clause-6-1' },
  },
};
