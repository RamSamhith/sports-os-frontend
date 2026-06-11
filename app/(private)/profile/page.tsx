'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { useChildren } from '@/lib/hooks/use-children';
import { useAcademySelection } from '@/lib/hooks/use-academy-selection';
import { getMatchingCriteria } from '@/lib/utils/matching';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { MyAcademyCard } from '@/components/profile/my-academy-card';
import { Pencil, MapPin, Target, Trophy, User, Users, Sparkles, School, Star, ChevronRight, Search, BookOpen } from 'lucide-react';

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
  const { role } = useAuth();
  const { athleteData, parentData, completed } = useOnboarding();
  const { activeChild } = useChildren();
  const { selectedAcademyId } = useAcademySelection();
  const isParent = role === 'parent';

  const selectedAcademy = selectedAcademyId
    ? academies.find((a) => a.id === selectedAcademyId)
    : null;

  const academyCoaches = selectedAcademyId
    ? coaches.filter((c) => c.academyId === selectedAcademyId)
    : [];

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
      </Card>

      <MatchingCriteriaCard />

      {completed && athleteData && !isParent && (
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
                <span className="font-medium">{activeChild?.name ?? parentData.childName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{activeChild?.age ?? parentData.childAge}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{parentData.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium capitalize">{activeChild?.skillLevel ?? parentData.skillLevel}</span>
              </div>
            </div>
            {activeChild && (
              <div className="flex flex-wrap gap-1.5">
                <Badge key={activeChild.sport} variant="secondary" className="text-xs">
                  {getSportName(activeChild.sport)}
                </Badge>
              </div>
            )}
            {!activeChild && parentData.sportInterests.length > 0 && (
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

      <MyAcademyCard academies={academies} />

      {!selectedAcademyId && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-muted/50 grid h-12 w-12 place-items-center rounded-full">
                <School className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">No academy selected yet</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Browse academies and select one as your primary academy.
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/academies">
                  <Search className="h-3.5 w-3.5 mr-1" />
                  Browse Academies
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAcademy && academyCoaches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="text-primary h-4 w-4" />
                <CardTitle className="text-base">My Coaches</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">{academyCoaches.length}</Badge>
            </div>
            <CardDescription className="text-xs">
              At {selectedAcademy.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {academyCoaches.slice(0, 3).map((coach) => (
              <Link
                key={coach.id}
                href={`/coaches/${coach.slug}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {coach.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-1">{coach.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {coach.specialization.slice(0, 2).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {coach.rating.average.toFixed(1)}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
            {academyCoaches.length > 3 && (
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href={`/coaches?academy=${selectedAcademy.slug}`}>
                  View all {academyCoaches.length} coaches
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
