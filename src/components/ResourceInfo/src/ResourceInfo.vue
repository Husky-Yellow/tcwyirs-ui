<template>
  <div class="bg-white">
    <h2 class="text-24px font-600 text-#1a1a1a mb-32px">数据资源信息</h2>

    <!-- 基本信息 -->
    <div class="mb-40px">
      <h3 class="text-18px font-600 text-#1a1a1a mb-24px">基本信息</h3>
      <div class="grid grid-cols-4 gap-x-40px gap-y-20px">
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">资源名称：</span>
          <span class="text-14px text-#333">{{ basicInfo.resourceName }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">资源标签：</span>
          <span class="text-14px text-#333">{{ basicInfo.resourceTag }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">资源联系人：</span>
          <span class="text-14px text-#333">{{ basicInfo.creator }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">资源上架时间：</span>
          <span class="text-14px text-#333">{{ basicInfo.publishTime }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">归属方：</span>
          <span class="text-14px text-#333">{{ basicInfo.owner }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">归属应用：</span>
          <span class="text-14px text-#333">{{ basicInfo.application }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">资源联系人：</span>
          <span class="text-14px text-#333">{{ basicInfo.contact }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">联系方式：</span>
          <span class="text-14px text-#333">{{ basicInfo.contactPhone }}</span>
        </div>
        <div class="flex flex-col gap-8px col-span-4">
          <span class="text-14px text-#999">描述：</span>
          <span class="text-14px text-#333">{{ basicInfo.descriptionText }}</span>
        </div>
      </div>
    </div>

    <!-- 数据信息 -->
    <div>
      <h3 class="text-18px font-600 text-#1a1a1a mb-24px">数据信息</h3>
      <div class="grid grid-cols-3 gap-x-40px gap-y-20px">
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">申请量：</span>
          <span class="text-14px text-#333">{{ dataInfo.applications }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">访问量：</span>
          <span class="text-14px text-#333">{{ dataInfo.visits }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <span class="text-14px text-#999">月度数数：</span>
          <span class="text-14px text-#333">{{ dataInfo.monthlyHits }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

withDefaults(defineProps<Props>(), {})
</script>
