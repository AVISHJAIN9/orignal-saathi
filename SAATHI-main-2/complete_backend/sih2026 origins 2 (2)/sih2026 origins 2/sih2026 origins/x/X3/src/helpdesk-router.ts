import { BISRegion, EscalationCategory, RegionalContactInfo, TicketPriority } from './escalation.types';

export const BIS_REGIONAL_OFFICES: Record<BISRegion, RegionalContactInfo> = {
  HQ_NEW_DELHI: {
    officeName: 'Bureau of Indian Standards — Headquarter',
    region: 'HQ_NEW_DELHI',
    nodalEmail: 'info@bis.gov.in',
    tollFreeNumber: '1800-11-0001',
    address: 'Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002',
  },
  NORTH_REGIONAL_OFFICE_DELHI: {
    officeName: 'BIS Northern Regional Office',
    region: 'NORTH_REGIONAL_OFFICE_DELHI',
    nodalEmail: 'nro@bis.gov.in',
    tollFreeNumber: '011-23230131',
    address: 'Plot No. 4-A, Sahibabad Industrial Area, Ghaziabad / Delhi NCR',
  },
  WEST_REGIONAL_OFFICE_MUMBAI: {
    officeName: 'BIS Western Regional Office',
    region: 'WEST_REGIONAL_OFFICE_MUMBAI',
    nodalEmail: 'wro@bis.gov.in',
    tollFreeNumber: '022-28329295',
    address: 'Manakalaya, E9 MIDC, Andheri (East), Mumbai 400093',
  },
  EAST_REGIONAL_OFFICE_KOLKATA: {
    officeName: 'BIS Eastern Regional Office',
    region: 'EAST_REGIONAL_OFFICE_KOLKATA',
    nodalEmail: 'ero@bis.gov.in',
    tollFreeNumber: '033-23554012',
    address: '1/14 C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata 700054',
  },
  SOUTH_REGIONAL_OFFICE_CHENNAI: {
    officeName: 'BIS Southern Regional Office',
    region: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
    nodalEmail: 'sro@bis.gov.in',
    tollFreeNumber: '044-22541216',
    address: 'CIT Campus, IV Cross Road, Taramani, Chennai 600113',
  },
  CENTRAL_REGIONAL_OFFICE_CHANDIGARH: {
    officeName: 'BIS Central Regional Office',
    region: 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH',
    nodalEmail: 'cro@bis.gov.in',
    tollFreeNumber: '0172-2784451',
    address: 'SCO 206-207, Sector 34-A, Chandigarh 160022',
  },
};

// Comprehensive coverage of all 28 States & 8 Union Territories in India
const STATE_TO_REGION_MAP: Record<string, BISRegion> = {
  // Northern Region
  delhi: 'NORTH_REGIONAL_OFFICE_DELHI',
  ncr: 'NORTH_REGIONAL_OFFICE_DELHI',
  haryana: 'NORTH_REGIONAL_OFFICE_DELHI',
  rajasthan: 'NORTH_REGIONAL_OFFICE_DELHI',
  uttarpradesh: 'NORTH_REGIONAL_OFFICE_DELHI',
  up: 'NORTH_REGIONAL_OFFICE_DELHI',
  uttarakhand: 'NORTH_REGIONAL_OFFICE_DELHI',
  uk: 'NORTH_REGIONAL_OFFICE_DELHI',
  jammuandkashmir: 'NORTH_REGIONAL_OFFICE_DELHI',
  jk: 'NORTH_REGIONAL_OFFICE_DELHI',
  ladakh: 'NORTH_REGIONAL_OFFICE_DELHI',

  // Central Region
  punjab: 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH',
  chandigarh: 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH',
  himachalpradesh: 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH',
  hp: 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH',

  // Western Region
  maharashtra: 'WEST_REGIONAL_OFFICE_MUMBAI',
  mh: 'WEST_REGIONAL_OFFICE_MUMBAI',
  gujarat: 'WEST_REGIONAL_OFFICE_MUMBAI',
  gj: 'WEST_REGIONAL_OFFICE_MUMBAI',
  goa: 'WEST_REGIONAL_OFFICE_MUMBAI',
  madhyapradesh: 'WEST_REGIONAL_OFFICE_MUMBAI',
  mp: 'WEST_REGIONAL_OFFICE_MUMBAI',
  chhattisgarh: 'WEST_REGIONAL_OFFICE_MUMBAI',
  cg: 'WEST_REGIONAL_OFFICE_MUMBAI',
  dadraandnagarhavelianddamananddiu: 'WEST_REGIONAL_OFFICE_MUMBAI',
  daman: 'WEST_REGIONAL_OFFICE_MUMBAI',

  // Eastern & North-Eastern Region
  westbengal: 'EAST_REGIONAL_OFFICE_KOLKATA',
  wb: 'EAST_REGIONAL_OFFICE_KOLKATA',
  bihar: 'EAST_REGIONAL_OFFICE_KOLKATA',
  jharkhand: 'EAST_REGIONAL_OFFICE_KOLKATA',
  odisha: 'EAST_REGIONAL_OFFICE_KOLKATA',
  orissa: 'EAST_REGIONAL_OFFICE_KOLKATA',
  assam: 'EAST_REGIONAL_OFFICE_KOLKATA',
  sikkim: 'EAST_REGIONAL_OFFICE_KOLKATA',
  meghalaya: 'EAST_REGIONAL_OFFICE_KOLKATA',
  manipur: 'EAST_REGIONAL_OFFICE_KOLKATA',
  mizoram: 'EAST_REGIONAL_OFFICE_KOLKATA',
  nagaland: 'EAST_REGIONAL_OFFICE_KOLKATA',
  tripura: 'EAST_REGIONAL_OFFICE_KOLKATA',
  arunachalpradesh: 'EAST_REGIONAL_OFFICE_KOLKATA',
  andamanandnicobarislands: 'EAST_REGIONAL_OFFICE_KOLKATA',

  // Southern Region
  tamilnadu: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  tn: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  karnataka: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  kerala: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  telangana: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  ts: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  andhrapradesh: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  ap: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  puducherry: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  pondicherry: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
  lakshadweep: 'SOUTH_REGIONAL_OFFICE_CHENNAI',
};

