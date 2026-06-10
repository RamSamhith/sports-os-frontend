import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type SuggestedAcademy } from '@/lib/utils/matching'
import { Star, MapPin, Shield, Navigation } from 'lucide-react'

interface SuggestedAcademiesProps {
  academies: SuggestedAcademy[]
  title?: string
  viewAllHref?: string
}

export function SuggestedAcademies({
  academies,
  title = 'Suggested Academies',
  viewAllHref = '/search?type=academy',
}: SuggestedAcademiesProps) {
  if (academies.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>View All</Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {academies.map((academy) => (
          <AcademyCard key={academy.id} academy={academy} />
        ))}
      </div>
    </section>
  )
}

function AcademyCard({ academy }: { academy: SuggestedAcademy }) {
  const ratingAvg =
    typeof academy.rating === 'number'
      ? academy.rating
      : academy.rating?.average ?? 0
  const ratingCount =
    typeof academy.rating === 'object' ? academy.rating?.count ?? 0 : 0

  return (
    <Link href={`/academies/${academy.slug}`} className="group block">
      <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
              {academy.name}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-1">
              {academy.distance != null && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Navigation className="h-3 w-3" />
                  {academy.distance} km
                </Badge>
              )}
              {academy.verificationStatus === 'verified' && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Shield className="h-3 w-3" />
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {academy.location?.city}, {academy.location?.state}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{ratingAvg.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">({ratingCount})</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {(academy.sportsOffered || []).slice(0, 3).map((sport) => (
              <Badge key={sport} variant="outline" className="text-xs">
                {sport}
              </Badge>
            ))}
            {(academy.sportsOffered || []).length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(academy.sportsOffered || []).length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
