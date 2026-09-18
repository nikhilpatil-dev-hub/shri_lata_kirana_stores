import { apiClient as client } from '../api/client'

const data = async (request) => (await request).data.data

export const businessService = {
  shop: () => data(client.get('/shop')),
  createShop: (payload) => data(client.post('/shop', payload)),
  dashboard: () => data(client.get('/dashboard')),
  customers: (params) => data(client.get('/customers', { params })),
  createCustomer: (payload) => data(client.post('/customers', payload)),
  updateCustomer: (id, payload) => data(client.put(`/customers/${id}`, payload)),
  removeCustomer: (id) => data(client.delete(`/customers/${id}`)),
  searchCustomers: (q) => data(client.get('/customers/search', { params: { q } })),
  transactions: (params) => data(client.get('/transactions', { params })),
  createTransaction: (payload) => data(client.post('/transactions', payload)),
  paymentsForCustomer: (id) => data(client.get(`/customers/${id}/payments`)),
  createPayment: (payload) => data(client.post('/payments', payload)),
}
