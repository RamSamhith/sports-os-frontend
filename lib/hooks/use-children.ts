'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStorageSync } from './use-storage-sync';

export interface Child {
  id: string;
  name: string;
  age: number;
  sport: string;
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
        typeof c.age === 'number' &&
        typeof c.sport === 'string',
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
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setChildren(readChildren());
    setActiveChildId(readActiveChild());
    setHydrated(true);
  }, []);

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
    (data: Omit<Child, 'id' | 'createdAt'>) => {
      const child: Child = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const next = [...children, child];
      setChildren(next);
      writeChildren(next);
      // Auto-select first child
      if (next.length === 1) {
        setActiveChildId(child.id);
        writeActiveChild(child.id);
      }
      return child;
    },
    [children],
  );

  const updateChild = useCallback(
    (id: string, data: Partial<Omit<Child, 'id' | 'createdAt'>>) => {
      const next = children.map((c) => (c.id === id ? { ...c, ...data } : c));
      setChildren(next);
      writeChildren(next);
    },
    [children],
  );

  const removeChild = useCallback(
    (id: string) => {
      const next = children.filter((c) => c.id !== id);
      setChildren(next);
      writeChildren(next);
      if (activeChildId === id) {
        const nextActive = next.length > 0 ? next[0].id : null;
        setActiveChildId(nextActive);
        writeActiveChild(nextActive);
      }
    },
    [children, activeChildId],
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
