import { API } from 'aws-amplify'
import { useFeatureFlags } from "@/composables/feature-flags"
import { useApi } from "@/composables/api"

const { isFeatureFlagEnabled } = useFeatureFlags()
const { get } = useApi()

export const useListSupplyPayrolls = async (id) => {
  if (isFeatureFlagEnabled('SUPPLIER', 'PAYROLL')) {
    return get(`/suppliers/${id}/payrolls`)
  } else {
    return API.get('api', `/payrolls/supplier/${id}`)
  }
}
