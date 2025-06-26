import React, { useState, useRef, useEffect } from 'react';
import { Modal, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ArrowRight, ArrowLeft, X, Target } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Card, Progress } from 'tamagui';
import { renderHighlight, renderTooltip } from '@/utils/guidedTourutils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
}

interface GuidedTourProps {
  steps: TourStep[];
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  visible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (visible && currentStepData) {
      // Start fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Calculate tooltip position based on step configuration
      calculateTooltipPosition();

      // Start pulse animation for highlights
      if (currentStepData.highlight) {
        startPulseAnimation();
      }

      // Execute step action if provided
      if (currentStepData.action) {
        setTimeout(() => {
          currentStepData.action?.();
        }, 100);
      }
    }
  }, [currentStep, visible, currentStepData]);

  const calculateTooltipPosition = () => {
    const step = currentStepData;
    let x = screenWidth / 2 - 150;
    let y = screenHeight / 2 - 100;

    if (step.highlight) {
      const { x: hx, y: hy, width, height } = step.highlight;
      
      switch (step.placement) {
        case 'top':
          x = Math.max(20, Math.min(screenWidth - 320, hx + width / 2 - 150));
          y = Math.max(20, hy - 180);
          break;
        case 'bottom':
          x = Math.max(20, Math.min(screenWidth - 320, hx + width / 2 - 150));
          y = Math.min(screenHeight - 200, hy + height + 20);
          break;
        case 'left':
          x = Math.max(20, hx - 320);
          y = Math.max(20, Math.min(screenHeight - 200, hy + height / 2 - 100));
          break;
        case 'right':
          x = Math.min(screenWidth - 320, hx + width + 20);
          y = Math.max(20, Math.min(screenHeight - 200, hy + height / 2 - 100));
          break;
        case 'center':
        default:
          // Keep center position
          break;
      }
    }

    setTooltipPosition({ x, y });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
      });
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  const skip = () => {
    onSkip();
  };

  if (!visible || !currentStepData) return null;



  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <YStack flex={1} position="relative">
        {/* Dark backdrop with cutout */}
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.75)"
        />
        
        {/* Highlight effects */}
        {renderHighlight(currentStepData,pulseAnim)}
        
        {/* Tooltip */}
        {renderTooltip(currentStepData, tooltipPosition, fadeAnim, currentStepData, steps, nextStep, prevStep, skip)}
      </YStack>
    </Modal>
  );
};