import { useCallback, useEffect, useState } from 'react'

export type RecentlyViewedType = 'academy' | 'coach'

export interface RecentlyViewedItem {
  id: string
  slug: string
  type: RecentlyViewedType
  name: string
  viewedAt: string
}

const STORAGE_KEY = 'sportsos:recently-viewed'
const MAX_ITEMS = 10

function loadItems(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveItems(items: RecentlyViewedItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage unavailable
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(loadItems)

  useEffect(() => {
    const handler = () => setItems(loadItems())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const addView = useCallback(
    (item: { id: string; slug: string; type: RecentlyViewedType; name: string }) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type))
        const next = [
          { ...item, viewedAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, MAX_ITEMS)
        saveItems(next)
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
        return next
      })
    },
    [],
  )

  const recentAcademies = items.filter((i) => i.type === 'academy')
  const recentCoaches = items.filter((i) => i.type === 'coach')

  return {
    items,
    recentAcademies,
    recentCoaches,
    addView,
    recentCount: items.length,
  }
}
