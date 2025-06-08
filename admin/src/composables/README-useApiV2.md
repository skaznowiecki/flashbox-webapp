# useApiV2 Composable

A Vue 3 composable for making authenticated requests to your API v2 endpoint using AWS Amplify/Cognito tokens.

## Setup

Make sure you have the `VITE_API_V2_ENDPOINT` environment variable set in your `.env` file:

```env
VITE_API_V2_ENDPOINT=https://your-api-v2-endpoint.com
```

## Usage

### Basic Import

```javascript
import { useApiV2 } from '@/composables/useApiV2'
```

### In a Vue Component

```vue
<template>
  <div>
    <button @click="fetchData" :disabled="loading">Fetch Data</button>
    <button @click="createItem" :disabled="loading">Create Item</button>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="data">{{ data }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiV2 } from '@/composables/useApiV2'

const { get, post, put, del } = useApiV2()

const loading = ref(false)
const error = ref('')
const data = ref(null)

// GET request example
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await get('/users', {
      params: { page: 1, limit: 10 }
    })
    data.value = result
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// POST request example
const createItem = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const newItem = await post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    })
    console.log('Created:', newItem)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// PUT request example
const updateItem = async (id, updates) => {
  try {
    const updated = await put(`/users/${id}`, updates)
    return updated
  } catch (err) {
    console.error('Update failed:', err)
    throw err
  }
}

// DELETE request example
const deleteItem = async (id) => {
  try {
    await del(`/users/${id}`)
    console.log('Deleted successfully')
  } catch (err) {
    console.error('Delete failed:', err)
    throw err
  }
}
</script>
```

## Available Methods

### `get(endpoint, options)`
Make a GET request.

```javascript
const { get } = useApiV2()

// Simple GET
const users = await get('/users')

// GET with query parameters
const filteredUsers = await get('/users', {
  params: { status: 'active', page: 1 }
})

// GET with custom headers
const data = await get('/protected-endpoint', {
  headers: { 'X-Custom-Header': 'value' }
})
```

### `post(endpoint, body, options)`
Make a POST request.

```javascript
const { post } = useApiV2()

const newUser = await post('/users', {
  name: 'Jane Doe',
  email: 'jane@example.com'
})
```

### `put(endpoint, body, options)`
Make a PUT request.

```javascript
const { put } = useApiV2()

const updatedUser = await put('/users/123', {
  name: 'Jane Smith'
})
```

### `patch(endpoint, body, options)`
Make a PATCH request.

```javascript
const { patch } = useApiV2()

const partialUpdate = await patch('/users/123', {
  status: 'inactive'
})
```

### `del(endpoint, options)`
Make a DELETE request.

```javascript
const { del } = useApiV2()

await del('/users/123')
```

### `request(endpoint, options)`
Make a custom request with full control.

```javascript
const { request } = useApiV2()

const result = await request('/custom-endpoint', {
  method: 'PATCH',
  body: { data: 'value' },
  headers: { 'X-Custom': 'header' },
  params: { filter: 'active' }
})
```

### `getAuthToken()`
Get the current user's JWT token (useful for debugging or custom requests).

```javascript
const { getAuthToken } = useApiV2()

const token = await getAuthToken()
console.log('Current token:', token)
```

## Error Handling

The composable automatically handles common error scenarios:

- **Authentication errors**: If the user is not authenticated, it will throw an "Authentication required" error
- **HTTP errors**: Non-2xx responses are automatically converted to JavaScript errors with meaningful messages
- **Network errors**: Network failures are propagated as-is

```javascript
try {
  const data = await get('/endpoint')
} catch (error) {
  if (error.message === 'Authentication required') {
    // Handle authentication error (redirect to login, etc.)
  } else {
    // Handle other errors
    console.error('API Error:', error.message)
  }
}
```

## Features

- ✅ Automatic JWT token retrieval from AWS Cognito
- ✅ Automatic token injection in Authorization header
- ✅ Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Query parameter support
- ✅ Custom headers support
- ✅ Automatic JSON parsing
- ✅ Comprehensive error handling
- ✅ TypeScript-friendly (with JSDoc comments)
- ✅ Consistent API similar to AWS Amplify's API module

## Environment Variables

Make sure to set the following environment variable:

```env
VITE_API_V2_ENDPOINT=https://your-api-v2-endpoint.com
```

The composable will warn you in the console if this environment variable is not set. 