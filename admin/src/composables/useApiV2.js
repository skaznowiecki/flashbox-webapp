import { Auth } from 'aws-amplify'

/**
 * Composable for making requests to API v2 endpoint with automatic token handling
 */
export function useApiV2() {
  const baseURL = import.meta.env.VITE_API_V2_ENDPOINT

  if (!baseURL) {
    console.warn('VITE_API_V2_ENDPOINT is not defined in environment variables')
  }

  /**
   * Get the current user's JWT token from AWS Cognito
   */
  const getAuthToken = async () => {
    try {
      const session = await Auth.currentSession()
      return session.getIdToken().getJwtToken()
    } catch (error) {
      console.error('Failed to get auth token:', error)
      throw new Error('Authentication required')
    }
  }

  /**
   * Make an authenticated request to API v2
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
      // Get the auth token
      const token = await getAuthToken()

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
        'Authorization': `Bearer ${token}`,
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
      console.error('API v2 request failed:', error)
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
    del,
    getAuthToken
  }
} 