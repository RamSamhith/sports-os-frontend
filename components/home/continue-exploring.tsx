import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type RecentlyViewedItem } from '@/lib/hooks/use-recently-viewed'
import { ArrowRight, Dumbbell, Users } from 'lucide-react'

interface ContinueExploringProps {
  lastAcademy?: RecentlyViewedItem
  lastCoach?: RecentlyViewedItem
}

export function ContinueExploring({ lastAcademy, lastCoach }: ContinueExploringProps) {
  const items: RecentlyViewedItem[] = []
  if (lastAcademy) items.push(lastAcademy)
  if (lastCoach) items.push(lastCoach)

  if (items.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">Continue Exploring</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <ContinueCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  )
}

function ContinueCard({ item }: { item: RecentlyViewedItem }) {
  const href = item.type === 'academy' ? `/academies/${item.slug}` : `/coaches/${item.slug}`
  const Icon = item.type === 'academy' ? Dumbbell : Users
  const label = item.type === 'academy' ? 'Academy' : 'Coach'

  return (
    <Link href={href} className="group block">
      <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">View {label.toLowerCase()}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  )
}
