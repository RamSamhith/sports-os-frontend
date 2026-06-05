import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function EnquiryFailure({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        <div className="bg-destructive/15 text-destructive grid h-12 w-12 place-items-center rounded-full">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <CardTitle>We couldn't submit your enquiry</CardTitle>
        <CardDescription>
          Please check your connection and try again. If the issue persists, contact support.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
      </CardContent>
    </Card>
  );
}
