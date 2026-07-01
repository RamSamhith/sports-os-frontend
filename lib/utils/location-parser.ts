import type { LocationSummary } from '@/types/domain/location';

const CITY_COORDS: Record<string, { lat: number; lng: number; state: string }> = {
  'bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'mumbai': { lat: 19.076, lng: 72.8777, state: 'Maharashtra' },
  'delhi': { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.209, state: 'Delhi' },
  'hyderabad': { lat: 17.385, lng: 78.4867, state: 'Telangana' },
  'chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  'bhopal': { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  'patna': { lat: 25.6093, lng: 85.1376, state: 'Bihar' },
  'indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  'nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  'kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  'guwahati': { lat: 26.1445, lng: 91.7362, state: 'Assam' },
  'dehradun': { lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
  'raipur': { lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
  'ranchi': { lat: 23.3441, lng: 85.3096, state: 'Jharkhand' },
  'noida': { lat: 28.5355, lng: 77.391, state: 'Uttar Pradesh' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'gurugram': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'mohali': { lat: 30.6942, lng: 76.7179, state: 'Punjab' },
};

export function parseLocationInput(cityInput: string): LocationSummary {
  const city = cityInput.trim();
  const key = city.toLowerCase();
  const coords = CITY_COORDS[key];

  return {
    city,
    state: coords?.state ?? 'India',
    country: 'India',
    lat: coords?.lat ?? 20.5937,
    lng: coords?.lng ?? 78.9629,
    address: city,
  };
}
