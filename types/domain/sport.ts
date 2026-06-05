export type SportCategory =
  | 'team'
  | 'individual'
  | 'combat'
  | 'racquet'
  | 'aquatic'
  | 'athletics'
  | 'other';

export type SportStatus = 'published' | 'draft';

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
  description: string;
  icon?: string;
  coverImage?: string;
  category: SportCategory;
  competitionPathway: CompetitionPathway;
  explorationGuidance?: ExplorationGuidance;
  status: SportStatus;
}
