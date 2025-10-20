export function makeRequiredRule() {
  return {
    type: 'Required',
    field: 'formCreate$required',
    title: '是否必填'
  }
}

// 组件前缀映射表 - 将英文组件名映射为中文
const componentPrefixMap = {
  'fc-editor': '编辑器',
  'fc-upload-file': '文件上传',
  'fc-upload-img': '图片上传',
  'fc-upload-imgs': '多图上传',
  'fc-select': '选择器',
  'fc-dict-select': '字典选择'
}

export const localeProps = (prefix, rules) => {
  return rules.map((rule) => {
    if (rule.field === 'formCreate$required') {
      rule.title = '必填'
    } else if (rule.field && rule.field !== '_optionType') {
      // 如果没有标题，使用 prefix 和 field 生成默认标题
      if (!rule.title) {
        // 提取组件名（prefix 格式通常是 'fc-xxx.props'）
        const componentName = prefix.split('.')[0]
        const chinesePrefix = componentPrefixMap[componentName] || componentName
        rule.title = `${chinesePrefix}.${rule.field}`
      }
    }
    return rule
  })
}

/**
 * 解析表单组件的  field, title 等字段（递归，如果组件包含子组件）
 *
 * @param rule  组件的生成规则 https://www.form-create.com/v3/guide/rule
 * @param fields 解析后表单组件字段
 * @param parentTitle  如果是子表单，子表单的标题，默认为空
 */
export const parseFormFields = (
  rule: Record<string, any>,
  fields: Array<Record<string, any>> = [],
  parentTitle: string = ''
) => {
  const { type, field, $required, title: tempTitle, children } = rule
  if (field && tempTitle) {
    let title = tempTitle
    if (parentTitle) {
      title = `${parentTitle}.${tempTitle}`
    }
    let required = false
    if ($required) {
      required = true
    }
    fields.push({
      field,
      title,
      type,
      required
    })
    // TODO 子表单 需要处理子表单字段
    // if (type === 'group' && rule.props?.rule && Array.isArray(rule.props.rule)) {
    //   // 解析子表单的字段
    //   rule.props.rule.forEach((item) => {
    //     parseFields(item, fieldsPermission, title)
    //   })
    // }
  }
  if (children && Array.isArray(children)) {
    children.forEach((rule) => {
      parseFormFields(rule, fields)
    })
  }
}
