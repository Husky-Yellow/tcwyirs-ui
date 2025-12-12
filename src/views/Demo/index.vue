<template>
  <div class="demo-page h-screen overflow-y-auto bg-[#f5f7fa]">
    <!-- 页面头部 -->
    <div class="border-b border-[var(--el-border-color-lighter)] bg-white">
      <div class="mx-auto max-w-1400px px-24px py-20px">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-12px">
            <Icon icon="ep:box" :size="32" color="#409EFF" />
            <div>
              <h1 class="mb-4px text-24px text-[var(--el-text-color-primary)] font-700">
                组件展示 Demo
              </h1>
              <p class="text-14px text-[var(--el-text-color-secondary)]"> Component Showcase </p>
            </div>
          </div>
          <el-button type="primary" @click="navigateToHome">
            <Icon icon="ep:home-filled" class="mr-6px" />
            返回首页
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="mx-auto max-w-1400px px-24px py-32px pb-60px">
      <!-- 组件展示卡片 -->
      <div class="grid grid-cols-1 gap-24px">
        <!-- 1. 评分/评论组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:star" :size="24" color="#409EFF" />
                <div>
                  <h2 class="text-18px font-600">RatingReviewModal - 评分/评论组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持标签选择和评论输入,实时显示已选择标签
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-button type="primary" @click="showReviewModal = true">
                <Icon icon="ep:star" class="mr-6px" />
                打开评分弹窗
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>标签选择(正面/负面) + 评论输入 + 已选标签展示</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>实时显示已选标签,可点击删除,表单验证</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/RatingReviewModal/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 2. 抽屉组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:menu" :size="24" color="#67C23A" />
                <div>
                  <h2 class="text-18px font-600">Drawer - 抽屉组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    基于 ElDrawer 封装,支持四个方向,使用 UnoCSS
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px flex flex-wrap gap-12px">
              <el-button type="success" @click="showDrawerRight = true"> 从右侧打开 </el-button>
              <el-button type="success" @click="showDrawerLeft = true"> 从左侧打开 </el-button>
              <el-button type="success" @click="showDrawerTop = true"> 从顶部打开 </el-button>
              <el-button type="success" @click="showDrawerBottom = true"> 从底部打开 </el-button>
            </div>

            <!-- 抽屉演示: 带表单的资源发布 -->
            <div class="mb-16px">
              <el-divider content-position="left">
                <span class="text-14px text-[var(--el-text-color-secondary)]">完整示例</span>
              </el-divider>
              <el-button type="success" plain @click="showResourceDrawer = true">
                <Icon icon="ep:upload" class="mr-6px" />
                快速资源发布 (带表单)
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>基于 ElDrawer,支持 ltr/rtl/ttb/btt 四个方向</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>完整插槽支持(header/default/footer),UnoCSS 样式</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/Drawer/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 3. SearchForm - 搜索表单组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:search" :size="24" color="#F56C6C" />
                <div>
                  <h2 class="text-18px font-600">SearchForm - 搜索表单组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    自适应布局,支持展开/收起,按钮固定在右下角
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-alert
                title="示例演示"
                type="info"
                :closable="false"
                description="下方是一个完整的搜索表单示例,包含 5 个搜索项,默认收起只显示 2 个"
                class="mb-16px"
              />

              <!-- 搜索表单示例 -->
              <SearchForm
                :schema="searchSchema"
                :model="searchModel"
                :cols-per-row="3"
                :show-expand="true"
                :default-expanded="false"
                @search="handleSearch"
                @reset="handleSearchReset"
              />
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>一行最多3个搜索项,超出自动收起,支持展开/收起切换</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>Grid布局,按钮固定右下角,支持多种表单组件</span>
              </div>
              <div class="demo-info-item">
                <span class="label">组件:</span>
                <span>Input, Select, DatePicker, DateRangePicker, InputNumber 等</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/SearchForm/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 4. DynamicDataTable - 动态数据表格组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:grid" :size="24" color="#9C27B0" />
                <div>
                  <h2 class="text-18px font-600">DynamicDataTable - 动态数据表格组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持动态增删行,可获取和设置表格数据,灵活配置列
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-alert
                title="使用说明"
                type="info"
                :closable="false"
                class="mb-16px"
              >
                <template #default>
                  <div class="text-13px leading-relaxed">
                    <p class="mb-8px">1. 点击「新增一行」按钮可以添加新行</p>
                    <p class="mb-8px">2. 非最后一行：点击删除按钮将删除整行</p>
                    <p class="mb-8px">3. 最后一行：点击删除按钮只会清空数据，保留该行</p>
                    <p>4. 在输入框中输入数据，实时同步到表格数据中</p>
                  </div>
                </template>
              </el-alert>

              <DynamicDataTable
                ref="tableRef"
                v-model="tableData"
                :columns="tableColumns"
                title="数据库表格式"
                @change="handleTableChange"
              />

              <div class="mt-16px flex flex-wrap gap-12px">
                <el-button type="primary" @click="getTableData">
                  <Icon icon="ep:document" class="mr-6px" />
                  获取表格数据
                </el-button>
                <el-button type="success" @click="setTableData">
                  <Icon icon="ep:upload" class="mr-6px" />
                  设置表格数据
                </el-button>
                <el-button type="warning" @click="addTableRow">
                  <Icon icon="ep:plus" class="mr-6px" />
                  添加一行
                </el-button>
                <el-button type="info" @click="clearTableData">
                  <Icon icon="ep:delete" class="mr-6px" />
                  清空数据
                </el-button>
              </div>

              <div v-if="tableDataDisplay" class="mt-16px">
                <el-divider content-position="left">当前表格数据</el-divider>
                <pre class="code-block">{{ JSON.stringify(tableData, null, 2) }}</pre>
              </div>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>动态增删行、数据双向绑定、自定义列配置、保护最后一行</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>v-model 支持、暴露方法调用、实时数据同步、TypeScript 类型</span>
              </div>
              <div class="demo-info-item">
                <span class="label">方法:</span>
                <span>getData, setData, addRow, deleteRow</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/DynamicDataTable/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 5. DynamicTreeTable - 树形表格组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:grid" :size="24" color="#00BCD4" />
                <div>
                  <h2 class="text-18px font-600">DynamicTreeTable - 树形表格组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持树形结构、添加下级、展开/折叠，适用于参数配置等场景
                  </p>
                </div>
              </div>
              <el-tag type="success">新增</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-alert
                title="功能说明"
                type="info"
                :closable="false"
                class="mb-16px"
              >
                <template #default>
                  <div class="text-13px leading-relaxed">
                    <p class="mb-8px">1. 支持无限层级嵌套，每一行都可以添加子级</p>
                    <p class="mb-8px">2. 点击箭头图标可以展开/折叠子节点</p>
                    <p class="mb-8px">3. 支持多种输入类型：Input、Select、Number</p>
                    <p>4. 删除节点时会删除其所有子节点</p>
                  </div>
                </template>
              </el-alert>

              <DynamicTreeTable
                v-model="treeTableData"
                :columns="treeTableColumns"
                title="输出参数"
                @change="handleTreeTableChange"
              />

              <div class="mt-16px flex flex-wrap gap-12px">
                <el-button type="primary" @click="showTreeData = !showTreeData">
                  <Icon icon="ep:view" class="mr-6px" />
                  {{ showTreeData ? '隐藏' : '显示' }}数据结构
                </el-button>
              </div>

              <div v-if="showTreeData" class="mt-16px">
                <el-divider content-position="left">树形数据结构</el-divider>
                <pre class="code-block">{{ JSON.stringify(treeTableData, null, 2) }}</pre>
              </div>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>树形结构、添加下级、展开/折叠、多种输入类型、层级缩进</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>自动管理层级、支持 Select/Number 等组件、数据双向绑定</span>
              </div>
              <div class="demo-info-item">
                <span class="label">适用场景:</span>
                <span>API 参数配置、数据库表字段、JSON 结构编辑、配置项管理</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/DynamicDataTable/src/DynamicTreeTable.vue</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 6. DynamicSelect - 动态下拉选择组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:select" :size="24" color="#E6A23C" />
                <div>
                  <h2 class="text-18px font-600">DynamicSelect - 动态下拉选择组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持动态添加/删除选项，实时管理下拉列表
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-alert
                title="使用说明"
                type="info"
                :closable="false"
                class="mb-16px"
              >
                <template #default>
                  <div class="text-13px leading-relaxed">
                    <p class="mb-8px">1. 在输入框中输入选项名称，按回车或点击「新增标签」按钮添加</p>
                    <p class="mb-8px">2. 鼠标悬停在选项上时，右侧会显示操作菜单（⋮图标）</p>
                    <p class="mb-8px">3. 点击菜单可以编辑或删除选项（标记为 fixed 的选项不可删除）</p>
                    <p>4. 编辑模式下，在输入框中修改名称，按回车保存或按 ESC 取消</p>
                  </div>
                </template>
              </el-alert>

              <div class="grid grid-cols-1 gap-20px md:grid-cols-2">
                <!-- 基础示例 -->
                <div class="demo-example-card">
                  <div class="mb-12px flex items-center justify-between">
                    <span class="text-14px text-[var(--el-text-color-primary)] font-600">
                      基础示例
                    </span>
                    <el-tag size="small" type="info">所有选项可删除</el-tag>
                  </div>
                  <DynamicSelect
                    v-model="selectedValue1"
                    :options="dynamicOptions1"
                    placeholder="请选择或添加选项"
                    @add-option="handleAddOption1"
                    @edit-option="handleEditOption1"
                    @delete-option="handleDeleteOption1"
                    @options-change="handleOptionsChange1"
                  />
                  <div
                    v-if="selectedValue1"
                    class="mt-10px text-12px text-[var(--el-text-color-secondary)]"
                  >
                    <span class="font-500">当前选中：</span>
                    <span class="text-[var(--el-color-primary)]">{{
                      getOptionLabel(dynamicOptions1, selectedValue1)
                    }}</span>
                  </div>
                </div>

                <!-- 固定选项示例 -->
                <div class="demo-example-card">
                  <div class="mb-12px flex items-center justify-between">
                    <span class="text-14px text-[var(--el-text-color-primary)] font-600">
                      固定选项示例
                    </span>
                    <el-tag size="small" type="warning">部分选项受保护</el-tag>
                  </div>
                  <DynamicSelect
                    v-model="selectedValue2"
                    :options="dynamicOptions2"
                    placeholder="请选择或添加选项"
                    @add-option="handleAddOption2"
                    @edit-option="handleEditOption2"
                    @delete-option="handleDeleteOption2"
                    @options-change="handleOptionsChange2"
                  />
                  <div class="mt-10px text-12px text-[var(--el-text-color-secondary)]">
                    <span class="font-500">提示：</span>
                    系统预设选项不可删除
                  </div>
                </div>
              </div>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>动态添加选项、内联编辑、删除选项、固定选项保护、实时搜索过滤</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>悬停显示操作菜单、内联编辑输入框、回车快速保存、ESC 取消编辑</span>
              </div>
              <div class="demo-info-item">
                <span class="label">交互:</span>
                <span>支持键盘导航、点击选择、搜索过滤、直接编辑、批量管理</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/DynamicSelect/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 6. ExtensionApplicationForm - 延期申请表单 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:document" :size="24" color="#FF6B9D" />
                <div>
                  <h2 class="text-18px font-600">ExtensionApplicationForm - 延期申请表单</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    抽屉形式的表单，支持项目选择、时间范围、申请说明，中间记录区域可展开/收起
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-button type="primary" @click="openExtensionForm">
                <Icon icon="ep:calendar" class="mr-6px" />
                打开延期申请表单
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>项目关联、日期范围选择、申请说明输入、历史记录展开/收起</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>抽屉形式、表单验证、可展开区域、平滑过渡动画、响应式布局</span>
              </div>
              <div class="demo-info-item">
                <span class="label">组件:</span>
                <span>Drawer + Form + DatePicker + Textarea + 可展开面板</span>
              </div>
              <div class="demo-info-item">
                <span class="label">调用:</span>
                <span>通过 ref 调用 open() 方法打开抽屉</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/ExtensionApplicationForm/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 7. FeedbackForm - 反馈表单组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:edit" :size="24" color="#FF9800" />
                <div>
                  <h2 class="text-18px font-600">FeedbackForm - 反馈表单组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    抽屉形式的反馈表单，支持类型选择、问题描述、截图上传
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px flex flex-wrap gap-12px">
              <el-button type="warning" @click="feedbackFormVisible = true">
                <Icon icon="ep:edit" class="mr-6px" />
                打开反馈表单
              </el-button>
              <el-button
                type="warning"
                plain
                @click="
                  () => {
                    feedbackFormVisible = true
                  }
                "
              >
                <Icon icon="ep:document" class="mr-6px" />
                带资源信息的反馈
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>反馈类型选择、问题描述输入、截图上传、资源关联（可选）</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>抽屉形式、表单验证、图片上传、支持资源ID和名称关联</span>
              </div>
              <div class="demo-info-item">
                <span class="label">类型:</span>
                <span>功能问题、资源使用问题、操作与体验、内容与数据问题、其他问题</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/FeedbackForm/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 8. FeedbackDetail - 反馈详情组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:chat-dot-round" :size="24" color="#17a2b8" />
                <div>
                  <h2 class="text-18px font-600">FeedbackDetail - 反馈详情组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持三种状态展示：待处理、已解决、未解决
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px flex flex-wrap gap-12px">
              <el-button type="info" @click="pendingVisible = true">
                <Icon icon="ep:clock" class="mr-6px" />
                待处理状态
              </el-button>
              <el-button type="success" @click="resolvedVisible = true">
                <Icon icon="ep:check" class="mr-6px" />
                已解决状态
              </el-button>
              <el-button type="danger" @click="unresolvedVisible = true">
                <Icon icon="ep:close" class="mr-6px" />
                未解决状态
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>反馈信息展示、回复列表、状态驱动交互、自定义反馈方式选项</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>三种状态切换、可回复/已结束状态、状态点颜色自动适配、回复输入</span>
              </div>
              <div class="demo-info-item">
                <span class="label">状态:</span>
                <span>待处理(可回复)、已解决(已结束)、未解决(可回复)</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/views/other/feedback/components/FeedbackDetail/</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 底部信息 -->
      <div class="mt-32px text-center">
        <el-divider />
        <p class="text-14px text-[var(--el-text-color-secondary)]">
          共 9 个组件 | 创建时间: 2025-10-19 |
          <span class="cursor-pointer text-[var(--el-color-primary)]" @click="showInfo"
            >查看详细信息</span
          >
        </p>
      </div>
    </div>

    <!-- 评分弹窗 -->
    <RatingReviewModal v-model="showReviewModal" title="组件评价" @submit="handleReviewSubmit" />

    <!-- 延期申请表单 -->
    <ExtensionApplicationForm ref="extensionFormRef" @submit="handleExtensionSubmit" />

    <!-- 反馈表单 -->
    <FeedbackForm
      v-model="feedbackFormVisible"
      :resource-id="123"
      resource-name="示例资源名称"
      @success="handleFeedbackSubmit"
    />

    <!-- 反馈详情组件 -->
    <FeedbackDetail
      v-model="pendingVisible"
      :data="pendingFeedback"
      @confirm="(way, reply) => handleFeedbackConfirm('待处理', way, reply)"
      @cancel="() => handleFeedbackCancel('待处理')"
    />

    <FeedbackDetail
      v-model="resolvedVisible"
      :data="resolvedFeedback"
      @confirm="() => handleFeedbackConfirm('已解决')"
      @cancel="() => handleFeedbackCancel('已解决')"
    />

    <FeedbackDetail
      v-model="unresolvedVisible"
      :data="unresolvedFeedback"
      @confirm="(way, reply) => handleFeedbackConfirm('未解决', way, reply)"
      @cancel="() => handleFeedbackCancel('未解决')"
    />

    <!-- 抽屉组件演示 -->
    <Drawer v-model="showDrawerRight" title="从右侧打开的抽屉" size="500px" direction="rtl">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">抽屉内容示例</h3>
        <p class="mb-16px text-14px text-[var(--el-text-color-regular)]">
          这是一个从右侧打开的抽屉,支持完整的插槽功能。
        </p>
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input placeholder="请输入邮箱" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showDrawerRight = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </Drawer>

    <Drawer v-model="showDrawerLeft" title="从左侧打开的抽屉" size="500px" direction="ltr">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">左侧抽屉</h3>
        <p>这是从左侧打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerTop" title="从顶部打开的抽屉" size="300px" direction="ttb">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">顶部抽屉</h3>
        <p>这是从顶部打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerBottom" title="从底部打开的抽屉" size="300px" direction="btt">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">底部抽屉</h3>
        <p>这是从底部打开的抽屉示例。</p>
      </div>
    </Drawer>

    <!-- 资源发布抽屉 (完整示例) -->
    <Drawer v-model="showResourceDrawer" title="快速资源发布" size="600px">
      <el-form :model="resourceForm" label-width="100px" label-position="top">
        <el-form-item label="资源名称">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源分类">
          <el-select v-model="resourceForm.category" placeholder="请选择分类" class="w-full">
            <el-option label="技术文档" value="doc" />
            <el-option label="开源项目" value="project" />
            <el-option label="在线工具" value="tool" />
            <el-option label="学习资源" value="learning" />
          </el-select>
        </el-form-item>

        <el-form-item label="资源链接">
          <el-input v-model="resourceForm.url" placeholder="请输入资源链接" />
        </el-form-item>

        <el-form-item label="资源描述">
          <el-input
            v-model="resourceForm.description"
            type="textarea"
            :rows="5"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="resourceForm.tags" multiple placeholder="请选择标签" class="w-full">
            <el-option label="热门" value="hot" />
            <el-option label="推荐" value="recommend" />
            <el-option label="新品" value="new" />
            <el-option label="免费" value="free" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showResourceDrawer = false">取消</el-button>
        <el-button type="primary" @click="handleResourceSubmit">发布资源</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RatingReviewModal } from '@/components/BusinessModal'
