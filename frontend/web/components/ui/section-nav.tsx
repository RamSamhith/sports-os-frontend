'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionItem {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface SectionNavProps {
  sections: SectionItem[];
  activeId: string;
  className?: string;
  sticky?: boolean;
}

export function SectionNav({ sections, activeId, className, sticky = true }: SectionNavProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (activeRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const scrollLeft = button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        'border-b bg-background/95 backdrop-blur-sm',
        sticky && 'sticky top-16 z-40',
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div
          ref={scrollContainerRef}
          className="scrollbar-none flex gap-1 overflow-x-auto px-4 py-2"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                ref={isActive ? activeRef : undefined}
                onClick={() => handleClick(section.id)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

interface UseSectionObserverProps {
  sectionIds: string[];
  offset?: number;
}

export function useSectionObserver({ sectionIds, offset = 100 }: UseSectionObserverProps) {
  const [activeId, setActiveId] = React.useState(sectionIds[0] ?? '');

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    });

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    observers.push(observer);

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [sectionIds, offset]);

  return activeId;
}
