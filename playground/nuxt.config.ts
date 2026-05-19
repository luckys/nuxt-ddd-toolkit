import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['nuxt-ddd-toolkit'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  dddToolkit: {
    enableCapabilityDetection: true,
  },
})
