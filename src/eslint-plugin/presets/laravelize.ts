import type { Linter } from 'eslint'

export const laravelizePreset: Linter.Config = {
  rules: {
    'nuxt-ddd-toolkit/no-infrastructure-from-domain': 'error',
  },
}
