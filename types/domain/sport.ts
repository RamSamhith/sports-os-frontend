export type SportCategory = 'Indoor' | 'Outdoor' | 'Both';

export type SportType = 'team' | 'individual' | 'both';

export type SportStatus = 'published' | 'draft';

export type InjuryRisk = 'Low' | 'Medium' | 'High';

export type FitnessLevel = 'Low' | 'Medium' | 'High';

export type AgeGroup = 'Kids' | 'Teens' | 'Adults' | 'Seniors';

export type Season = 'All Year' | 'Seasonal';

export type ParticipationType = 'Individual' | 'Team' | 'Both';

export interface Tournament {
  tournamentName: string;
  level: 'International' | 'National';
  organizer: string;
  frequency: string;
  shortDescription: string;
}

export interface CompetitionPathway {
  levels: Array<{
    key: 'district' | 'state' | 'national' | 'international';
    label: string;
    description?: string;
  }>;
}

export interface ExplorationGuidance {
  ageSuitability?: { min?: number; max?: number };
  physicalRequirements?: string[];
  notes?: string;
}

export interface Sport {
  id: string;
  slug: string;
  name: string;
  category: SportCategory;
  sportType: SportType;
  description?: string;
  shortDescription: string;
  fullDescription: string;
  origin: string;
  popularityInIndia: string;
  popularityWorldwide: string;
  icon: string;
  coverImage: string;

  howToPlay: string;
  objectiveOfGame: string;
  teamSize: string;
  matchDuration: string;
  scoringSystem: string;
  playingSurface: string;
  requiredEquipment: string[];
  ageGroups: string;
  beginnerFriendly: boolean;
  olympicSport: boolean;

  estimatedMonthlyCost: string;
  playingSeason: Season;
  trainingFrequency: string;
  averageLearningTime: string;
  injuryRisk: InjuryRisk;
  fitnessLevelRequired: FitnessLevel;
  suitableFor: AgeGroup[];
  individualOrTeam: ParticipationType;
  indoorOutdoor: SportCategory;

  physicalBenefits: string[];
  mentalBenefits: string[];
  skillsDeveloped: string[];

  careerOpportunities: string[];
  scholarships: string[];
  professionalLeagues: string[];

  tournaments: Tournament[];

  competitionPathway: CompetitionPathway;
  explorationGuidance?: ExplorationGuidance;
  status: SportStatus;
}
