'use client'

import { useAcademyStatus, type AcademyUserStatus } from '@/lib/hooks/use-academy-status'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Bookmark, CheckCircle, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface AcademyStatusButtonProps {
  academyId: string
}

const statusConfig: Record<AcademyUserStatus, { label: string; icon: typeof Heart; color: string }> = {
  interested: { label: 'Interested', icon: Heart, color: 'text-pink-500' },
  shortlisted: { label: 'Shortlisted', icon: Bookmark, color: 'text-blue-500' },
  selected: { label: 'Selected', icon: CheckCircle, color: 'text-green-500' },
}

export function AcademyStatusButton({ academyId }: AcademyStatusButtonProps) {
  const { getStatus, setStatus, clearStatus } = useAcademyStatus()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentStatus = getStatus(academyId)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const current = currentStatus ? statusConfig[currentStatus] : null
  const Icon = current?.icon ?? Heart

  return (
    <div ref={ref} className="relative">
      <Button
        variant={currentStatus ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5"
      >
        <Icon className={`h-4 w-4 ${current?.color ?? ''}`} />
        {current?.label ?? 'Save'}
        <ChevronDown className="h-3 w-3" />
      </Button>
      {open && (
        <div className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-44 rounded-md border p-1 shadow-md">
          {(Object.entries(statusConfig) as [AcademyUserStatus, typeof statusConfig[AcademyUserStatus]][]).map(
            ([key, cfg]) => {
              const CfgIcon = cfg.icon
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setStatus(academyId, key)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent ${
                    currentStatus === key ? 'bg-accent' : ''
                  }`}
                >
                  <CfgIcon className={`h-4 w-4 ${cfg.color}`} />
                  {cfg.label}
                </button>
              )
            },
          )}
          {currentStatus && (
            <>
              <div className="bg-border my-1 h-px" />
              <button
                type="button"
                onClick={() => {
                  clearStatus(academyId)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"
              >
                Remove status
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
