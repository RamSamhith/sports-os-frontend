'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Trophy, Target, Users, Clock, Dumbbell, Heart,
  Brain, Briefcase, GraduationCap, Medal, MapPin, Star,
  ChevronDown, ChevronRight,
  Zap, Activity, HelpCircle, Lightbulb,
  ArrowLeft, Shield, AlertTriangle, Sparkles, Flame,
  TrendingUp, Swords, BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils/cn';
import { sportsContent } from '@/data/sports-content';
import { competitionsBySport } from '@/data/competitions';
import type { Sport } from '@/types/domain/sport';

interface SportDetailViewProps {
  sport: Sport;
}

function AccordionSection({
  title,
  icon: Icon,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border-border/40 overflow-hidden rounded-xl border transition-colors hover:border-foreground/20">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/20"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="text-primary h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">{title}</span>
          {badge && <Badge variant="secondary" className="text-[10px] h-5">{badge}</Badge>}
        </div>
        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="border-border/40 border-t p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="bg-muted/30 flex items-start gap-3 rounded-xl border border-border/40 p-3.5 transition-all hover:border-foreground/20 hover:bg-muted/40">
      <div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', accent || 'bg-primary/10')}>
        <Icon className={cn('h-4 w-4', accent ? 'text-current' : 'text-primary')} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">{label}</span>
        <span className="text-sm font-medium truncate">{value}</span>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="text-muted-foreground h-3 w-3 shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SportDetailView({ sport }: SportDetailViewProps) {
  const {
    name, slug, category, sportType, shortDescription, fullDescription,
    origin, icon, coverImage,
    howToPlay, objectiveOfGame, teamSize, matchDuration, scoringSystem,
    playingSurface, requiredEquipment, ageGroups, beginnerFriendly, olympicSport,
    explorationGuidance,
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

  const sc = sportsContent[slug];
  const competitions = competitionsBySport(slug);

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="-ml-2 min-h-[44px] self-start">
        <Link href="/sports"><ArrowLeft className="h-4 w-4 mr-1" /> Back to sports</Link>
      </Button>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40">
        <div className="bg-muted/40 relative aspect-[21/9] w-full">
          <ImageWithFallback
            src={imageSrc}
            alt={`${name} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            fallback={
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex h-full w-full items-center justify-center">
                <span className="text-primary/30 text-6xl font-bold">{name.charAt(0)}</span>
              </div>
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-muted/60 relative h-11 w-11 shrink-0 overflow-hidden rounded-xl backdrop-blur-sm border border-white/20">
                <ImageWithFallback
                  src={iconSrc}
                  alt={`${name} icon`}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                  fallback={
                    <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
                      {name.charAt(0)}
                    </span>
                  }
                />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl tracking-tight">{name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px] backdrop-blur-sm">{category}</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px] capitalize">{sportType === 'both' ? 'Individual & Team' : sportType}</Badge>
                  {olympicSport && <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/20 text-[10px]">Olympic</Badge>}
                  {beginnerFriendly && <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/20 text-[10px]">Beginner Friendly</Badge>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={Users} label="Team Size" value={teamSize ?? 'N/A'} />
        <StatCard icon={Clock} label="Duration" value={matchDuration ?? 'N/A'} />
        <StatCard icon={Heart} label="Fitness Level" value={sport.fitnessLevelRequired ?? 'N/A'} />
      </div>

      {/* Tagline */}
      {sc?.tagline && (
        <p className="text-muted-foreground text-center text-sm italic px-4">{sc.tagline}</p>
      )}

      {/* Key Differences - Premium highlight */}
      {sc?.keyDifferences && (
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 grid h-8 w-8 shrink-0 place-items-center rounded-lg">
              <Swords className="text-primary h-4 w-4" />
            </div>
            <div>
              <span className="text-primary text-[10px] tracking-widest uppercase font-medium">What Makes {name} Unique</span>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{sc.keyDifferences}</p>
            </div>
          </div>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="flex flex-col gap-3">
        <AccordionSection title={`About ${name}`} icon={Star} defaultOpen>
          <p className="text-muted-foreground text-sm leading-relaxed">{shortDescription}</p>
          {(sc?.about || fullDescription) && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{sc?.about || fullDescription}</p>
          )}
          {origin && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Origin:</span>
              <span>{origin}</span>
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {sc?.injuryRisk && <MiniStat icon={AlertTriangle} label="Injury risk" value={sc.injuryRisk} />}
            {sc?.trainingFrequency && <MiniStat icon={Activity} label="Training" value={sc.trainingFrequency} />}
          </div>
        </AccordionSection>

        <AccordionSection title="Rules & Gameplay" icon={Target}>
          <p className="text-muted-foreground text-sm leading-relaxed">{sc?.rules || howToPlay}</p>
          {objectiveOfGame && (
            <div className="mt-3 bg-muted/30 rounded-lg border p-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Objective</span>
              <p className="mt-1 text-sm">{objectiveOfGame}</p>
            </div>
          )}
          {sc?.individualOrTeam && (
            <div className="mt-2">
              <Badge variant="outline" className="capitalize">{sc.individualOrTeam}</Badge>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Equipment Needed" icon={Dumbbell}>
          {(sc?.equipment || requiredEquipment) && (
            <div className="flex flex-wrap gap-1.5">
              {(sc?.equipment || requiredEquipment || []).map((item) => (
                <span key={item} className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {playingSurface && <div className="text-xs"><span className="text-muted-foreground">Surface:</span> {playingSurface}</div>}
            {scoringSystem && <div className="text-xs"><span className="text-muted-foreground">Scoring:</span> {scoringSystem}</div>}
          </div>
        </AccordionSection>

        <AccordionSection title="Health & Fitness Benefits" icon={Heart}>
          {(sc?.benefits?.physical || sport.physicalBenefits) && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Physical Benefits</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(sc?.benefits?.physical || sport.physicalBenefits || []).map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Zap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(sc?.benefits?.mental || sport.mentalBenefits) && (
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Mental Benefits</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(sc?.benefits?.mental || sport.mentalBenefits || []).map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Brain className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionSection>

        {/* Skills Developed - uses new `skills` field */}
        {sc?.skills && sc.skills.length > 0 && (
          <AccordionSection title="Skills You'll Develop" icon={BarChart3}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sc.skills.map((skill, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-muted/30 rounded-lg border p-2.5">
                  <Sparkles className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        <AccordionSection title="Training Roadmap" icon={Activity}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {sc?.trainingPath || `Start with basic ${name.toLowerCase()} fundamentals at a local academy. Progress through skill development, match play, and competitive training.`}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {ageText && <MiniStat icon={Users} label="Age to start" value={ageText} />}
            {sc?.trainingFrequency && <MiniStat icon={Activity} label="Frequency" value={sc.trainingFrequency} />}
            {sport.fitnessLevelRequired && <MiniStat icon={Heart} label="Fitness" value={sport.fitnessLevelRequired} />}
            {sc?.injuryRisk && <MiniStat icon={AlertTriangle} label="Injury risk" value={sc.injuryRisk} />}
          </div>
        </AccordionSection>

        {competitions.length > 0 && (
          <AccordionSection title="Competitions & Pathway" icon={Trophy} badge={`${competitions.length} competitions`}>
            <div className="flex flex-col gap-4">
              {(['state', 'national', 'international'] as const).map((level) => {
                const levelComps = competitions.filter((c) => c.level === level);
                if (levelComps.length === 0) return null;
                return (
                  <div key={level}>
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase capitalize">{level}</span>
                    <div className="mt-1.5 flex flex-col gap-2">
                      {levelComps.map((c) => (
                        <div key={c.id} className="rounded-lg border p-2.5 hover:bg-muted/20 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium">{c.name}</span>
                            <span className="text-muted-foreground text-[10px] shrink-0">{c.organiser}</span>
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">{c.whyImportant}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionSection>
        )}

        {sc?.competitions && (
          <AccordionSection title="Competition Pathway" icon={Medal}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {sc.competitions.state && sc.competitions.state.length > 0 && (
                <div className="bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground text-[10px] tracking-widest uppercase">District / State</span>
                  <ul className="mt-1 space-y-0.5">
                    {sc.competitions.state.slice(0, 3).map((c) => (
                      <li key={c} className="text-xs flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sc.competitions.national && sc.competitions.national.length > 0 && (
                <div className="bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground text-[10px] tracking-widest uppercase">National</span>
                  <ul className="mt-1 space-y-0.5">
                    {sc.competitions.national.slice(0, 3).map((c) => (
                      <li key={c} className="text-xs flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sc.competitions.international && sc.competitions.international.length > 0 && (
                <div className="bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground text-[10px] tracking-widest uppercase">International</span>
                  <ul className="mt-1 space-y-0.5">
                    {sc.competitions.international.slice(0, 3).map((c) => (
                      <li key={c} className="text-xs flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionSection>
        )}

        <AccordionSection title="Career Opportunities" icon={Briefcase}>
          {(sc?.careerOpportunities || sport.careerOpportunities) && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Career Paths</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(sc?.careerOpportunities || sport.careerOpportunities || []).map((c) => (
                  <div key={c} className="flex items-start gap-2 text-sm">
                    <Briefcase className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sport.scholarships && sport.scholarships.length > 0 && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Scholarships</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {sport.scholarships.map((s) => (
                  <div key={s} className="flex items-start gap-2 text-sm">
                    <GraduationCap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sport.professionalLeagues && sport.professionalLeagues.length > 0 && (
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Professional Leagues</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {sport.professionalLeagues.map((l) => (
                  <span key={l} className="inline-flex items-center rounded-full border border-warning/20 bg-warning/5 px-2 py-0.5 text-[11px] font-medium text-warning">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AccordionSection>

        {/* Popularity - merged into a single section */}
        {(sc?.popularityInIndia || sc?.popularityWorldwide) && (
          <AccordionSection title="Popularity" icon={TrendingUp}>
            {sc.popularityInIndia && (
              <div className="mb-2 bg-muted/30 rounded-lg border p-3">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">In India</span>
                <p className="mt-1 text-sm">{sc.popularityInIndia}</p>
              </div>
            )}
            {sc.popularityWorldwide && (
              <div className="bg-muted/30 rounded-lg border p-3">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Worldwide</span>
                <p className="mt-1 text-sm">{sc.popularityWorldwide}</p>
              </div>
            )}
          </AccordionSection>
        )}

        {sc?.funFacts && sc.funFacts.length > 0 && (
          <AccordionSection title="Fun Facts" icon={Lightbulb}>
            <div className="flex flex-col gap-2">
              {sc.funFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 text-xs">•</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {sc?.faqs && sc.faqs.length > 0 && (
          <AccordionSection title="FAQs" icon={HelpCircle} badge={`${sc.faqs.length} questions`}>
            <div className="flex flex-col gap-3">
              {sc.faqs.map((faq, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{faq.q}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}
      </div>

      {/* CTA */}
      <div className="border-border/60 flex flex-col gap-3 border-t pt-6">
        <p className="text-muted-foreground text-sm">
          Looking for a {name.toLowerCase()} academy or coach?
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm" className="min-h-[44px]">
            <Link href={`/academies?sport=${slug}`}>
              Explore {name} Academies <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href={`/sports`}>
              Compare Sports <BarChart3 className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
