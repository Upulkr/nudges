import React, { useEffect, useRef } from 'react';
import { Modal, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { ArrowRight, ArrowLeft, X, Target } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Card, Progress } from 'tamagui';
import { useTourStore } from '@/store/tourStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const TourTooltip: React.FC = () => {
  const {
    isVisible,
    currentStep,
    steps,
    nextStep,
    prevStep,
    skipTour,
  } = useTourStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isVisible && currentStepData) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Start pulse animation for highlights
      if (currentStepData.highlight) {
        startPulseAnimation();
      }

      // Execute step action
      if (currentStepData.action) {
        setTimeout(() => {
          currentStepData.action?.();
        }, 100);
      }
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [currentStep, isVisible, currentStepData]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const calculateTooltipPosition = () => {
    const step = currentStepData;
    let x = screenWidth / 2 - 160;
    let y = screenHeight / 2 - 120;

    if (step?.highlight) {
      const { x: hx, y: hy, width, height } = step.highlight;
      
      switch (step.placement) {
        case 'top':
          x = Math.max(20, Math.min(screenWidth - 340, hx + width / 2 - 160));
          y = Math.max(20, hy - 200);
          break;
        case 'bottom':
          x = Math.max(20, Math.min(screenWidth - 340, hx + width / 2 - 160));
          y = Math.min(screenHeight - 220, hy + height + 20);
          break;
        case 'left':
          x = Math.max(20, hx - 340);
          y = Math.max(20, Math.min(screenHeight - 220, hy + height / 2 - 110));
          break;
        case 'right':
          x = Math.min(screenWidth - 340, hx + width + 20);
          y = Math.max(20, Math.min(screenHeight - 220, hy + height / 2 - 110));
          break;
      }
    }

    return { x, y };
  };

  const renderHighlight = () => {
    if (!currentStepData?.highlight) return null;

    const { x, y, width, height } = currentStepData.highlight;

    return (
      <>
        {/* Backdrop with highlight */}
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.75)"
        />
        <YStack 
          position="absolute"
          left={x - 8}
          top={y - 8}
          width={width + 16}
          height={height + 16}
          backgroundColor="transparent"
          borderWidth={4}
          borderColor="$blue9"
          borderRadius="$3"
          shadowColor="$blue9"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.8}
          shadowRadius={20}
          elevation={20}
        />

        {/* Pulsing border */}
        <Animated.View
          style={{
            position: 'absolute',
            left: x - 4,
            top: y - 4,
            width: width + 8,
            height: height + 8,
            borderWidth: 2,
            borderColor: '#60A5FA',
            borderRadius: 8,
            transform: [{ scale: pulseAnim }],
          }}
        />

        {/* Target indicator */}
        <YStack 
          position="absolute"
          left={x + width / 2 - 16}
          top={y + height / 2 - 16}
          width={32}
          height={32}
          backgroundColor="rgba(59, 130, 246, 0.2)"
          borderRadius="$4"
          alignItems="center"
          justifyContent="center"
        >
          <Target size={20} color="$blue9" />
        </YStack>
      </>
    );
  };

  const renderArrowPointer = () => {
    if (!currentStepData?.highlight) return null;

    const { x: hx, y: hy, width, height } = currentStepData.highlight;
    const { x: tx, y: ty } = calculateTooltipPosition();

    let arrowStyle = {};

    switch (currentStepData.placement) {
      case 'top':
        arrowStyle = {
          position: 'absolute',
          bottom: -8,
          left: Math.max(20, Math.min(300, hx + width / 2 - tx)),
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#ffffff',
        };
        break;
      case 'bottom':
        arrowStyle = {
          position: 'absolute',
          top: -8,
          left: Math.max(20, Math.min(300, hx + width / 2 - tx)),
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#ffffff',
        };
        break;
      case 'left':
        arrowStyle = {
          position: 'absolute',
          right: -8,
          top: Math.max(20, Math.min(180, hy + height / 2 - ty)),
          borderTopWidth: 8,
          borderBottomWidth: 8,
          borderLeftWidth: 8,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: '#ffffff',
        };
        break;
      case 'right':
        arrowStyle = {
          position: 'absolute',
          left: -8,
          top: Math.max(20, Math.min(180, hy + height / 2 - ty)),
          borderTopWidth: 8,
          borderBottomWidth: 8,
          borderRightWidth: 8,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: '#ffffff',
        };
        break;
    }

    return <YStack style={arrowStyle} />;
  };

  if (!isVisible || !currentStepData) return null;

  const tooltipPosition = calculateTooltipPosition();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <YStack flex={1} position="relative">
        {/* Backdrop with highlight */}
        {renderHighlight()}
        
        {/* Tooltip */}
        <Animated.View
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            width: 320,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Card
            backgroundColor="$background"
            borderRadius="$4"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 12 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            elevation={25}
          >
            {/* Arrow pointer */}
            {renderArrowPointer()}

            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$5"
              paddingTop="$5"
              paddingBottom="$3"
            >
              <YStack flex={1}>
                <Text fontSize={12} color="$gray10" fontWeight="600" marginBottom="$2">
                  {currentStep + 1} of {steps.length}
                </Text>
                <Progress
                  value={Math.round(((currentStep + 1) / steps.length) * 100)}
                  backgroundColor="$gray5"
                  height={4}
                  borderRadius="$1"
                >
                  <Progress.Indicator backgroundColor="$blue9" />
                </Progress>
              </YStack>
              {currentStepData.skipable !== false && (
                <TouchableOpacity onPress={skipTour} style={{ padding: 8, marginLeft: 12 }}>
                  <X size={20} color="$gray10" />
                </TouchableOpacity>
              )}
            </XStack>

            {/* Content */}
            <YStack paddingHorizontal="$5" paddingBottom="$5">
              <Text fontSize={20} fontWeight="700" color="$gray12" marginBottom="$2" lineHeight={28}>
                {currentStepData.title}
              </Text>
              <Text fontSize={15} color="$gray10" lineHeight={22}>
                {currentStepData.text}
              </Text>
            </YStack>

            {/* Actions */}
            <XStack gap="$3" paddingHorizontal="$5" paddingBottom="$5">
              <Button
                flex={1}
                backgroundColor="$gray2"
                borderWidth={1.5}
                borderColor="$gray6"
                onPress={prevStep}
                disabled={currentStep === 0}
                opacity={currentStep === 0 ? 0.5 : 1}
              >
                <XStack alignItems="center" gap="$2">
                  <ArrowLeft size={16} color={currentStep === 0 ? '$grey6' : '$gray11'} />
                  <Text
                    fontSize={15}
                    fontWeight="600"
                    color={currentStep === 0 ? '$grey6' : '$gray11'}
                  >
                    Back
                  </Text>
                </XStack>
              </Button>

              <Button
                flex={1}
                backgroundColor="$blue9"
                onPress={nextStep}
                shadowColor="$blue9"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={4}
              >
                <XStack alignItems="center" gap="$2">
                  <Text fontSize={15} fontWeight="600" color="white">
                    {currentStepData.buttonText || (currentStep === steps.length - 1 ? 'Finish' : 'Next')}
                  </Text>
                  {currentStep < steps.length - 1 && (
                    <ArrowRight size={16} color="white" />
                  )}
                </XStack>
              </Button>
            </XStack>
          </Card>
        </Animated.View>
      </YStack>
    </Modal>
  );
};