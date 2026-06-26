import type { Facility, TrainingLevel } from '@/types/domain/academy';
import type { SportCategory } from '@/types/domain/sport';

export interface FilterOption<TValue extends string = string> {
  value: TValue;
  label: string;
  count?: number;
}

export const academyFilterFacilities: FilterOption<Facility>[] = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'ground', label: 'Ground' },
  { value: 'court', label: 'Court' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'gym', label: 'Gym' },
  { value: 'physio', label: 'Physio' },
  { value: 'parking', label: 'Parking' },
  { value: 'changing_room', label: 'Changing rooms' },
];

export const academyFilterLevels: FilterOption<TrainingLevel>[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
];

export const sportCategories: FilterOption<SportCategory>[] = [
  { value: 'Indoor', label: 'Indoor' },
  { value: 'Outdoor', label: 'Outdoor' },
  { value: 'Both', label: 'Both' },
];

export const verificationStatuses = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'unverified', label: 'Unverified' },
] as const;
