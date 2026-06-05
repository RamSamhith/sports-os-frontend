import { Card } from '@/components/ui/card';

export interface CompareRow {
  key: string;
  label: string;
  values: Array<string | number | null>;
}

export function CompareTable({ rows, columns }: { rows: CompareRow[]; columns: string[] }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-border/60 border-b">
            <th className="text-muted-foreground p-3 text-left text-xs font-medium tracking-widest uppercase">
              Attribute
            </th>
            {columns.map((c) => (
              <th key={c} className="p-3 text-left text-xs font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-border/40 border-b last:border-0">
              <td className="text-muted-foreground p-3 text-xs tracking-wide uppercase">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={`${row.key}-${i}`} className="p-3">
                  {v ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
