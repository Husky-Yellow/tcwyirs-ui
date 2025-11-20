/**
 * 组件类型定义
 * 包含组件名称、属性、选项等通用组件类型
 */

// ========== 组件名称 ==========

export type ComponentName =
  | 'Radio'
  | 'RadioButton'
  | 'Checkbox'
  | 'CheckboxButton'
  | 'Input'
  | 'Autocomplete'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'Divider'
  | 'TimeSelect'
  | 'SelectV2'
  | 'TreeSelect'
  | 'InputPassword'
  | 'Editor'
  | 'UploadImg'
  | 'UploadImgs'
  | 'UploadFile'

// ========== 列属性 ==========

export type ColProps = {
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  tag?: string
}

// ========== 组件选项 ==========

export type ComponentOptions = {
  label?: string
  value?: any
  disabled?: boolean
  key?: string | number
  children?: ComponentOptions[]
  options?: ComponentOptions[]
} & Recordable

export type ComponentOptionsAlias = {
  labelField?: string
  valueField?: string
}

export type ComponentProps = {
  optionsAlias?: ComponentOptionsAlias
  options?: ComponentOptions[]
  optionsSlot?: boolean
} & Recordable
