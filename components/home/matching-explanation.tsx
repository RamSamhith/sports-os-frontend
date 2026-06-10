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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
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
  )
}
