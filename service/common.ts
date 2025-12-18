import type { Fetcher } from 'swr'
import { del, get, patch, post, put } from './base'
import type {
  AccountIntegrate,
  ApiBasedExtension,
  CodeBasedExtension,
  CommonResponse,
  DataSourceNotion,
  FileUploadConfigResponse,
  ICurrentWorkspace,
  IWorkspace,
  InitValidateStatusResponse,
  InvitationResponse,
  LangGeniusVersionResponse,
  Member,
  ModerateResponse,
  OauthResponse,
  PluginProvider,
  Provider,
  ProviderAnthropicToken,
  ProviderAzureToken,
  SetupStatusResponse,
  UserProfileOriginResponse,
} from '@/models/common'
import type {
  UpdateOpenAIKeyResponse,
  ValidateOpenAIKeyResponse,
} from '@/models/app'
import {
  DefaultModelResponse,
  Model,
  ModelItem,
  ModelLoadBalancingConfig,
  ModelParameterRule,
  ModelProvider,
  ModelTypeEnum,
} from '@/app/components/header/account-setting/model-provider-page/declarations'
import type { RETRIEVE_METHOD } from '@/types/app'
import { defaultSystemFeatures, SystemFeatures } from '@/types/feature'

type LoginSuccess = {
  result: 'success'
  data: { access_token: string }
}
type LoginFail = {
  result: 'fail'
  data: string
  code: string
  message: string
}
type LoginResponse = LoginSuccess | LoginFail
export const login: Fetcher<LoginResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', data: { access_token: 'dummy_token' } })
}
export const webAppLogin: Fetcher<LoginResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', data: { access_token: 'dummy_token' } })
}

export const setup: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return Promise.resolve({ result: 'success' })
}

export const initValidate: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchInitValidateStatus = () => {
  return Promise.resolve({ status: 'finished' } as InitValidateStatusResponse)
}

export const fetchSetupStatus = () => {
  return Promise.resolve({ step: 'finished', setup_at: Date.now() } as SetupStatusResponse)
}

export const fetchUserProfile: Fetcher<UserProfileOriginResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({
    id: 'dummy_user_id',
    name: 'Dummy User',
    email: 'dummy@example.com',
    interface_language: 'en-US',
    interface_theme: 'light',
    timezone: 'UTC',
    last_login_at: Date.now(),
    last_login_ip: '127.0.0.1',
    created_at: Date.now(),
    is_password_set: true,
  } as UserProfileOriginResponse)
}

export const updateUserProfile: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchLangGeniusVersion: Fetcher<LangGeniusVersionResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({ current_version: '0.0.0', latest_version: '0.0.0', release_date: '', release_notes: '', version: '0.0.0', can_auto_update: false })
}

export const oauth: Fetcher<OauthResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({ redirect_url: '/' })
}

export const oneMoreStep: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchMembers: Fetcher<{ accounts: Member[] | null }, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({ accounts: [] })
}

export const fetchProviders: Fetcher<Provider[] | null, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve([])
}

export const validateProviderKey: Fetcher<ValidateOpenAIKeyResponse, { url: string; body: { token: string } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}
export const updateProviderAIKey: Fetcher<UpdateOpenAIKeyResponse, { url: string; body: { token: string | ProviderAzureToken | ProviderAnthropicToken } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchAccountIntegrates: Fetcher<{ data: AccountIntegrate[] | null }, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({ data: [] })
}

export const inviteMember: Fetcher<InvitationResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', invitation: {} as any, url: '' })
}

export const updateMemberRole: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const deleteMemberOrCancelInvitation: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return Promise.resolve({ result: 'success' })
}

export const sendOwnerEmail = (body: { language?: string }) =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyOwnerEmail = (body: { code: string; token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true, email: '', token: '' })

export const ownershipTransfer = (memberID: string, body: { token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true, email: '', token: '' })

