'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { WizardShell } from '@/components/onboarding/wizard-shell';
import { LocationPicker } from '@/components/ui/location-picker';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding, type OnboardingData, type SkillLevel } from '@/lib/hooks/use-onboarding';
import { useChildren } from '@/lib/hooks/use-children';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ATHLETE_STEPS = ['Age', 'Gender', 'Location', 'Sports', 'Skill', 'Goals'];
const PARENT_STEPS = ["Child's Name", "Child's Age", 'Location', 'Sports', 'Skill'];

const SKILL_LEVELS: { value: SkillLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', description: 'Played for a while' },
  { value: 'advanced', label: 'Advanced', description: 'Competitive level' },
  { value: 'competitive', label: 'Competitive', description: 'Tournament / elite' },
];

const GENDER_OPTIONS = [
  { value: 'male' as const, label: 'Male' },
  { value: 'female' as const, label: 'Female' },
  { value: 'other' as const, label: 'Other' },
  { value: 'prefer_not_to_say' as const, label: 'Prefer not to say' },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const { isAuthenticated, isLoading, role, completeOnboarding: markAuthComplete } = useAuth();
  const { completed, athleteData, parentData, completeOnboarding, updateOnboardingData, hydrated } = useOnboarding();
  const { children, addChild } = useChildren();
  const isParent = role === 'parent';
  const [step, setStep] = useState(0);

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('');
  const [goals, setGoals] = useState('');
  const [childName, setChildName] = useState('');

  // Pre-fill from existing onboarding data (edit mode)
  useEffect(() => {
    if (isEdit && completed) {
      if (isParent && parentData) {
        setChildName(parentData.childName);
        setAge(String(parentData.childAge));
        setLocation(parentData.location);
        setSports(parentData.sportInterests);
        setSkillLevel(parentData.skillLevel);
      } else if (!isParent && athleteData) {
        setAge(String(athleteData.age));
        setGender(athleteData.gender);
        setLocation(athleteData.location);
        setSports(athleteData.sportInterests);
        setSkillLevel(athleteData.skillLevel);
        setGoals(athleteData.goals);
      }
    }
  }, [isEdit, completed, isParent, parentData, athleteData]);

  const steps = isParent ? PARENT_STEPS : ATHLETE_STEPS;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!role) {
      router.replace('/onboarding/role');
    } else if (completed && !isEdit) {
      router.replace('/profile/personal');
    }
  }, [isLoading, isAuthenticated, role, completed, isEdit, router]);

  const canNext = useCallback(() => {
    if (isParent) {
      switch (step) {
        case 0: return childName.trim().length >= 1;
        case 1: return age !== '' && Number(age) >= 3 && Number(age) <= 18;
        case 2: return location.trim().length >= 1;
        case 3: return sports.length > 0;
        case 4: return skillLevel !== '';
        default: return false;
      }
    }
    switch (step) {
      case 0: return age !== '' && Number(age) >= 3 && Number(age) <= 80;
      case 1: return gender !== '';
      case 2: return location.trim().length >= 1;
      case 3: return sports.length > 0;
      case 4: return skillLevel !== '';
      case 5: return true;
      default: return false;
    }
  }, [step, isParent, age, gender, location, sports, skillLevel, childName]);

  function handleNext() {
    if (!canNext()) return;
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleComplete() {
    const data: OnboardingData = isParent
      ? {
          parent: {
            childName: childName.trim(),
            childAge: Number(age),
            location: location.trim(),
            sportInterests: sports,
            skillLevel: skillLevel as SkillLevel,
          },
        }
      : {
          athlete: {
            age: Number(age),
            gender: gender as OnboardingData['athlete'] extends undefined ? never : NonNullable<OnboardingData['athlete']>['gender'],
            location: location.trim(),
            sportInterests: sports,
            skillLevel: skillLevel as SkillLevel,
            goals: goals.trim(),
          },
        };

    if (isEdit) {
      updateOnboardingData(data);
      router.push('/profile/personal');
    } else {
      completeOnboarding(data);
      markAuthComplete();
      // Auto-create child from onboarding data for parent role
      if (isParent && data.parent && children.length === 0) {
        addChild({
          name: data.parent.childName,
          age: data.parent.childAge,
          sport: data.parent.sportInterests[0] ?? '',
          skillLevel: data.parent.skillLevel,
        });
      }
      router.push('/profile/personal');
    }
  }

  function toggleSport(slug: string) {
    setSports((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  const titles: Record<number, string> = {
    0: isParent ? "What's your child's name?" : 'How old are you?',
    1: isParent ? "How old is your child?" : 'What is your gender?',
    2: 'Where are you located?',
    3: 'Which sports interest you?',
    4: "What's your skill level?",
    5: 'Any goals in mind?',
  };

  const subtitles: Record<number, string | undefined> = {
    0: undefined,
    1: isParent ? 'This helps us recommend age-appropriate programs.' : undefined,
    2: 'We use this to find nearby academies and coaches.',
    3: 'Select all that apply.',
    4: undefined,
    5: 'Optional — helps us personalise your experience.',
  };

  if (isLoading || !hydrated || (completed && !isEdit)) return null;

  return (
    <WizardShell
      currentStep={step}
      totalSteps={steps.length}
      stepLabels={steps}
      title={titles[step] ?? ''}
      subtitle={subtitles[step]}
      onNext={handleNext}
      onBack={handleBack}
      canNext={canNext()}
      isLastStep={step === steps.length - 1}
    >
      <div className="flex flex-col gap-4">
        {/* Step 0: Age / Child Name */}
        {step === 0 && isParent && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-child-name">Child&apos;s name</Label>
            <Input
              id="wizard-child-name"
              placeholder="e.g. Aarav"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {step === 0 && !isParent && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-age">Your age</Label>
            <Input
              id="wizard-age"
              type="number"
              min={3}
              max={80}
              placeholder="e.g. 14"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 1: Gender (athlete) / Child Age (parent) */}
        {step === 1 && !isParent && (
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Select gender">
            {GENDER_OPTIONS.map((opt) => {
              const isSelected = gender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setGender(opt.value)}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/60 bg-background/60 text-muted-foreground hover:border-primary/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    {opt.label}
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && isParent && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-child-age">Child&apos;s age</Label>
            <Input
              id="wizard-child-age"
              type="number"
              min={3}
              max={18}
              placeholder="e.g. 8"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-location">City</Label>
            <LocationPicker
              value={location}
              onChange={setLocation}
              placeholder="e.g. Bengaluru"
            />
          </div>
        )}

        {/* Step 3: Sports */}
        {step === 3 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select sports">
            {sportTaxonomy.map((s) => {
              const active = sports.includes(s.slug);
              return (
                <Badge
                  key={s.slug}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  aria-label={s.name}
                  tabIndex={0}
                  onClick={() => toggleSport(s.slug)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleSport(s.slug);
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {s.name}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Step 4: Skill Level */}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Select skill level">
            {SKILL_LEVELS.map((level) => {
              const isSelected = skillLevel === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSkillLevel(level.value)}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-left transition-all',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border/60 bg-background/60 hover:border-primary/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-sm font-medium', isSelected ? 'text-primary' : 'text-foreground')}>
                      {level.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="text-muted-foreground text-xs">{level.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 5: Goals (athlete only) */}
        {step === 5 && !isParent && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-goals">Your goals</Label>
            <Input
              id="wizard-goals"
              placeholder="e.g. Join a competitive football team"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>
    </WizardShell>
  );
}
