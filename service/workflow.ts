import type { Fetcher } from 'swr'
import { get, post } from './base'
import type { CommonResponse } from '@/models/common'
import type {
  ChatRunHistoryResponse,
  ConversationVariableResponse,
  FetchWorkflowDraftResponse,
  NodesDefaultConfigsResponse,
  WorkflowRunHistoryResponse,
} from '@/types/workflow'
import type { BlockEnum } from '@/app/components/workflow/types'
import type { VarInInspect } from '@/types/workflow'
import type { FlowType } from '@/types/common'
import { getFlowPrefix } from './utils'

export const fetchWorkflowDraft = (url: string) => {
  return Promise.resolve({
    graph: { nodes: [], edges: [] },
    features: {},
    environment_variables: [],
    conversation_variables: [],
  }) as Promise<FetchWorkflowDraftResponse>
}

export const syncWorkflowDraft = ({ url, params }: {
  url: string
  params: Pick<FetchWorkflowDraftResponse, 'graph' | 'features' | 'environment_variables' | 'conversation_variables'>
}) => {
  return Promise.resolve({ updated_at: Date.now(), hash: 'mock-hash' })
}

export const fetchNodesDefaultConfigs: Fetcher<NodesDefaultConfigsResponse, string> = (url) => {
  return Promise.resolve({}) as Promise<NodesDefaultConfigsResponse>
}

export const fetchWorkflowRunHistory: Fetcher<WorkflowRunHistoryResponse, string> = (url) => {
  return get<WorkflowRunHistoryResponse>(url)
}

export const fetchChatRunHistory: Fetcher<ChatRunHistoryResponse, string> = (url) => {
  return get<ChatRunHistoryResponse>(url)
}

export const singleNodeRun = (flowType: FlowType, flowId: string, nodeId: string, params: object) => {
  return post(`${getFlowPrefix(flowType)}/${flowId}/workflows/draft/nodes/${nodeId}/run`, { body: params })
}

export const getIterationSingleNodeRunUrl = (flowType: FlowType, isChatFlow: boolean, flowId: string, nodeId: string) => {
  return `${getFlowPrefix(flowType)}/${flowId}/${isChatFlow ? 'advanced-chat/' : ''}workflows/draft/iteration/nodes/${nodeId}/run`
}

export const getLoopSingleNodeRunUrl = (flowType: FlowType, isChatFlow: boolean, flowId: string, nodeId: string) => {
  return `${getFlowPrefix(flowType)}/${flowId}/${isChatFlow ? 'advanced-chat/' : ''}workflows/draft/loop/nodes/${nodeId}/run`
}

export const fetchPublishedWorkflow: Fetcher<FetchWorkflowDraftResponse, string> = (url) => {
  return get<FetchWorkflowDraftResponse>(url)
}

export const stopWorkflowRun = (url: string) => {
  return post<CommonResponse>(url)
}

export const fetchNodeDefault = (appId: string, blockType: BlockEnum, query = {}) => {
  return Promise.resolve({})
}

export const fetchPipelineNodeDefault = (pipelineId: string, blockType: BlockEnum, query = {}) => {
  return Promise.resolve({})
}

// TODO: archived
export const updateWorkflowDraftFromDSL = (appId: string, data: string) => {
  return post<FetchWorkflowDraftResponse>(`apps/${appId}/workflows/draft/import`, { body: { data } })
}

export const fetchCurrentValueOfConversationVariable: Fetcher<ConversationVariableResponse, {
  url: string
  params: { conversation_id: string }
}> = ({ url, params }) => {
  return get<ConversationVariableResponse>(url, { params })
}

const fetchAllInspectVarsOnePage = async (flowType: FlowType, flowId: string, page: number): Promise<{ total: number, items: VarInInspect[] }> => {
  return get(`${getFlowPrefix(flowType)}/${flowId}/workflows/draft/variables`, {
    params: { page, limit: 100 },
  })
}
export const fetchAllInspectVars = async (flowType: FlowType, flowId: string): Promise<VarInInspect[]> => {
  const res = await fetchAllInspectVarsOnePage(flowType, flowId, 1)
  const { items, total } = res
  if (total <= 100)
    return items

  const pageCount = Math.ceil(total / 100)
  const promises = []
  for (let i = 2; i <= pageCount; i++)
    promises.push(fetchAllInspectVarsOnePage(flowType, flowId, i))

  const restData = await Promise.all(promises)
  restData.forEach(({ items: item }) => {
    items.push(...item)
  })
  return items
}

export const fetchNodeInspectVars = async (flowType: FlowType, flowId: string, nodeId: string): Promise<VarInInspect[]> => {
  const { items } = (await get(`${getFlowPrefix(flowType)}/${flowId}/workflows/draft/nodes/${nodeId}/variables`)) as { items: VarInInspect[] }
  return items
}
