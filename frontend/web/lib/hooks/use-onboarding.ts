'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStorageSync } from './use-storage-sync';
import type {
  OnboardingData,
  OnboardingState,
  AthleteOnboardingData,
  ParentOnboardingData,
  SkillLevel,
  BudgetRange,
  TrainingFrequency,
  CompetitionLevel,
} from '@/types/domain/onboarding';

export type { OnboardingData, AthleteOnboardingData, ParentOnboardingData, SkillLevel, BudgetRange, TrainingFrequency, CompetitionLevel };

const STORAGE_KEY = 'sportsos:onboarding';

function readState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: false, data: {} };
    const parsed = JSON.parse(raw);
    return {
      completed: !!parsed.completed,
      data: parsed.data && typeof parsed.data === 'object' ? parsed.data : {},
    };
  } catch {
    return { completed: false, data: {} };
  }
}

function writeState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({ completed: false, data: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeState(state);
  }, [state, hydrated]);

  const handleExternalChange = useCallback(() => {
    setState(readState());
  }, []);
  useStorageSync(STORAGE_KEY, handleExternalChange);

  const completeOnboarding = useCallback((data: OnboardingData) => {
    setState({ completed: true, data });
  }, []);

  const updateOnboardingData = useCallback((data: OnboardingData) => {
    setState((prev) => ({ ...prev, data: { ...prev.data, ...data } }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState({ completed: false, data: {} });
  }, []);

  const athleteData: AthleteOnboardingData | undefined = state.data.athlete;
  const parentData: ParentOnboardingData | undefined = state.data.parent;

  return {
    completed: state.completed,
    data: state.data,
    athleteData,
    parentData,
    hydrated,
    completeOnboarding,
    updateOnboardingData,
    resetOnboarding,
  };
}
