import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';

interface Row { id: string; name: string; sport: string; status: 'verified' | 'pending' | 'rejected' }
const rows: Row[] = [
  { id: '1', name: 'Coach Asha', sport: 'Tennis', status: 'verified' },
  { id: '2', name: 'Coach Raj', sport: 'Swimming', status: 'pending' },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'sport', header: 'Sport', cell: (r) => r.sport },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
];

export default function AdminCoachesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Coaches</h1>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}
