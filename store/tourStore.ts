import { create } from 'zustand';

export interface TourStep {
  id: string;
  title: string;
  text: string;
  target?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  highlight?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nudgeType?: 'tooltip' | 'spotlight' | 'overlay';
  buttonText?: string;
  skipable?: boolean;
  pulseTarget?: boolean;
}

interface TourState {
  isVisible: boolean;
  currentStep: number;
  steps: TourStep[];
  pulsingElements: Set<string>;
  highlightedElement: string | null;
  
  // Actions
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  setHighlight: (elementId: string | null) => void;
  addPulse: (elementId: string) => void;
  removePulse: (elementId: string) => void;
  clearAllPulses: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  isVisible: false,
  currentStep: 0,
  steps: [],
  pulsingElements: new Set(),
  highlightedElement: null,

  startTour: (steps: TourStep[]) => {
    set({
      isVisible: true,
      currentStep: 0,
      steps,
      pulsingElements: new Set(),
      highlightedElement: null,
    });
  },

  nextStep: () => {
    const { currentStep, steps, completeTour } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      completeTour();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  skipTour: () => {
    set({
      isVisible: false,
      currentStep: 0,
      steps: [],
      pulsingElements: new Set(),
      highlightedElement: null,
    });
  },

  completeTour: () => {
    set({
      isVisible: false,
      currentStep: 0,
      steps: [],
      pulsingElements: new Set(),
      highlightedElement: null,
    });
  },

  setHighlight: (elementId: string | null) => {
    set({ highlightedElement: elementId });
  },

  addPulse: (elementId: string) => {
    const { pulsingElements } = get();
    const newPulsingElements = new Set(pulsingElements);
    newPulsingElements.add(elementId);
    set({ pulsingElements: newPulsingElements });
  },

  removePulse: (elementId: string) => {
    const { pulsingElements } = get();
    const newPulsingElements = new Set(pulsingElements);
    newPulsingElements.delete(elementId);
    set({ pulsingElements: newPulsingElements });
  },

  clearAllPulses: () => {
    set({ pulsingElements: new Set() });
  },
}));