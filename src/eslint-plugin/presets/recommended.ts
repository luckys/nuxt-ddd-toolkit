import type { Linter } from 'eslint'

export const recommendedPreset: Linter.Config = {
  rules: {
    'nuxt-ddd-toolkit/no-infrastructure-from-domain': 'error',
  },
}
