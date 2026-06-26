'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStorageSync } from './use-storage-sync';
import { getChildren, createChild as apiCreateChild, updateChild as apiUpdateChild, deleteChild as apiDeleteChild } from '@/lib/api/children';
import { useAuth } from './use-auth';

export interface Child {
  id: string;
  name: string;
  age: number;
  gender?: string;
  sportInterests: string[];
  skillLevel?: string;
  createdAt: string;
}

const CHILDREN_KEY = 'sportsos:children';
const ACTIVE_CHILD_KEY = 'sportsos:active-child';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function readChildren(): Child[] {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c) =>
        c &&
        typeof c === 'object' &&
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        typeof c.age === 'number',
    );
  } catch {
    return [];
  }
}

function writeChildren(children: Child[]) {
  try {
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
  } catch {
    // storage full or unavailable
  }
}

function readActiveChild(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CHILD_KEY);
  } catch {
    return null;
  }
}

function writeActiveChild(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_CHILD_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CHILD_KEY);
    }
  } catch {
    // ignore
  }
}

export function useChildren() {
  const { isAuthenticated, isGuest } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setChildren(readChildren());
    setActiveChildId(readActiveChild());
    setHydrated(true);
  }, []);

  // Load from backend when authenticated (non-guest)
  useEffect(() => {
    if (!hydrated || !isAuthenticated || isGuest) return;
    let cancelled = false;
    getChildren().then((res) => {
      if (cancelled || !res.ok) return;
      const backendChildren: Child[] = (res.data || []).map((c) => {
        const child = c as unknown as Record<string, unknown>;
        return {
          id: String(child.id || ''),
          name: String(child.name || ''),
          age: Number(child.age) || 0,
          gender: child.gender ? String(child.gender) : undefined,
          skillLevel: child.skillLevel ? String(child.skillLevel) : undefined,
          sportInterests: Array.isArray(child.sportInterests) ? child.sportInterests.map(String) : [],
          createdAt: new Date().toISOString(),
        };
      });
      if (backendChildren.length > 0) {
        setChildren(backendChildren);
        writeChildren(backendChildren);
      }
    }).catch(() => {
      // Non-critical — localStorage fallback is already hydrated
    });
    return () => { cancelled = true; };
  }, [hydrated, isAuthenticated, isGuest]);

  // Sync active child if it was removed
  useEffect(() => {
    if (!hydrated) return;
    if (children.length === 0) {
      if (activeChildId !== null) {
        setActiveChildId(null);
        writeActiveChild(null);
      }
    } else if (activeChildId && !children.some((c) => c.id === activeChildId)) {
      const next = children[0].id;
      setActiveChildId(next);
      writeActiveChild(next);
    } else if (!activeChildId && children.length > 0) {
      setActiveChildId(children[0].id);
      writeActiveChild(children[0].id);
    }
  }, [children, activeChildId, hydrated]);

  // Cross-tab sync
  const handleExternalChange = useCallback(() => {
    setChildren(readChildren());
    setActiveChildId(readActiveChild());
  }, []);
  useStorageSync(CHILDREN_KEY, handleExternalChange);

  const addChild = useCallback(
    async (data: { name: string; age: number; sport?: string; skillLevel?: string; sportInterests?: string[] }) => {
      // Optimistic local update
      const localChild: Child = {
        id: generateId(),
        name: data.name,
        age: data.age,
        sportInterests: data.sportInterests || (data.sport ? [data.sport] : []),
        skillLevel: data.skillLevel,
        createdAt: new Date().toISOString(),
      };
      const next = [...children, localChild];
      setChildren(next);
      writeChildren(next);

      // Auto-select first child
      if (next.length === 1) {
        setActiveChildId(localChild.id);
        writeActiveChild(localChild.id);
      }

      // Sync to backend if authenticated
      if (isAuthenticated && !isGuest) {
        const res = await apiCreateChild({
          name: data.name,
          age: data.age,
          sportInterests: data.sportInterests || (data.sport ? [data.sport] : []),
          skillLevel: data.skillLevel,
        });
        if (res.ok) {
          // Replace local ID with backend ID
          const backendData = res.data as unknown as Record<string, unknown>;
          const backendChild: Child = {
            id: String(backendData.id || ''),
            name: data.name,
            age: data.age,
            sportInterests: data.sportInterests || (data.sport ? [data.sport] : []),
            skillLevel: data.skillLevel,
            createdAt: new Date().toISOString(),
          };
          const updated = next.map((c) => (c.id === localChild.id ? backendChild : c));
          setChildren(updated);
          writeChildren(updated);
          if (activeChildId === localChild.id) {
            setActiveChildId(backendChild.id);
            writeActiveChild(backendChild.id);
          }
          return backendChild;
        }
      }

      return localChild;
    },
    [children, activeChildId, isAuthenticated, isGuest],
  );

  const updateChild = useCallback(
    async (id: string, data: { name?: string; age?: number; sport?: string; skillLevel?: string; sportInterests?: string[] }) => {
      // Optimistic local update
      const next = children.map((c) =>
        c.id === id
          ? {
              ...c,
              ...data,
              sportInterests: data.sportInterests || (data.sport ? [data.sport] : c.sportInterests),
            }
          : c,
      );
      setChildren(next);
      writeChildren(next);

      // Sync to backend if authenticated
      if (isAuthenticated && !isGuest) {
        await apiUpdateChild(id, {
          name: data.name,
          age: data.age,
          sportInterests: data.sportInterests || (data.sport ? [data.sport] : undefined),
          skillLevel: data.skillLevel,
        });
      }
    },
    [children, isAuthenticated, isGuest],
  );

  const removeChild = useCallback(
    async (id: string) => {
      // Optimistic local update
      const next = children.filter((c) => c.id !== id);
      setChildren(next);
      writeChildren(next);
      if (activeChildId === id) {
        const nextActive = next.length > 0 ? next[0].id : null;
        setActiveChildId(nextActive);
        writeActiveChild(nextActive);
      }

      // Sync to backend if authenticated
      if (isAuthenticated && !isGuest) {
        await apiDeleteChild(id);
      }
    },
    [children, activeChildId, isAuthenticated, isGuest],
  );

  const setActiveChild = useCallback(
    (id: string) => {
      if (children.some((c) => c.id === id)) {
        setActiveChildId(id);
        writeActiveChild(id);
      }
    },
    [children],
  );

  const activeChild = children.find((c) => c.id === activeChildId) ?? null;

  return {
    children,
    activeChild,
    activeChildId,
    hydrated,
    addChild,
    updateChild,
    removeChild,
    setActiveChild,
  };
}
