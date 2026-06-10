import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Coach } from '@/types/domain/coach'
import { Star, Clock, ChevronRight } from 'lucide-react'

interface CoachesAtAcademyProps {
  coaches: Coach[]
  academyName: string
}

export function CoachesAtAcademy({ coaches, academyName }: CoachesAtAcademyProps) {
  if (coaches.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Coaches at {academyName}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {coaches.map((coach) => (
          <CompactCoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </section>
  )
}

function CompactCoachCard({ coach }: { coach: Coach }) {
  const ratingAvg =
    typeof coach.rating === 'number' ? coach.rating : coach.rating?.average ?? 0

  return (
    <Link href={`/coaches/${coach.slug}`} className="group block">
      <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {coach.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight line-clamp-1">{coach.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="line-clamp-1">
                {coach.specialization.slice(0, 2).join(', ')}
              </span>
              {coach.experienceYears > 0 && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {coach.experienceYears}y
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {ratingAvg.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {coach.sportsCoached.slice(0, 2).map((sport) => (
                <Badge key={sport} variant="outline" className="text-[10px] px-1.5 py-0">
                  {sport}
                </Badge>
              ))}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  )
}
