'use client'

import { useAcademySelection } from '@/lib/hooks/use-academy-selection'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'

interface SelectAcademyButtonProps {
  academyId: string
  academyName?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function SelectAcademyButton({
  academyId,
  academyName,
  variant = 'default',
  size = 'md',
}: SelectAcademyButtonProps) {
  const { isSelected, selectAcademy, clearSelection } = useAcademySelection()
  const selected = isSelected(academyId)

  const handleClick = () => {
    if (selected) {
      clearSelection()
    } else {
      selectAcademy(academyId)
    }
  }

  return (
    <Button
      variant={selected ? 'secondary' : variant}
      size={size}
      onClick={handleClick}
      className="gap-2"
    >
      {selected ? (
        <>
          <CheckCircle className="h-4 w-4" />
          {academyName ? `Selected: ${academyName}` : 'Selected'}
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Select Academy
        </>
      )}
    </Button>
  )
}
