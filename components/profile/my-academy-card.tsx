'use client'

import Link from 'next/link'
import { useAcademySelection } from '@/lib/hooks/use-academy-selection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Shield, ExternalLink, X } from 'lucide-react'

interface MyAcademyCardProps {
  academies: Array<{
    id: string
    slug: string
    name: string
    location?: { city?: string; state?: string }
    rating?: number | { average: number; count: number }
    verificationStatus?: string
    sportsOffered?: string[]
  }>
}

export function MyAcademyCard({ academies }: MyAcademyCardProps) {
  const { selectedAcademyId, clearSelection } = useAcademySelection()

  if (!selectedAcademyId) return null

  const academy = academies.find((a) => a.id === selectedAcademyId)
  if (!academy) return null

  const ratingAvg =
    typeof academy.rating === 'number'
      ? academy.rating
      : academy.rating?.average ?? 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">My Academy</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold">{academy.name}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {academy.location?.city}, {academy.location?.state}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{ratingAvg.toFixed(1)}</span>
          </div>
          {academy.verificationStatus === 'verified' && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        {academy.sportsOffered && academy.sportsOffered.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {academy.sportsOffered.slice(0, 4).map((sport) => (
              <Badge key={sport} variant="outline" className="text-xs">
                {sport}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <Button size="sm" asChild>
            <Link href={`/academies/${academy.slug}`}>
              View Academy
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/academies/${academy.slug}#enquire`}>
              Enquire
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/coaches?academy=${academy.slug}`}>
              View Coaches
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
