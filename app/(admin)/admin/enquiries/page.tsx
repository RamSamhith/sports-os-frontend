import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';

interface Row { id: string; parent: string; target: string; status: 'new' | 'contacted' | 'qualified' | 'trial_scheduled' | 'converted' | 'lost' }
const rows: Row[] = [
  { id: '1', parent: 'Priya Sharma', target: 'Stadium Cricket Academy', status: 'new' },
  { id: '2', parent: 'Arjun Verma', target: 'Coach Asha', status: 'contacted' },
];
const columns: Column<Row>[] = [
  { key: 'parent', header: 'Parent', cell: (r) => r.parent },
  { key: 'target', header: 'Target', cell: (r) => r.target },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
];

export default function AdminEnquiriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Enquiries</h1>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}
