import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type SuggestedCoach } from '@/lib/utils/matching'
import { Star, MapPin, Navigation, Clock } from 'lucide-react'

interface SuggestedCoachesProps {
  coaches: SuggestedCoach[]
  title?: string
  viewAllHref?: string
}

export function SuggestedCoaches({
  coaches,
  title = 'Suggested Coaches',
  viewAllHref = '/search?type=coach',
}: SuggestedCoachesProps) {
  if (coaches.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>View All</Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </section>
  )
}

function CoachCard({ coach }: { coach: SuggestedCoach }) {
  const ratingAvg =
    typeof coach.rating === 'number'
      ? coach.rating
      : coach.rating?.average ?? 0
  const ratingCount =
    typeof coach.rating === 'object' ? coach.rating?.count ?? 0 : 0

  return (
    <Link href={`/coaches/${coach.slug}`} className="group block">
      <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
              {coach.name}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-1">
              {coach.distance != null && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Navigation className="h-3 w-3" />
                  {coach.distance} km
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {coach.location?.city}, {coach.location?.state}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{ratingAvg.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">({ratingCount})</span>
            </div>
            {coach.experienceYears > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{coach.experienceYears} yrs</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {(coach.sportsCoached || []).slice(0, 2).map((sport) => (
              <Badge key={sport} variant="outline" className="text-xs">
                {sport}
              </Badge>
            ))}
            {(coach.sportsCoached || []).length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{(coach.sportsCoached || []).length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
