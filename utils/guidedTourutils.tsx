import React, { useState, useRef, useEffect } from 'react';
import { Modal, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ArrowRight, ArrowLeft, X, Target } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Card, Progress, styled } from 'tamagui';

const ARROW_OFFSET = -8;
const ARROW_SIZE = 8;
const TOOLTIP_HORIZONTAL_PADDING = 20;
const TOOLTIP_HORIZONTAL_MAX = 280;
const TOOLTIP_VERTICAL_PADDING = 20;
const TOOLTIP_VERTICAL_MAX = 160;

interface CurrentStepData {
  highlight: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  placement?: string;
}

interface TooltipPosition {
  x: number;
  y: number;
}
interface ArrowProps {
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
const calculateArrowPosition = (hx: number, width: number, tx: number, padding: number, max: number): number => {
  return Math.max(padding, Math.min(max, hx + width / 2 - tx));
};

export const renderHighlight = (currentStepData: any, pulseAnim: any) => {
  if (!currentStepData.highlight) return null;

  const { x, y, width, height } = currentStepData.highlight;

  return (
    <>
      {/* Spotlight effect */}
      <YStack
        position="absolute"
        left={x - 10}
        top={y - 10}
        width={width + 20}
        height={height + 20}
        backgroundColor="transparent"
        borderRadius="$3"
        shadowColor="white"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.8}
        shadowRadius={20}
        elevation={10}
      />

      {/* Pulsing border */}
      <Animated.View
        style={{
          position: 'absolute',
          left: x - 5,
          top: y - 5,
          width: width + 10,
          height: height + 10,
          borderWidth: 3,
          borderColor: '#2563EB',
          borderRadius: 12,
          backgroundColor: 'transparent',
          transform: [{ scale: pulseAnim }],
        }}
      />

      {/* Target indicator */}
      <YStack
        position="absolute"
        left={x + width / 2 - 12}
        top={y + height / 2 - 12}
        width={24}
        height={24}
        backgroundColor="rgba(37, 99, 235, 0.1)"
        borderRadius="$3"
        alignItems="center"
        justifyContent="center"
      >
        <Target size={24} color="$blue9" />
      </YStack>
    </>
  );
};

export const renderTooltip = (
  currentStep: any,
  tooltipPosition: any,
  fadeAnim: any,
  currentStepData: any,
  steps: any,
  nextStep: any,
  prevStep: any,
  skip: any
) => (
  <Animated.View
    style={{
      position: 'absolute',
      left: tooltipPosition.x,
      top: tooltipPosition.y,
      width: 320,
      opacity: fadeAnim,
      transform: [
        {
          scale: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    }}
  >
    <Card
      backgroundColor="$background"
      borderRadius="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 12 }}
      shadowOpacity={0.4}
      shadowRadius={20}
      elevation={20}
    >
      {/* Arrow pointer */}
      {currentStepData.highlight && renderArrowPointer(currentStepData, tooltipPosition)}

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
            value={((currentStep + 1) / steps.length) * 100}
            backgroundColor="$gray5"
            height={3}
            borderRadius="$1"
          >
            <Progress.Indicator backgroundColor="$blue9" />
          </Progress>
        </YStack>
        {currentStepData.skipable !== false && (
          <TouchableOpacity onPress={skip} style={{ padding: 8, marginLeft: 12 }}>
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
            <ArrowLeft size={16} color={currentStep === 0 ? '$gray8' : '$gray11'} />
            <Text fontSize={15} fontWeight="600" color={currentStep === 0 ? '$gray8' : '$gray11'}>
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
            {currentStep < steps.length - 1 && <ArrowRight size={16} color="white" />}
          </XStack>
        </Button>
      </XStack>
      </YStack>
    </Card>
  </Animated.View>
);



const Arrow = styled(YStack, {
  variants: {
    placement: {
      top: {
        position: 'absolute',
        bottom: ARROW_OFFSET,
        left: calculateArrowPosition(0, 0, 0, TOOLTIP_HORIZONTAL_PADDING, TOOLTIP_HORIZONTAL_MAX) || 0,
        width: 0,
        height: 0,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
      },
      bottom: {
        position: 'absolute',
        top: ARROW_OFFSET,
        left: calculateArrowPosition(0, 0, 0, TOOLTIP_HORIZONTAL_PADDING, TOOLTIP_HORIZONTAL_MAX) || 0,
        width: 0,
        height: 0,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
      },
      left: {
        position: 'absolute',
        right: ARROW_OFFSET,
        top: calculateArrowPosition(0, 0, 0, TOOLTIP_VERTICAL_PADDING, TOOLTIP_VERTICAL_MAX) || 0,
        width: 0,
        height: 0,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#FFFFFF',
      },
      right: {
        position: 'absolute',
        left: ARROW_OFFSET,
        top: calculateArrowPosition(0, 0, 0, TOOLTIP_VERTICAL_PADDING, TOOLTIP_VERTICAL_MAX) || 0,
        width: 0,
        height: 0,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#FFFFFF',
      },
    },
  },
  defaultVariants: {
    placement: 'top',
  },
});


const renderArrowPointer = (currentStepData: CurrentStepData, tooltipPosition: TooltipPosition): React.ReactNode => {
  if (!currentStepData.highlight) return null;

  const { x: hx, y: hy, width, height } = currentStepData.highlight;
  const { x: tx, y: ty } = tooltipPosition;

  const style = {
    left: (currentStepData.placement === 'top' || currentStepData.placement === 'bottom') ? calculateArrowPosition(hx, width, tx, TOOLTIP_HORIZONTAL_PADDING, TOOLTIP_HORIZONTAL_MAX) : 0,
    top: (currentStepData.placement === 'left' || currentStepData.placement === 'right') ? calculateArrowPosition(hy, height, ty, TOOLTIP_VERTICAL_PADDING, TOOLTIP_VERTICAL_MAX) : 0,
  };

  return (
    <Arrow placement={currentStepData.placement || 'top'} style={style} />
  );
};
