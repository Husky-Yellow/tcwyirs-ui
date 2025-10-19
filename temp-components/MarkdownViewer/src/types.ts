export interface MenuItem {
  label: string
  value: string
  icon?: string
  children?: MenuItem[]
}

export interface MarkdownViewerProps {
  menuItems: MenuItem[]
  defaultActiveKey?: string
  menuWidth?: string
  contentPadding?: string
}
