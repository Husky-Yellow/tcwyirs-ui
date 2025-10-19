export type ApprovalStatus = 'waiting' | 'processing' | 'completed' | 'rejected'

export interface ApprovalStep {
  title: string
  time?: string
  status: ApprovalStatus
  description?: string
}

export interface ApprovalProcessProps {
  steps: ApprovalStep[]
  activeColor?: string
  inactiveColor?: string
}
