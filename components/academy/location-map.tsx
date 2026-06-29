import { MapPin } from 'lucide-react'

interface LocationMapProps {
  lat: number
  lng: number
  label: string
  className?: string
}

export function LocationMap({ lat, lng, label, className }: LocationMapProps) {
  if (!lat || !lng || (lat === 0 && lng === 0)) {
    return (
      <div className={className}>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Location not available</span>
        </div>
      </div>
    )
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className={className}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted h-full">
        <iframe
          title={`Map of ${label}`}
          src={mapUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary mt-2 inline-flex items-center gap-1 text-xs hover:underline"
      >
        <MapPin className="h-3 w-3" />
        Get directions
      </a>
    </div>
  )
}
