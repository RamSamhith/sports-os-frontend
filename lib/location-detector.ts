/**
 * Location detector — extracts Indian + global locations from email text.
 *
 * Pure frontend logic. No external API calls.
 * Uses regex-based NLP to find city names, state names, pincodes, and
 * street-level address patterns in email content.
 */

// ─── Data ──────────────────────────────────────────────────────

const INDIAN_CITIES = [
  'Hyderabad', 'Secunderabad', 'Mumbai', 'Delhi', 'New Delhi', 'Bangalore',
  'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur',
  'Vijayawada', 'Visakhapatnam', 'Vizag', 'Warangal', 'Tirupati', 'Guntur',
  'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Karimnagar', 'Nizamabad',
  'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar',
  'Coimbatore', 'Madurai', 'Kochi', 'Cochin', 'Trivandrum',
  'Thiruvananthapuram', 'Mysore', 'Mysuru', 'Mangalore', 'Chandigarh',
  'Gurgaon', 'Gurugram', 'Noida', 'Goa', 'Bhubaneswar', 'Ranchi',
  'Raipur', 'Dehradun', 'Shimla', 'Guwahati', 'Jodhpur', 'Udaipur',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
  'Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana',
  'Uttar Pradesh', 'Bihar', 'West Bengal', 'Odisha', 'Madhya Pradesh',
  'Chhattisgarh', 'Jharkhand', 'Assam', 'Goa', 'Delhi', 'Uttarakhand',
  'Himachal Pradesh', 'Jammu and Kashmir',
];

const GLOBAL_CITIES = [
  'New York', 'London', 'San Francisco', 'Los Angeles', 'Chicago',
  'Singapore', 'Dubai', 'Toronto', 'Sydney', 'Tokyo', 'Seattle', 'Boston',
  'Austin', 'Berlin', 'Paris', 'Amsterdam', 'Hong Kong',
];

// ─── Compiled patterns ─────────────────────────────────────────

const ALL_PLACE_NAMES = [...INDIAN_CITIES, ...INDIAN_STATES, ...GLOBAL_CITIES];

/** Build regex with word boundaries; longest names first to avoid partial matches. */
const PLACE_REGEX = new RegExp(
  '\\b(' +
    ALL_PLACE_NAMES
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') +
    ')\\b',
  'gi',
);

const PINCODE_REGEX = /\b\d{6}\b/g;

const ADDRESS_LINE_REGEX =
  /\b([A-Za-z0-9.,#\-\/ ]{0,40}(street|st\.|road|rd\.|nagar|colony|sector|lane|apartment|flat|plot|floor|block|society|enclave|layout)[A-Za-z0-9.,#\-\/ ]{0,40})\b/gi;

// ─── Types ─────────────────────────────────────────────────────

export interface LocationDetection {
  places: string[];
  pincodes: string[];
  addressLines: string[];
  hasLocation: boolean;
}

export interface EmailLocationResult extends LocationDetection {
  id: string;
  subject: string;
  from?: string;
  snippet?: string;
}

export interface LocationGroup {
  name: string;
  count: number;
  emails: Array<{ id: string; subject: string }>;
}

export interface LocationSummary {
  perEmail: EmailLocationResult[];
  grouped: LocationGroup[];
}

// ─── Helpers ───────────────────────────────────────────────────

function uniqueCaseInsensitive(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of arr) {
    const key = item.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item.trim());
    }
  }
  return out;
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Detect locations inside a block of text (subject + snippet + body).
 */
export function detectLocations(text: string): LocationDetection {
  if (!text || typeof text !== 'string') {
    return { places: [], pincodes: [], addressLines: [], hasLocation: false };
  }

  const places: string[] = [];
  let match: RegExpExecArray | null;
  PLACE_REGEX.lastIndex = 0;
  while ((match = PLACE_REGEX.exec(text)) !== null) {
    places.push(match[1]);
  }

  const pincodeMatches = text.match(PINCODE_REGEX) || [];

  const addressLines: string[] = [];
  let addrMatch: RegExpExecArray | null;
  ADDRESS_LINE_REGEX.lastIndex = 0;
  while ((addrMatch = ADDRESS_LINE_REGEX.exec(text)) !== null) {
    addressLines.push(addrMatch[0].trim());
  }

  const cleanedPlaces = uniqueCaseInsensitive(places);
  const cleanedAddressLines = uniqueCaseInsensitive(addressLines).slice(0, 5);
  const cleanedPincodes = uniqueCaseInsensitive(pincodeMatches);

  return {
    places: cleanedPlaces,
    pincodes: cleanedPincodes,
    addressLines: cleanedAddressLines,
    hasLocation:
      cleanedPlaces.length > 0 ||
      cleanedPincodes.length > 0 ||
      cleanedAddressLines.length > 0,
  };
}

/**
 * Run detection across many emails and build a grouped summary
 * (location name → list of email ids/subjects mentioning it).
 */
export function summarizeLocations(
  emailsWithText: Array<{ id: string; subject: string; text: string }>,
): LocationSummary {
  const grouped: Record<string, LocationGroup> = {};

  const perEmail = emailsWithText.map(({ id, subject, text }) => {
    const result = detectLocations(text);
    result.places.forEach((place) => {
      const key = place.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = { name: place, count: 0, emails: [] };
      }
      grouped[key].count += 1;
      grouped[key].emails.push({ id, subject });
    });
    return { id, subject, ...result };
  });

  const groupedArray = Object.values(grouped).sort((a, b) => b.count - a.count);

  return { perEmail, grouped: groupedArray };
}
