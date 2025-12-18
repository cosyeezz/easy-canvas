import { del, get, post, put } from './base'
import type {
  Collection,
  MCPServerDetail,
  Tool,
} from '@/app/components/tools/types'
import { CollectionType } from '@/app/components/tools/types'
import type { RAGRecommendedPlugins, ToolWithProvider } from '@/app/components/workflow/types'
import type { AppIconType } from '@/types/app'
import { useInvalid } from './use-base'
import type { QueryKey } from '@tanstack/react-query'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

const NAME_SPACE = 'tools'

const useAllToolProvidersKey = [NAME_SPACE, 'allToolProviders']
export const useAllToolProviders = (enabled = true) => {
  return useQuery<Collection[]>({
    queryKey: useAllToolProvidersKey,
    queryFn: () => Promise.resolve([]),
    enabled,
  })
}

export const useInvalidateAllToolProviders = () => {
  return useInvalid(useAllToolProvidersKey)
}

const useAllBuiltInToolsKey = [NAME_SPACE, 'builtIn']
export const useAllBuiltInTools = () => {
  return useQuery<ToolWithProvider[]>({
    queryKey: useAllBuiltInToolsKey,
    queryFn: () => Promise.resolve([]),
  })
}

export const useInvalidateAllBuiltInTools = () => {
  return useInvalid(useAllBuiltInToolsKey)
}

const useAllCustomToolsKey = [NAME_SPACE, 'customTools']
export const useAllCustomTools = () => {
  return useQuery<ToolWithProvider[]>({
    queryKey: useAllCustomToolsKey,
    queryFn: () => Promise.resolve([]),
  })
}

export const useInvalidateAllCustomTools = () => {
  return useInvalid(useAllCustomToolsKey)
}

const useAllWorkflowToolsKey = [NAME_SPACE, 'workflowTools']
export const useAllWorkflowTools = () => {
  return useQuery<ToolWithProvider[]>({
    queryKey: useAllWorkflowToolsKey,
    queryFn: () => Promise.resolve([]),
  })
}

export const useInvalidateAllWorkflowTools = () => {
  return useInvalid(useAllWorkflowToolsKey)
}

const useAllMCPToolsKey = [NAME_SPACE, 'MCPTools']
export const useAllMCPTools = () => {
  return useQuery<ToolWithProvider[]>({
    queryKey: useAllMCPToolsKey,
    queryFn: () => Promise.resolve([]),
  })
}

export const useInvalidateAllMCPTools = () => {
  return useInvalid(useAllMCPToolsKey)
}

const useInvalidToolsKeyMap: Record<string, QueryKey> = {
  [CollectionType.builtIn]: useAllBuiltInToolsKey,
  [CollectionType.custom]: useAllCustomToolsKey,
  [CollectionType.workflow]: useAllWorkflowToolsKey,
  [CollectionType.mcp]: useAllMCPToolsKey,
}
export const useInvalidToolsByType = (type?: CollectionType | string) => {
  const queryKey = type ? useInvalidToolsKeyMap[type] : undefined
  return useInvalid(queryKey)
}

export const useCreateMCP = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'create-mcp'],
    mutationFn: (payload: any) => Promise.resolve({} as ToolWithProvider),
  })
}

export const useUpdateMCP = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-mcp'],
    mutationFn: (payload: any) => Promise.resolve({} as any),
    onSuccess,
  })
}

export const useDeleteMCP = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'delete-mcp'],
    mutationFn: (id: string) => Promise.resolve({} as any),
    onSuccess,
  })
}

export const useAuthorizeMCP = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'authorize-mcp'],
    mutationFn: (payload: { provider_id: string; }) => Promise.resolve({ result: 'success', authorization_url: '' }),
  })
}

export const useUpdateMCPAuthorizationToken = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'refresh-mcp-server-code'],
    mutationFn: (payload: any) => Promise.resolve({} as MCPServerDetail),
  })
}

export const useMCPTools = (providerID: string) => {
  return useQuery({
    enabled: !!providerID,
    queryKey: [NAME_SPACE, 'get-MCP-provider-tool', providerID],
    queryFn: () => Promise.resolve({ tools: [] }),
  })
}

