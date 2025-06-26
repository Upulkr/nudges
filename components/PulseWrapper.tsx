import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { YStack } from 'tamagui';
import { useTourStore } from '@/store/tourStore';

interface PulseWrapperProps {
  children: React.ReactNode;
  elementId: string;
  style?: any;
}

export const PulseWrapper: React.FC<PulseWrapperProps> = ({ 
  children, 
  elementId, 
  style 
}) => {
  const { pulsingElements } = useTourStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isPulsing = pulsingElements.has(elementId);

  useEffect(() => {
    if (isPulsing) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPulsing]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: pulseAnim }],
        }
      ]}
    >
      <YStack>
        {children}
      </YStack>
    </Animated.View>
  );
};