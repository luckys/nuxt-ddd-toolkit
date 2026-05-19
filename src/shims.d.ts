declare module '#app' {
  export function defineNuxtPlugin<T>(plugin: T): T
}

declare module 'citty' {
  export function defineCommand(input: unknown): unknown
  export function runMain(input: unknown): void
}

declare module 'consola' {
  export const consola: {
    success(message: string): void
    info(message: string): void
  }
}
