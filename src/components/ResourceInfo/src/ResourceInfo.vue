<template>
  <div class="bg-white">
    <h2 class="border-x-0 border-b border-t-0 border-[#0000000f] border-solid pb-22px text-20px text-black/85 font-medium leading-24px font-['PingFang_SC']">
      数据资源信息
    </h2>

    <!-- 基本信息 -->
    <div class="mb-40px mt-24px">
      <h3 class="mb-24px text-14px text-black/85 font-medium leading-24px font-['PingFang_SC']">基本信息</h3>
      <div class="grid grid-cols-4 gap-x-40px gap-y-20px">
        <div
          v-for="item in basicInfoItems"
          :key="item.label"
          class="flex items-baseline gap-8px"
          :class="item.fullWidth ? 'col-span-4' : ''"
        >
          <span class="whitespace-nowrap text-14px text-black/45 font-normal leading-22px font-['PingFang_SC']">
            {{ item.label }}：
          </span>
          <span class="text-14px text-black/88 font-normal leading-22px font-['PingFang_SC']">
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- 数据信息 -->
    <div class="mt-28px">
      <h3 class="mb-24px text-14px text-black/85 font-medium leading-24px font-['PingFang_SC']">数据信息</h3>
      <div class="grid grid-cols-3 gap-x-40px gap-y-20px">
        <div v-for="item in dataInfoItems" :key="item.label" class="flex items-baseline gap-8px">
          <span class="whitespace-nowrap text-14px text-black/45 font-normal leading-22px font-['PingFang_SC']">
            {{ item.label }}：
          </span>
          <span class="text-14px text-black/88 font-normal leading-22px font-['PingFang_SC']">
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
