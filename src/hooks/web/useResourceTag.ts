import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import type { ResourceTagVO } from '@/api/resource/tag'
import {
  getResourceTagSimpleList,
  createResourceTag,
  updateResourceTag,
  deleteResourceTag
} from '@/api/resource/tag'

/**
 * 资源标签管理 Hook 选项
 */
export interface UseResourceTagOptions {
  /** 是否自动加载标签列表，默认为 true */
  autoLoad?: boolean
  /** 初始标签选项（如果提供则不自动加载） */
  initialOptions?: ResourceTagVO[]
}

/**
 * 资源标签管理 Hook
 * 提供资源标签的增删改查功能
 */
export const useResourceTag = (options: UseResourceTagOptions = {}) => {
  const { autoLoad = true, initialOptions } = options

  const tagOptions = ref<DynamicSelectOption[]>([])
  const loading = ref(false)

  // 标签 ID 映射表，用于将 DynamicSelect 的 value 映射到实际的标签 id
  const tagIdMap = ref<Map<string | number, number>>(new Map())

  /**
   * 将 ResourceTagVO 转换为 DynamicSelectOption
   */
  const convertToOption = (tag: ResourceTagVO): DynamicSelectOption => {
    // 直接使用标签 id 作为 value
    const value = tag.id || 0
    // 系统标签固定不可删除
    const fixed = tag.type === 0

    // 存储映射关系
    if (tag.id) {
      tagIdMap.value.set(value, tag.id)
    }

    return {
      label: tag.name,
      value,
      fixed
    }
  }

  // 如果提供了初始选项，则使用它们
  if (initialOptions) {
    tagOptions.value = initialOptions.map(convertToOption)
  }

  /**
   * 加载标签列表
   */
  const loadTags = async (params?: { type?: number; status?: number }) => {
    try {
      loading.value = true
      const res = await getResourceTagSimpleList(params)
      tagOptions.value = (res || []).map(convertToOption)
    } catch (error) {
      console.error('加载标签失败:', error)
      ElMessage.error('加载标签失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加标签
   * @returns 返回新创建标签的 id，失败返回 null
   */
  const addTag = async (option: DynamicSelectOption): Promise<number | null> => {
    try {
      const tagData: ResourceTagVO = {
        name: option.label,
        type: 1, // 用户自定义标签
        status: 1 // 启用
      }

      const id = await createResourceTag(tagData)

      if (id) {
        // 创建新的选项，使用返回的 id 作为 value
        const newOption: DynamicSelectOption = {
          label: option.label,
          value: id,
          fixed: false
        }

        // 更新映射表
        tagIdMap.value.set(id, id)

        // 查找并更新 tagOptions 中的临时选项
        const index = tagOptions.value.findIndex((opt) => opt.value === option.value)
        if (index !== -1) {
          tagOptions.value[index] = newOption
        } else {
          tagOptions.value.push(newOption)
        }

        ElMessage.success('添加标签成功')
        return id
      }

      return null
    } catch (error) {
      console.error('添加标签失败:', error)
      ElMessage.error('添加标签失败')
      return null
    }
  }

  /**
   * 编辑标签
   */
  const editTag = async (option: DynamicSelectOption) => {
    try {
      const id = tagIdMap.value.get(option.value)
      if (!id) {
        ElMessage.warning('未找到标签ID')
        return false
      }

      const tagData: ResourceTagVO = {
        id,
        name: option.label
      }

      await updateResourceTag(tagData)
      ElMessage.success('更新标签成功')
      return true
    } catch (error) {
      console.error('更新标签失败:', error)
      ElMessage.error('更新标签失败')
      return false
    }
  }

  /**
   * 删除标签
   */
  const deleteTag = async (value: string | number) => {
    try {
      const id = tagIdMap.value.get(value)
      if (!id) {
        ElMessage.warning('未找到标签ID')
        return false
      }

      await deleteResourceTag(id)

      // 删除映射关系
      tagIdMap.value.delete(value)

      ElMessage.success('删除标签成功')
      return true
    } catch (error) {
      console.error('删除标签失败:', error)
      ElMessage.error('删除标签失败')
      return false
    }
  }

  /**
   * 处理 DynamicSelect 的 options-change 事件
   */
  const handleOptionsChange = (options: DynamicSelectOption[]) => {
    tagOptions.value = options
  }

  // 组件挂载时加载标签列表（仅当 autoLoad 为 true 且未提供初始选项时）
  onMounted(() => {
    if (autoLoad && !initialOptions) {
      loadTags({ status: 1 }) // 只加载启用的标签
    }
  })

  return {
    tagOptions,
    loading,
    loadTags,
    addTag,
    editTag,
    deleteTag,
    handleOptionsChange
  }
}
