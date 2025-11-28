import { FormSchema } from '@/types/data'
import { ComponentOptions } from '@/types/component'
import { ElOption, ElOptionGroup } from 'element-plus'
import { getSlot } from '@/utils/tsxHelper'
import { Slots } from 'vue'

export const useRenderSelect = (slots: Slots) => {
  // 渲染 select options
  const renderSelectOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    return item?.componentProps?.options?.map((option) => {
      if (option?.options?.length) {
        return (
          <ElOptionGroup label={option[labelAlias || 'label']}>
            {option?.options?.map((v) => renderSelectOptionItem(item, v))}
          </ElOptionGroup>
        )
      } else {
        return renderSelectOptionItem(item, option)
      }
    })
  }

  // 渲染 select option item
  const renderSelectOptionItem = (item: FormSchema, option: ComponentOptions) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    const valueAlias = item?.componentProps?.optionsAlias?.valueField

    const { label, value, ...other } = option

    return (
      <ElOption
        {...other}
        label={labelAlias ? option[labelAlias] : label}
        value={valueAlias ? option[valueAlias] : value}>
        {item?.componentProps?.optionsSlot
          ? getSlot(slots, `${item.field}-option`, { item: option })
          : undefined}
      </ElOption>
    )
  }

  return {
    renderSelectOptions
  }
}





