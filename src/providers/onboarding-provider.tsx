
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingContextType {
  showOnboarding: boolean;
  currentStep: number;
  nextStep: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'taskpilot-onboarding-completed';

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
        const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
        }
    } catch(e) {
        // If localStorage is not available, default to not showing.
        setShowOnboarding(false);
    }
  }, []);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const completeOnboarding = () => {
    try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch(e) {
        console.error("Could not save onboarding status to localStorage")
    }
    setShowOnboarding(false);
  };
  
  return (
    <OnboardingContext.Provider value={{ showOnboarding, currentStep, nextStep, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