import type { RatingReviewResult } from '@/components/BusinessModal'
import { Drawer } from '@/components/Drawer'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'
import { DynamicSelect } from '@/components/DynamicSelect'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import { DynamicDataTable, DynamicTreeTable } from '@/components/DynamicDataTable'
import type { TableColumn, TableRow, TreeTableColumn, TreeTableRow } from '@/components/DynamicDataTable'
import { ExtensionApplicationForm } from '@/components/ExtensionApplicationForm'
import type { ExtensionFormData } from '@/components/ExtensionApplicationForm'
import { FeedbackDetail, FeedbackStatus } from '@/views/other/feedback/components/FeedbackDetail'
import { FeedbackForm } from '@/components/FeedbackForm'

defineOptions({ name: 'DemoPage' })

const router = useRouter()

// 评分弹窗
const showReviewModal = ref(false)

const handleReviewSubmit = (data: RatingReviewResult) => {
  ElMessage.success(`提交成功! 选择了 ${data.tags.length} 个标签`)
  console.log('评价数据:', data)
}

// 抽屉演示
const showDrawerRight = ref(false)
const showDrawerLeft = ref(false)
const showDrawerTop = ref(false)
const showDrawerBottom = ref(false)

// 资源发布抽屉
const showResourceDrawer = ref(false)
const resourceForm = ref({
  name: '',
  category: '',
  url: '',
  description: '',
  tags: [] as string[]
})

