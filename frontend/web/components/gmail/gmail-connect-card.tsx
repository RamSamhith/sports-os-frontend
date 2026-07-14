'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Mail, MapPin, RefreshCw, Unlink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGmailToken } from '@/lib/hooks/use-gmail-token';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { fetchEmails, extractEmailText } from '@/lib/gmail';
import { summarizeLocations } from '@/lib/location-detector';
import type { EmailLocationResult, LocationGroup } from '@/lib/location-detector';
import { EmailLocationResults } from './email-location-results';

export function GmailConnectCard() {
  const gmail = useGmailToken();
  const geolocation = useGeolocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailResults, setEmailResults] = useState<EmailLocationResult[]>([]);
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([]);
  const [activeTab, setActiveTab] = useState('emails');

  const handleConnect = useCallback(() => {
    setError(null);
    gmail.requestToken();
  }, [gmail]);

  const handleScan = useCallback(async () => {
    if (!gmail.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const rawEmails = await fetchEmails(gmail.accessToken, 50);
      const extracted = rawEmails.map((e) => extractEmailText(e));
      const { perEmail, grouped } = summarizeLocations(
        extracted.map((e) => ({ id: e.id, subject: e.subject, text: e.fullText })),
      );

      // Attach snippet/from back for display
      const merged = perEmail.map((p) => {
        const orig = extracted.find((e) => e.id === p.id);
        return { ...p, snippet: orig?.snippet || '', from: orig?.from || '' };
      });

      setEmailResults(merged);
      setLocationGroups(grouped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to scan emails. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [gmail.accessToken]);

  // Auto-scan when token is first obtained
  const [hasScanned, setHasScanned] = useState(false);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    if (gmail.accessToken && !hasScannedRef.current && !loading && emailResults.length === 0) {
      hasScannedRef.current = true;
      setHasScanned(true);
      handleScan();
    }
  }, [gmail.accessToken, loading, emailResults.length, handleScan]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Location Detection
        </CardTitle>
        <CardDescription>
          Connect your Gmail to scan recent emails for location mentions.
          Your access token is stored in memory only and never persisted.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Geolocation section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={geolocation.detect}
              disabled={geolocation.status === 'loading'}
            >
              {geolocation.status === 'loading' ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-1 h-4 w-4" />
              )}
              Detect My Location
            </Button>
            {geolocation.status === 'done' && geolocation.result && (
              <span className="text-muted-foreground text-xs">
                {geolocation.result.address ||
                  `${geolocation.result.coords.latitude.toFixed(4)}, ${geolocation.result.coords.longitude.toFixed(4)}`}
              </span>
            )}
          </div>
          {geolocation.status === 'error' && geolocation.error && (
            <p className="text-destructive text-xs">{geolocation.error}</p>
          )}
        </div>

        {/* Gmail connection section */}
        {!gmail.accessToken ? (
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleConnect}
              disabled={!gmail.ready || loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-1 h-4 w-4" />
              )}
              Connect Gmail
            </Button>
            {!gmail.ready && (
              <p className="text-muted-foreground text-xs">
                Loading Google Identity Services...
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScan}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1 h-4 w-4" />
                )}
                {emailResults.length > 0 ? 'Rescan' : 'Scan Emails'}
              </Button>
              <Button variant="ghost" size="sm" onClick={gmail.disconnect}>
                <Unlink className="mr-1 h-4 w-4" />
                Disconnect
              </Button>
            </div>

            {/* Results */}
            {loading && (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Scanning your last 50 emails for locations...
                </span>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {!loading && emailResults.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="emails">
                    Emails ({emailResults.length})
                  </TabsTrigger>
                  <TabsTrigger value="summary">
                    Locations ({locationGroups.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="emails" className="mt-3">
                  <EmailLocationResults results={emailResults} tab="emails" />
                </TabsContent>
                <TabsContent value="summary" className="mt-3">
                  <EmailLocationResults results={emailResults} tab="summary" />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
