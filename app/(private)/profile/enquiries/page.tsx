'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { EmptyState } from '@/components/feedback/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShortlistSkeleton } from '@/components/feedback/skeletons';
import { getMyEnquiries } from '@/lib/api/enquiries';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import type { Enquiry } from '@/types/domain/enquiry';

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-500/15 text-blue-600',
  delivered: 'bg-green-500/15 text-green-600',
  failed: 'bg-red-500/15 text-red-600',
  bounced: 'bg-yellow-500/15 text-yellow-600',
};

function getTargetName(eq: Enquiry): string {
  if (eq.targetType === 'academy') {
    return academies.find((a) => a.id === eq.targetId)?.name ?? 'Academy';
  }
  return coaches.find((c) => c.id === eq.targetId)?.name ?? 'Coach';
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getMyEnquiries().then((res) => {
      if (res.ok) setEnquiries(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ShortlistSkeleton />
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle className="h-5 w-5" />}
        title="No enquiries yet"
        description="When you contact an academy or coach, your enquiries will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {enquiries.map((eq) => (
        <Card key={eq.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-medium">
                  {getTargetName(eq)}
                </span>
                <Badge variant="secondary" className={statusColors[eq.status] ?? ''}>
                  {eq.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Sport: {eq.sportInterest} · Sent: {new Date(eq.createdAt).toLocaleDateString()}
              </p>
              {eq.message && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{eq.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