export const fetchFilePreview: Fetcher<{ content: string }, { fileID: string }> = ({ fileID }) => {
  return Promise.resolve({ content: '' })
}

export const fetchCurrentWorkspace: Fetcher<ICurrentWorkspace, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({
    id: 'dummy_workspace_id',
    name: 'Dummy Workspace',
    role: 'owner',
    providers: [],
    in_trail: false,
    created_at: Date.now(),
    custom_config: {},
    plan: 'sandbox',
    status: 'active',
  } as ICurrentWorkspace)
}

export const updateCurrentWorkspace: Fetcher<ICurrentWorkspace, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({} as ICurrentWorkspace)
}

export const fetchWorkspaces: Fetcher<{ workspaces: IWorkspace[] }, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return Promise.resolve({ workspaces: [] })
}

export const switchWorkspace: Fetcher<CommonResponse & { new_tenant: IWorkspace }, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', new_tenant: {} as IWorkspace })
}

export const updateWorkspaceInfo: Fetcher<ICurrentWorkspace, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return Promise.resolve({} as ICurrentWorkspace)
}

export const fetchDataSource: Fetcher<{ data: DataSourceNotion[] }, { url: string }> = ({ url }) => {
  return Promise.resolve({ data: [] })
}

export const syncDataSourceNotion: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return Promise.resolve({ result: 'success' })
}

export const updateDataSourceNotionAction: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchPluginProviders: Fetcher<PluginProvider[] | null, string> = (url) => {
  return Promise.resolve([])
}

export const validatePluginProviderKey: Fetcher<ValidateOpenAIKeyResponse, { url: string; body: { credentials: any } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}
export const updatePluginProviderAIKey: Fetcher<UpdateOpenAIKeyResponse, { url: string; body: { credentials: any } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const invitationCheck: Fetcher<CommonResponse & { is_valid: boolean; data: { workspace_name: string; email: string; workspace_id: string } }, { url: string; params: { workspace_id?: string; email?: string; token: string } }> = ({ url, params }) => {
  return Promise.resolve({ result: 'success', is_valid: true, data: { workspace_name: 'Dummy', email: 'dummy@example.com', workspace_id: '1' } })
}

export const activateMember: Fetcher<LoginResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', data: { access_token: 'dummy' } })
}

// MOCK: Model Providers
export const fetchModelProviders: Fetcher<{ data: ModelProvider[] }, string> = (url) => {
  return Promise.resolve({
    data: [
      {
        provider: 'openai',
        label: { 'en-US': 'OpenAI' },
        icon_small: { 'en-US': 'openai_small.png' },
        icon_large: { 'en-US': 'openai_large.png' },
        background: '#000',
        help: { title: { 'en-US': 'Help' }, url: { 'en-US': '#' } },
        supported_model_types: [ModelTypeEnum.TEXT_GENERATION],
        configurate_methods: [],
        provider_credential_schema: { credential_form_schemas: [] },
        model_credential_schema: { credential_form_schemas: [] },
      } as unknown as ModelProvider
    ]
  })
}

export type ModelProviderCredentials = {
  credentials?: Record<string, string | undefined | boolean>
  load_balancing: ModelLoadBalancingConfig
}
export const fetchModelProviderCredentials: Fetcher<ModelProviderCredentials, string> = (url) => {
  return Promise.resolve({ load_balancing: { enabled: false, configs: [] } })
}

export const fetchModelLoadBalancingConfig: Fetcher<{
  credentials?: Record<string, string | undefined | boolean>
  load_balancing: ModelLoadBalancingConfig
}, string> = (url) => {
  return Promise.resolve({ load_balancing: { enabled: false, configs: [] } })
}

export const fetchModelProviderModelList: Fetcher<{ data: ModelItem[] }, string> = (url) => {
  return Promise.resolve({ data: [] })
}

