# 测试用例文档

本项目为 `src/utils/` 目录下的工具函数编写了全面的测试用例，使用 Vitest 作为测试框架。

## 测试覆盖范围

### 已完成的测试文件

1. **`tests/utils/index.test.ts`** - 核心工具函数测试
   - 组件安装函数 (`withInstall`)
   - 字符串转换函数 (`humpToUnderline`, `underlineToHump`, `humpToDash`)
   - CSS 变量设置 (`setCssVar`)
   - 数组操作函数 (`findIndex`, `trim`)
   - 时间格式化 (`formatTime`)
   - 随机字符串生成 (`toAnyString`, `generateRandomStr`, `generateUUID`)
   - 文件类型处理 (`generateAcceptedFileTypes`)
   - 字符串处理 (`firstUpperCase`, `subString`)
   - 文件大小格式化 (`fileSizeFormatter`)
   - 对象操作 (`copyValueToTarget`)
   - URL 参数处理 (`getUrlValue`, `getUrlNumberValue`)
   - 排序字段构建 (`buildSortingField`)
   - 数值计算 (`getSumValue`, `formatToFraction`, `floatToFixed2`)
   - 货币转换 (`yuanToFen`, `fenToYuan`, `convertToInteger`)
   - 环比计算 (`calculateRelativeRate`)
   - ERP 相关格式化函数
   - 地区名称处理 (`areaReplace`)
   - JSON 解析 (`jsonParse`)

2. **`tests/utils/color.test.ts`** - 颜色工具函数测试
   - 十六进制颜色验证 (`isHexColor`)
   - RGB 与十六进制转换 (`rgbToHex`, `hexToRGB`)
   - 颜色亮度判断 (`colorIsDark`)
   - 颜色调整 (`darken`, `lighten`)
   - 最佳文本颜色计算 (`calculateBestTextColor`)
   - 预设颜色常量 (`PREDEFINE_COLORS`)

3. **`tests/utils/formatTime.test.ts`** - 时间格式化函数测试
   - 日期快捷选项 (`defaultShortcuts`)
   - 日期格式化 (`formatDate`, `getNowDateTime`)
   - 周数计算 (`getWeek`)
   - 相对时间格式化 (`formatPast`, `formatPast2`)
   - 时间问候语 (`formatAxis`)
   - 表格列格式化 (`dateFormatter`, `dateFormatter2`)
   - 日期范围处理 (`beginOfDay`, `endOfDay`, `betweenDay`)
   - 日期计算 (`addTime`, `convertDate`)
   - 日期比较 (`isSameDay`)
   - 日期范围获取 (`getDayRange`, `getLast7Days`, `getLast30Days`, `getLast1Year`, `getDateRange`)

4. **`tests/utils/domUtils.test.ts`** - DOM 工具函数测试
   - CSS 类操作 (`hasClass`, `addClass`, `removeClass`)
   - 元素位置计算 (`getBoundingClientRect`, `getViewportOffset`)
   - 事件处理 (`on`, `off`, `once`)
   - 样式操作 (`getStyle`, `setStyle`)
   - 滚动检测 (`isScroll`, `getScrollContainer`)
   - 容器检测 (`isInContainer`)

5. **`tests/utils/tree.test.ts`** - 树结构工具函数测试
   - 列表与树转换 (`listToTree`, `treeToList`)
   - 节点查找 (`findNode`, `findNodeAll`, `findPath`, `findPathAll`)
   - 树过滤 (`filter`)
   - 树遍历 (`forEach`, `eachTree`)
   - 树映射 (`treeMap`, `treeMapEach`)
   - 树构建 (`handleTree`, `handleTree2`)
   - 节点检查 (`checkSelectedNode`)
   - 树字符串化 (`treeToString`)
   - 默认属性 (`defaultProps`)

