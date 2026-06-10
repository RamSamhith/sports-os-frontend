import { Badge } from '@/components/ui/badge'
import { MapPin, Globe, Navigation } from 'lucide-react'

interface AcademyInfoProps {
  address?: string
  city: string
  state: string
  country: string
  distance?: number
  sportsOffered: string[]
  website?: string
}

export function AcademyInfo({
  address,
  city,
  state,
  country,
  distance,
  sportsOffered,
  website,
}: AcademyInfoProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Academy Information</h2>
      <div className="grid gap-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            {address && <p className="text-foreground">{address}</p>}
            <p className="text-muted-foreground">{city}, {state}, {country}</p>
          </div>
        </div>
        {distance != null && (
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{distance} km away</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline line-clamp-1"
            >
              {website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>
      {sportsOffered.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {sportsOffered.map((sport) => (
            <Badge key={sport} variant="secondary" className="text-xs">
              {sport}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
