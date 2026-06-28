'use client'

import { useCallback, useEffect, useState } from 'react'

interface AcademySelectionState {
  selectedAcademyId: string | null
  selectedAt: string | null
}

const STORAGE_KEY = 'sportsos:selected-academy'

function loadState(): AcademySelectionState {
  if (typeof window === 'undefined') {
    return { selectedAcademyId: null, selectedAt: null }
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { selectedAcademyId: null, selectedAt: null }
    const parsed = JSON.parse(stored)
    return {
      selectedAcademyId: parsed.selectedAcademyId ?? null,
      selectedAt: parsed.selectedAt ?? null,
    }
  } catch {
    return { selectedAcademyId: null, selectedAt: null }
  }
}

function saveState(state: AcademySelectionState): void {
  if (typeof window === 'undefined') return
  try {
    if (state.selectedAcademyId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage unavailable
  }
}

export function useAcademySelection() {
  const [state, setState] = useState<AcademySelectionState>({ selectedAcademyId: null, selectedAt: null })

  useEffect(() => {
    setState(loadState())
    const handler = () => setState(loadState())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const selectAcademy = useCallback((academyId: string) => {
    setState((prev) => {
      if (prev.selectedAcademyId === academyId) return prev
      const next = { selectedAcademyId: academyId, selectedAt: new Date().toISOString() }
      saveState(next)
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setState({ selectedAcademyId: null, selectedAt: null })
    saveState({ selectedAcademyId: null, selectedAt: null })
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
  }, [])

  return {
    selectedAcademyId: state.selectedAcademyId,
    selectedAt: state.selectedAt,
    selectAcademy,
    clearSelection,
    isSelected: (academyId: string) => state.selectedAcademyId === academyId,
  }
}