export const useInvalidateMCPTools = () => {
  const queryClient = useQueryClient()
  return (providerID: string) => {
    queryClient.invalidateQueries({
      queryKey: [NAME_SPACE, 'get-MCP-provider-tool', providerID],
    })
  }
}

export const useUpdateMCPTools = () => {
  return useMutation({
    mutationFn: (providerID: string) => Promise.resolve({ tools: [] }),
  })
}

export const useMCPServerDetail = (appID: string) => {
  return useQuery<MCPServerDetail>({
    queryKey: [NAME_SPACE, 'MCPServerDetail', appID],
    queryFn: () => Promise.resolve({} as MCPServerDetail),
  })
}

export const useInvalidateMCPServerDetail = () => {
  const queryClient = useQueryClient()
  return (appID: string) => {
    queryClient.invalidateQueries({
      queryKey: [NAME_SPACE, 'MCPServerDetail', appID],
    })
  }
}

export const useCreateMCPServer = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'create-mcp-server'],
    mutationFn: (payload: any) => Promise.resolve({} as any),
  })
}

export const useUpdateMCPServer = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-mcp-server'],
    mutationFn: (payload: any) => Promise.resolve({} as any),
  })
}

export const useRefreshMCPServerCode = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'refresh-mcp-server-code'],
    mutationFn: (appID: string) => Promise.resolve({} as MCPServerDetail),
  })
}

export const useBuiltinProviderInfo = (providerName: string) => {
  return useQuery({
    queryKey: [NAME_SPACE, 'builtin-provider-info', providerName],
    queryFn: () => Promise.resolve({} as Collection),
  })
}

export const useInvalidateBuiltinProviderInfo = () => {
  const queryClient = useQueryClient()
  return (providerName: string) => {
    queryClient.invalidateQueries({
      queryKey: [NAME_SPACE, 'builtin-provider-info', providerName],
    })
  }
}

export const useBuiltinTools = (providerName: string) => {
  return useQuery({
    enabled: !!providerName,
    queryKey: [NAME_SPACE, 'builtin-provider-tools', providerName],
    queryFn: () => Promise.resolve([] as Tool[]),
  })
}

export const useUpdateProviderCredentials = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-provider-credentials'],
    mutationFn: (payload: any) => Promise.resolve({} as any),
    onSuccess,
  })
}

export const useRemoveProviderCredentials = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'remove-provider-credentials'],
    mutationFn: (providerName: string) => Promise.resolve({} as any),
    onSuccess,
  })
}

const useRAGRecommendedPluginListKey = [NAME_SPACE, 'rag-recommended-plugins']

export const useRAGRecommendedPlugins = (type: 'tool' | 'datasource' | 'all' = 'all') => {
  return useQuery<RAGRecommendedPlugins>({
    queryKey: [...useRAGRecommendedPluginListKey, type],
    queryFn: () => Promise.resolve({} as RAGRecommendedPlugins),
  })
}

export const useInvalidateRAGRecommendedPlugins = () => {
  const queryClient = useQueryClient()
  return (type: 'tool' | 'datasource' | 'all' = 'all') => {
    queryClient.invalidateQueries({
      queryKey: [...useRAGRecommendedPluginListKey, type],
    })
  }
}

// App Triggers API hooks
export type AppTrigger = {
  id: string
  trigger_type: 'trigger-webhook' | 'trigger-schedule' | 'trigger-plugin'
  title: string
  node_id: string
  provider_name: string
  icon: string
  status: 'enabled' | 'disabled' | 'unauthorized'
  created_at: string
  updated_at: string
}

export const useAppTriggers = (appId: string | undefined, options?: any) => {
  return useQuery<{ data: AppTrigger[] }>({
    queryKey: [NAME_SPACE, 'app-triggers', appId],
    queryFn: () => Promise.resolve({ data: [] }),
    enabled: !!appId,
    ...options, // Merge additional options while maintaining backward compatibility
  })
}

export const useInvalidateAppTriggers = () => {
  const queryClient = useQueryClient()
  return (appId: string) => {
    queryClient.invalidateQueries({
      queryKey: [NAME_SPACE, 'app-triggers', appId],
    })
  }
}

export const useUpdateTriggerStatus = () => {
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-trigger-status'],
    mutationFn: (payload: any) => Promise.resolve({} as AppTrigger),
  })
}
