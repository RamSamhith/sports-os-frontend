import { EmptyState } from '@/components/feedback/empty-state';
import { MessageCircle } from 'lucide-react';

export default function EnquiriesPage() {
  return (
    <EmptyState
      icon={<MessageCircle className="h-5 w-5" />}
      title="No enquiries yet"
      description="When you contact an academy or coach, your enquiries will appear here."
    />
  );
}
