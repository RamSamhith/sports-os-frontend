import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  width?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  empty,
  className,
}: {
  rows: T[];
  columns: Column<T>[];
  empty?: React.ReactNode;
  className?: string;
}) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <div className={cn('border-border/60 bg-card/40 overflow-x-auto rounded-xl border', className)}>
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/30">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className="text-muted-foreground p-3 text-left text-xs font-medium tracking-wide uppercase"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-border/40 border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-3 align-middle">
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