const handleResourceSubmit = () => {
  console.log('发布资源:', resourceForm.value)
  ElMessage.success('资源发布成功!')
  showResourceDrawer.value = false
  // 重置表单
  resourceForm.value = {
    name: '',
    category: '',
    url: '',
    description: '',
    tags: []
  }
}

// SearchForm 搜索表单演示
const searchModel = ref({
  keyword: '',
  category: '',
  status: '',
  dateRange: [],
  priority: null
})

const searchSchema: SearchFormSchema[] = [
  {
    field: 'keyword',
    label: '关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词'
    }
  },
  {
    field: 'category',
    label: '分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择分类',
      options: [
        { label: '技术文档', value: 'doc' },
        { label: '开源项目', value: 'project' },
        { label: '在线工具', value: 'tool' },
        { label: '学习资源', value: 'learning' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
      ]
    }
  },
  {
    field: 'dateRange',
    label: '日期范围',
    component: 'DateRangePicker',
    componentProps: {
      placeholder: '请选择日期范围'
    }
  },
  {
    field: 'priority',
    label: '优先级',
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 5,
      placeholder: '1-5'
    }
  }
]

const handleSearch = (values: Recordable) => {
  console.log('搜索参数:', values)
  ElMessage.success('搜索成功!')
}

const handleSearchReset = () => {
  console.log('重置搜索')
  ElMessage.info('已重置搜索条件')
}

