/**
 * Composable for making requests to API endpoint without authentication
 */
export function useApi() {
  const baseURL = import.meta.env.VITE_API_V2_ENDPOINT

  if (!baseURL) {
    console.warn('VITE_API_V2_ENDPOINT is not defined in environment variables')
  }

  /**
   * Make a request to the API
   * @param {string} endpoint - The API endpoint (without base URL)
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {Object} options.body - Request body (will be JSON stringified)
   * @param {Object} options.headers - Additional headers
   * @param {Object} options.params - URL search parameters
   * @returns {Promise} - Response data
   */
  const request = async (endpoint, options = {}) => {
    const {
      method = 'GET',
      body,
      headers = {},
      params
    } = options

    try {
      // Build the URL
      let url = `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
      
      // Add query parameters if provided
      if (params) {
        const searchParams = new URLSearchParams(params)
        url += `?${searchParams.toString()}`
      }

      // Prepare headers
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
      }

      // Prepare request options
      const requestOptions = {
        method,
        headers: requestHeaders
      }

      // Add body for non-GET requests
      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body)
      }

      // Make the request
      const response = await fetch(url, requestOptions)

      // Handle non-ok responses
      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.message || parsedError.error || errorMessage
        } catch {
          // If parsing fails, use the raw text or default message
          errorMessage = errorData || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      // Parse response
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }

    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  const get = (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' })
  }

  const post = (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', body })
  }

  const put = (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PUT', body })
  }

  const patch = (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PATCH', body })
  }

  const del = (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' })
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    del
  }
} 