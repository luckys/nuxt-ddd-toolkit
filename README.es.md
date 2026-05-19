# @luckys_luis/nuxt-ddd-toolkit

[English](./README.md) | Español

Toolkit DDD para proyectos Nuxt y Nitro, con integración opcional con `nuxt-laravelize`.

Este paquete agrupa tres capacidades base de bootstrap:

- un módulo Nuxt para detección de capacidades y exposición runtime
- un punto de entrada CLI (`laravelize` / `lz`)
- un plugin de ESLint con reglas de frontera de capas

## Tabla de contenido

- [Qué ofrece este paquete](#qué-ofrece-este-paquete)
- [Instalación](#instalación)
- [Inicio rápido](#inicio-rápido)
- [Configuración del módulo](#configuración-del-módulo)
- [Comportamiento de detección de capacidades](#comportamiento-de-detección-de-capacidades)
- [Uso del CLI](#uso-del-cli)
- [Uso del plugin de ESLint](#uso-del-plugin-de-eslint)
- [Límites actuales del bootstrap](#límites-actuales-del-bootstrap)
- [Desarrollo local](#desarrollo-local)
- [Flujo de publicación](#flujo-de-publicación)

## Qué ofrece este paquete

- Registro del módulo Nuxt con clave de configuración: `dddToolkit`.
- Detección opcional de la dependencia `nuxt-laravelize` en startup.
- Composable runtime: `useDddToolkitCapabilities()`.
- Aliases ejecutables del CLI:
  - `laravelize`
  - `lz`
- Regla del plugin ESLint:
  - `nuxt-ddd-toolkit/no-infrastructure-from-domain`

## Instalación

Instálalo en tu proyecto Nuxt:

```bash
pnpm add @luckys_luis/nuxt-ddd-toolkit
```

Requisito peer:

- `nuxt >= 4.0.0`

Paquete compañero opcional:

- `@luckys_luis/nuxt-laravelize`

## Inicio rápido

En `nuxt.config.ts`:

```ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@luckys_luis/nuxt-ddd-toolkit'],
  dddToolkit: {
    enableCapabilityDetection: true,
  },
})
```

En runtime:

```ts
const capabilities = useDddToolkitCapabilities()

if (capabilities.hasLaravelize) {
  console.log('nuxt-laravelize integration is available')
}
```

## Configuración del módulo

Clave del módulo: `dddToolkit`

Opciones disponibles:

- `enableCapabilityDetection: boolean` (por defecto: `true`)

Comportamiento:

- `true`: revisa `package.json` buscando `nuxt-laravelize` en `dependencies` o `devDependencies`.
- `false`: omite la inspección de capacidades.

## Comportamiento de detección de capacidades

Flujo de detección:

1. Localiza `package.json` desde el directorio de trabajo actual.
2. Lee `dependencies` y `devDependencies`.
3. Si existe `nuxt-laravelize`, define la variable:
   - `NUXT_DDD_TOOLKIT_HAS_LARAVELIZE=1`
4. El composable runtime expone:
   - `hasLaravelize: boolean`

## Uso del CLI

Comandos disponibles:

- `laravelize`
- `lz`

Comportamiento por defecto:

```bash
pnpm laravelize
```

Con directorio explícito:

```bash
pnpm laravelize --cwd .
```

Comportamiento de salida:

- imprime éxito cuando detecta `nuxt-laravelize`
- imprime un mensaje informativo cuando está en modo standalone

## Uso del plugin de ESLint

Export del paquete:

- `@luckys_luis/nuxt-ddd-toolkit/eslint-plugin`

Regla incluida en configuración `recommended`:

- `nuxt-ddd-toolkit/no-infrastructure-from-domain`

Objetivo:

- Evitar imports desde `/infrastructure/` dentro de archivos ubicados en `/domain/`.

Ejemplo de uso con configuración flat:

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

## Límites actuales del bootstrap

El alcance actual es intencionalmente acotado:

- introspección de capacidades
- exposición runtime de capacidades
- punto de entrada CLI mínimo
- una regla arquitectónica de ESLint

Todavía no incluye generadores completos de scaffolding ni orquestación avanzada de workflows.

## Desarrollo local

```bash
pnpm install
pnpm dev:prepare
pnpm dev
```

Validaciones de calidad:

```bash
pnpm lint
pnpm test
pnpm typecheck
```

## Flujo de publicación

```bash
pnpm lint && pnpm test && pnpm typecheck
pnpm prepack
pnpm publish
```
