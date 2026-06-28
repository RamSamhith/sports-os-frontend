export type LeadSource =
  | 'academy_detail'
  | 'coach_detail'
  | 'compare'
  | 'shortlist'
  | 'search';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'trial_scheduled'
  | 'converted'
  | 'lost';

export type LeadOwnerType = 'academy' | 'coach';

export type LeadActorType = 'system' | 'admin';

export type LeadActivityType =
  | 'note'
  | 'status_change'
  | 'contact_attempt'
  | 'whatsapp_sent'
  | 'callback_logged';

export interface Lead {
  id: string;
  enquiryId: string;
  source: LeadSource;
  ownerType: LeadOwnerType;
  ownerId: string;
  userId?: string;
  childId?: string;
  status: LeadStatus;
  assignedTo?: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  actorType: LeadActorType;
  actorId?: string;
  type: LeadActivityType;
  payload: Record<string, unknown>;
  createdAt: string;
}
