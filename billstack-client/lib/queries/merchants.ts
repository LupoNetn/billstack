import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const merchantKeys = {
  me: ['merchants', 'me'] as const,
  apiKeys: ['merchants', 'api-keys'] as const,
  settlementAccounts: ['merchants', 'settlement-accounts'] as const,
  webhookConfig: ['merchants', 'webhook-config'] as const,
  portalConfig: ['merchants', 'portal-config'] as const,
  splitConfigs: ['merchants', 'split-configs'] as const,
};

export function useGetMe() {
  return useQuery({
    queryKey: merchantKeys.me,
    queryFn: async () => {
      const data = await api.get('/merchants/me');
      return data;
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/merchants/onboarding', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.me });
    },
  });
}

export function useSendVerificationCode() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/merchants/send-verification-code', {});
      return res;
    },
  });
}

export function useVerifyEmailCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/merchants/verify-email', { code });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.me });
    },
  });
}

export function useCreateApiKeys() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/merchants/api-keys', {});
      return res;
    },
  });
}

export function useGetSettlementAccounts() {
  return useQuery({
    queryKey: merchantKeys.settlementAccounts,
    queryFn: async () => {
      const data = await api.get('/merchants/settlement-accounts');
      return data;
    },
  });
}

export function useCreateSettlementAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/merchants/settlement-account', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.settlementAccounts });
    },
  });
}

export function useGetWebhookConfig() {
  return useQuery({
    queryKey: merchantKeys.webhookConfig,
    queryFn: async () => {
      const data = await api.get('/merchants/webhook-url');
      return data;
    },
    retry: false, // Might not exist initially
  });
}

export function useSetWebhookConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { webhook_url: string }) => {
      const res = await api.post('/merchants/webhook-url', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.webhookConfig });
    },
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/merchants/webhook-url/test', {});
      return res;
    },
  });
}

export function useGetPortalConfig() {
  return useQuery({
    queryKey: merchantKeys.portalConfig,
    queryFn: async () => {
      const data = await api.get('/merchants/portal-config');
      return data;
    },
    retry: false,
  });
}

export function useSavePortalConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/merchants/portal-config', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.portalConfig });
    },
  });
}

export function useGetSplitConfigs() {
  return useQuery({
    queryKey: merchantKeys.splitConfigs,
    queryFn: async () => {
      const data = await api.get('/merchants/split-config');
      return data;
    },
  });
}

export function useCreateSplitConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/merchants/split-config', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.splitConfigs });
    },
  });
}

export function useUpdateSplitConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/merchants/split-config/${id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.splitConfigs });
    },
  });
}

export function useDeleteSplitConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/merchants/split-config/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.splitConfigs });
    },
  });
}
