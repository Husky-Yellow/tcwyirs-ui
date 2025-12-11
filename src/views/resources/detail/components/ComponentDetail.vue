<template>
  <div class="component-detail">
    <!-- 组件资源信息 -->
    <el-card class="detail-card mb-16px" shadow="never">
      <template #header>
        <div class="card-header text-16px font-600">组件资源信息</div>
      </template>

      <!-- 基本信息 -->
      <div class="section-title mb-12px text-14px font-600">基本信息</div>
      <div class="info-grid mb-24px">
        <div class="info-item">
          <span class="label">资源名称：</span>
          <span class="value">{{ baseInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">资源类型：</span>
          <span class="value">{{ getTypeName(baseInfo.type) }}</span>
        </div>
        <div class="info-item">
          <span class="label">对接方式：</span>
          <span class="value">{{ getDockingTypeName(baseInfo.dockingType) }}</span>
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
          <span class="label">更新时间：</span>
          <span class="value">{{ formatDate(baseInfo.updateTime) }}</span>
        </div>

        <div class="info-item">
          <span class="label">上架状态：</span>
          <span class="value">{{ getStatusName(baseInfo.publishStatus) }}</span>
        </div>
        <div class="info-item">
          <span class="label">资源地址：</span>
          <span class="value">{{ baseInfo.componentUrl || '-' }}</span>
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
          <span class="label">请求地址：</span>
          <span class="value">{{ baseInfo.requestUrl || '-' }}</span>
        </div>

        <div class="info-item full-width">
          <span class="label">描述：</span>
          <span class="value">{{ baseInfo.description || '-' }}</span>
        </div>
      </div>

      <!-- 数据信息 -->
      <div class="section-title mb-12px text-14px font-600">数据信息</div>
      <div class="info-grid mb-24px">
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

    <!-- 输入参数 -->
    <el-card class="detail-card mb-16px" shadow="never">
      <template #header>
        <div class="card-header text-16px font-600">输入参数</div>
      </template>
      <el-table :data="inputParamsJson" border>
        <el-table-column prop="paramName" label="参数名称" />
        <el-table-column prop="paramType" label="参数类型" />
        <el-table-column prop="paramDesc" label="参数说明" show-overflow-tooltip />
        <el-table-column label="是否必填" width="100" align="center">
          <template #default="{ row }">
            {{ row.required ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="paramPosition" label="参数位置" />
        <el-table-column prop="relTableInfo" label="关联服务范围" show-overflow-tooltip />
      </el-table>
    </el-card>

    <!-- 输出参数 -->
    <el-card class="detail-card mb-16px" shadow="never">
      <template #header>
        <div class="card-header text-16px font-600">输出参数</div>
      </template>
      <el-table :data="outputParamsJson" border>
        <el-table-column prop="paramName" label="参数名称" />
        <el-table-column prop="paramType" label="参数类型" />
        <el-table-column prop="paramDesc" label="参数说明" show-overflow-tooltip />
        <el-table-column label="是否必填" width="100" align="center">
          <template #default="{ row }">
            {{ row.required ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="paramPosition" label="参数位置" />
        <el-table-column prop="relTableInfo" label="关联服务范围" show-overflow-tooltip />
      </el-table>
    </el-card>

    <!-- 示例代码 -->
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="card-header text-16px font-600">示例代码</div>
      </template>
      <pre class="code-block">{{ baseInfo.sampleCode || '暂无示例代码' }}</pre>
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

// 输入参数
const inputParamsJson = computed(() => props.data.inputParamsJson || [])

// 输出参数
const outputParamsJson = computed(() => props.data.outputParamsJson || [])

// 获取资源类型名称
const getTypeName = (type: number | undefined) => {
  const typeMap = { 1: '数据资源', 2: '应用资源', 3: '组件资源' }
  return type ? typeMap[type] || '-' : '-'
}

// 获取对接方式名称
const getDockingTypeName = (type: number | undefined) => {
  const typeMap = { 1: 'GET', 2: 'POST' }
  return type ? typeMap[type] || '-' : '-'
}

// 获取状态名称
const getStatusName = (status: number | undefined) => {
  const statusMap = { 0: '草稿', 1: '待审批', 2: '已发布', 3: '已下架', 4: '已驳回' }
  return status !== undefined ? statusMap[status] || '-' : '-'
}
</script>

<style lang="scss" scoped>
.component-detail {
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
    grid-template-columns: repeat(3, 1fr);
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
        min-width: 90px;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        flex: 1;
        word-break: break-all;
      }
    }
  }

  .code-block {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #303133;
    overflow-x: auto;
    margin: 0;
  }
}
</style>
