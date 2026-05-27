# @luckys_luis/nuxt-ddd-toolkit

[English](./README.md) | Español

Toolchain de Domain-Driven Design para proyectos Nuxt 4 / Nitro: un **plugin ESLint con 12 reglas** que protegen las invariantes DDD, un **CLI de scaffolding** (`laravelize` / `ddd-toolkit`), **presets** compartidos de linting/formato, y un **catálogo de skills IA** que se instalan automáticamente en `.claude/skills/` y `.cursor/rules/`.

> **`@luckys_luis/nuxt-laravelize-config` fue renombrado a este paquete en la v0.2.0.** El nombre antiguo sigue funcionando (re-exporta todo desde aquí) pero está deprecado.

## El stack Laravelize

| Paquete | Rol |
|---|---|
| **[`@luckys_luis/nuxt-ddd-toolkit`](./)** *(este)* | Toolchain — plugin ESLint con 12 reglas DDD, CLI scaffolding (`new:*`), presets, 15 skills IA con auto-link. |
| [`@luckys_luis/nuxt-laravelize`](../nuxt-laravelize) | Runtime — container DI, controllers, queues, mail, notifications, i18n, policies, seeders, factories, testing helpers. |

Usa el toolchain solo para cualquier proyecto Nuxt con sabor DDD, o emparéjalo con `@luckys_luis/nuxt-laravelize` para el runtime completo estilo Laravel.

## Tabla de contenido

