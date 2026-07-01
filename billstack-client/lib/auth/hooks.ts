// ── Authentication Hooks ─────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { register, login, logout, refresh } from './api';
import api from '../api';
import type { RegisterRequest, LoginRequest, AuthUser } from './types';

export const authKeys = {
  user: ['auth', 'user'] as const,
};

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (data) => {
      toast.success('Account created successfully');
      queryClient.setQueryData(authKeys.user, data.data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      toast.success('Welcome back!');
      queryClient.setQueryData(authKeys.user, data.data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.setQueryData(authKeys.user, null);
      window.location.href = '/login';
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: () => refresh(),
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
      // Force logout on refresh failure
      window.location.href = '/login';
    },
  });
}

export function useAuthUser() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.user,
    queryFn: async () => {
      try {
        const response = await api.get('/merchants/me');
        return response as unknown as AuthUser;
      } catch (error) {
        return null;
      }
    },
    staleTime: Infinity,
  });
}
