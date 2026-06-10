'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Comprehensive Indian cities, towns, and districts dataset
const INDIAN_LOCATIONS: string[] = [
  // Major Metros
  'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kochi', 'Chandigarh', 'Bhopal', 'Patna', 'Indore',
  'Guwahati', 'Imphal', 'Jamshedpur', 'Rohtak', 'Ludhiana',
  // Karnataka
  'Mysuru', 'Mangaluru', 'Hubli', 'Dharwad', 'Belgaum', 'Belagavi',
  'Gulbarga', 'Kalaburagi', 'Davangere', 'Shimoga', 'Shivamogga',
  'Tumkur', 'Tumakuru', 'Raichur', 'Bellary', 'Ballari',
  'Bijapur', 'Vijayapura', 'Bagalkot', 'Haveri', 'Gadag',
  'Koppal', 'Yadgir', 'Chamarajanagar', 'Hassan', 'Kodagu',
  'Mandya', 'Ramanagara', 'Chikkaballapur', 'Kolar', 'Chitradurga',
  'Madanapalle', 'Chittoor', 'Tirupati', 'Kuppam', 'Kadapa', 'Anantapur',
  // Andhra Pradesh
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
  'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur',
  'Chittoor', 'East Godavari', 'West Godavari', 'Krishna', 'Guntur',
  'Prakasam', 'Nellore', 'Chittoor', 'Kurnool', 'Anantapur',
  'Madanapalle', 'Kuppam', 'Puttaparthi', 'Srikakulam', 'Vizianagaram',
  // Tamil Nadu
  'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur',
  'Ramanathapuram', 'Karur', 'Namakkal', 'Krishnagiri', 'Dharmapuri',
  'Sivaganga', 'Tiruvannamalai', 'Villupuram', 'Cuddalore', 'Kancheepuram',
  'Ariyalur', 'Perambalur', 'Nagapattinam', 'Tiruvarur', 'Nilgiris',
  // Maharashtra
  'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati',
  'Kolhapur', 'Sangli', 'Satara', 'Ratnagiri', 'Sindhudurg',
  'Thane', 'Navi Mumbai', 'Kalyan', 'Dombivli', 'Ulhasnagar',
  'Bhiwandi', 'Mira-Bhayandar', 'Vasai-Virar', 'Badlapur', 'Ambarnath',
  'Akola', 'Wardha', 'Yavatmal', 'Beed', 'Hingoli',
  'Parbhani', 'Jalna', 'Osmanabad', 'Nanded', 'Latur',
  'Pune', 'Pimpri-Chinchwad', 'Ahmednagar', 'Ichalkaranji', 'Shirur',
  // Gujarat
  'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
  'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi',
  'Mehsana', 'Bharuch', 'Vapi', 'Godhra', 'Dahod',
  'Porbandar', 'Palanpur', 'Valsad', 'Patan', 'Surendranagar',
  'Bhuj', 'Gandhidham', 'Kutch', 'Amreli', 'Devbhoomi Dwarka',
  // Rajasthan
  'Udaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Bikaner',
  'Alwar', 'Bharatpur', 'Bhilwara', 'Sikar', 'Pali',
  'Chittorgarh', 'Kishangarh', 'Baran', 'Dausa', 'Jhunjhunu',
  'Karauli', 'Sawai Madhopur', 'Dungarpur', 'Banswara', 'Pratapgarh',
  'Nagaur', 'Tonk', 'Bundi', 'Barmer', 'Jaisalmer',
  'Jalore', 'Rajsamand', 'Sirohi', 'Dholpur', 'Hanumangarh',
  // Uttar Pradesh
  'Agra', 'Varanasi', 'Allahabad', 'Prayagraj', 'Kanpur',
  ' Meerut', 'Noida', 'Ghaziabad', 'Agra', 'Lucknow',
  'Jhansi', 'Aligarh', 'Bareilly', 'Moradabad', 'Saharanpur',
  'Gorakhpur', 'Firozabad', 'Jalaun', 'Mathura', 'Ayodhya',
  'Sitapur', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Etawah',
  'Mirzapur', 'Varanasi', 'Ballia', 'Mau', 'Jaunpur',
  'Azamgarh', 'Budaun', 'Bijnor', 'Bulandshahr', 'Gautam Buddha Nagar',
  // Madhya Pradesh
  'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas',
  'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Katni',
  'Singrauli', 'Burhanpur', 'Khandwa', 'Khargone', 'Barwani',
  'Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain',
  'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa',
  // West Bengal
  'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman',
  'Kharagpur', 'Haldia', 'Raniganj', 'Durgapur', 'Bishnupur',
  'Midnapore', 'Bankura', 'Purulia', 'Jhargram', 'Malda',
  'Murshidabad', 'Birbhum', 'Nadia', 'Hooghly', '24 Parganas',
  // Kerala
  'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kottayam',
  'Alappuzha', 'Palakkad', 'Malappuram', 'Kannur', 'Kasaragod',
  'Idukki', 'Wayanad', 'Pathanamthitta', 'Ernakulam', 'Cherthala',
  // Telangana
  'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam',
  'Mahbubnagar', 'Nalgonda', 'Medak', 'Adilabad', 'Rangareddy',
  'Secunderabad', 'Begumpet', 'Ameerpet', 'Madhapur', 'HITEC City',
  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur',
  'Puri', 'Balasore', 'Baripada', 'Bhadrak', 'Jajpur',
  'Kendrapara', 'Jagatsinghpur', 'Koraput', 'Rayagada', 'Kalahandi',
  // Punjab
  'Amritsar', 'Jalandhar', 'Patiala', 'Ludhiana', 'Bathinda',
  'Hoshiarpur', 'Patiala', 'Gurdaspur', 'Kapurthala', 'Moga',
  'Sangrur', 'Barnala', 'Firozpur', 'Moga', 'Faridkot',
  // Haryana
  'Faridabad', 'Gurgaon', 'Gurugram', 'Panipat', 'Ambala',
  'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat',
  'Panchkula', 'Kurukshetra', 'Jhajjar', 'Rewari', 'Mahendragarh',
  // Bihar
  'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Arrah',
  'Begusarai', 'Katihar', 'Munger', 'Purnia', 'Saharsa',
  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar',
  'Hazaribag', 'Giridih', 'Ramgarh', 'Medininagar', 'Dumka',
  // Assam
  'Dibrugarh', 'Jorhat', 'Tezpur', 'Silchar', 'Nagaon',
  'Tinsukia', 'Sivasagar', 'Barpeta', 'Goalpara', 'Karimganj',
  // Goa
  'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda',
  // Jammu & Kashmir
  'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore',
  'Udhampur', 'Kathra', 'Rajouri', 'Poonch', 'Kupwara',
  // Himachal Pradesh
  'Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Mandi',
  'Solan', 'Bilaspur', 'Hamirpur', 'Kangra', 'Chamba',
  // Uttarakhand
  'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur',
  'Kashipur', 'Mussoorie', 'Nainital', 'Almora', 'Pithoragarh',
  // Northeast
  'Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara',
  'Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib',
  'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha',
  'Itanagar', 'Naharlagun', 'Pasighat', 'Tezpor', 'Bomdila',
  // Union Territories
  'Puducherry', 'Karaikal', 'Mahe', 'Yanam',
  'Lakshadweep', 'Kavaratti', 'Minicoy',
  'Andaman and Nicobar', 'Port Blair', 'Car Nicobar',
  'Dadra and Nagar Haveli', 'Silvassa',
  'Daman', 'Diu',
  // Ladakh
  'Leh', 'Kargil',
  // Common misspellings and variations
  'Bangalore', 'Bombay', 'Madras', 'Calcutta', 'Cochin',
  'Trivandrum', 'Pondicherry', 'Benaras', 'Varanasi',
  'Mysore', ' Mangalore', 'Hubli-Dharwad', 'Belgaum',
]

