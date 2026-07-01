import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const planKeys = {
  all: ['plans'] as const,
  list: (filters: any) => ['plans', 'list', filters] as const,
  detail: (id: string) => ['plans', 'detail', id] as const,
};

export function useGetPlans(filters?: { limit?: number; offset?: number; status?: string }) {
  return useQuery({
    queryKey: planKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.status) params.append('status', filters.status);
      
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get(`/plans${queryStr}`);
      return data;
    },
  });
}

export function useGetPlan(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: async () => {
      const data = await api.get(`/plans/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/plans', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.patch(`/plans/${id}`, data);
      return res;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.id) });
    },
  });
}

export function useArchivePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/plans/${id}/archive`);
      return res;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables) });
    },
  });
}
