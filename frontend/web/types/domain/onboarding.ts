export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive';

export interface AthleteOnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location: string;
  sportInterests: string[];
  skillLevel: SkillLevel;
}

export interface ParentOnboardingData {
  childName: string;
  childAge: number;
  location: string;
  sportInterests: string[];
  skillLevel: SkillLevel;
}

export interface OnboardingData {
  athlete?: AthleteOnboardingData;
  parent?: ParentOnboardingData;
}

export interface OnboardingState {
  completed: boolean;
  data: OnboardingData;
}