// DynamicDataTable 动态表格演示
const tableRef = ref()
const tableData = ref<TableRow[]>([
  { col1: '标题名称1', col2: '标题名称2', col3: '标题名称3' },
  { col1: '标题名称4', col2: '标题名称5', col3: '标题名称6' }
])

const tableColumns: TableColumn[] = [
  { key: 'col1', label: '标题名称', width: '30%', placeholder: '请输入' },
  { key: 'col2', label: '标题名称', width: '30%', placeholder: '请输入' },
  { key: 'col3', label: '标题名称', width: '30%', placeholder: '请输入' }
]

const tableDataDisplay = ref(false)

const getTableData = () => {
  const data = tableRef.value?.getData()
  console.log('当前表格数据:', data)
  ElMessage.success('数据已打印到控制台')
  tableDataDisplay.value = true
}

const setTableData = () => {
  const newData: TableRow[] = [
    { col1: '新数据1', col2: '新数据2', col3: '新数据3' },
    { col1: '新数据4', col2: '新数据5', col3: '新数据6' },
    { col1: '新数据7', col2: '新数据8', col3: '新数据9' }
  ]
  tableRef.value?.setData(newData)
  ElMessage.success('表格数据已更新')
}

const addTableRow = () => {
  tableRef.value?.addRow()
  ElMessage.success('已添加新行')
}

