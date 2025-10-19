export interface DrawerProps {
  modelValue: boolean
  title?: string
  size?: string | number
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showClose?: boolean
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  destroyOnClose?: boolean
  withHeader?: boolean
  zIndex?: number
}
