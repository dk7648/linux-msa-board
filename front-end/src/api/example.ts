import client from './client'

// Example API service
export const exampleApi = {
  // GET request example
  getItems: async () => {
    const response = await client.get('/items')
    return response.data
  },

  // GET by ID example
  getItemById: async (id: number) => {
    const response = await client.get(`/items/${id}`)
    return response.data
  },

  // POST request example
  createItem: async (data: unknown) => {
    const response = await client.post('/items', data)
    return response.data
  },

  // PUT request example
  updateItem: async (id: number, data: unknown) => {
    const response = await client.put(`/items/${id}`, data)
    return response.data
  },

  // DELETE request example
  deleteItem: async (id: number) => {
    const response = await client.delete(`/items/${id}`)
    return response.data
  },
}
