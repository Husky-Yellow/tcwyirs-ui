# 添加角色布局

为 Home 页面添加新的角色布局配置。

## 使用方法

```
/role-layout <角色名称> <角色代码>
```

## 示例

```
/role-layout 数据分析师 dataAnalyst
/role-layout 审计员 auditor
```

## 实施步骤

### 1. 创建 Widget 组件（如需要）

在 `src/views/Home/components/widgets/` 创建所需的 Widget 组件。

### 2. 添加组件类型枚举

编辑 `src/views/Home/types/layout.ts`:

```typescript
export enum HomeComponentType {
  // 现有类型...
  NEW_WIDGET = 'NewWidget', // 添加新类型
}
```

### 3. 注册组件

编辑 `src/views/Home/utils/componentMap.ts`:

```typescript
import NewWidget from '../components/widgets/NewWidget.vue'

export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  // 现有映射...
  [HomeComponentType.NEW_WIDGET]: markRaw(NewWidget),
}
```

### 4. 创建角色布局配置

编辑 `src/views/Home/config/roleLayout.ts`:

```typescript
/**
 * [角色名称] 角色配置
 */
const roleCodeLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.WIDGET_NAME,
        order: 1
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MESSAGES,
        order: 1
      },
      {
        type: HomeComponentType.HELP_DOCS,
        order: 2
      }
    ]
  }
}

// 在 ROLE_LAYOUT_CONFIG 中注册
export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  // 现有配置...
  roleCode: roleCodeLayout, // 添加新角色
}
```

### 5. 添加 Mock 用户（可选）

编辑 `src/mock/modules/auth/login.ts`:

```typescript
const userConfigs: Record<string, { user: UserVO; roles: string[]; permissions: string[] }> = {
  // 现有用户...
  roleCode: {
    user: {
      id: 6,
      nickname: '角色名称',
      avatar: '',
      deptId: 108,
      username: 'roleCode',
      email: 'roleCode@example.com',
      mobile: '13800138005',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['roleCode'],
    permissions: [
      // 权限列表
    ]
  }
}
```

## 测试

```bash
# 使用测试账号登录
用户名: roleCode
密码: admin123
```

## 布局配置说明

### 响应式列宽
- `xl`: ≥1920px
- `lg`: ≥1200px
- `md`: ≥992px
- `sm`: ≥768px
- `xs`: <768px

### 组件顺序
使用 `order` 属性控制组件显示顺序（数字越小越靠前）。

### 可选配置
```typescript
{
  type: HomeComponentType.WIDGET,
  title: '自定义标题',        // 覆盖默认标题
  showViewAll: true,          // 显示"查看全部"链接
  hidden: false,              // 是否隐藏
  order: 1,                   // 显示顺序
  props: {                    // 自定义属性
    // 传递给组件的 props
  }
}
```
