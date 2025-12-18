import { get, put } from './base'
import type { CurrentPlanInfoBackend, SubscriptionUrlsBackend } from '@/app/components/billing/type'

export const fetchCurrentPlanInfo = () => {
  return Promise.resolve({
    billing: { enabled: false },
    education: { enabled: false, activated: false },
    can_replace_logo: false,
    model_load_balancing_enabled: false,
    dataset_operator_enabled: false,
    webapp_copyright_enabled: false,
    workspace_members: { size: 0, limit: 0 },
    is_allow_transfer_workspace: false,
    knowledge_pipeline: { publish_enabled: false },
  } as unknown as CurrentPlanInfoBackend)
}

export const fetchSubscriptionUrls = (plan: string, interval: string) => {
  return Promise.resolve({ url: '#' } as unknown as SubscriptionUrlsBackend)
}

export const fetchBillingUrl = () => {
  return Promise.resolve({ url: '#' })
}

export const bindPartnerStackInfo = (partnerKey: string, clickId: string) => {
  return put(`/billing/partners/${partnerKey}/tenants`, {
    body: {
      click_id: clickId,
    },
  }, {
    silent: true,
  })
}
