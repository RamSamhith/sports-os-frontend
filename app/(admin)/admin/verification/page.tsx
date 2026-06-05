import { DataTable, type Column } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';

interface Row { id: string; target: string; type: 'academy' | 'coach'; submittedAt: string }
const rows: Row[] = [
  { id: '1', target: 'Stadium Cricket Academy', type: 'academy', submittedAt: '2 hours ago' },
  { id: '2', target: 'Coach Asha', type: 'coach', submittedAt: '1 day ago' },
];
const columns: Column<Row>[] = [
  { key: 'target', header: 'Target', cell: (r) => r.target },
  { key: 'type', header: 'Type', cell: (r) => r.type },
  { key: 'submittedAt', header: 'Submitted', cell: (r) => r.submittedAt },
  { key: 'actions', header: '', cell: () => <Button size="sm" variant="outline">Review</Button> },
];

export default function VerificationPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Verification queue</h1>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}
