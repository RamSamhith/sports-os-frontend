import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';

interface Row { id: string; name: string; status: 'published' | 'draft' }
const rows: Row[] = [
  { id: '1', name: 'Cricket', status: 'published' },
  { id: '2', name: 'Kabaddi', status: 'draft' },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
];

export default function AdminSportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Sports</h1>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}
