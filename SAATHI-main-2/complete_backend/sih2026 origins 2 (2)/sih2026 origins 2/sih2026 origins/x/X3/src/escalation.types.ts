export type TicketStatus = 'OPEN' | 'IN_REVIEW' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserRole = 'CITIZEN' | 'MSME_USER' | 'BIS_OFFICER' | 'ADMIN';

export type EscalationCategory =
  | 'TECHNICAL_INTERPRETATION'
  | 'PRODUCT_CERTIFICATION_SCHEME'
  | 'LABORATORY_TESTING'
  | 'FEE_AND_PAYMENT_DISPUTE'
  | 'QUALITY_CONTROL_ORDER_COMPLIANCE'
  | 'GENERAL_ENQUIRY';

export type BISRegion =
  | 'NORTH_REGIONAL_OFFICE_DELHI'
  | 'WEST_REGIONAL_OFFICE_MUMBAI'
  | 'EAST_REGIONAL_OFFICE_KOLKATA'
  | 'SOUTH_REGIONAL_OFFICE_CHENNAI'
  | 'CENTRAL_REGIONAL_OFFICE_CHANDIGARH'
  | 'HQ_NEW_DELHI';

export interface RegionalContactInfo {
  officeName: string;
  region: BISRegion;
  nodalEmail: string;
  tollFreeNumber: string;
  address: string;
}

export interface TicketTimelineEvent {
  eventId: string;
  eventType: 'TICKET_CREATED' | 'ROUTED_TO_OFFICE' | 'ASSIGNED_OFFICER' | 'VIEWED' | 'NOTIFICATION_SENT' | 'RESOLUTION_ADDED' | 'STATUS_CHANGED' | 'SLA_BREACH_ALERT';
  description: string;
  actor: string;
  timestamp: string;
}

export interface EscalationTicket {
  ticketId: string;
  messageId?: string;
  conversationId?: string;
  userQuery: string;
  userEmail?: string;
  userPhone?: string;
  userState?: string;
  reason: string;
  confidenceScore: number;
  priority: TicketPriority;
  category: EscalationCategory;
  assignedRegion: BISRegion;
  assignedDepartment: string;
  nodalContact: RegionalContactInfo;
  status: TicketStatus;
  slaTargetHours: number;
  slaBreachWarning: boolean;
  isBreached: boolean;
  hoursRemainingBeforeBreach: number;
  acknowledgementNotice: {
    english: string;
    hindi: string;
  };
  timelineEvents: TicketTimelineEvent[];
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  userQuery: string;
  messageId?: string;
  conversationId?: string;
  userEmail?: string;
  userPhone?: string;
  userState?: string;
  reason?: string;
  confidenceScore?: number;
  category?: EscalationCategory;
  priority?: TicketPriority;
}

export interface ResolveTicketDto {
  ticketId: string;
  resolutionNotes: string;
  resolvedBy: string;
  callerRole?: UserRole;
}
