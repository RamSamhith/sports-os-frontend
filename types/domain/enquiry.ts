export type EnquiryTargetType = 'academy' | 'coach';

export type EnquiryIntent =
  | 'contact'
  | 'callback'
  | 'trial'
  | 'enrollment_interest'
  | 'whatsapp';

export type EnquiryStatus = 'submitted' | 'delivered' | 'failed' | 'bounced';

export interface Enquiry {
  id: string;
  userId?: string;
  childId?: string;
  targetType: EnquiryTargetType;
  targetId: string;
  targetName?: string;
  intent: EnquiryIntent;
  parentInfo: {
    name: string;
    email: string;
    phone: string;
  };
  childInfo?: {
    name: string;
    age?: number;
  };
  sportInterest: string;
  message?: string;
  status: EnquiryStatus;
  deliveryAttempts: number;
  lastDeliveryAt?: string;
  failureReason?: string;
  whatsappConfirmationSent: boolean;
  whatsappMessageId?: string;
  leadId?: string;
  ipHash?: string;
  userAgentHash?: string;
  createdAt: string;
}