// MOCK: Model List
export const fetchModelList: Fetcher<{ data: Model[] }, string> = (url) => {
  return Promise.resolve({
    data: [
      {
        id: 'gpt-3.5-turbo',
        model: 'gpt-3.5-turbo',
        model_type: ModelTypeEnum.TEXT_GENERATION,
        provider: {
          provider: 'openai',
          label: { 'en-US': 'OpenAI' },
          icon_small: { 'en-US': 'openai_small.png' },
          icon_large: { 'en-US': 'openai_large.png' },
          supported_model_types: [ModelTypeEnum.TEXT_GENERATION]
        },
        features: [],
        fetch_from: 'preset',
        model_properties: {
          mode: 'chat',
          context_size: 4096
        }
      } as unknown as Model
    ]
  })
}

export const validateModelProvider: Fetcher<ValidateOpenAIKeyResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const validateModelLoadBalancingCredentials: Fetcher<ValidateOpenAIKeyResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const setModelProvider: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const deleteModelProvider: Fetcher<CommonResponse, { url: string; body?: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const changeModelProviderPriority: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const setModelProviderModel: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

export const deleteModelProviderModel: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return Promise.resolve({ result: 'success' })
}

export const getPayUrl: Fetcher<{ url: string }, string> = (url) => {
  return Promise.resolve({ url: '#' })
}

// MOCK: Default Model
export const fetchDefaultModal: Fetcher<{ data: DefaultModelResponse }, string> = (url) => {
  return Promise.resolve({
    data: {
      model: 'gpt-3.5-turbo',
      model_type: ModelTypeEnum.TEXT_GENERATION,
      provider: {
          provider: 'openai',
          label: { 'en-US': 'OpenAI' },
          icon_small: { 'en-US': 'openai_small.png' },
          icon_large: { 'en-US': 'openai_large.png' },
          supported_model_types: [ModelTypeEnum.TEXT_GENERATION]
      }
    } as unknown as DefaultModelResponse
  })
}

export const updateDefaultModel: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success' })
}

// MOCK: Model Rules
export const fetchModelParameterRules: Fetcher<{ data: ModelParameterRule[] }, string> = (url) => {
  return Promise.resolve({ data: [] })
}

export const fetchFileUploadConfig: Fetcher<FileUploadConfigResponse, { url: string }> = ({ url }) => {
  return Promise.resolve({
    file_size_limit: 10,
    batch_count_limit: 5,
    image_file_size_limit: 5,
    file_types: [],
    image_file_types: []
  } as FileUploadConfigResponse)
}

export const fetchNotionConnection: Fetcher<{ data: string }, string> = (url) => {
  return Promise.resolve({ data: '' })
}

export const fetchDataSourceNotionBinding: Fetcher<{ result: string }, string> = (url) => {
  return Promise.resolve({ result: '' })
}

export const fetchApiBasedExtensionList: Fetcher<ApiBasedExtension[], string> = (url) => {
  return Promise.resolve([])
}

export const fetchApiBasedExtensionDetail: Fetcher<ApiBasedExtension, string> = (url) => {
  return Promise.resolve({} as ApiBasedExtension)
}

export const addApiBasedExtension: Fetcher<ApiBasedExtension, { url: string; body: ApiBasedExtension }> = ({ url, body }) => {
  return Promise.resolve(body)
}

export const updateApiBasedExtension: Fetcher<ApiBasedExtension, { url: string; body: ApiBasedExtension }> = ({ url, body }) => {
  return Promise.resolve(body)
}

export const deleteApiBasedExtension: Fetcher<{ result: string }, string> = (url) => {
  return Promise.resolve({ result: 'success' })
}

export const fetchCodeBasedExtensionList: Fetcher<CodeBasedExtension, string> = (url) => {
  return Promise.resolve({ data: [] } as unknown as CodeBasedExtension)
}

export const moderate = (url: string, body: { app_id: string; text: string }) => {
  return Promise.resolve({ flagged: false } as ModerateResponse)
}

