export function useDddToolkitCapabilities() {
  return {
    hasLaravelize: process.env.NUXT_DDD_TOOLKIT_HAS_LARAVELIZE === '1',
  }
}
