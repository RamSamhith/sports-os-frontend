'use client';

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AcademyImage } from '@/components/ui/academy-image'
import { CoachImage } from '@/components/ui/coach-image'
import { useRecentlyViewed, type RecentlyViewedItem } from '@/lib/hooks/use-recently-viewed'
import { Clock, History, Trash2 } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { ease, duration } from '@/components/motion/constants'

export function RecentlyViewed() {
  const { recentAcademies, recentCoaches, clearHistory } = useRecentlyViewed()
  const reduced = useReducedMotion()
  const academies = recentAcademies
  const coaches = recentCoaches
  const items = [...academies, ...coaches].sort(
    (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
  )

  if (items.length === 0) return null

  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Recently Viewed</h2>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.slice(0, 6).map((item) => (
              <RecentlyViewedCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  const reduced = useReducedMotion()
  const href = item.type === 'academy' ? `/academies/${item.slug}` : `/coaches/${item.slug}`
  const label = item.type === 'academy' ? 'Academy' : 'Coach'

  const timeAgo = getTimeAgo(item.viewedAt)

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4, scale: 1.008 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
    >
      <Link href={href} className="group block">
        <Card className="group overflow-hidden border-border/40 hover:border-foreground/20 hover:shadow-xl transition-all duration-300">
          <div className="bg-muted/40 relative aspect-[16/9] w-full overflow-hidden">
            {item.type === 'academy' ? (
              <AcademyImage
                slug={item.slug}
                name={item.name}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            ) : (
              <CoachImage
                name={item.name}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-sm font-bold text-white drop-shadow-sm line-clamp-1">{item.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="bg-white/20 text-white/80 text-[10px] backdrop-blur-sm hover:bg-white/20">
                  {label}
                </Badge>
                <span className="flex items-center gap-1 text-white/70 text-[10px]">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <span className="text-primary text-xs font-medium flex items-center gap-1">
              View details
              <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
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