- [Qué ofrece este paquete](#qué-ofrece-este-paquete)
- [Instalación](#instalación)
- [CLI `laravelize`](#cli-laravelize)
- [Skills para agentes IA](#skills-para-agentes-ia)
- [Plugin ESLint DDD](#plugin-eslint-ddd)
- [Presets compartidos](#presets-compartidos)
- [Desarrollo](#desarrollo)

## Qué ofrece este paquete

1. **Plugin ESLint DDD** (`./eslint-plugin`): 12 reglas semánticas que protegen las invariantes de Domain-Driven Design (sin imports infra→domain, naming de use cases, contratos de repositorios, etc.).
2. **CLI `laravelize`** (también alias `ddd-toolkit`) con dos familias de comandos:
   - `new:*` — scaffolding de contextos, agregados, value objects, repositorios, use cases, controladores, recursos, listeners, políticas, seeders y factorías.
   - `skills install|unlink|status` — gestiona los enlaces a `.claude/skills/` y `.cursor/rules/`.
3. **15 Skills IA** publicadas en el paquete; un postinstall las enlaza automáticamente si detecta `.claude/skills/` o `.cursor/rules/` en el repo consumidor.
4. **Presets compartidos**: ESLint flat (`recommended` / `strict`), Vitest, `tsconfig.base.json`, `oxlintrc.base.json`, `dprint.base.json`, `lefthook.base.yml`.

## Instalación

```bash
pnpm add -D @luckys_luis/nuxt-ddd-toolkit
```

> El `postinstall` enlaza automáticamente los skills si existen `.claude/skills/` y/o `.cursor/rules/`. Para desactivarlo: `NUXT_DDD_TOOLKIT_SKIP_POSTINSTALL=1 pnpm install` (la env var legacy `LARAVELIZE_SKIP_POSTINSTALL=1` también sigue funcionando).

## CLI `laravelize`

El bin se puede invocar como `laravelize` o `ddd-toolkit` — ambos apuntan al mismo entrypoint.

```bash
# bounded context + módulo
pnpm laravelize new:context billing
pnpm laravelize new:aggregate Invoice --context=billing --module=invoicing
pnpm laravelize new:value-object InvoiceAmount --context=billing --module=invoicing --type=int
pnpm laravelize new:repository Invoice --context=billing --module=invoicing --impl=drizzle
pnpm laravelize new:use-case InvoiceCreator --context=billing --module=invoicing --aggregate=Invoice --type=command

# HTTP / wiring
pnpm laravelize new:controller CreateInvoice
pnpm laravelize new:resource Invoice --context=billing --module=invoicing --aggregate=Invoice

# Eventos + side effects
pnpm laravelize new:listener NotifyAdminOfNewInvoice --context=billing --module=invoicing --event=InvoiceCreated --queued
pnpm laravelize new:policy Invoice
pnpm laravelize new:seeder DemoInvoice
pnpm laravelize new:factory Invoice --context=billing --module=invoicing

# skills
pnpm laravelize skills status
pnpm laravelize skills install --target=claude
pnpm laravelize skills unlink
```

Cada plantilla emite código que cumple las reglas Codely (`{Aggregate}{Action}er.execute()`, `{Verb}{Noun}Controller.invoke()`, value objects con `#value` + `#ensure*`, repositorios con `save/find/search/searchPaginated/count`).

## Skills para agentes IA

Catálogo (15) en formato Anthropic (`SKILL.md` con frontmatter):

`nuxt-laravelize-ddd-overview`, `create-bounded-context`, `create-aggregate`, `create-value-object`, `create-repository`, `create-use-case`, `create-controller-with-form-request`, `create-resource`, `create-listener-and-event`, `create-mail`, `create-notification`, `create-policy`, `create-seeder`, `create-factory`, `write-use-case-test-with-object-mother`.

El postinstall escribe `.laravelize-manifest.json` en cada destino enlazado; `laravelize skills unlink` los retira limpiamente. Para Cursor el contenido se reescribe a `.mdc` con globs `server/contexts/**`, `app/contexts/**`, `tests/**`.

## Plugin ESLint DDD

```js
// eslint.config.mjs
import dddPlugin from '@luckys_luis/nuxt-ddd-toolkit/eslint-plugin'

export default [
  dddPlugin.configs.recommended, // o configs.strict
]
```

**Reglas** (`recommended` activa las primeras 8; `strict` añade las cuatro últimas):

- `ddd/no-infrastructure-from-domain`
- `ddd/no-application-from-domain`
- `ddd/domain-flat`
- `ddd/use-case-naming` — `{Aggregate}{Action}er` (acepta `-er` y `-or`)
- `ddd/use-case-method-execute`
- `ddd/controller-single-action` — único método `invoke()`
- `ddd/repository-no-throw`
- `ddd/repository-required-methods` — `save/find/search/searchPaginated/count`
- `ddd/controller-naming` — verbos conocidos (Find, Create, Update, …)
- `ddd/aggregate-max-props` — máximo 4 props si la clase declara `toPrimitives`
- `ddd/value-object-private-value`
- `ddd/value-object-no-throw-in-constructor`

## Presets compartidos

Subpaths: `./eslint`, `./vitest`, `./tsconfig`, `./oxlint`, `./dprint`, `./lefthook`. Ejemplos:

```js
// eslint.config.mjs (sin plugin DDD)
import { defineNuxtLaravelizeEslintConfig } from '@luckys_luis/nuxt-ddd-toolkit/eslint'
export default defineNuxtLaravelizeEslintConfig({ preset: 'strict' })
```

```ts
// vitest.config.ts
import { mergeConfig, defineConfig } from 'vitest/config'
import { vitestBaseConfig } from '@luckys_luis/nuxt-ddd-toolkit/vitest'
export default mergeConfig(vitestBaseConfig, defineConfig({ test: { coverage: { reporter: ['html'] } } }))
```

## Migración desde `nuxt-laravelize-config`

```bash
pnpm remove @luckys_luis/nuxt-laravelize-config
pnpm add -D @luckys_luis/nuxt-ddd-toolkit
```

Luego sustituye `@luckys_luis/nuxt-laravelize-config` → `@luckys_luis/nuxt-ddd-toolkit` en todo tu proyecto. Todas las rutas de export y comportamiento son idénticos.

## Desarrollo

```bash
pnpm install
pnpm build      # tsup → dist/, copia skills + assets + cli/bin.js +755
pnpm test       # vitest (presets, postinstall, eslint-plugin rule-tester, CLI scaffolding)
pnpm typecheck  # tsc --noEmit
```

## Proceso de publicación

```bash
pnpm lint && pnpm test && pnpm typecheck && pnpm build
npm publish --access public
```