const clearTableData = () => {
  tableRef.value?.setData([{ col1: '', col2: '', col3: '' }])
  ElMessage.success('表格数据已清空')
  tableDataDisplay.value = false
}

const handleTableChange = (data: TableRow[]) => {
  console.log('表格数据变化:', data)
}

// DynamicTreeTable 树形表格演示
const treeTableData = ref<TreeTableRow[]>([
  {
    name: 'user',
    type: 'Object',
    description: '用户信息对象',
    required: true,
    position: 'body',
    serviceRange: '用户服务',
    children: [
      {
        name: 'id',
        type: 'String',
        description: '用户ID',
        required: true,
        position: 'body',
        serviceRange: '用户服务'
      },
      {
        name: 'name',
        type: 'String',
        description: '用户名称',
        required: true,
        position: 'body',
        serviceRange: '用户服务'
      },
      {
        name: 'profile',
        type: 'Object',
        description: '用户资料',
        required: false,
        position: 'body',
        serviceRange: '用户服务',
        children: [
          {
            name: 'avatar',
            type: 'String',
            description: '头像地址',
            required: false,
            position: 'body',
            serviceRange: '用户服务'
          },
          {
            name: 'bio',
            type: 'String',
            description: '个人简介',
            required: false,
            position: 'body',
            serviceRange: '用户服务'
          }
        ]
      }
    ]
  },
  {
    name: 'token',
    type: 'String',
    description: '认证令牌',
    required: true,
    position: 'header',
    serviceRange: '认证服务'
  }
])

