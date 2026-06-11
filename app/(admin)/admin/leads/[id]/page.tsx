import { LeadDetail } from '@/components/admin/lead-detail';

export default function AdminLeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Lead {params.id}</h1>
      <LeadDetail />
    </div>
  );
}
