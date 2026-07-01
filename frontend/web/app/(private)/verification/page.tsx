'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VerificationFlow, type VerificationStep } from '@/components/trust/verification-badge';
import {
  ShieldCheck,
  FileText,
  Loader2,
  Send,
  Globe,
  MapPin,
  Building2,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';

type VerificationStatus = 'unverified' | 'pending' | 'submitted' | 'under_review' | 'verified' | 'rejected';

interface AcademyFormData {
  name: string;
  address: string;
  facilities: string;
  sports: string;
  contact: string;
  website: string;
  description: string;
}

interface CoachFormData {
  sport: string;
  certificateName: string;
  issuingOrg: string;
  yearsOfExperience: string;
  specialization: string;
}

const SPORTS_LIST = [
  'Cricket',
  'Football',
  'Basketball',
  'Tennis',
  'Badminton',
  'Swimming',
  'Athletics',
  'Hockey',
  'Volleyball',
  'Table Tennis',
  'Chess',
  'Kabaddi',
];

function StatusBadge({ status }: { status: VerificationStatus }) {
  const config = {
    unverified: { label: 'Unverified', variant: 'outline' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    submitted: { label: 'Submitted', variant: 'info' as const },
    under_review: { label: 'Under Review', variant: 'info' as const },
    verified: { label: 'Verified', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'danger' as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function toFlowStep(status: VerificationStatus): VerificationStep {
  const map: Record<string, VerificationStep> = {
    pending: 'pending',
    submitted: 'documents_submitted',
    under_review: 'under_review',
    verified: 'verified',
    rejected: 'rejected',
  };
  return map[status] ?? 'pending';
}

function AcademyForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (data: AcademyFormData) => void;
  disabled: boolean;
}) {
  const [form, setForm] = useState<AcademyFormData>({
    name: '',
    address: '',
    facilities: '',
    sports: '',
    contact: '',
    website: '',
    description: '',
  });

  function update(field: keyof AcademyFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.contact.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="academy-name">
            Academy Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="academy-name"
            placeholder="e.g. Rising Stars Academy"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="academy-contact">
            Contact Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="academy-contact"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.contact}
            onChange={(e) => update('contact', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="academy-address">
          Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="academy-address"
          placeholder="Full address with city and state"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="academy-sports">Sports Offered</Label>
        <Input
          id="academy-sports"
          placeholder="e.g. Cricket, Football, Badminton"
          value={form.sports}
          onChange={(e) => update('sports', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="academy-facilities">Facilities</Label>
        <Textarea
          id="academy-facilities"
          placeholder="List available facilities (e.g. Indoor nets, swimming pool, gym)"
          value={form.facilities}
          onChange={(e) => update('facilities', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="academy-website">Website</Label>
        <Input
          id="academy-website"
          type="url"
          placeholder="https://example.com"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="academy-description">Description</Label>
        <Textarea
          id="academy-description"
          placeholder="Tell us about your academy, coaching philosophy, and achievements"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled} className="gap-1.5">
          <Send className="h-4 w-4" />
          Submit for Review
        </Button>
      </div>
    </form>
  );
}

function CoachForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (data: CoachFormData) => void;
  disabled: boolean;
}) {
  const [form, setForm] = useState<CoachFormData>({
    sport: '',
    certificateName: '',
    issuingOrg: '',
    yearsOfExperience: '',
    specialization: '',
  });

  function update(field: keyof CoachFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sport || !form.certificateName.trim() || !form.issuingOrg.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>
            Coaching Sport <span className="text-destructive">*</span>
          </Label>
          <Select value={form.sport} onValueChange={(v) => update('sport', v)} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select a sport" />
            </SelectTrigger>
            <SelectContent>
              {SPORTS_LIST.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coach-experience">Years of Experience</Label>
          <Input
            id="coach-experience"
            type="number"
            min="0"
            max="60"
            placeholder="e.g. 5"
            value={form.yearsOfExperience}
            onChange={(e) => update('yearsOfExperience', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="coach-certificate">
          Certificate Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="coach-certificate"
          placeholder="e.g. BCCI Level-2 Coaching Certificate"
          value={form.certificateName}
          onChange={(e) => update('certificateName', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="coach-org">
          Issuing Organization <span className="text-destructive">*</span>
        </Label>
        <Input
          id="coach-org"
          placeholder="e.g. BCCI, AIFF, SAI"
          value={form.issuingOrg}
          onChange={(e) => update('issuingOrg', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="coach-specialization">Specialization</Label>
        <Input
          id="coach-specialization"
          placeholder="e.g. Youth development, fitness training"
          value={form.specialization}
          onChange={(e) => update('specialization', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled} className="gap-1.5">
          <Send className="h-4 w-4" />
          Submit for Review
        </Button>
      </div>
    </form>
  );
}

export default function VerificationPage() {
  const { role } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('unverified');
  const [submitting, setSubmitting] = useState(false);

  const isAcademyOwner = role === 'academy_owner';
  const isCoach = role === 'coach';
  const showForm = (isAcademyOwner || isCoach) && (status === 'unverified' || status === 'rejected');
  const showFlow = status !== 'unverified';

  async function handleSubmit() {
    setSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setStatus('submitted');
    toast.success('Verification request submitted');
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Verification</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Get verified to build trust with athletes and parents on SportsOS.
        </p>
      </header>

      {/* Current Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Verification Status</p>
                <p className="text-muted-foreground text-xs">
                  {status === 'unverified' && 'You have not started verification yet.'}
                  {status === 'submitted' && 'Your documents have been submitted.'}
                  {status === 'pending' && 'Your submission is queued for review.'}
                  {status === 'under_review' && 'Our team is reviewing your submission.'}
                  {status === 'verified' && 'Your account is verified.'}
                  {status === 'rejected' && 'Your submission was not approved.'}
                </p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </CardContent>
      </Card>

      {/* Verification Flow Progress */}
      {showFlow && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
            <CardDescription>
              {status === 'verified'
                ? 'Your account has been fully verified.'
                : status === 'rejected'
                ? 'Your submission was not approved. Please review and resubmit.'
                : 'Track your verification progress below.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerificationFlow currentStep={toFlowStep(status)} />

            {status === 'rejected' && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-destructive text-sm font-medium">Rejection Reason</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  The submitted documents were not legible. Please resubmit with clear, high-resolution images.
                </p>
              </div>
            )}

            {status === 'submitted' && (
              <p className="text-muted-foreground mt-4 text-sm">
                Our team typically reviews submissions within 2-3 business days.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAcademyOwner ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              {isAcademyOwner ? 'Academy Verification' : 'Coach Verification'}
            </CardTitle>
            <CardDescription>
              {isAcademyOwner
                ? 'Provide your academy details and documentation for verification.'
                : 'Submit your coaching credentials for verification.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitting ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <p className="text-muted-foreground text-sm">Submitting your verification request...</p>
              </div>
            ) : isAcademyOwner ? (
              <AcademyForm onSubmit={handleSubmit} disabled={submitting} />
            ) : (
              <CoachForm onSubmit={handleSubmit} disabled={submitting} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Role mismatch */}
      {!isAcademyOwner && !isCoach && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <FileText className="text-muted-foreground h-10 w-10" />
            <div>
              <p className="text-sm font-medium">Verification not available</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Verification is currently available for academy owners and coaches.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info cards for benefits */}
      {status === 'unverified' && (isAcademyOwner || isCoach) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <p className="text-sm font-medium">Build Trust</p>
                <p className="text-muted-foreground text-xs">
                  Verified accounts earn higher trust from athletes and parents.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Search Visibility</p>
                <p className="text-muted-foreground text-xs">
                  Verified listings appear higher in search results.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <div>
                <p className="text-sm font-medium">Premium Badge</p>
                <p className="text-muted-foreground text-xs">
                  Display a verified badge on your profile and listings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
