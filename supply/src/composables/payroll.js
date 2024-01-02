import { API } from 'aws-amplify'

export const useListSupplyPayrolls = async (id) => {
  return API.get('api', `/payrolls/supplier/${id}`)
}
