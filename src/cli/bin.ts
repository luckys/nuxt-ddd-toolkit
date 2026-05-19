#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'

import { detectLaravelizeCapability } from '../capability-detection/detect-laravelize'

const main = defineCommand({
  meta: {
    name: 'laravelize',
    description: 'CLI for nuxt-ddd-toolkit scaffolding and workflows',
  },
  args: {
    cwd: {
      type: 'string',
      required: false,
      default: process.cwd(),
    },
  },
  async run({ args }: { args: { cwd: string } }) {
    const capability = detectLaravelizeCapability(args.cwd)

    if (capability.installed) {
      consola.success('nuxt-laravelize capability detected')
      return
    }

    consola.info('Running in standalone DDD toolkit mode')
  },
})

runMain(main)