const treeTableColumns: TreeTableColumn[] = [
  {
    key: 'name',
    label: '参数名称',
    width: '15%',
    placeholder: '请输入参数名称'
  },
  {
    key: 'type',
    label: '参数类型',
    width: '13%',
    type: 'select',
    options: [
      { label: 'String', value: 'String' },
      { label: 'Number', value: 'Number' },
      { label: 'Boolean', value: 'Boolean' },
      { label: 'Object', value: 'Object' },
      { label: 'Array', value: 'Array' }
    ]
  },
  {
    key: 'description',
    label: '参数说明',
    width: '18%',
    placeholder: '请输入参数说明'
  },
  {
    key: 'required',
    label: '是否必填',
    width: '12%',
    type: 'select',
    options: [
      { label: '请选择', value: '' },
      { label: '是', value: true },
      { label: '否', value: false }
    ]
  },
  {
    key: 'position',
    label: '参数位置',
    width: '12%',
    type: 'select',
    options: [
      { label: 'body', value: 'body' },
      { label: 'query', value: 'query' },
      { label: 'path', value: 'path' },
      { label: 'header', value: 'header' }
    ]
  },
  {
    key: 'serviceRange',
    label: '关联服务范围',
    width: '15%',
    placeholder: '请输入服务范围'
  }
]

