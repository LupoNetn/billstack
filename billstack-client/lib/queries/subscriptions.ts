import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  list: (filters: any) => ['subscriptions', 'list', filters] as const,
  detail: (id: string) => ['subscriptions', 'detail', id] as const,
};

export function useGetSubscriptions(filters?: any) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: async () => {
      // Endpoint might not exist yet, returning empty array as fallback
      try {
        const data = await api.get(`/subscriptions`);
        return data || [];
      } catch (err: any) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
}

export function useGetSubscription(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: async () => {
      const data = await api.get(`/subscriptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/subscriptions/${id}/cancel`, {});
      return res;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(variables) });
    },
  });
}

export function usePauseSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await api.post(`/subscriptions/${id}/pause`, { pause_status: status });
      return res;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(variables.id) });
    },
  });
}
