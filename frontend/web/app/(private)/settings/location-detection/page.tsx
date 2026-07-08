'use client';

import { Mail, MapPin, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GmailConnectCard } from '@/components/gmail/gmail-connect-card';

export default function LocationDetectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Location Detection
        </h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Scan your Gmail for location mentions and detect your current position.
        </p>
      </header>

      {/* Info card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>Gmail access:</strong> Connect your Google account to scan
                the last 50 emails for city names, pincodes, and address patterns.
                Your access token is stored in memory only and never persisted to
                disk.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>Current location:</strong> Optionally detect your current
                GPS position using your browser. This is processed locally and
                never sent to any server.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main feature card */}
      <GmailConnectCard />
    </div>
  );
}