export class HelpdeskRouter {
  public classifyCategory(query: string): EscalationCategory {
    const q = query.toLowerCase();

    if (q.includes('test') || q.includes('lab') || q.includes('sample') || q.includes('lims')) {
      return 'LABORATORY_TESTING';
    }
    if (q.includes('fee') || q.includes('payment') || q.includes('concession') || q.includes('cost')) {
      return 'FEE_AND_PAYMENT_DISPUTE';
    }
    if (q.includes('qco') || q.includes('mandatory') || q.includes('penalty') || q.includes('violation')) {
      return 'QUALITY_CONTROL_ORDER_COMPLIANCE';
    }
    if (q.includes('scheme') || q.includes('license') || q.includes('crs') || q.includes('isi mark') || q.includes('audit')) {
      return 'PRODUCT_CERTIFICATION_SCHEME';
    }
    if (q.includes('clause') || q.includes('standard') || q.includes('interpretation') || q.includes('is ')) {
      return 'TECHNICAL_INTERPRETATION';
    }

    return 'GENERAL_ENQUIRY';
  }

  public resolveDepartment(category: EscalationCategory): string {
    switch (category) {
      case 'TECHNICAL_INTERPRETATION':
        return 'Standardization Division (Technical Committee Desk)';
      case 'PRODUCT_CERTIFICATION_SCHEME':
        return 'Conformity Assessment Department (CAD)';
      case 'LABORATORY_TESTING':
        return 'Central Laboratory & LIMS Department';
      case 'QUALITY_CONTROL_ORDER_COMPLIANCE':
        return 'Enforcement & Legal Compliance Cell';
      case 'FEE_AND_PAYMENT_DISPUTE':
        return 'Accounts & Licencing Revenue Division';
      default:
        return 'Central Public Information & Helpdesk Desk';
    }
  }

  public resolveRegion(userState?: string): BISRegion {
    if (!userState) {
      return 'HQ_NEW_DELHI';
    }
    const cleanState = userState.toLowerCase().replace(/[\s\-_&]/g, '');
    return STATE_TO_REGION_MAP[cleanState] || 'HQ_NEW_DELHI';
  }

  public calculatePriorityAndSLA(
    confidenceScore: number,
    category: EscalationCategory
  ): { priority: TicketPriority; slaTargetHours: number } {
    if (category === 'QUALITY_CONTROL_ORDER_COMPLIANCE' || confidenceScore < 0.20) {
      return { priority: 'HIGH', slaTargetHours: 24 };
    }
    if (category === 'PRODUCT_CERTIFICATION_SCHEME' || category === 'TECHNICAL_INTERPRETATION') {
      return { priority: 'MEDIUM', slaTargetHours: 48 };
    }
    return { priority: 'LOW', slaTargetHours: 72 };
  }
}
