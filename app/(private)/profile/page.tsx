'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { getMatchingCriteria } from '@/lib/utils/matching';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { academies } from '@/data/academies';
import { MyAcademyCard } from '@/components/profile/my-academy-card';
import { Pencil, MapPin, Target, Trophy, User, Users, Sparkles } from 'lucide-react';

function getSportName(slug: string): string {
  return sportTaxonomy.find((s) => s.slug === slug)?.name ?? slug;
}

function MatchingCriteriaCard() {
  const { data: onboarding } = useOnboarding();
  if (!onboarding) return null;

  const criteria = getMatchingCriteria(onboarding);
  if (criteria.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <CardTitle className="text-base">Why These Results</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-2">
          Showing relevant academies and coaches based on:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {criteria.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">
              {c}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { role } = useAuth();
  const { athleteData, parentData, completed } = useOnboarding();
  const isParent = role === 'parent';

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Welcome back.</CardDescription>
            </div>
            {completed && (
              <Link href="/onboarding/wizard?edit=true" prefetch={false}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          {isParent
            ? 'Use the sidebar to manage personal info, children, preferences, saved items, and enquiries.'
            : 'Use the sidebar to manage personal info, preferences, saved items, and enquiries.'}
        </CardContent>
      </Card>

      {completed && athleteData && !isParent && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-4 w-4" />
              <CardTitle className="text-base">Your Sport Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{athleteData.age}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{athleteData.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium capitalize">{athleteData.skillLevel}</span>
              </div>
            </div>
            {athleteData.sportInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {athleteData.sportInterests.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            )}
            {athleteData.goals && (
              <p className="text-muted-foreground text-xs">
                <span className="text-foreground font-medium">Goal:</span> {athleteData.goals}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {completed && parentData && isParent && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <CardTitle className="text-base">Child&apos;s Sport Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{parentData.childName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{parentData.childAge}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{parentData.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium capitalize">{parentData.skillLevel}</span>
              </div>
            </div>
            {parentData.sportInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {parentData.sportInterests.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {completed && (
        <MatchingCriteriaCard />
      )}

      <MyAcademyCard academies={academies} />
    </div>
  );
}
