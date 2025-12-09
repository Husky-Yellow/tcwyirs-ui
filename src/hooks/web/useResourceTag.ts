import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import type { ResourceTagVO } from '@/api/resource/tag'
import {
  getResourceTagList,
  createResourceTag,
  updateResourceTag,
  deleteResourceTag
} from '@/api/resource/tag'

/**
 * D~¡ Hook
 * (Ž¡D~„ž 9åÍ\
 */
export const useResourceTag = () => {
  const tagOptions = ref<DynamicSelectOption[]>([])
  const loading = ref(false)

  // ~ ID  h(Ž9n value å~ id	
  const tagIdMap = ref<Map<string | number, number>>(new Map())

  /**
   *  ResourceTagVO lb: DynamicSelectOption
   */
  const convertToOption = (tag: ResourceTagVO): DynamicSelectOption => {
    const value = tag.code || `tag_${tag.id}`
    // ûß~¾n: fixed
    const fixed = tag.type === 0

    // X¨ sû
    if (tag.id) {
      tagIdMap.value.set(value, tag.id)
    }

    return {
      label: tag.name,
      value,
      fixed
    }
  }

  /**
   *  }~h
   */
  const loadTags = async (params?: { type?: number; status?: number }) => {
    try {
      loading.value = true
      const res = await getResourceTagList(params)
      tagOptions.value = (res || []).map(convertToOption)
    } catch (error) {
      console.error(' }~h1%:', error)
      ElMessage.error(' }~h1%')
    } finally {
      loading.value = false
    }
  }

  /**
   * û ~
   */
  const addTag = async (option: DynamicSelectOption) => {
    try {
      const tagData: ResourceTagVO = {
        name: option.label,
        type: 1, // (7êšI~
        status: 1 // /(
      }

      const id = await createResourceTag(tagData)

      // ô° sû
      if (id) {
        tagIdMap.value.set(option.value, id)
      }

      ElMessage.success('û ~Ÿ')
      return true
    } catch (error) {
      console.error('û ~1%:', error)
      ElMessage.error('û ~1%')
      return false
    }
  }

  /**
   * ‘~
   */
  const editTag = async (option: DynamicSelectOption) => {
    try {
      const id = tagIdMap.value.get(option.value)
      if (!id) {
        ElMessage.warning('*~0~ID')
        return false
      }

      const tagData: ResourceTagVO = {
        id,
        name: option.label
      }

      await updateResourceTag(tagData)
      ElMessage.success('‘~Ÿ')
      return true
    } catch (error) {
      console.error('‘~1%:', error)
      ElMessage.error('‘~1%')
      return false
    }
  }

  /**
   *  d~
   */
  const deleteTag = async (value: string | number) => {
    try {
      const id = tagIdMap.value.get(value)
      if (!id) {
        ElMessage.warning('*~0~ID')
        return false
      }

      await deleteResourceTag(id)

      //  d sû
      tagIdMap.value.delete(value)

      ElMessage.success(' d~Ÿ')
      return true
    } catch (error) {
      console.error(' d~1%:', error)
      ElMessage.error(' d~1%')
      return false
    }
  }

  /**
   * 	yØDynamicSelect „ options-change ‹ö	
   */
  const handleOptionsChange = (options: DynamicSelectOption[]) => {
    tagOptions.value = options
  }

  // Äö}ö }~
  onMounted(() => {
    loadTags({ status: 1 }) // ê }/(„~
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
