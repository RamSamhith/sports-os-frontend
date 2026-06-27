// lib/locationDetector.js
// Detects Indian + major global locations mentioned inside email text.

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

const ALL_PLACE_NAMES = [...INDIAN_CITIES, ...INDIAN_STATES, ...GLOBAL_CITIES];

// Build one regex with word boundaries, longest names first so "New Delhi"
// matches before "Delhi" alone.
const PLACE_REGEX = new RegExp(
  '\\b(' +
    ALL_PLACE_NAMES
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') +
  ')\\b',
  'gi'
);

const PINCODE_REGEX = /\b\d{6}\b/g;

const ADDRESS_LINE_REGEX =
  /\b([A-Za-z0-9.,#\-\/ ]{0,40}(street|st\.|road|rd\.|nagar|colony|sector|lane|apartment|flat|plot|floor|block|society|enclave|layout)[A-Za-z0-9.,#\-\/ ]{0,40})\b/gi;

// Simple landmark-style hints often used in emails (delivery, invites, etc.)
const LANDMARK_HINTS = /\b(near|opposite|behind|next to|landmark)\b/i;

function uniqueCaseInsensitive(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = item.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item.trim());
    }
  }
  return out;
}

/**
 * Detect locations inside a block of text (subject + snippet + body).
 * Returns { places, pincodes, addressLines, hasLocation }
 */
export function detectLocations(text) {
  if (!text || typeof text !== 'string') {
    return { places: [], pincodes: [], addressLines: [], hasLocation: false };
  }

  const places = [];
  let match;
  PLACE_REGEX.lastIndex = 0;
  while ((match = PLACE_REGEX.exec(text)) !== null) {
    places.push(match[1]);
  }

  const pincodeMatches = text.match(PINCODE_REGEX) || [];

  const addressLines = [];
  let addrMatch;
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
 * Run detection across many emails and also build a grouped summary
 * (location name -> list of email ids/subjects mentioning it).
 */
export function summarizeLocations(emailsWithText) {
  // emailsWithText: [{ id, subject, text }]
  const grouped = {};

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