// Fuzzy match score: higher = better match
function fuzzyScore(query: string, candidate: string): number {
  const q = query.toLowerCase()
  const c = candidate.toLowerCase()

  // Exact match
  if (c === q) return 100

  // Starts with query
  if (c.startsWith(q)) return 90

  // Contains query as whole word
  if (c.includes(q)) return 80

  // Partial word match
  const qWords = q.split(/\s+/)
  const cWords = c.split(/\s+/)
  let wordMatches = 0
  for (const qw of qWords) {
    if (cWords.some((cw) => cw.startsWith(qw) || cw.includes(qw))) {
      wordMatches++
    }
  }
  if (wordMatches === qWords.length) return 70
  if (wordMatches > 0) return 60

  // Character sequence match (subsequence)
  let qi = 0
  for (let ci = 0; ci < c.length && qi < q.length; ci++) {
    if (c[ci] === q[qi]) qi++
  }
  if (qi === q.length) return 40

  // Levenshtein-like: check if edit distance is small
  if (Math.abs(c.length - q.length) <= 2 && c.includes(q[0])) return 20

  return 0
}

interface LocationPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function LocationPicker({ value, onChange, placeholder = 'Enter your city', className }: LocationPickerProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  useEffect(() => {
    setQuery(value)
  }, [value])

  const filterCities = useCallback((q: string) => {
    if (!q.trim()) {
      setSuggestions(INDIAN_LOCATIONS.slice(0, 8))
      return
    }

    // Score and sort locations
    const scored = INDIAN_LOCATIONS
      .map((loc) => ({ loc, score: fuzzyScore(q, loc) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((item) => item.loc)

    setSuggestions(scored)
  }, [])

  useEffect(() => {
    filterCities(query)
  }, [query, filterCities])

  useEffect(() => {
    setHighlightIndex(-1)
  }, [suggestions])

  function handleSelect(city: string) {
    setQuery(city)
    onChange(city)
    setShowSuggestions(false)
    setHighlightIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[highlightIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightIndex(-1)
    }
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          const data = await resp.json()
          const city = data.address?.city || data.address?.town || data.address?.village || ''
          if (city) {
            handleSelect(city)
          }
        } catch {
          // Geocoding failed
        }
        setDetecting(false)
      },
      () => {
        setDetecting(false)
      },
      { timeout: 10000 },
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
            if (value) onChange('')
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-20"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="location-listbox"
          aria-activedescendant={highlightIndex >= 0 ? `location-option-${highlightIndex}` : undefined}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onChange('')
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear location"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2"
          title="Detect my location"
        >
          <Navigation className={cn('h-4 w-4', detecting && 'animate-spin')} />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          id="location-listbox"
          role="listbox"
          className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-full rounded-md border p-1 shadow-md max-h-60 overflow-y-auto"
        >
          {!query && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Popular cities</p>
          )}
          {suggestions.map((city, index) => (
            <button
              key={city}
              id={`location-option-${index}`}
              type="button"
              role="option"
              aria-selected={highlightIndex === index}
              onMouseDown={() => handleSelect(city)}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent text-left',
                value === city && 'bg-accent',
                highlightIndex === index && 'bg-accent',
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