type RetrievalMethodsRes = {
  retrieval_method: RETRIEVE_METHOD[]
}
export const fetchSupportRetrievalMethods: Fetcher<RetrievalMethodsRes, string> = (url) => {
  return Promise.resolve({ retrieval_method: [] })
}

// MOCK: System Features
export const getSystemFeatures = () => {
  return Promise.resolve(defaultSystemFeatures)
}

export const enableModel = (url: string, body: { model: string; model_type: ModelTypeEnum }) =>
  Promise.resolve({ result: 'success' })

export const disableModel = (url: string, body: { model: string; model_type: ModelTypeEnum }) =>
  Promise.resolve({ result: 'success' })

export const sendForgotPasswordEmail: Fetcher<CommonResponse & { data: string }, { url: string; body: { email: string } }> = ({ url, body }) =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyForgotPasswordToken: Fetcher<CommonResponse & { is_valid: boolean; email: string }, { url: string; body: { token: string } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', is_valid: true, email: '' })
}

export const changePasswordWithToken: Fetcher<CommonResponse, { url: string; body: { token: string; new_password: string; password_confirm: string } }> = ({ url, body }) =>
  Promise.resolve({ result: 'success' })

export const sendWebAppForgotPasswordEmail: Fetcher<CommonResponse & { data: string }, { url: string; body: { email: string } }> = ({ url, body }) =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyWebAppForgotPasswordToken: Fetcher<CommonResponse & { is_valid: boolean; email: string }, { url: string; body: { token: string } }> = ({ url, body }) => {
  return Promise.resolve({ result: 'success', is_valid: true, email: '' })
}

export const changeWebAppPasswordWithToken: Fetcher<CommonResponse, { url: string; body: { token: string; new_password: string; password_confirm: string } }> = ({ url, body }) =>
  Promise.resolve({ result: 'success' })

export const uploadRemoteFileInfo = (url: string, isPublic?: boolean, silent?: boolean) => {
  return Promise.resolve({ id: 'dummy_id', name: 'dummy_file', size: 0, mime_type: 'text/plain', url })
}

export const sendEMailLoginCode = (email: string, language = 'en-US') =>
  Promise.resolve({ result: 'success', data: '' })

export const emailLoginWithCode = (data: { email: string; code: string; token: string; language: string }) =>
  Promise.resolve({ result: 'success', data: { access_token: 'dummy' } } as unknown as LoginResponse)

export const sendResetPasswordCode = (email: string, language = 'en-US') =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyResetPasswordCode = (body: { email: string; code: string; token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true, token: 'dummy' })

export const sendWebAppEMailLoginCode = (email: string, language = 'en-US') =>
  Promise.resolve({ result: 'success', data: '' })

export const webAppEmailLoginWithCode = (data: { email: string; code: string; token: string }) =>
  Promise.resolve({ result: 'success', data: { access_token: 'dummy' } } as unknown as LoginResponse)

export const sendWebAppResetPasswordCode = (email: string, language = 'en-US') =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyWebAppResetPasswordCode = (body: { email: string; code: string; token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true, token: 'dummy' })

export const sendDeleteAccountCode = () =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyDeleteAccountCode = (body: { code: string; token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true })

export const submitDeleteAccountFeedback = (body: { feedback: string; email: string }) =>
  Promise.resolve({ result: 'success' })

export const getDocDownloadUrl = (doc_name: string) =>
  Promise.resolve({ url: '#' })

export const sendVerifyCode = (body: { email: string; phase: string; token?: string }) =>
  Promise.resolve({ result: 'success', data: '' })

export const verifyEmail = (body: { email: string; code: string; token: string }) =>
  Promise.resolve({ result: 'success', is_valid: true, email: '', token: '' })

export const resetEmail = (body: { new_email: string; token: string }) =>
  Promise.resolve({ result: 'success' })

export const checkEmailExisted = (body: { email: string }) =>
  Promise.resolve({ result: 'success' })