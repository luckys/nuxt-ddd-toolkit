import type { Linter } from 'eslint'

export const frontendPreset: Linter.Config = {
  rules: {
    'nuxt-ddd-toolkit/no-infrastructure-from-domain': 'error',
  },
}
