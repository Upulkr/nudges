import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createAnimations } from '@tamagui/animations-react-native'

const config = createTamagui({
  defaultFont: 'body',
  animations: createAnimations({
    fast: {
      type: 'spring',
      damping: 20,
      mass: 1,
      stiffness: 250,
    },
    medium: {
      type: 'spring',
      damping: 10,
      mass: 1,
      stiffness: 100,
    },
    slow: {
      type: 'spring',
      damping: 20,
      stiffness: 60,
    },
  }),
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {},
  themes,
  tokens,
  media: {},
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config