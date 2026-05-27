# @luckys_luis/nuxt-ddd-toolkit

English | [Español](./README.es.md)

Lightweight bootstrap toolkit for any Nuxt 4 / Nitro project that follows a Domain-Driven Design layout. It ships a Nuxt module, a small preflight CLI, an ESLint plugin guarding the `domain ↔ infrastructure` boundary, and an AI skills catalogue — all with **optional** integration with `@luckys_luis/nuxt-laravelize`.

If you need the full Laravel-style runtime (DI container, queues, mail, notifications, scaffolding, 12 DDD rules…), use `@luckys_luis/nuxt-laravelize` + `@luckys_luis/nuxt-laravelize-config` instead. This package is the **minimal entry point**.

## The Laravelize stack

| Package | Role |
|---|---|
| **[`@luckys_luis/nuxt-ddd-toolkit`](./)** *(this one)* | Bootstrap layer — capability detection, 1 ESLint rule, 4 skills, minimal CLI. |
| [`@luckys_luis/nuxt-laravelize`](../nuxt-laravelize) | Runtime — DI container, controllers, queues, mail, notifications, i18n, policies… |
| [`@luckys_luis/nuxt-laravelize-config`](../nuxt-laravelize-config) | Toolchain — 12-rule DDD ESLint plugin, scaffolding CLI (`new:*`), shared presets, 15 AI skills. |

## Contents

- [What this package provides](#what-this-package-provides)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Module configuration](#module-configuration)
- [Capability detection](#capability-detection)
- [CLI usage](#cli-usage)
- [ESLint plugin](#eslint-plugin)
- [Bundled AI skills](#bundled-ai-skills)
- [Development](#development)

## What this package provides

- **Nuxt module** with config key `dddToolkit`.
- **Optional capability detection** of `@luckys_luis/nuxt-laravelize` at startup. Exposes `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1` when found.
- **Runtime composable** `useDddToolkitCapabilities()` → `{ hasLaravelize: boolean }`.
- **CLI bins** `laravelize` and `lz` (preflight: reports whether `nuxt-laravelize` is present).
- **ESLint plugin** with one rule and four presets.
- **4 AI skills** (`ddd-architecture`, `frontend-hexagonal-functional`, `nuxt-ddd-cli`, `nuxt-laravelize-runtime`).

## Installation

```bash
pnpm add @luckys_luis/nuxt-ddd-toolkit
```

Peer requirement: `nuxt >= 4.0.0`. Optional companion: `@luckys_luis/nuxt-laravelize`.

## Quick start

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@luckys_luis/nuxt-ddd-toolkit'],
  dddToolkit: {
    enableCapabilityDetection: true, // default
  },
})
```

```vue
<script setup lang="ts">
const { hasLaravelize } = useDddToolkitCapabilities()
</script>

<template>
  <p v-if="hasLaravelize">Running with nuxt-laravelize.</p>
  <p v-else>Standalone DDD mode.</p>
</template>
```

## Module configuration

| Option | Type | Default | Purpose |
|---|---|---|---|
| `enableCapabilityDetection` | `boolean` | `true` | Scans the host `package.json` for `nuxt-laravelize` at boot. Set `false` to skip the FS read entirely. |

## Capability detection

Flow at boot:

1. Read the consumer's `package.json` from `process.cwd()`.
2. Look for `nuxt-laravelize` in `dependencies` or `devDependencies`.
3. If found, set `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1`.
4. `useDddToolkitCapabilities()` reads that env var at runtime.

No filesystem traversal beyond a single `package.json` read. Safe in CI and serverless containers.

## CLI usage

```bash
pnpm laravelize           # or `pnpm lz`
pnpm laravelize --cwd .   # explicit working directory
```

Output:

- `success: nuxt-laravelize capability detected` — when the runtime package is installed.
- `info: Running in standalone DDD toolkit mode` — otherwise.

> The richer scaffolding CLI (`new:context`, `new:aggregate`, `new:use-case`…) lives in `@luckys_luis/nuxt-laravelize-config`.

## ESLint plugin

Subpath export: `@luckys_luis/nuxt-ddd-toolkit/eslint-plugin`.

### Rule

- `nuxt-ddd-toolkit/no-infrastructure-from-domain` — prevents imports from `/infrastructure/` inside files under `/domain/`.

### Presets

| Preset | Rules |
|---|---|
| `recommended` | `no-infrastructure-from-domain: error` |
| `strict` | `recommended` + `max-depth: 1` + `no-else-return: error` |
| `laravelize` | `recommended` (slot kept distinct so projects on the Laravelize runtime can opt into runtime-specific rules later without churn) |
| `frontend` | `recommended` (slot for future frontend-only rules) |

```js
// eslint.config.mjs
import { rules, configs } from '@luckys_luis/nuxt-ddd-toolkit/eslint-plugin'

export default [
  {
    plugins: { 'nuxt-ddd-toolkit': { rules } },
    rules: configs.recommended.rules,
  },
]
```

## Bundled AI skills

Anthropic `SKILL.md` format. Source files live in `src/skills/`:

| Skill | Purpose |
|---|---|
| `ddd-architecture` | Layered DDD layout for any TS/JS project. |
| `frontend-hexagonal-functional` | Build frontend bounded contexts with functional value objects. |
| `nuxt-ddd-cli` | How to use the `laravelize` / `lz` preflight CLI. |
| `nuxt-laravelize-runtime` | Integrate `nuxt-ddd-toolkit` with `nuxt-laravelize` runtime contracts. |

Skills are not auto-linked by this package. For automatic linking into `.claude/skills/` and `.cursor/rules/`, use `@luckys_luis/nuxt-laravelize-config` (which bundles 15 richer skills).

## Development

```bash
pnpm install
pnpm dev:prepare
pnpm dev        # playground
pnpm test       # vitest
pnpm typecheck  # vue-tsc --noEmit
pnpm lint
```

## Release

```bash
pnpm lint && pnpm test && pnpm typecheck && pnpm prepack
pnpm publish
```
