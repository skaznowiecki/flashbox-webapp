import { API } from 'aws-amplify'

export const useGetDocument = async (id) => {
  return API.get('api', `/documents/${id}`)
}
