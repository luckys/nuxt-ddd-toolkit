import { defineNuxtPlugin } from '#app'

type NuxtAppLike = {
  provide: (name: string, value: unknown) => void
}

export default defineNuxtPlugin((nuxtApp: NuxtAppLike) => {
  nuxtApp.provide('dddToolkit', {
    enabled: true,
    hasLaravelize: process.env.NUXT_DDD_TOOLKIT_HAS_LARAVELIZE === '1',
  })
})
