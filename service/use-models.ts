import {
  del,
  get,
  post,
  put,
} from './base'
import type {
  ModelCredential,
  ModelItem,
  ModelLoadBalancingConfig,
  ModelTypeEnum,
  ProviderCredential,
} from '@/app/components/header/account-setting/model-provider-page/declarations'
import {
  useMutation,
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query'

const NAME_SPACE = 'models'

export const useModelProviderModelList = (provider: string) => {
  return useQuery({
    queryKey: [NAME_SPACE, 'model-list', provider],
    queryFn: () => Promise.resolve({ data: [] }),
  })
}

export const useGetProviderCredential = (enabled: boolean, provider: string, credentialId?: string) => {
  return useQuery({
    enabled,
    queryKey: [NAME_SPACE, 'model-list', provider, credentialId],
    queryFn: () => Promise.resolve({} as ProviderCredential),
  })
}

export const useAddProviderCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: ProviderCredential) => Promise.resolve({ result: 'success' }),
  })
}

export const useEditProviderCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: ProviderCredential) => Promise.resolve({ result: 'success' }),
  })
}

export const useDeleteProviderCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}

export const useActiveProviderCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}

export const useGetModelCredential = (
  enabled: boolean,
  provider: string,
  credentialId?: string,
  model?: string,
  modelType?: string,
  configFrom?: string,
) => {
  return useQuery({
    enabled,
    queryKey: [NAME_SPACE, 'model-list', provider, model, modelType, credentialId],
    queryFn: () => Promise.resolve({} as ModelCredential),
    staleTime: 0,
    gcTime: 0,
  })
}

export const useAddModelCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: ModelCredential) => Promise.resolve({ result: 'success' }),
  })
}

export const useEditModelCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: ModelCredential) => Promise.resolve({ result: 'success' }),
  })
}

export const useDeleteModelCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}

export const useDeleteModel = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}

export const useActiveModelCredential = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}

export const useUpdateModelLoadBalancingConfig = (provider: string) => {
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ result: 'success' }),
  })
}
