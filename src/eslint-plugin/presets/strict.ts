import type { Linter } from 'eslint'

export const strictPreset: Linter.Config = {
  rules: {
    'nuxt-ddd-toolkit/no-infrastructure-from-domain': 'error',
    'max-depth': ['error', 1],
    'no-else-return': 'error',
  },
}
