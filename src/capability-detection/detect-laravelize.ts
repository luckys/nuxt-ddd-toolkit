import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type CapabilityResult = {
  installed: boolean
}

type PackageJsonShape = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function detectLaravelizeCapability(currentWorkingDirectory: string): CapabilityResult {
  const packageJsonPath = join(currentWorkingDirectory, 'package.json')

  if (!existsSync(packageJsonPath)) {
    return { installed: false }
  }

  const rawPackageJson = readFileSync(packageJsonPath, 'utf-8')
  const parsedPackageJson = JSON.parse(rawPackageJson) as PackageJsonShape

  const dependencyNames = new Set<string>([
    ...Object.keys(parsedPackageJson.dependencies ?? {}),
    ...Object.keys(parsedPackageJson.devDependencies ?? {}),
  ])

  return {
    installed: dependencyNames.has('nuxt-laravelize'),
  }
}
