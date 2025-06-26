import { Link, Stack } from 'expo-router';
import { YStack, Text } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$5"
      >
        <Text fontSize={20} fontWeight="600" marginBottom="$4">
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Text color="$blue10" textDecorationLine="underline">
            Go to home screen!
          </Text>
        </Link>
      </YStack>
    </>
  );
}