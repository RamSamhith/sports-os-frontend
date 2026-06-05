import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Button } from '@/components/ui/button';

interface Row {
  id: string;
  name: string;
  city: string;
  status: 'verified' | 'pending' | 'rejected';
}

const rows: Row[] = [
  { id: '1', name: 'Stadium Cricket Academy', city: 'Bengaluru', status: 'verified' },
  { id: '2', name: 'Court Basketball Club', city: 'Mumbai', status: 'pending' },
  { id: '3', name: 'Aqua Swim Center', city: 'Hyderabad', status: 'rejected' },
];

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'city', header: 'City', cell: (r) => r.city },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
  { key: 'actions', header: '', cell: () => <Button size="sm" variant="outline">Review</Button> },
];

export default function AdminAcademiesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Academies</h1>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}
