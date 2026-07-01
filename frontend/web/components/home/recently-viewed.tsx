import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type RecentlyViewedItem } from '@/lib/hooks/use-recently-viewed'
import { Clock, Dumbbell, Users, ChevronRight, History, Trash2 } from 'lucide-react'

interface RecentlyViewedProps {
  academies: RecentlyViewedItem[]
  coaches: RecentlyViewedItem[]
  onClear?: () => void
}

export function RecentlyViewed({ academies, coaches, onClear }: RecentlyViewedProps) {
  const items = [...academies, ...coaches].sort(
    (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
  )

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Recently Viewed</h2>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground min-h-[44px]"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.slice(0, 4).map((item) => (
          <RecentlyViewedCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  )
}

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  const href = item.type === 'academy' ? `/academies/${item.slug}` : `/coaches/${item.slug}`
  const Icon = item.type === 'academy' ? Dumbbell : Users
  const label = item.type === 'academy' ? 'Academy' : 'Coach'

  const timeAgo = getTimeAgo(item.viewedAt)

  return (
    <Link href={href} className="group block">
      <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
                {item.name}
              </CardTitle>
              <Badge variant="secondary" className="mt-1 text-[10px]">
                {label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-medium">
              <span>View</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
