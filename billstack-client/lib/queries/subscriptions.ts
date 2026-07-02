import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  list: (filters?: Record<string, unknown>) => ['subscriptions', 'list', filters] as const,
  detail: (id: string) => ['subscriptions', 'detail', id] as const,
};

export function useGetSubscriptions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await api.get("/subscriptions");
        return response.data;
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          const apiErr = err as { response?: { status?: number } };
          if (apiErr.response?.status === 404) {
            return [];
          }
        }
        throw err;
      }
    },
  });
}
export function useGetSubscription(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
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
