import type { Rule } from 'eslint'

type RuleLike = {
  meta: {
    type: 'problem' | 'suggestion' | 'layout'
    docs: {
      description: string
    }
    schema: unknown[]
    messages: Record<string, string>
  }
  create: Rule.RuleModule['create']
}

export const rules: Record<string, RuleLike> = {
  'no-infrastructure-from-domain': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prevent domain files from importing infrastructure layer files',
      },
      schema: [],
      messages: {
        noInfrastructureImport: 'Domain layer cannot import infrastructure files.',
      },
    },
    create(context: Rule.RuleContext) {
      return {
        ImportDeclaration(node: Rule.Node) {
          if (!('source' in node)) {
            return
          }

          const importDeclaration = node as Rule.Node & {
            source: {
              value: unknown
            }
          }

          const importPath = String(importDeclaration.source.value)

          if (!importPath.includes('/infrastructure/')) {
            return
          }

          if (!context.filename.includes('/domain/')) {
            return
          }

          context.report({
            node,
            messageId: 'noInfrastructureImport',
          })
        },
      }
    },
  },
}

export const configs = {
  recommended: {
    rules: {
      'nuxt-ddd-toolkit/no-infrastructure-from-domain': 'error',
    },
  },
}
