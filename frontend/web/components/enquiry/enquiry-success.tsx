import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function EnquirySuccess() {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        <div className="bg-success/15 text-success grid h-12 w-12 place-items-center rounded-full">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <CardTitle>Enquiry submitted</CardTitle>
        <CardDescription>We've shared your interest with the academy. You'll receive a WhatsApp confirmation shortly.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        <Button asChild>
          <Link href="/academies">Browse Academies</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/profile/enquiries">
            <MessageCircle className="h-4 w-4" /> View enquiries
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
