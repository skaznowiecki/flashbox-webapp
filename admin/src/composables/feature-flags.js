import featureFlags from '@/data/features-flags.json'

export function useFeatureFlags() {
  const isFeatureFlagEnabled = (service, feature) => {
    if (!featureFlags[service]) {
      console.error(`Service ${service} doesn't exist`)
      return false
    }

    if (!featureFlags[service][feature]) {
      console.error(`Feature ${feature} doesn't exist`)
      return false
    }
    
    return featureFlags[service][feature]
  }

  return {
    isFeatureFlagEnabled
  }
}