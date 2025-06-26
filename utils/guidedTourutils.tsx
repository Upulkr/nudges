  import { Button, Card, Progress, Text, XStack, YStack } from 'tamagui';
  import { Animated, Dimensions, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';import { ArrowLeft, ArrowRight, Target, X } from 'lucide-react-native';
import { useRef,  } from 'react';
import { TourStep } from '@/components/GuidedTour';


  const pulseAnim = useRef(new Animated.Value(1)).current;




  export const renderHighlight = (currentStepData:TourStep) => {
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
  export const renderArrowPointer = (currentStepData:TourStep,tooltipPosition:{ x: number; y: number },) => {
    if (!currentStepData.highlight) return null;

    const { x: hx, y: hy, width, height } = currentStepData.highlight;
    const { x: tx, y: ty } = tooltipPosition;

    // Calculate arrow position and direction
    let arrowStyle = {};

    switch (currentStepData.placement) {
      case 'top':
        arrowStyle = {
          position: 'absolute',
          bottom: -8,
          left: Math.max(20, Math.min(280, hx + width / 2 - tx)),
          width: 0,
          height: 0,
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#FFFFFF',
        };
        break;
      case 'bottom':
        arrowStyle = {
          position: 'absolute',
          top: -8,
          left: Math.max(20, Math.min(280, hx + width / 2 - tx)),
          width: 0,
          height: 0,
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#FFFFFF',
        };
        break;
      case 'left':
        arrowStyle = {
          position: 'absolute',
          right: -8,
          top: Math.max(20, Math.min(160, hy + height / 2 - ty)),
          width: 0,
          height: 0,
          borderTopWidth: 8,
          borderBottomWidth: 8,
          borderLeftWidth: 8,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: '#FFFFFF',
        };
        break;
      case 'right':
        arrowStyle = {
          position: 'absolute',
          left: -8,
          top: Math.max(20, Math.min(160, hy + height / 2 - ty)),
          width: 0,
          height: 0,
          borderTopWidth: 8,
          borderBottomWidth: 8,
          borderRightWidth: 8,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: '#FFFFFF',
        };
        break;
    }

    return <YStack style={arrowStyle} />;
  };
  
  export const renderTooltip = (steps:TourStep[],currentStepData:TourStep,currentStep:number,tooltipPosition:{ x: number; y: number },fadeAnim:Animated.Value,nextStep:any,prevStep:() => void,skip:() => void,) => (
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
              value={Number(((currentStep + 1) / steps.length) * 100)}
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
  );

