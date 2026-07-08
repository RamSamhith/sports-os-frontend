export type Radius = 5 | 10 | 15 | 25;

export type LocationSource = 'gps' | 'manual' | 'ip';

export interface LocationSummary {
  address?: string;
  city: string;
  state: string;
  country: string;
  district?: string;
  lat: number;
  lng: number;
  pincode?: string;
  geohash?: string;
}

export interface LocationCache {
  userId: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  source: LocationSource;
  updatedAt: string;
}
