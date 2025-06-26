import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, H1, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '$gray2' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <YStack alignItems="center" marginBottom="$8" paddingTop="$5">
          <H1 fontSize={28} fontWeight="bold" color="$gray12" marginBottom="$2">
            Welcome Home
          </H1>
          <H2 fontSize={16} color="$gray10" textAlign="center">
            Your app is ready to go!
          </H2>
        </YStack>
        
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize={16} color="$gray11" textAlign="center" lineHeight={24}>
            This is your home screen. Start building your amazing app here.
          </Text>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}