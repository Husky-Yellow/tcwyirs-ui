export interface SearchFormSchema {
  // 字段名
  field: string
  // 标签
  label: string
  // 组件类型
  component:
    | 'Input'
    | 'Select'
    | 'DatePicker'
    | 'DateRangePicker'
    | 'TimePicker'
    | 'InputNumber'
    | 'slot'
  // 组件属性
  componentProps?: {
    placeholder?: string
    options?: Array<{ label: string; value: any }>
    [key: string]: any
  }
  // 表单验证规则
  rules?: Array<any>
  // 默认值
  defaultValue?: any
}

export interface SearchFormInstance {
  validate: () => Promise<boolean>
  resetFields: () => void
  getFormData: () => Recordable
  setFormData: (data: Recordable) => void
}
