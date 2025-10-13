# 测试扩展路线图

## 📋 当前测试覆盖情况

### ✅ 已完成测试
- **工具函数 (utils/)**: 9个文件，330个测试用例
- **Store 模块**: 2个文件 (user, app)
- **Hooks**: 4个文件 (useCache, useTable, useForm, useLocale)

### 🚀 可扩展的测试领域

## 1. Store 模块测试 (Pinia)

### 待测试的 Store 模块
```
src/store/modules/
├── app.ts ✅ (已完成)
├── user.ts ✅ (已完成)
├── dict.ts
├── locale.ts
├── lock.ts
├── permission.ts
├── tagsView.ts
└── bpm/
    └── simpleWorkflow.ts
└── mall/
    └── kefu.ts
```

**测试重点**:
- State 初始化和更新
- Getters 计算属性
- Actions 异步操作
- 数据持久化
- 模块间交互

## 2. Hooks 测试 (Vue Composition API)

### 待测试的 Hooks
```
src/hooks/web/
├── useCache.ts ✅ (已完成)
├── useTable.ts ✅ (已完成)
├── useForm.ts ✅ (已完成)
├── useLocale.ts ✅ (已完成)
├── useConfigGlobal.ts
├── useCrudSchemas.ts
├── useDesign.ts
├── useEmitt.ts
├── useGuide.ts
├── useI18n.ts
├── useIcon.ts
├── useMessage.ts
├── useNetwork.ts
├── useNow.ts
├── useNProgress.ts
├── usePageLoading.ts
├── useTagsView.ts
├── useTimeAgo.ts
├── useTitle.ts
├── useValidator.ts
└── useWatermark.ts
```

**测试重点**:
- 响应式数据
- 生命周期钩子
- 副作用清理
- 事件监听
- 外部依赖集成

## 3. API 模块测试

### 待测试的 API 模块
```
src/api/
├── login/
│   ├── index.ts
│   ├── oauth2/
│   └── types.ts
├── system/
│   ├── user/
│   ├── role/
│   ├── menu/
│   ├── dept/
│   └── ...
├── infra/
│   ├── config/
│   ├── job/
│   └── ...
└── bpm/
    ├── definition/
    ├── task/
    └── ...
```

**测试重点**:
- HTTP 请求/响应
- 错误处理
- 请求拦截器
- 响应拦截器
- 数据转换

## 4. 组件测试 (Vue Components)

### 关键组件测试
```
src/components/
├── Table/ (表格组件)
├── Form/ (表单组件)
├── Dialog/ (对话框组件)
├── UploadFile/ (文件上传)
├── Cropper/ (图片裁剪)
├── Editor/ (富文本编辑器)
├── Echart/ (图表组件)
└── ...
```

**测试重点**:
- 组件渲染
- Props 传递
- 事件触发
- 插槽内容
- 生命周期
- 用户交互

## 5. 指令测试 (Vue Directives)

### 待测试的指令
```
src/directives/
├── index.ts
└── permission/
    ├── index.ts
    └── hasPermission.ts
```

**测试重点**:
- 指令绑定
- 权限检查
- DOM 操作
- 指令参数

## 6. 路由测试 (Vue Router)

### 待测试的路由功能
```
src/router/
├── index.ts
└── modules/
    └── remaining.ts
```

**测试重点**:
- 路由配置
- 导航守卫
- 动态路由
- 权限路由
- 路由元信息

## 7. 权限系统测试

### 待测试的权限功能
```
src/
├── permission.ts
├── utils/permission.ts
└── directives/permission/
```

**测试重点**:
- 权限验证
- 角色检查
- 路由权限
- 按钮权限
- 菜单权限

## 8. 工具函数扩展测试

### 待测试的工具函数
```
src/utils/
├── routerHelper.ts
├── permission.ts
├── formRules.ts
├── formCreate.ts
├── jsencrypt.ts
├── Logger.ts
├── propTypes.ts
└── tsxHelper.ts
```

## 9. 插件测试

### 待测试的插件
```
src/plugins/
├── vueI18n/
├── elementPlus/
├── echarts/
├── formCreate/
└── svgIcon/
```

**测试重点**:
- 插件初始化
- 全局配置
- 依赖注入
- 错误处理

## 10. 布局组件测试

### 待测试的布局组件
```
src/layout/
├── Layout.vue
└── components/
    ├── Header/
    ├── Sidebar/
    ├── TagsView/
    └── ...
```

**测试重点**:
- 布局渲染
- 响应式设计
- 主题切换
- 用户交互

## 🎯 测试优先级建议

### 高优先级 (P0)
1. **Store 模块** - 核心状态管理
2. **关键 Hooks** - 业务逻辑复用
3. **权限系统** - 安全相关
4. **API 模块** - 数据交互

### 中优先级 (P1)
1. **核心组件** - Table, Form, Dialog
2. **路由系统** - 导航和权限
3. **工具函数** - 通用功能

### 低优先级 (P2)
1. **UI 组件** - 展示类组件
2. **插件系统** - 第三方集成
3. **布局组件** - 页面结构

## 📊 测试覆盖率目标

- **Store 模块**: 90%+
- **Hooks**: 85%+
- **API 模块**: 80%+
- **核心组件**: 75%+
- **工具函数**: 95%+
- **整体覆盖率**: 80%+

## 🛠️ 测试工具和配置

### 已配置的测试工具
- **Vitest** - 测试框架
- **@vue/test-utils** - Vue 组件测试
- **jsdom** - DOM 环境模拟
- **@vitest/ui** - 测试界面

### 建议的测试工具
- **@testing-library/vue** - 组件测试增强
- **msw** - API 模拟
- **@vue/test-utils/jest-dom** - DOM 断言
- **cypress** - E2E 测试

## 📝 测试最佳实践

1. **单元测试**: 测试单个函数/组件
2. **集成测试**: 测试模块间交互
3. **快照测试**: 测试组件输出
4. **E2E 测试**: 测试完整用户流程

## 🚀 下一步行动

1. 完成 Store 模块测试
2. 扩展 Hooks 测试覆盖
3. 添加 API 模块测试
4. 实现组件测试
5. 建立 E2E 测试流程
