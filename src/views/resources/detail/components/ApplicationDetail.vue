<template>
  <div class="application-detail">
    <!-- 应用资源信息 -->
    <el-card class="detail-card mb-16px" shadow="never">
      <template #header>
        <div class="card-header text-16px font-600">应用资源信息</div>
      </template>

      <!-- 基本信息 -->
      <div class="section-title mb-12px text-14px font-600">基本信息</div>
      <div class="info-grid mb-24px">
        <div class="info-item">
          <span class="label">资源名称：</span>
          <span class="value">{{ baseInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">应用资源地址：</span>
          <span class="value link">{{ baseInfo.componentUrl || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">资源类型：</span>
          <span class="value">{{ getTypeName(baseInfo.type) }}</span>
        </div>

        <div class="info-item">
          <span class="label">上架状态：</span>
          <span class="value">{{ getStatusName(baseInfo.publishStatus) }}</span>
        </div>
        <div class="info-item">
          <span class="label">资源创建人：</span>
          <span class="value">{{ baseInfo.linkPerson || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">上架时间：</span>
          <span class="value">{{ formatDate(baseInfo.createTime) }}</span>
        </div>

        <div class="info-item">
          <span class="label">归属方：</span>
          <span class="value">{{ baseInfo.belong || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系人：</span>
          <span class="value">{{ baseInfo.linkPerson || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系方式：</span>
          <span class="value">{{ baseInfo.linkPhone || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">更新时间：</span>
          <span class="value">{{ formatDate(baseInfo.updateTime) }}</span>
      </div>

        <!-- 物联网设备接入信息 -->
        <div class="info-item full-width">
          <span class="label">物联网设备接入信息：</span>
          <span class="value">{{ baseInfo.connDeviceFlag ? '是' : '否' }}</span>
        </div>
        <div v-if="baseInfo.connDeviceFlag" class="info-item">
          <span class="label">设备类型：</span>
          <span class="value">{{ getDeviceTypeName(baseInfo.deviceType) }}</span>
        </div>
        <div v-if="baseInfo.connDeviceFlag" class="info-item">
          <span class="label">设备数量：</span>
          <span class="value">{{ baseInfo.deviceNum || '-' }}</span>
        </div>
        <div v-if="baseInfo.connDeviceFlag" class="info-item">
          <span class="label">设备地址：</span>
          <span class="value">{{ baseInfo.deviceAddr || '-' }}</span>
        </div>

        <!-- 功能模块说明介绍 -->
        <div class="info-item full-width">
          <span class="label">功能模块说明介绍：</span>
          <span class="value">{{ baseInfo.description || '-' }}</span>
        </div>
      </div>

      <!-- 数据信息 -->
      <div class="section-title mb-12px text-14px font-600">数据信息</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">申请量：</span>
          <span class="value">{{ dataInfo?.applyCount || 0 }}</span>
        </div>
        <div class="info-item">
          <span class="label">访问量：</span>
          <span class="value">{{ dataInfo?.visitCount || 0 }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResourceDetailRespVO } from '@/api/resource/info'
import { formatDate } from '@/utils/formatTime'

interface Props {
  data: ResourceDetailRespVO
}

const props = defineProps<Props>()

// 基本信息
const baseInfo = computed(() => props.data.baseInfo)

// 数据信息
const dataInfo = computed(() => props.data.dataInfo)

// 获取资源类型名称
const getTypeName = (type: number | undefined) => {
  const typeMap = { 1: '数据资源', 2: '应用资源', 3: '组件资源' }
  return type ? typeMap[type] || '-' : '-'
}

// 获取状态名称
const getStatusName = (status: number | undefined) => {
  const statusMap = { 0: '草稿', 1: '待审批', 2: '已发布', 3: '已下架', 4: '已驳回' }
  return status !== undefined ? statusMap[status] || '-' : '-'
}

// 获取设备类型名称
const getDeviceTypeName = (type: number | undefined) => {
  const typeMap = { 1: '传感器', 2: '控制器', 3: '网关' }
  return type ? typeMap[type] || '-' : '-'
}
</script>

<style lang="scss" scoped>
.application-detail {
  .detail-card {
    background: white;
    border-radius: 8px;

    :deep(.el-card__header) {
      padding: 16px 24px;
      border-bottom: 1px solid #ebeef5;
    }

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .section-title {
    color: #303133;
    margin-bottom: 12px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .info-item {
      display: flex;
      align-items: flex-start;
      font-size: 14px;

      &.full-width {
        grid-column: 1 / -1;
      }

      .label {
        color: #606266;
        min-width: 120px;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        flex: 1;
        word-break: break-all;

        &.link {
          color: #409eff;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
