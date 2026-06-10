'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const POPULAR_CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kochi', 'Chandigarh', 'Bhopal', 'Patna', 'Indore',
  'Guwahati', 'Imphal', 'Jamshedpur', 'Rohtak', 'Ludhiana',
]

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

  useEffect(() => {
    setQuery(value)
  }, [value])

  const filterCities = useCallback((q: string) => {
    if (!q.trim()) {
      setSuggestions(POPULAR_CITIES.slice(0, 8))
      return
    }
    const lower = q.toLowerCase()
    const filtered = POPULAR_CITIES.filter((c) => c.toLowerCase().includes(lower))
    setSuggestions(filtered)
  }, [])

  useEffect(() => {
    filterCities(query)
  }, [query, filterCities])

  function handleSelect(city: string) {
    setQuery(city)
    onChange(city)
    setShowSuggestions(false)
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
          // Geocoding failed — ignore
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
          placeholder={placeholder}
          className="pl-9 pr-20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onChange('')
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        <div className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-full rounded-md border p-1 shadow-md max-h-60 overflow-y-auto">
          {!query && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Popular cities</p>
          )}
          {suggestions.map((city) => (
            <button
              key={city}
              type="button"
              onMouseDown={() => handleSelect(city)}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent text-left',
                value === city && 'bg-accent',
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
