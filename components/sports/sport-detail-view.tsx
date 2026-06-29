'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Trophy, Target, Users, Clock, Dumbbell, Shield, Heart,
  Brain, Briefcase, GraduationCap, Medal, MapPin, Star,
  Calendar, Timer, IndianRupee, AlertTriangle, Check, ChevronRight,
  Swords, Zap, Activity, CircleDot,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { cn } from '@/lib/utils/cn';
import type { Sport } from '@/types/domain/sport';

interface SportDetailViewProps {
  sport: Sport;
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-[10px] tracking-widest uppercase">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function TagList({ items, colorClass }: { items: string[]; colorClass?: string }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
            colorClass ?? 'border-border/60 bg-muted/50 text-muted-foreground',
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-muted/30 flex items-start gap-3 rounded-lg border p-3">
      <Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

export function SportDetailView({ sport }: SportDetailViewProps) {
  const {
    name, slug, category, sportType, shortDescription, fullDescription,
    origin, popularityInIndia, popularityWorldwide, icon, coverImage,
    howToPlay, objectiveOfGame, teamSize, matchDuration, scoringSystem,
    playingSurface, requiredEquipment, ageGroups, beginnerFriendly, olympicSport,
    estimatedMonthlyCost, playingSeason, trainingFrequency, averageLearningTime,
    injuryRisk, fitnessLevelRequired, suitableFor, individualOrTeam, indoorOutdoor,
    physicalBenefits, mentalBenefits, skillsDeveloped,
    careerOpportunities, scholarships, professionalLeagues,
    tournaments, competitionPathway, explorationGuidance,
  } = sport;

  const imageSrc = coverImage || `/images/sports/${slug}.svg`;
  const iconSrc = icon || `/images/sports/${slug}.svg`;
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `${ageRange.min}–${ageRange.max} years`
      : ageRange?.min !== undefined
        ? `${ageRange.min}+ years`
        : ageGroups;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="bg-muted/40 relative aspect-[21/9] w-full">
          <ImageWithFallback
            src={imageSrc}
            alt={`${name} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            fallback={
              <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                <span className="text-primary/40 text-6xl font-bold">{name.charAt(0)}</span>
              </div>
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-muted/60 relative h-10 w-10 shrink-0 overflow-hidden rounded-lg backdrop-blur-sm">
                <ImageWithFallback
                  src={iconSrc}
                  alt={`${name} icon`}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  fallback={
                    <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
                      {name.charAt(0)}
                    </span>
                  }
                />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">{name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px]">{category}</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px] capitalize">{sportType}</Badge>
                  {olympicSport && <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/20 text-[10px]">Olympic</Badge>}
                  {beginnerFriendly && <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/20 text-[10px]">Beginner Friendly</Badge>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Team Size" value={teamSize} />
        <StatCard icon={Clock} label="Duration" value={matchDuration} />
        <StatCard icon={IndianRupee} label="Monthly Cost" value={estimatedMonthlyCost} />
        <StatCard icon={Timer} label="Learning Time" value={averageLearningTime} />
      </div>

      {/* About */}
      <section className="flex flex-col gap-3">
        <SectionHeader icon={Star} title="About {name}" />
        <p className="text-muted-foreground text-sm leading-relaxed">{shortDescription}</p>
        {fullDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed">{fullDescription}</p>
        )}
        {origin && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Origin:</span>
            <span>{origin}</span>
          </div>
        )}
      </section>

      {/* How to Play */}
      <section className="flex flex-col gap-3">
        <SectionHeader icon={Target} title="How to Play" />
        <p className="text-muted-foreground text-sm leading-relaxed">{howToPlay}</p>
        {objectiveOfGame && (
          <div className="bg-muted/30 rounded-lg border p-3">
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Objective</span>
            <p className="mt-1 text-sm">{objectiveOfGame}</p>
          </div>
        )}
      </section>

      {/* Game Details */}
      <section className="flex flex-col gap-3">
        <SectionHeader icon={CircleDot} title="Game Details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow label="Playing Surface" value={playingSurface} />
          <InfoRow label="Scoring System" value={scoringSystem} />
          <InfoRow label="Age Groups" value={ageText} />
          <InfoRow label="Playing Season" value={playingSeason} />
          <InfoRow label="Training Frequency" value={trainingFrequency} />
          <InfoRow label="Injury Risk" value={injuryRisk} />
          <InfoRow label="Fitness Required" value={fitnessLevelRequired} />
          <InfoRow label="Suitable For" value={suitableFor?.join(', ')} />
        </div>
        {requiredEquipment && requiredEquipment.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Required Equipment</span>
            <TagList items={requiredEquipment} />
          </div>
        )}
      </section>

      {/* Benefits */}
      {(physicalBenefits?.length > 0 || mentalBenefits?.length > 0 || skillsDeveloped?.length > 0) && (
        <section className="flex flex-col gap-4">
          <SectionHeader icon={Heart} title="Benefits" />
          {physicalBenefits?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Physical Benefits</span>
              <div className="flex flex-col gap-1">
                {physicalBenefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Zap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mentalBenefits?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Mental Benefits</span>
              <div className="flex flex-col gap-1">
                {mentalBenefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Brain className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skillsDeveloped?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Skills Developed</span>
              <TagList items={skillsDeveloped} colorClass="border-primary/20 bg-primary/5 text-primary" />
            </div>
          )}
        </section>
      )}

      {/* Career & Pathway */}
      {(careerOpportunities?.length > 0 || scholarships?.length > 0 || professionalLeagues?.length > 0) && (
        <section className="flex flex-col gap-4">
          <SectionHeader icon={Briefcase} title="Career & Pathway" />
          {careerOpportunities?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Career Opportunities</span>
              <div className="flex flex-col gap-1">
                {careerOpportunities.map((c) => (
                  <div key={c} className="flex items-start gap-2 text-sm">
                    <Briefcase className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {scholarships?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Scholarships</span>
              <div className="flex flex-col gap-1">
                {scholarships.map((s) => (
                  <div key={s} className="flex items-start gap-2 text-sm">
                    <GraduationCap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {professionalLeagues?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Professional Leagues</span>
              <TagList items={professionalLeagues} colorClass="border-warning/20 bg-warning/5 text-warning" />
            </div>
          )}
        </section>
      )}

      {/* Tournaments */}
      {tournaments && tournaments.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader icon={Trophy} title="Tournaments" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tournaments.map((t) => (
              <Card key={t.tournamentName} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{t.tournamentName}</span>
                    <Badge variant="outline" className="w-fit text-[10px]">{t.level}</Badge>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{t.frequency}</span>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">{t.shortDescription}</p>
                <p className="text-muted-foreground mt-1 text-[10px]">Organized by {t.organizer}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Popularity */}
      {(popularityInIndia || popularityWorldwide) && (
        <section className="flex flex-col gap-3">
          <SectionHeader icon={Medal} title="Popularity" />
          {popularityInIndia && (
            <div className="bg-muted/30 rounded-lg border p-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">In India</span>
              <p className="mt-1 text-sm">{popularityInIndia}</p>
            </div>
          )}
          {popularityWorldwide && (
            <div className="bg-muted/30 rounded-lg border p-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Worldwide</span>
              <p className="mt-1 text-sm">{popularityWorldwide}</p>
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <div className="border-border/60 flex flex-col gap-3 border-t pt-6">
        <p className="text-muted-foreground text-sm">
          Looking for a {name.toLowerCase()} academy or coach?
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm">
            <Link href={`/academies?sport=${slug}`}>
              Explore {name} Academies <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/coaches?sport=${slug}`}>
              Explore {name} Coaches <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
