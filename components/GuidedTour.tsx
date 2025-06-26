import { renderHighlight, renderTooltip } from '@/utils/guidedTourutils';
import { ArrowLeft, ArrowRight, Target, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Button, Card, Progress, Text, XStack, YStack } from 'tamagui';
// import type { TourStep } from '../types/invoice';

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const currentStepData:TourStep = steps[currentStep];

  useEffect(() => {
    if (visible && currentStepData) {
      // Start fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Execute step action if provided
      if (currentStepData.action) {
        setTimeout(() => {
          currentStepData.action?.();
        }, 100);
      }
    }
  }, [currentStep, visible, currentStepData]);

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
        {renderHighlight(currentStepData)}
        
        {/* Tooltip */}
        {renderTooltip(steps, currentStepData, currentStep, tooltipPosition, nextStep, prevStep, skip, true)}
      </YStack>
    </Modal>
  );
};
