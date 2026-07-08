'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Trophy, Target, Users, Clock, Dumbbell, Heart,
  Brain, Briefcase, GraduationCap, Medal, MapPin, Star,
  Timer, ChevronDown, ChevronRight,
  Zap, Activity, HelpCircle, Lightbulb,
  ArrowLeft, Shield, AlertTriangle, Sparkles, Flame,
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
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border-border/40 overflow-hidden rounded-xl border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/30"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="text-primary h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">{title}</span>
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
          'grid transition-all duration-200 ease-in-out',
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
    trainingFrequency, averageLearningTime,
    injuryRisk, fitnessLevelRequired,
    physicalBenefits, mentalBenefits,
    careerOpportunities, scholarships, professionalLeagues,
    tournaments, explorationGuidance,
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

  const staticContent = sportsContent[slug];
  const competitions = competitionsBySport(slug);

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="-ml-2 min-h-[44px] self-start">
        <Link href="/sports"><ArrowLeft className="h-4 w-4 mr-1" /> Back to sports</Link>
      </Button>
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
        <StatCard icon={Users} label="Team Size" value={teamSize ?? 'N/A'} />
        <StatCard icon={Clock} label="Duration" value={matchDuration ?? 'N/A'} />
        <StatCard icon={Timer} label="Learning Time" value={averageLearningTime ?? 'N/A'} />
        <StatCard icon={Heart} label="Fitness Level" value={fitnessLevelRequired ?? 'N/A'} />
      </div>

      {/* Tagline */}
      {staticContent?.tagline && (
        <p className="text-muted-foreground text-center text-sm italic">{staticContent.tagline}</p>
      )}

      {/* Accordion Sections */}
      <div className="flex flex-col gap-3">
        <AccordionSection title={`About ${name}`} icon={Star} defaultOpen>
          <p className="text-muted-foreground text-sm leading-relaxed">{shortDescription}</p>
          {(staticContent?.about || fullDescription) && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{staticContent?.about || fullDescription}</p>
          )}
          {origin && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Origin:</span>
              <span>{origin}</span>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Rules & Gameplay" icon={Target}>
          <p className="text-muted-foreground text-sm leading-relaxed">{staticContent?.rules || howToPlay}</p>
          {objectiveOfGame && (
            <div className="mt-3 bg-muted/30 rounded-lg border p-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Objective</span>
              <p className="mt-1 text-sm">{objectiveOfGame}</p>
            </div>
          )}
          {staticContent?.individualOrTeam && (
            <div className="mt-2">
              <Badge variant="outline" className="capitalize">{staticContent.individualOrTeam}</Badge>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Equipment Needed" icon={Dumbbell}>
          {(staticContent?.equipment || requiredEquipment) && (
            <div className="flex flex-wrap gap-1.5">
              {(staticContent?.equipment || requiredEquipment || []).map((item) => (
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
          {(staticContent?.benefits?.physical || physicalBenefits) && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Physical Benefits</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(staticContent?.benefits?.physical || physicalBenefits || []).map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Zap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(staticContent?.benefits?.mental || mentalBenefits) && (
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Mental Benefits</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(staticContent?.benefits?.mental || mentalBenefits || []).map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <Brain className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Training Roadmap" icon={Activity}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {staticContent?.trainingPath || `Start with basic ${name.toLowerCase()} fundamentals at a local academy. Progress through skill development, match play, and competitive training.`}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {ageText && <div><span className="text-muted-foreground">Age to start:</span> {ageText}</div>}
            {trainingFrequency && <div><span className="text-muted-foreground">Training:</span> {trainingFrequency}</div>}
            {fitnessLevelRequired && <div><span className="text-muted-foreground">Fitness:</span> {fitnessLevelRequired}</div>}
            {injuryRisk && <div><span className="text-muted-foreground">Injury risk:</span> {injuryRisk}</div>}
          </div>
        </AccordionSection>

        <AccordionSection title="Career Opportunities" icon={Briefcase}>
          {(staticContent?.careerOpportunities || careerOpportunities) && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Career Paths</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {(staticContent?.careerOpportunities || careerOpportunities || []).map((c) => (
                  <div key={c} className="flex items-start gap-2 text-sm">
                    <Briefcase className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {scholarships && scholarships.length > 0 && (
            <div className="mb-3">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Scholarships</span>
              <div className="mt-1.5 flex flex-col gap-1">
                {scholarships.map((s) => (
                  <div key={s} className="flex items-start gap-2 text-sm">
                    <GraduationCap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {professionalLeagues && professionalLeagues.length > 0 && (
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Professional Leagues</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {professionalLeagues.map((l) => (
                  <span key={l} className="inline-flex items-center rounded-full border border-warning/20 bg-warning/5 px-2 py-0.5 text-[11px] font-medium text-warning">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AccordionSection>

        {competitions.length > 0 && (
          <AccordionSection title="Competitions" icon={Trophy}>
            <div className="flex flex-col gap-4">
              {(['state', 'national', 'international'] as const).map((level) => {
                const levelComps = competitions.filter((c) => c.level === level);
                if (levelComps.length === 0) return null;
                return (
                  <div key={level}>
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase capitalize">{level}</span>
                    <div className="mt-1.5 flex flex-col gap-2">
                      {levelComps.map((c) => (
                        <div key={c.id} className="rounded-lg border p-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium">{c.name}</span>
                            <span className="text-muted-foreground text-[10px]">{c.organiser}</span>
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

        {tournaments && tournaments.length > 0 && (
          <AccordionSection title="Major Tournaments" icon={Medal}>
            <div className="flex flex-col gap-2">
              {tournaments.map((t) => (
                <div key={t.tournamentName} className="rounded-lg border p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{t.tournamentName}</span>
                    <span className="text-muted-foreground text-[10px]">{t.frequency}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{t.shortDescription}</p>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Skills Developed */}
        <AccordionSection title="Skills Developed" icon={Brain}>
          <div className="flex flex-col gap-2">
            {staticContent?.benefits?.mental && (
              <div>
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Mental Skills</span>
                <div className="mt-1.5 flex flex-col gap-1">
                  {(staticContent.benefits.mental).map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm">
                      <Brain className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {staticContent?.benefits?.physical && (
              <div className="mt-2">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Physical Skills</span>
                <div className="mt-1.5 flex flex-col gap-1">
                  {(staticContent.benefits.physical).map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm">
                      <Zap className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Who Should Play */}
        <AccordionSection title="Who Should Play" icon={Users}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {name} is suitable for a wide range of ages and skill levels.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {ageText && (
              <div className="bg-muted/30 rounded-lg border p-2.5">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Age Groups</span>
                <p className="mt-0.5 font-medium">{ageText}</p>
              </div>
            )}
            {beginnerFriendly !== undefined && (
              <div className="bg-muted/30 rounded-lg border p-2.5">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Beginner Friendly</span>
                <p className="mt-0.5 font-medium">{beginnerFriendly ? 'Yes — Great for starters' : 'Requires prior training'}</p>
              </div>
            )}
          </div>
          <div className="mt-3 bg-muted/30 rounded-lg border p-2.5">
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Who Benefits Most</span>
            <p className="mt-0.5 text-sm">
              {staticContent?.benefits?.physical?.length ? 'Great for fitness enthusiasts' : ''}
              {staticContent?.benefits?.mental?.length ? ' and those looking to develop mental discipline' : ''}.
              Suitable for recreational play and competitive pathways alike.
            </p>
          </div>
        </AccordionSection>

        {/* Training Tips */}
        <AccordionSection title="Training Tips" icon={Flame}>
          <div className="flex flex-col gap-3">
            <div className="bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase flex items-center gap-1">
                <Activity className="h-3 w-3" /> Warm-up
              </span>
              <p className="mt-1 text-sm">Start with light cardio (5-10 mins) to increase heart rate, followed by dynamic stretches targeting the muscles used in {name.toLowerCase()}. Sport-specific drills at low intensity prepare the body for training.</p>
            </div>
            <div className="bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase flex items-center gap-1">
                <Heart className="h-3 w-3" /> Cool-down
              </span>
              <p className="mt-1 text-sm">End each session with static stretches held for 15-30 seconds per muscle group. Deep breathing helps lower heart rate gradually. Hydration and light mobility work aid recovery.</p>
            </div>
          </div>
        </AccordionSection>

        {/* Competition Pathway */}
        <AccordionSection title="Competition Pathway" icon={Trophy}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">District</Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">State</Badge>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">National</Badge>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">International</Badge>
              {olympicSport && (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Olympics</Badge>
              )}
              <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 border-rose-500/20">Asian Games</Badge>
            </div>
            {staticContent?.competitions && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {staticContent.competitions.state && staticContent.competitions.state.length > 0 && (
                  <div className="bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase">District / State</span>
                    <ul className="mt-1 space-y-0.5">
                      {staticContent.competitions.state.slice(0, 3).map((c) => (
                        <li key={c} className="text-xs flex items-start gap-1">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {staticContent.competitions.national && staticContent.competitions.national.length > 0 && (
                  <div className="bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase">National</span>
                    <ul className="mt-1 space-y-0.5">
                      {staticContent.competitions.national.slice(0, 3).map((c) => (
                        <li key={c} className="text-xs flex items-start gap-1">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {staticContent.competitions.international && staticContent.competitions.international.length > 0 && (
                  <div className="bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase">International</span>
                    <ul className="mt-1 space-y-0.5">
                      {staticContent.competitions.international.slice(0, 3).map((c) => (
                        <li key={c} className="text-xs flex items-start gap-1">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <p className="text-muted-foreground text-xs">Progress from local tournaments to national championships and international representation through consistent training and competitive performance.</p>
          </div>
        </AccordionSection>

        {/* Common Injuries & Recovery */}
        <AccordionSection title="Common Injuries & Recovery" icon={AlertTriangle}>
          <div className="flex flex-col gap-2">
            <div className="bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Common Injuries</span>
              <p className="mt-1 text-sm">Common {name.toLowerCase()} injuries include sprains, strains, and overuse injuries depending on the intensity of play. Proper warm-up, technique, and rest days help prevent most issues.</p>
            </div>
            <div className="bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Recovery Tips</span>
              <p className="mt-1 text-sm">Rest, ice, compression, and elevation (RICE) for acute injuries. Gradual return to play after full recovery. Work with a sports physiotherapist for personalized rehabilitation.</p>
            </div>
          </div>
        </AccordionSection>

        {/* Why Choose This Sport */}
        <AccordionSection title={`Why Choose ${name}`} icon={Sparkles}>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {staticContent?.tagline || `${name} offers a unique combination of physical fitness, mental development, and competitive opportunities.`}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {staticContent?.benefits?.physical && staticContent.benefits.physical.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Heart className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span className="font-medium">Physical Development</span>
                    <p className="text-muted-foreground text-xs">Build {staticContent.benefits.physical.slice(0, 2).join(', ').toLowerCase()}</p>
                  </div>
                </div>
              )}
              {staticContent?.benefits?.mental && staticContent.benefits.mental.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Brain className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span className="font-medium">Mental Growth</span>
                    <p className="text-muted-foreground text-xs">Develop {staticContent.benefits.mental.slice(0, 2).join(', ').toLowerCase()}</p>
                  </div>
                </div>
              )}
              {olympicSport && (
                <div className="flex items-start gap-2 text-sm">
                  <Medal className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span className="font-medium">Olympic Sport</span>
                    <p className="text-muted-foreground text-xs">Compete at the highest international level</p>
                  </div>
                </div>
              )}
              {beginnerFriendly && (
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span className="font-medium">Beginner Friendly</span>
                    <p className="text-muted-foreground text-xs">Easy to start with minimal prior experience</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {(popularityInIndia || popularityWorldwide) && (
          <AccordionSection title="Popularity" icon={Medal}>
            {popularityInIndia && (
              <div className="mb-2 bg-muted/30 rounded-lg border p-3">
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
          </AccordionSection>
        )}

        {staticContent?.funFacts && staticContent.funFacts.length > 0 && (
          <AccordionSection title="Fun Facts" icon={Lightbulb}>
            <div className="flex flex-col gap-2">
              {staticContent.funFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 text-xs">•</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {staticContent?.faqs && staticContent.faqs.length > 0 && (
          <AccordionSection title="FAQs" icon={HelpCircle}>
            <div className="flex flex-col gap-3">
              {staticContent.faqs.map((faq, i) => (
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
        </div>
      </div>
    </div>
  );
}