const showTreeData = ref(false)

const handleTreeTableChange = (data: TreeTableRow[]) => {
  console.log('树形表格数据变化:', data)
}

// DynamicSelect 动态选择演示
const selectedValue1 = ref<string | number | null>(null)
const selectedValue2 = ref<string | number | null>(null)

const dynamicOptions1 = ref<DynamicSelectOption[]>([
  { label: '选项 1', value: 'option1' },
  { label: '选项 2', value: 'option2' },
  { label: '选项 3', value: 'option3' }
])

const dynamicOptions2 = ref<DynamicSelectOption[]>([
  { label: '系统预设 1', value: 'preset1', fixed: true },
  { label: '系统预设 2', value: 'preset2', fixed: true },
  { label: '自定义选项', value: 'custom1', fixed: false }
])

const handleAddOption1 = (option: DynamicSelectOption) => {
  console.log('添加选项1:', option)
}

const handleEditOption1 = (option: DynamicSelectOption) => {
  console.log('编辑选项1:', option)
}

const handleDeleteOption1 = (value: string | number) => {
  console.log('删除选项1:', value)
}

const handleOptionsChange1 = (options: DynamicSelectOption[]) => {
  dynamicOptions1.value = options
  console.log('选项列表1更新:', options)
}

const handleAddOption2 = (option: DynamicSelectOption) => {
  console.log('添加选项2:', option)
}

const handleEditOption2 = (option: DynamicSelectOption) => {
  console.log('编辑选项2:', option)
}

const handleDeleteOption2 = (value: string | number) => {
  console.log('删除选项2:', value)
}

const handleOptionsChange2 = (options: DynamicSelectOption[]) => {
  dynamicOptions2.value = options
  console.log('选项列表2更新:', options)
}

