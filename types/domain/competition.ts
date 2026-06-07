export type CompetitionLevel = 'district' | 'state' | 'national' | 'international';

export interface Competition {
  id: string;
  sportSlug: string;
  name: string;
  level: CompetitionLevel;
  organiser: string;
  whatIs: string;
  whyImportant: string;
  progression: string;
}
