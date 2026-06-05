import { LeadBoard } from '@/components/admin/lead-board';

export default function AdminLeadsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
      <LeadBoard />
    </div>
  );
}
