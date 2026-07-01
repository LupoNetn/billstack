// ── Authentication API ─────────────────────────────────────────────────────────

import axios from 'axios';
import type { RegisterRequest, LoginRequest, AuthResponse } from './types';

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060/v1',
  withCredentials: true, // Critical for HTTP-only cookies
});

export const authApiInstance = authApi;

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function refresh(): Promise<void> {
  await authApi.post('/auth/refresh');
}

export async function logout(): Promise<void> {
  await authApi.post('/auth/logout');
}
