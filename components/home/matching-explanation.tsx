'use client'

import { useOnboarding } from '@/lib/hooks/use-onboarding'
import { getMatchingCriteria } from '@/lib/utils/matching'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface MatchingExplanationProps {
  className?: string
}

export function MatchingExplanation({ className }: MatchingExplanationProps) {
  const { data: onboarding } = useOnboarding()
  if (!onboarding) return null

  const criteria = getMatchingCriteria(onboarding)
  if (criteria.length === 0) return null

  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm font-semibold text-foreground">Recommended For You</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Based on:</span>
          <div className="flex flex-wrap gap-1">
            {criteria.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs font-normal">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
