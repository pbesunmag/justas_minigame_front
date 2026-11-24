import axiosClient from './axiosClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/api'

export async function loginRequest(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>('/auth/register', payload)
  return data
}
