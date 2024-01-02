import { API } from 'aws-amplify'

export const useUploadInvoice = async (file) => {
  const { formData, uploadUrl, key } = await API.get('api', `/invoices/upload`)
  const form = new FormData()

  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key])
  })

  form.append('file', file)

  await fetch(uploadUrl, {
    method: 'POST',
    body: form
  })

  return key
}

export const useSendInvoice = async (key) => {
  const response = await API.post('api', '/invoices/mailbox', {
    body: {
      key,
      provider: 'MAILBOX'
    }
  })

  return response.id
}

export const useCreateInvoice = async (invoice, key, internalId, payrollId) => {
  await API.post('api', '/invoices/mailbox/store', {
    body: {
      data: invoice,
      key,
      internalId,
      payrollId
    }
  })
}
