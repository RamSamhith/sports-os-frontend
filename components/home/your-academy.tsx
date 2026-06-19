'use client'

import Link from 'next/link'
import { ProtectedLink } from '@/components/auth/protected-link'
import { useAcademySelection } from '@/lib/hooks/use-academy-selection'
import { useAcademyStatus } from '@/lib/hooks/use-academy-status'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, ChevronRight } from 'lucide-react'
import { academies } from '@/data/academies'

export function YourAcademy() {
  const { selectedAcademyId } = useAcademySelection()
  const { getStatus } = useAcademyStatus()

  if (!selectedAcademyId) return null

  const academy = academies.find((a) => a.id === selectedAcademyId)
  if (!academy) return null

  const status = getStatus(academy.id)
  const ratingAvg = typeof academy.rating === 'number'
    ? academy.rating
    : academy.rating?.average ?? 0

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Your Academy</h2>
      <Link href={`/academies/${academy.slug}`} className="group block">
        <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {academy.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold leading-tight line-clamp-1">
                  {academy.name}
                </p>
                {status && (
                  <Badge variant="secondary" className="shrink-0 text-[10px] capitalize">
                    {status}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{academy.location.city}</span>
                <span>·</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{ratingAvg.toFixed(1)}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </CardContent>
        </Card>
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link href={`/academies/${academy.slug}`}>View Academy</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <ProtectedLink href={`/enquiry/academy/${academy.slug}`}>Enquire</ProtectedLink>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/coaches?academy=${academy.slug}`}>View Coaches</Link>
        </Button>
      </div>
    </section>
  )
}