const getOptionLabel = (options: DynamicSelectOption[], value: string | number | null) => {
  if (!value) return ''
  const option = options.find((opt) => opt.value === value)
  return option?.label || ''
}

// ExtensionApplicationForm 延期申请表单演示
const extensionFormRef = ref()

const openExtensionForm = () => {
  extensionFormRef.value?.open()
}

const handleExtensionSubmit = (data: ExtensionFormData) => {
  console.log('延期申请数据:', data)
  ElMessage.success('延期申请提交成功!')
}

// FeedbackForm 反馈表单演示
const feedbackFormVisible = ref(false)

const handleFeedbackSubmit = () => {
  console.log('反馈提交成功')
  ElMessage.success('感谢您的反馈！')
}

// FeedbackDetail 反馈详情演示
const pendingVisible = ref(false)
const resolvedVisible = ref(false)
const unresolvedVisible = ref(false)

// 待处理状态数据
const pendingFeedback = ref<any>({
  id: 1,
  status: FeedbackStatus.PENDING,
  type: '待处理',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  description: '这是一个问题描述的文本。这是一个问题描述的文本。',
  screenshot: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
  replies: []
})

// 已解决状态数据
const resolvedFeedback = ref<any>({
  id: 2,
  status: FeedbackStatus.RESOLVED,
  type: '其他问题',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  description: '这是一个问题描述的文本。这是一个问题描述的文本。',
  screenshot: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
  replies: [
    {
      id: 1,
      content:
        '实时报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据的实时处理。感谢反馈，这个问题已经解决了。',
      time: '9月11日 12:36',
      isSelf: false
    }
  ]
})

// 未解决状态数据
const unresolvedFeedback = ref<any>({
  id: 3,
  status: FeedbackStatus.UNRESOLVED,
  type: '其他问题',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  description: '这是一个问题描述的文本。这是一个问题描述的文本。',
  screenshot: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
  replies: [
    {
      id: 1,
      content:
        '实时报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据的实时处理，感谢您的反馈。',
      time: '10月11日 12:36',
      isSelf: false
    },
    {
      id: 2,
      content: '本计报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据。',
      time: '10月12日 12:36',
      isSelf: true
    }
  ]
})

const handleFeedbackConfirm = (type: string, feedbackWay?: string, reply?: string) => {
  console.log(`${type} - 确认`, { feedbackWay, reply })
  ElMessage.success('操作成功')
}

const handleFeedbackCancel = (type: string) => {
  console.log(`${type} - 取消`)
}

// 导航
const navigateToHome = () => {
  router.push('/')
}

// 显示详细信息
const showInfo = () => {
  ElMessageBox.alert(
    `
      <div>
        <p><strong>组件总数:</strong> 9 个</p>
        <p><strong>创建时间:</strong> 2025-10-19</p>
        <p><strong>技术栈:</strong> Vue 3 + TypeScript + Element Plus + UnoCSS</p>
        <p><strong>组件列表:</strong> RatingReviewModal, Drawer, SearchForm, DynamicDataTable, DynamicTreeTable, DynamicSelect, ExtensionApplicationForm, FeedbackForm, FeedbackDetail</p>
      </div>
    `,
    '组件信息',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了'
    }
  )
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
}

.demo-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.demo-content {
  padding: 8px 0;
}

.demo-example-card {
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
}

.demo-info {
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  padding: 16px;
}

.demo-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 600;
    color: var(--el-text-color-regular);
    min-width: 60px;
    margin-right: 12px;
  }

  .code {
    font-family: 'Consolas', 'Monaco', monospace;
    background: var(--el-fill-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--el-color-primary);
  }
}

.demo-drawer-content {
  padding: 0;
}

.code-block {
  background: var(--el-fill-color-darker);
  padding: 12px;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: var(--el-text-color-primary);
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}
</style>
