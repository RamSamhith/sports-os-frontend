'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { useChildren } from '@/lib/hooks/use-children';
import { ConversionModal } from '@/components/auth/conversion-modal';
import { getMatchingCriteria } from '@/lib/utils/matching';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { Pencil, MapPin, Target, Trophy, User, Users, Sparkles, Shield } from 'lucide-react';

function getSportName(slug: string): string {
  return sportTaxonomy.find((s) => s.slug === slug)?.name ?? slug;
}

function MatchingCriteriaCard() {
  const { onboarding: authOnboarding, onboardingCompleted } = useAuth();
  const { data: onboarding, completed } = useOnboarding();
  const isOnboarded = onboardingCompleted || completed;
  const effectiveOnboarding = (isOnboarded && authOnboarding.location) ? {
    athlete: authOnboarding.age ? {
      age: authOnboarding.age,
      gender: (authOnboarding.gender || 'prefer_not_to_say') as 'male' | 'female' | 'other' | 'prefer_not_to_say',
      location: authOnboarding.location,
      sportInterests: authOnboarding.sportInterests,
      skillLevel: (authOnboarding.skillLevel || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'competitive',
    } : undefined,
    parent: authOnboarding.children.length > 0 ? {
      childName: authOnboarding.children[0].name,
      childAge: authOnboarding.children[0].age,
      location: authOnboarding.location,
      sportInterests: authOnboarding.children[0].sportInterests,
      skillLevel: (authOnboarding.children[0].skillLevel || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'competitive',
    } : undefined,
  } : onboarding;
  if (!effectiveOnboarding) return null;

  const criteria = getMatchingCriteria(effectiveOnboarding);
  if (criteria.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-primary h-4 w-4" />
          <p className="text-sm font-medium">Based on</p>
        </div>
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
  const { role, isGuest, isAuthenticated, onboarding: authOnboarding, onboardingCompleted } = useAuth();
  const { athleteData, parentData, completed } = useOnboarding();
  const { activeChild } = useChildren();
  const isParent = role === 'parent';
  const [showUpgrade, setShowUpgrade] = React.useState(false);

  const isOnboarded = onboardingCompleted || completed;

  const effectiveParentData = (authOnboarding.children.length > 0 || authOnboarding.location)
    ? {
        childName: activeChild?.name ?? authOnboarding.children[0]?.name ?? parentData?.childName ?? '',
        childAge: activeChild?.age ?? authOnboarding.children[0]?.age ?? parentData?.childAge ?? 0,
        location: authOnboarding.location || (parentData?.location ?? ''),
        sportInterests: activeChild?.sportInterests ?? authOnboarding.children[0]?.sportInterests ?? parentData?.sportInterests ?? [],
        skillLevel: activeChild?.skillLevel ?? authOnboarding.children[0]?.skillLevel ?? parentData?.skillLevel ?? '',
      }
    : parentData;

  const effectiveAthleteData = (authOnboarding.age || authOnboarding.sportInterests.length > 0)
    ? {
        age: authOnboarding.age ?? athleteData?.age ?? 0,
        gender: authOnboarding.gender ?? athleteData?.gender ?? '',
        location: authOnboarding.location || (athleteData?.location ?? ''),
        sportInterests: authOnboarding.sportInterests.length > 0 ? authOnboarding.sportInterests : athleteData?.sportInterests ?? [],
        skillLevel: authOnboarding.skillLevel ?? athleteData?.skillLevel ?? '',
      }
    : athleteData;

  return (
    <div className="flex flex-col gap-4">
      {/* Guest Upgrade Banner */}
      {(isGuest || !isAuthenticated) && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-amber-100 dark:bg-amber-900/50 grid h-10 w-10 shrink-0 place-items-center rounded-full">
              <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Guest User</p>
                <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                  <Shield className="h-2.5 w-2.5 mr-0.5" />
                  Guest
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Sign up to save favourites, write reviews, and get personalised recommendations.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowUpgrade(true)}>
              Upgrade Account
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Welcome back.</CardDescription>
            </div>
            {isOnboarded && (
              <Link href="/onboarding/wizard?edit=true" prefetch={false}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      <ConversionModal open={showUpgrade} onOpenChange={setShowUpgrade} />

      <MatchingCriteriaCard />

      {isOnboarded && effectiveAthleteData && !isParent && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-4 w-4" />
              <CardTitle className="text-base">My Sport</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{effectiveAthleteData.age}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{effectiveAthleteData.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium capitalize">{effectiveAthleteData.skillLevel}</span>
              </div>
            </div>
            {effectiveAthleteData.sportInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {effectiveAthleteData.sportInterests.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isOnboarded && effectiveParentData && isParent && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <CardTitle className="text-base">{activeChild ? `${activeChild.name}'s Sport` : "My Child's Sport"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{activeChild?.name ?? effectiveParentData.childName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{activeChild?.age ?? effectiveParentData.childAge}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{effectiveParentData.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium capitalize">{activeChild?.skillLevel ?? effectiveParentData.skillLevel}</span>
              </div>
            </div>
            {activeChild && (
              <div className="flex flex-wrap gap-1.5">
                {activeChild.sportInterests?.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            )}
            {!activeChild && effectiveParentData.sportInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {effectiveParentData.sportInterests.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
