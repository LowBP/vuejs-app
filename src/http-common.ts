import axios, { type AxiosInstance } from 'axios'
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-type': 'application/json'
  }
})
export default apiClient
