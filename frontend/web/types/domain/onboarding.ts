export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive';

export type BudgetRange = 'free' | 'budget' | 'moderate' | 'premium' | 'elite';
export type TrainingFrequency = 'occasional' | 'weekly' | 'regular' | 'daily';
export type CompetitionLevel = 'recreational' | 'local' | 'state' | 'national' | 'international';

export interface AthleteOnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location: string;
  sportInterests: string[];
  skillLevel: SkillLevel;
  goals: string;
  budget: BudgetRange;
  trainingFrequency: TrainingFrequency;
  competitionLevel: CompetitionLevel;
}

export interface ParentOnboardingData {
  childName: string;
  childAge: number;
  location: string;
  sportInterests: string[];
  skillLevel: SkillLevel;
  budget: BudgetRange;
  trainingFrequency: TrainingFrequency;
  competitionLevel: CompetitionLevel;
}

export interface OnboardingData {
  athlete?: AthleteOnboardingData;
  parent?: ParentOnboardingData;
}

export interface OnboardingState {
  completed: boolean;
  data: OnboardingData;
}
