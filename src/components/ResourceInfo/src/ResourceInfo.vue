<template>
  <div class="bg-white">
    <h2 class="border-b border-[#0000000f] border-solid border-x-0 border-t-0 font-['PingFang_SC'] font-medium text-20px leading-24px text-black/85 pb-22px">
      数据资源信息
    </h2>

    <!-- 基本信息 -->
    <div class="mb-40px mt-24px">
      <h3 class="font-['PingFang_SC'] font-medium text-14px leading-24px text-black/85 mb-24px">基本信息</h3>
      <div class="grid grid-cols-4 gap-x-40px gap-y-20px">
        <div
          v-for="item in basicInfoItems"
          :key="item.label"
          class="flex items-baseline gap-8px"
          :class="item.fullWidth ? 'col-span-4' : ''"
        >
          <span class="font-['PingFang_SC'] font-normal text-14px leading-22px text-black/45 whitespace-nowrap">
            {{ item.label }}：
          </span>
          <span class="font-['PingFang_SC'] font-normal text-14px leading-22px text-black/88">
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- 数据信息 -->
    <div class="mt-28px">
      <h3 class="font-['PingFang_SC'] font-medium text-14px leading-24px text-black/85 mb-24px">数据信息</h3>
      <div class="grid grid-cols-3 gap-x-40px gap-y-20px">
        <div v-for="item in dataInfoItems" :key="item.label" class="flex items-baseline gap-8px">
          <span class="font-['PingFang_SC'] font-normal text-14px leading-22px text-black/45 whitespace-nowrap">
            {{ item.label }}：
          </span>
          <span class="font-['PingFang_SC'] font-normal text-14px leading-22px text-black/88">
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'ResourceInfo' })

interface BasicInfo {
  resourceName: string
  resourceTag: string
  owner: string
  creator: string
  application: string
  contact: string
  descriptionText: string
  publishTime: string
  contactPhone: string
}

interface DataInfo {
  applications: string
  visits: string
  monthlyHits: string
}

interface Props {
  basicInfo: BasicInfo
  dataInfo: DataInfo
}

const props = withDefaults(defineProps<Props>(), {})

const basicInfoItems = computed(() => [
  { label: '资源名称', value: props.basicInfo.resourceName },
  { label: '资源标签', value: props.basicInfo.resourceTag },
  { label: '资源联系人', value: props.basicInfo.creator },
  { label: '资源上架时间', value: props.basicInfo.publishTime },
  { label: '归属方', value: props.basicInfo.owner },
  { label: '归属应用', value: props.basicInfo.application },
  { label: '资源联系人', value: props.basicInfo.contact },
  { label: '联系方式', value: props.basicInfo.contactPhone },
  { label: '描述', value: props.basicInfo.descriptionText, fullWidth: true }
])

const dataInfoItems = computed(() => [
  { label: '申请量', value: props.dataInfo.applications },
  { label: '访问量', value: props.dataInfo.visits },
  { label: '月度数数', value: props.dataInfo.monthlyHits }
])
</script>
