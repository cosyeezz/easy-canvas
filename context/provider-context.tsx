'use client'

import { createContext, useContext, useContextSelector } from 'use-context-selector'
import useSWR from 'swr'
import {
  fetchModelList,
  fetchModelProviders,
  fetchSupportRetrievalMethods,
} from '@/service/common'
import {
  ModelStatusEnum,
  ModelTypeEnum,
} from '@/app/components/header/account-setting/model-provider-page/declarations'
import type { Model, ModelProvider } from '@/app/components/header/account-setting/model-provider-page/declarations'
import type { RETRIEVE_METHOD } from '@/types/app'
import { noop } from 'lodash-es'

export type ProviderContextState = {
  modelProviders: ModelProvider[]
  refreshModelProviders: () => void
  textGenerationModelList: Model[]
  supportRetrievalMethods: RETRIEVE_METHOD[]
  isAPIKeySet: boolean
  enableBilling: boolean
  onPlanInfoChanged: () => void
  enableReplaceWebAppLogo: boolean
  modelLoadBalancingEnabled: boolean
  datasetOperatorEnabled: boolean
  webappCopyrightEnabled: boolean
}

export const baseProviderContextValue: ProviderContextState = {
  modelProviders: [],
  refreshModelProviders: noop,
  textGenerationModelList: [],
  supportRetrievalMethods: [],
  isAPIKeySet: true,
  enableBilling: false,
  onPlanInfoChanged: noop,
  enableReplaceWebAppLogo: false,
  modelLoadBalancingEnabled: false,
  datasetOperatorEnabled: false,
  webappCopyrightEnabled: false,
}

const ProviderContext = createContext<ProviderContextState>(baseProviderContextValue)

export const useProviderContext = () => useContext(ProviderContext)

// Adding a dangling comma to avoid the generic parsing issue in tsx, see:
// https://github.com/microsoft/TypeScript/issues/15713
export const useProviderContextSelector = <T,>(selector: (state: ProviderContextState) => T): T =>
  useContextSelector(ProviderContext, selector)

type ProviderContextProviderProps = {
  children: React.ReactNode
}
export const ProviderContextProvider = ({
  children,
}: ProviderContextProviderProps) => {
  const { data: providersData, mutate: refreshModelProviders } = useSWR('/workspaces/current/model-providers', fetchModelProviders)
  const fetchModelListUrlPrefix = '/workspaces/current/models/model-types/'
  const { data: textGenerationModelList } = useSWR(`${fetchModelListUrlPrefix}${ModelTypeEnum.textGeneration}`, fetchModelList)
  const { data: supportRetrievalMethods } = useSWR('/datasets/retrieval-setting', fetchSupportRetrievalMethods)

  return (
    <ProviderContext.Provider value={{
      modelProviders: providersData?.data || [],
      refreshModelProviders,
      textGenerationModelList: textGenerationModelList?.data || [],
      isAPIKeySet: !!textGenerationModelList?.data.some(model => model.status === ModelStatusEnum.active),
      supportRetrievalMethods: supportRetrievalMethods?.retrieval_method || [],
      enableBilling: false,
      onPlanInfoChanged: noop,
      enableReplaceWebAppLogo: false,
      modelLoadBalancingEnabled: false,
      datasetOperatorEnabled: false,
      webappCopyrightEnabled: false,
    }}>
      {children}
    </ProviderContext.Provider>
  )
}

export default ProviderContext
