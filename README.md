# @luckys_luis/nuxt-ddd-toolkit

English | [Español](./README.es.md)

DDD toolkit for Nuxt and Nitro projects, with optional integration for `nuxt-laravelize`.

This package bundles three bootstrap capabilities:

- a Nuxt module for capability detection and runtime exposure
- a CLI entrypoint (`laravelize` / `lz`)
- an ESLint plugin with domain-boundary rules

## Table of contents

- [What this package provides](#what-this-package-provides)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Module configuration](#module-configuration)
- [Capability detection behavior](#capability-detection-behavior)
- [CLI usage](#cli-usage)
- [ESLint plugin usage](#eslint-plugin-usage)
- [Current bootstrap boundaries](#current-bootstrap-boundaries)
- [Local development](#local-development)
- [Release flow](#release-flow)

## What this package provides

- Nuxt module registration with config key: `dddToolkit`.
- Optional detection of `nuxt-laravelize` dependency at startup.
- Runtime composable: `useDddToolkitCapabilities()`.
- CLI executable aliases:
  - `laravelize`
  - `lz`
- ESLint plugin rule:
  - `nuxt-ddd-toolkit/no-infrastructure-from-domain`

## Installation

Install in your Nuxt project:

```bash
pnpm add @luckys_luis/nuxt-ddd-toolkit
```

Peer requirement:

- `nuxt >= 4.0.0`

Optional companion package:

- `@luckys_luis/nuxt-laravelize`

## Quick start

In `nuxt.config.ts`:

```ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@luckys_luis/nuxt-ddd-toolkit'],
  dddToolkit: {
    enableCapabilityDetection: true,
  },
})
```

In runtime code:

```ts
const capabilities = useDddToolkitCapabilities()

if (capabilities.hasLaravelize) {
  console.log('nuxt-laravelize integration is available')
}
```

## Module configuration

Module key: `dddToolkit`

Available options:

- `enableCapabilityDetection: boolean` (default: `true`)

Behavior:

- `true`: checks project `package.json` for `nuxt-laravelize` in dependencies or devDependencies.
- `false`: skips capability inspection.

## Capability detection behavior

Detection flow:

1. Locate `package.json` from current working directory.
2. Read `dependencies` and `devDependencies`.
3. If `nuxt-laravelize` exists, set env flag:
   - `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1`
4. Runtime composable exposes:
   - `hasLaravelize: boolean`

## CLI usage

Available commands:

- `laravelize`
- `lz`

Default behavior:

```bash
pnpm laravelize
```

With explicit working directory:

```bash
pnpm laravelize --cwd .
```

Output behavior:

- prints success when `nuxt-laravelize` is detected
- prints info message when running in standalone mode

## ESLint plugin usage

Package export:

- `@luckys_luis/nuxt-ddd-toolkit/eslint-plugin`

Rule included in `recommended` config:

- `nuxt-ddd-toolkit/no-infrastructure-from-domain`

Purpose:

- Prevent imports from `/infrastructure/` inside files located in `/domain/`.

Example flat config usage:

```js
import { rules, configs } from '@luckys_luis/nuxt-ddd-toolkit/eslint-plugin'

export default [
  {
    plugins: {
      'nuxt-ddd-toolkit': { rules },
    },
    rules: {
      ...configs.recommended.rules,
    },
  },
]
```

## Current bootstrap boundaries

Current scope is intentionally small:

- capability introspection
- runtime capability exposure
- minimal CLI entrypoint
- one architectural ESLint rule

It does not yet include complete scaffolding generators or advanced workflow orchestration.

## Local development

```bash
pnpm install
pnpm dev:prepare
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm test
pnpm typecheck
```

## Release flow

```bash
pnpm lint && pnpm test && pnpm typecheck
pnpm prepack
pnpm publish
```
