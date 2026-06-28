'use client'

import { useCallback, useEffect, useState } from 'react'

export type AcademyUserStatus = 'interested' | 'shortlisted' | 'selected'

interface AcademyStatusEntry {
  status: AcademyUserStatus
  updatedAt: string
}

type AcademyStatusMap = Record<string, AcademyStatusEntry>

const STORAGE_KEY = 'sportsos:academy-status'

function loadMap(): AcademyStatusMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveMap(map: AcademyStatusMap): void {
  if (typeof window === 'undefined') return
  try {
    if (Object.keys(map).length === 0) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    }
  } catch {
    // Storage unavailable
  }
}

export function useAcademyStatus() {
  const [map, setMap] = useState<AcademyStatusMap>({})

  useEffect(() => {
    setMap(loadMap())
    const handler = () => setMap(loadMap())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const setStatus = useCallback((academyId: string, status: AcademyUserStatus) => {
    setMap((prev) => {
      const next = { ...prev, [academyId]: { status, updatedAt: new Date().toISOString() } }
      saveMap(next)
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
      return next
    })
  }, [])

  const clearStatus = useCallback((academyId: string) => {
    setMap((prev) => {
      const next = { ...prev }
      delete next[academyId]
      saveMap(next)
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
      return next
    })
  }, [])

  const getStatus = useCallback(
    (academyId: string): AcademyUserStatus | undefined => {
      return map[academyId]?.status
    },
    [map],
  )

  const isInterested = useCallback(
    (academyId: string) => map[academyId]?.status === 'interested',
    [map],
  )

  const isShortlisted = useCallback(
    (academyId: string) => map[academyId]?.status === 'shortlisted',
    [map],
  )

  const isSelected = useCallback(
    (academyId: string) => map[academyId]?.status === 'selected',
    [map],
  )

  return {
    setStatus,
    clearStatus,
    getStatus,
    isInterested,
    isShortlisted,
    isSelected,
  }
}
