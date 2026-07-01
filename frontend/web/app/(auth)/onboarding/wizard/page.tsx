'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { WizardShell } from '@/components/onboarding/wizard-shell';
import { LocationPicker } from '@/components/ui/location-picker';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding, type OnboardingData, type SkillLevel } from '@/lib/hooks/use-onboarding';
import { useChildren } from '@/lib/hooks/use-children';
import { saveOnboarding } from '@/lib/api/auth';
import { createAcademy, type CreateAcademyPayload } from '@/lib/api/academies';
import { createCoach, type CreateCoachPayload } from '@/lib/api/coaches';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { parseLocationInput } from '@/lib/utils/location-parser';
import type { Facility, TrainingLevel } from '@/types/domain/academy';

const ATHLETE_STEPS = ['Age', 'Gender', 'Location', 'Sports', 'Skill', 'Goals'];
const PARENT_STEPS = ["Child's Name", "Child's Age", 'Location', 'Sports', 'Skill'];
const COACH_STEPS = ['Name', 'Location', 'Sports', 'Skill', 'Experience', 'Bio'];
const ACADEMY_STEPS = ['Location', 'Sports', 'Name', 'About', 'Facilities', 'Contact'];

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

const FACILITY_OPTIONS: { label: string; value: Facility }[] = [
  { label: 'Indoor Court', value: 'indoor' },
  { label: 'Outdoor Court', value: 'outdoor' },
  { label: 'Gym / Fitness Center', value: 'gym' },
  { label: 'Swimming Pool', value: 'physio' },
  { label: 'Artificial Turf', value: 'ground' },
  { label: 'Track & Field', value: 'ground' },
  { label: 'Shooting Range', value: 'equipment' },
  { label: 'Archery Range', value: 'equipment' },
  { label: 'Recovery Room', value: 'physio' },
  { label: 'Cafeteria', value: 'changing_room' },
  { label: 'Parking', value: 'parking' },
  { label: 'Hostel / Dormitory', value: 'changing_room' },
];

const TRAINING_LEVELS: { value: TrainingLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Professional' },
];

export default function OnboardingWizardPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingWizardContent />
    </Suspense>
  );
}

function OnboardingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const { isAuthenticated, isLoading, role, verified, completeOnboarding: markAuthComplete, setOnboarding } = useAuth();
  const { completed, athleteData, parentData, completeOnboarding, updateOnboardingData, hydrated } = useOnboarding();
  const { children, addChild } = useChildren();
  const isParent = role === 'parent';
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('');
  const [goals, setGoals] = useState('');
  const [childName, setChildName] = useState('');

  // Academy form state
  const [academyName, setAcademyName] = useState('');
  const [academyDescription, setAcademyDescription] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [trainingLevels, setTrainingLevels] = useState<TrainingLevel[]>(['beginner', 'intermediate']);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');

  // Coach form state
  const [coachName, setCoachName] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [coachBio, setCoachBio] = useState('');

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

  const steps = isParent ? PARENT_STEPS : role === 'coach' ? COACH_STEPS : role === 'academy_owner' ? ACADEMY_STEPS : ATHLETE_STEPS;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!role) {
      router.replace('/onboarding/role');
      return;
    }
    if (completed && !isEdit) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, verified, role, completed, isEdit, router]);

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
    if (role === 'coach') {
      switch (step) {
        case 0: return coachName.trim().length >= 1;
        case 1: return location.trim().length >= 1;
        case 2: return sports.length > 0;
        case 3: return skillLevel !== '';
        case 4: return experienceYears !== '' && Number(experienceYears) >= 0;
        case 5: return true;
        default: return false;
      }
    }
    if (role === 'academy_owner') {
      switch (step) {
        case 0: return location.trim().length >= 1;
        case 1: return sports.length > 0;
        case 2: return academyName.trim().length >= 2;
        case 3: return true;
        case 4: return facilities.length > 0;
        case 5: return true;
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
  }, [step, isParent, role, age, gender, location, sports, skillLevel, childName, academyName, facilities, experienceYears, coachName]);

  async function handleComplete() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let data: OnboardingData;
    if (isParent) {
      data = {
        parent: {
          childName: childName.trim(),
          childAge: Number(age),
          location: location.trim(),
          sportInterests: sports,
          skillLevel: skillLevel as SkillLevel,
        },
      };
    } else if (role === 'coach') {
      data = {
        athlete: {
          age: 0,
          gender: 'prefer_not_to_say' as const,
          location: location.trim(),
          sportInterests: sports,
          skillLevel: skillLevel as SkillLevel,
          goals: coachBio.trim(),
        },
      };
    } else if (role === 'academy_owner') {
      data = {
        athlete: {
          age: 0,
          gender: 'prefer_not_to_say' as const,
          location: location.trim(),
          sportInterests: sports,
          skillLevel: 'intermediate' as SkillLevel,
          goals: '',
        },
      };
    } else {
      data = {
        athlete: {
          age: Number(age),
          gender: gender as OnboardingData['athlete'] extends undefined ? never : NonNullable<OnboardingData['athlete']>['gender'],
          location: location.trim(),
          sportInterests: sports,
          skillLevel: skillLevel as SkillLevel,
          goals: goals.trim(),
        },
      };
    }

    // Save onboarding data locally
    if (isEdit) {
      updateOnboardingData(data);
    } else {
      completeOnboarding(data);
      markAuthComplete();

      const onboardingUpdate: Record<string, unknown> = {
        sportInterests: sports,
        skillLevel: skillLevel as string,
        location: location.trim(),
      };
      if (isParent) {
        onboardingUpdate.children = [{
          name: childName.trim(),
          age: Number(age),
          sportInterests: sports,
          skillLevel: skillLevel as string,
        }];
      } else if (role !== 'coach' && role !== 'academy_owner') {
        onboardingUpdate.age = Number(age);
        onboardingUpdate.gender = gender;
        onboardingUpdate.goals = goals.trim();
      }
      setOnboarding(onboardingUpdate as Parameters<typeof setOnboarding>[0]);

      saveOnboarding({
        role: role || undefined,
        age: isParent || role === 'coach' || role === 'academy_owner' ? undefined : Number(age),
        gender: isParent || role === 'coach' || role === 'academy_owner' ? undefined : gender || undefined,
        sportInterests: sports,
        skillLevel: skillLevel as string || undefined,
        goals: role === 'coach' || role === 'academy_owner' ? goals.trim() || undefined : isParent ? undefined : goals.trim() || undefined,
        location: location.trim() || undefined,
        children: isParent ? [{
          name: childName.trim(),
          age: Number(age),
          sportInterests: sports,
          skillLevel: skillLevel as string || undefined,
        }] : undefined,
      }).catch(() => { /* non-blocking */ });

      if (isParent && data.parent && children.length === 0) {
        addChild({
          name: data.parent.childName,
          age: data.parent.childAge,
          sport: data.parent.sportInterests[0] ?? '',
          skillLevel: data.parent.skillLevel,
        });
      }

      // Auto-create academy or coach record via API
      if (role === 'academy_owner') {
        const locationData = parseLocationInput(location.trim());
        const payload: CreateAcademyPayload = {
          name: academyName.trim(),
          description: academyDescription.trim() || undefined,
          location: locationData,
          contact: {
            phone: contactPhone.trim() || undefined,
            email: contactEmail.trim() || undefined,
            website: contactWebsite.trim() || undefined,
          },
          sportsOffered: sports,
          facilities: facilities,
          trainingLevels: trainingLevels,
        };
        createAcademy(payload).catch(() => { /* non-blocking */ });
      }

      if (role === 'coach') {
        const locationData = parseLocationInput(location.trim());
        const payload: CreateCoachPayload = {
          name: coachName.trim(),
          sportsCoached: sports,
          specialization: sports,
          experienceYears: Number(experienceYears) || 0,
          bio: coachBio.trim() || undefined,
          location: locationData,
          contact: {
            phone: undefined,
            email: undefined,
          },
        };
        createCoach(payload).catch(() => { /* non-blocking */ });
      }
    }

    router.push(isEdit ? '/profile/personal' : '/');
  }

  function toggleSport(slug: string) {
    setSports((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  const titles: Record<number, string> = {
    0: isParent ? "What's your child's name?" : role === 'coach' ? "What's your name?" : role === 'academy_owner' ? 'Where is your academy?' : 'How old are you?',
    1: isParent ? "How old is your child?" : role === 'coach' ? 'Where are you based?' : role === 'academy_owner' ? 'Which sports do you offer?' : 'What is your gender?',
    2: role === 'academy_owner' ? "What's the academy name?" : role === 'coach' ? 'Which sports do you coach?' : 'Where are you located?',
    3: role === 'academy_owner' ? 'Tell us about your academy' : role === 'coach' ? "What's your skill level?" : 'Which sports interest you?',
    4: role === 'academy_owner' ? 'What facilities do you offer?' : role === 'coach' ? 'Years of experience?' : "What's your skill level?",
    5: role === 'academy_owner' ? 'Contact details (optional)' : role === 'coach' ? 'Short bio' : 'Any goals in mind?',
  };

  const subtitles: Record<number, string | undefined> = {
    0: isParent ? undefined : role === 'coach' ? 'This will appear on your coach profile.' : undefined,
    1: isParent ? 'This helps us recommend age-appropriate programs.' : role === 'coach' ? 'We use this to find nearby athletes.' : undefined,
    2: role === 'academy_owner' ? 'This is how athletes will identify your academy.' : role === 'coach' ? 'Select all that apply.' : 'We use this to find nearby academies and coaches.',
    3: role === 'academy_owner' ? 'Brief description of your academy (optional).' : role === 'coach' ? undefined : 'Select all that apply.',
    4: role === 'academy_owner' ? 'Select at least one facility type.' : role === 'coach' ? 'Optional — tell athletes about yourself.' : undefined,
    5: role === 'academy_owner' ? 'Help athletes reach you.' : role === 'coach' ? 'Optional — helps athletes know you better.' : 'Optional — helps us personalise your experience.',
  };

  if (isLoading || !hydrated || (completed && !isEdit)) return null;

  return (
    <WizardShell
      currentStep={step}
      totalSteps={steps.length}
      stepLabels={steps}
      title={titles[step] ?? ''}
      subtitle={subtitles[step]}
      onNext={() => {
        if (!canNext()) return;
        if (step < steps.length - 1) {
          setStep((s) => s + 1);
        } else {
          handleComplete();
        }
      }}
      onBack={() => { if (step > 0) setStep((s) => s - 1); }}
      canNext={canNext() && !isSubmitting}
      isLastStep={step === steps.length - 1}
    >
      <div className="flex flex-col gap-4">
        {/* Step 0: Age / Child Name / Location (coach/academy) */}
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

        {step === 0 && !isParent && role !== 'coach' && role !== 'academy_owner' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-age">Your age</Label>
            <Input
              id="wizard-age"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={3}
              max={80}
              placeholder="e.g. 14"
              value={age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val === '' || (Number(val) >= 0 && Number(val) <= 120)) {
                  setAge(val)
                }
              }}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {step === 0 && (role === 'academy_owner') && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-location">City</Label>
            <LocationPicker
              value={location}
              onChange={setLocation}
              placeholder="e.g. Bengaluru"
            />
          </div>
        )}

        {step === 0 && role === 'coach' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-coach-name">Your name</Label>
            <Input
              id="wizard-coach-name"
              placeholder="e.g. Priya Sharma"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {/* Step 1: Gender (athlete) / Child Age (parent) / Location (coach) / Sports (academy) */}
        {step === 1 && role === 'coach' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-location">City</Label>
            <LocationPicker
              value={location}
              onChange={setLocation}
              placeholder="e.g. Bengaluru"
            />
          </div>
        )}

        {/* Step 1: Gender (athlete) / Child Age (parent) / Sports (coach/academy) */}
        {step === 1 && !isParent && role !== 'coach' && role !== 'academy_owner' && (
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={3}
              max={18}
              placeholder="e.g. 8"
              value={age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val === '' || (Number(val) >= 0 && Number(val) <= 120)) {
                  setAge(val)
                }
              }}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {step === 1 && role === 'academy_owner' && (
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

        {/* Step 2: Location (athlete/parent) / Sports (coach) / Academy Name */}
        {step === 2 && role !== 'coach' && role !== 'academy_owner' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-location">City</Label>
            <LocationPicker
              value={location}
              onChange={setLocation}
              placeholder="e.g. Bengaluru"
            />
          </div>
        )}

        {step === 2 && role === 'coach' && (
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

        {step === 2 && role === 'academy_owner' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-academy-name">Academy name</Label>
            <Input
              id="wizard-academy-name"
              placeholder="e.g. Champions Sports Academy"
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {/* Step 3: Sports (athlete/parent) / Experience (coach) / Description (academy) */}
        {step === 3 && role !== 'coach' && (
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

        {/* Step 3: Sports (athlete/parent) / Skill (coach) / Description (academy) */}
        {step === 3 && role === 'coach' && (
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

        {step === 3 && role === 'academy_owner' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-academy-desc">About your academy</Label>
            <Textarea
              id="wizard-academy-desc"
              placeholder="Tell athletes what makes your academy special..."
              value={academyDescription}
              onChange={(e) => setAcademyDescription(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {/* Step 4: Skill Level (athlete/parent) / Bio (coach) / Facilities (academy) */}
        {step === 4 && !isParent && (
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

        {step === 4 && role === 'coach' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-experience">Years of coaching experience</Label>
            <Input
              id="wizard-experience"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={50}
              placeholder="e.g. 5"
              value={experienceYears}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val === '' || (Number(val) >= 0 && Number(val) <= 50)) {
                  setExperienceYears(val)
                }
              }}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}

        {step === 4 && role === 'academy_owner' && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select facilities">
            {FACILITY_OPTIONS.map((f) => {
              const active = facilities.includes(f.value);
              return (
                <Badge
                  key={f.value}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  aria-label={f.label}
                  tabIndex={0}
                  onClick={() => {
                    setFacilities((prev) =>
                      prev.includes(f.value) ? prev.filter((x) => x !== f.value) : [...prev, f.value],
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setFacilities((prev) =>
                        prev.includes(f.value) ? prev.filter((x) => x !== f.value) : [...prev, f.value],
                      );
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {f.label}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Step 5: Goals (athlete) / Bio (coach) / Contact (academy) */}
        {step === 5 && role === 'coach' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wizard-bio">Short bio</Label>
            <Textarea
              id="wizard-bio"
              placeholder="e.g. Certified tennis coach with 5 years of experience training juniors..."
              value={coachBio}
              onChange={(e) => setCoachBio(e.target.value)}
              rows={3}
              autoFocus
            />
          </div>
        )}

        {step === 5 && !isParent && role !== 'coach' && (
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

        {step === 5 && role === 'academy_owner' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wizard-contact-phone">Phone number</Label>
              <Input
                id="wizard-contact-phone"
                type="tel"
                placeholder="e.g. 9876543210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wizard-contact-email">Email</Label>
              <Input
                id="wizard-contact-email"
                type="email"
                placeholder="e.g. contact@championsacademy.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wizard-contact-website">Website</Label>
              <Input
                id="wizard-contact-website"
                type="url"
                placeholder="e.g. https://championsacademy.com"
                value={contactWebsite}
                onChange={(e) => setContactWebsite(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </WizardShell>
  );
}
