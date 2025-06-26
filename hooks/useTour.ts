import { useState, useEffect } from 'react';
import { Storage } from '@/utils/storage';
import { TourStep } from '@/components/GuidedTour';

export const useTour = (tourSteps: TourStep[]) => {
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await Storage.isOnboardingCompleted();
    setIsOnboardingCompleted(completed);
    if (!completed) {
      setIsTourVisible(true);
    }
  };

  const startTour = () => {
    setIsTourVisible(true);
  };

  const completeTour = async () => {
    setIsTourVisible(false);
    await Storage.setOnboardingCompleted();
    setIsOnboardingCompleted(true);
  };

  const skipTour = async () => {
    setIsTourVisible(false);
    await Storage.setOnboardingCompleted();
    setIsOnboardingCompleted(true);
  };

  const resetTour = async () => {
    await Storage.resetOnboarding();
    setIsOnboardingCompleted(false);
    setIsTourVisible(true);
  };

  return {
    isTourVisible,
    isOnboardingCompleted,
    startTour,
    completeTour,
    skipTour,
    resetTour,
  };
};