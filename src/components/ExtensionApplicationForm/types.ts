export interface ExtensionFormData {
  projectId: string | number
  dateRange: [string, string] | []
  description: string
}

export interface ProjectOption {
  label: string
  value: string | number
}
