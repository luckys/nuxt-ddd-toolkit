# @luckys_luis/nuxt-ddd-toolkit

[English](./README.md) | Español

Toolkit ligero de bootstrap para cualquier proyecto Nuxt 4 / Nitro que siga arquitectura Domain-Driven Design. Incluye un módulo Nuxt, un CLI mínimo de preflight, un plugin ESLint que protege la frontera `domain ↔ infrastructure`, y un catálogo de skills IA — todo con integración **opcional** con `@luckys_luis/nuxt-laravelize`.

Si necesitas el runtime completo estilo Laravel (container DI, queues, mail, notifications, scaffolding, 12 reglas DDD…), usa `@luckys_luis/nuxt-laravelize` + `@luckys_luis/nuxt-laravelize-config`. Este paquete es el **punto de entrada mínimo**.

## El stack Laravelize

| Paquete | Rol |
|---|---|
| **[`@luckys_luis/nuxt-ddd-toolkit`](./)** *(este)* | Capa bootstrap — detección de capacidades, 1 regla ESLint, 4 skills, CLI mínimo. |
| [`@luckys_luis/nuxt-laravelize`](../nuxt-laravelize) | Runtime — container DI, controllers, queues, mail, notifications, i18n, policies… |
| [`@luckys_luis/nuxt-laravelize-config`](../nuxt-laravelize-config) | Toolchain — plugin ESLint con 12 reglas DDD, CLI scaffolding (`new:*`), presets, 15 skills IA. |

## Tabla de contenido

- [Qué ofrece este paquete](#qué-ofrece-este-paquete)
- [Instalación](#instalación)
- [Inicio rápido](#inicio-rápido)
- [Configuración del módulo](#configuración-del-módulo)
- [Detección de capacidades](#detección-de-capacidades)
- [Uso del CLI](#uso-del-cli)
- [Plugin ESLint](#plugin-eslint)
- [Skills IA incluidas](#skills-ia-incluidas)
- [Desarrollo](#desarrollo)

## Qué ofrece este paquete

- **Módulo Nuxt** con clave de configuración `dddToolkit`.
- **Detección opcional de capacidades** de `@luckys_luis/nuxt-laravelize` en arranque. Expone `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1` si lo encuentra.
- **Composable runtime** `useDddToolkitCapabilities()` → `{ hasLaravelize: boolean }`.
- **CLI bins** `laravelize` y `lz` (preflight: informa si `nuxt-laravelize` está presente).
- **Plugin ESLint** con una regla y cuatro presets.
- **4 skills IA** (`ddd-architecture`, `frontend-hexagonal-functional`, `nuxt-ddd-cli`, `nuxt-laravelize-runtime`).

## Instalación

```bash
pnpm add @luckys_luis/nuxt-ddd-toolkit
```

Peer requerido: `nuxt >= 4.0.0`. Paquete compañero opcional: `@luckys_luis/nuxt-laravelize`.

## Inicio rápido

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@luckys_luis/nuxt-ddd-toolkit'],
  dddToolkit: {
    enableCapabilityDetection: true, // por defecto
  },
})
```

```vue
<script setup lang="ts">
const { hasLaravelize } = useDddToolkitCapabilities()
</script>

<template>
  <p v-if="hasLaravelize">Corriendo con nuxt-laravelize.</p>
  <p v-else>Modo DDD standalone.</p>
</template>
```

## Configuración del módulo

| Opción | Tipo | Default | Propósito |
|---|---|---|---|
| `enableCapabilityDetection` | `boolean` | `true` | Escanea el `package.json` del host buscando `nuxt-laravelize` al arrancar. `false` evita la lectura FS. |

## Detección de capacidades

Flujo al arrancar:

1. Lee el `package.json` del consumidor desde `process.cwd()`.
2. Busca `nuxt-laravelize` en `dependencies` o `devDependencies`.
3. Si lo encuentra, define `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1`.
4. `useDddToolkitCapabilities()` lee esa variable de entorno en runtime.

No hay recorridos de filesystem más allá de leer un solo `package.json`. Seguro en CI y contenedores serverless.

## Uso del CLI

```bash
pnpm laravelize           # o `pnpm lz`
pnpm laravelize --cwd .   # directorio explícito
```

Salida:

- `success: nuxt-laravelize capability detected` — cuando el runtime está instalado.
- `info: Running in standalone DDD toolkit mode` — en caso contrario.

> El CLI completo de scaffolding (`new:context`, `new:aggregate`, `new:use-case`…) vive en `@luckys_luis/nuxt-laravelize-config`.

## Plugin ESLint

Subpath: `@luckys_luis/nuxt-ddd-toolkit/eslint-plugin`.

### Regla

- `nuxt-ddd-toolkit/no-infrastructure-from-domain` — prohíbe imports desde `/infrastructure/` dentro de archivos en `/domain/`.

### Presets

| Preset | Reglas |
|---|---|
| `recommended` | `no-infrastructure-from-domain: error` |
| `strict` | `recommended` + `max-depth: 1` + `no-else-return: error` |
| `laravelize` | `recommended` (slot reservado para reglas específicas del runtime Laravelize sin churn futuro) |
| `frontend` | `recommended` (slot reservado para reglas frontend) |

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

## Skills IA incluidas

Formato Anthropic `SKILL.md`. Fuente en `src/skills/`:

| Skill | Propósito |
|---|---|
| `ddd-architecture` | Estructura DDD por capas para cualquier proyecto TS/JS. |
| `frontend-hexagonal-functional` | Bounded contexts frontend con value objects funcionales. |
| `nuxt-ddd-cli` | Cómo usar el CLI de preflight `laravelize` / `lz`. |
| `nuxt-laravelize-runtime` | Integrar `nuxt-ddd-toolkit` con los contratos runtime de `nuxt-laravelize`. |

Este paquete **no** auto-enlaza los skills. Para enlace automático a `.claude/skills/` y `.cursor/rules/` usa `@luckys_luis/nuxt-laravelize-config` (que trae 15 skills más completos).

## Desarrollo

```bash
pnpm install
pnpm dev:prepare
pnpm dev        # playground
pnpm test       # vitest
pnpm typecheck  # vue-tsc --noEmit
pnpm lint
```

## Publicación

```bash
pnpm lint && pnpm test && pnpm typecheck && pnpm prepack
pnpm publish
```