6. **`tests/utils/constants.test.ts`** - 常量枚举测试
   - 通用状态枚举 (`CommonStatusEnum`, `UserTypeEnum`)
   - 系统模块枚举 (`SystemMenuTypeEnum`, `SystemRoleTypeEnum`, `SystemDataScopeEnum`)
   - 用户社交类型枚举 (`SystemUserSocialTypeEnum`)
   - 基础设施枚举 (`InfraCodegenTemplateTypeEnum`, `InfraJobStatusEnum`)
   - 支付相关枚举 (`PayChannelEnum`, `PayDisplayModeEnum`, `PayType`, `PayOrderStatusEnum`)
   - 商品状态枚举 (`ProductSpuStatusEnum`)
   - 营销相关枚举 (`CouponTemplateValidityTypeEnum`, `PromotionProductScopeEnum`)
   - 分销相关枚举 (`BrokerageBindModeEnum`, `BrokerageWithdrawStatusEnum`)
   - 交易订单枚举 (`TradeOrderStatusEnum`)
   - ERP 业务类型 (`ErpBizType`)
   - BPM 流程枚举 (`BpmModelType`, `BpmProcessInstanceStatus`)

7. **`tests/utils/is.test.ts`** - 类型判断函数测试
   - 基础类型判断 (`is`, `isDef`, `isUnDef`, `isNull`, `isNullOrUnDef`)
   - 对象类型判断 (`isObject`, `isEmpty`, `isRecord`, `isPlainObject`)
   - 数组类型判断 (`isArray`, `isNonEmptyArray`, `isArrayOf`)
   - 函数类型判断 (`isFunction`, `isPromise`)
   - 数值类型判断 (`isNumber`, `isInteger`, `isPositiveNumber`, `isNegativeNumber`)
   - 字符串类型判断 (`isString`, `isEmail`, `isPhoneNumber`, `isIdCard`)
   - 布尔类型判断 (`isBoolean`)
   - 正则表达式判断 (`isRegExp`)
   - 日期类型判断 (`isDate`)
   - 环境判断 (`isServer`, `isClient`, `isWindow`)
   - 元素判断 (`isElement`, `isMap`)
   - URL 判断 (`isUrl`, `isImgPath`)
   - 颜色模式判断 (`isDark`)
   - 空值判断 (`isEmptyVal`)
   - 原始类型判断 (`isPrimitive`, `isNonNullable`)
   - 属性判断 (`hasProperty`)

8. **`tests/utils/auth.test.ts`** - 认证相关函数测试
   - Token 管理 (`getAccessToken`, `getRefreshToken`, `setToken`, `removeToken`)
   - Token 格式化 (`formatToken`)
   - 登录表单处理 (`getLoginForm`, `setLoginForm`, `removeLoginForm`)
   - 租户管理 (`getTenantId`, `setTenantId`, `getVisitTenantId`, `setVisitTenantId`)

9. **`tests/utils/download.test.ts`** - 下载相关函数测试
   - 文件下载 (`download.excel`, `download.word`, `download.zip`, `download.html`, `download.markdown`, `download.json`)
   - 图片下载 (`download.image`)
   - Base64 转换 (`download.base64ToFile`)

## 测试配置

### 测试框架
- **Vitest** - 现代化的测试框架，支持 TypeScript 和 Vue
- **jsdom** - 模拟浏览器环境
- **@vue/test-utils** - Vue 组件测试工具

### 配置文件
- `vitest.config.ts` - Vitest 配置文件
- `tests/setup.ts` - 测试环境设置

### 测试脚本
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

## 运行测试

### 运行所有测试
```bash
pnpm test
```

### 运行测试并生成覆盖率报告
```bash
pnpm test:coverage
```

### 运行特定测试文件
```bash
pnpm test:run tests/utils/constants.test.ts
```

### 打开测试 UI
```bash
pnpm test:ui
```

## 测试覆盖率

测试用例覆盖了以下方面：
- ✅ 正常功能测试
- ✅ 边界条件测试
- ✅ 错误处理测试
- ✅ 类型安全测试
- ✅ 参数验证测试
- ✅ 返回值验证测试

## 注意事项

1. **模拟设置**: 某些测试需要模拟浏览器环境或外部依赖
2. **异步测试**: 时间相关的测试使用了 `vi.useFakeTimers()` 来模拟时间
3. **DOM 测试**: DOM 相关的测试需要模拟 DOM 元素和方法
4. **缓存测试**: 认证相关的测试需要模拟缓存系统

## 持续改进

- 定期更新测试用例以匹配代码变更
- 增加边界条件和错误场景的测试
- 优化测试性能和覆盖率
- 添加集成测试和端到端测试
