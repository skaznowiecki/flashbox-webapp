import { API } from 'aws-amplify'

export const useCreateCreditNote = async (invoice, key, internalId, payrollId) => {
  await API.post('api', '/invoices/mailbox/credit-note/store', {
    body: {
      data: invoice,
      key,
      internalId,
      payrollId
    }
  })
}
