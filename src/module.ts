import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

import { detectLaravelizeCapability } from './capability-detection/detect-laravelize'

export type DddToolkitModuleOptions = {
  enableCapabilityDetection: boolean
}

export default defineNuxtModule<DddToolkitModuleOptions>({
  meta: {
    name: 'nuxt-ddd-toolkit',
    configKey: 'dddToolkit',
  },
  defaults: {
    enableCapabilityDetection: true,
  },
  setup(options) {
    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))

    if (!options.enableCapabilityDetection) {
      return
    }

    const capability = detectLaravelizeCapability(process.cwd())

    if (capability.installed) {
      process.env.NUXT_DDD_TOOLKIT_HAS_LARAVELIZE = '1'
    }
  },
})
