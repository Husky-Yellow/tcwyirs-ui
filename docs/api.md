[TOC]

修订表
------------

|编号|生成版本|修订人|修订章节与内容|修订日期|
|:--|:--|:--:|:--|:--|
|001|1.0|lixh|创建全文|2025-11-28|

# 资源模块接口清单

> 基础路径: `/admin-api/resource`

---

## 一、资源管理（统一接口）

> 通过 `type` 参数区分资源类型：1-数据资源 2-应用资源 3-组件资源

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 创建资源 | POST | /info/create | resource:info:create | 新增资源，type区分类型 |
| 2 | 更新资源 | PUT | /info/update | resource:info:update | 编辑资源 |
| 3 | 删除资源 | DELETE | /info/delete | resource:info:delete | 删除资源 |
| 4 | 资源详情 | GET | /info/get | resource:info:query | 获取详情（含扩展信息） |
| 5 | 资源列表 | GET | /info/page | resource:info:query | 分页列表，可按type筛选 |
| 6 | 发起上架申请 | POST | /info/publish | resource:info:publish | 提交上架审批 |
| 7 | 下架资源 | POST | /info/unpublish | resource:info:unpublish | 下架已上架资源 |

---

## 二、资源标签管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 创建标签 | POST | /tag/create | resource:tag:create | 新增系统标签 |
| 2 | 更新标签 | PUT | /tag/update | resource:tag:update | 编辑标签 |
| 3 | 删除标签 | DELETE | /tag/delete | resource:tag:delete | 删除标签 |
| 4 | 标签列表 | GET | /tag/list | - | 获取系统标签 |
| 5 | 用户自定义标签 | GET | /tag/user-list | - | 获取用户自定义标签 |
| 6 | 创建用户标签 | POST | /tag/user-create | - | 新增用户自定义标签 |
| 7 | 删除用户标签 | DELETE | /tag/user-delete | - | 删除用户自定义标签 |

---

## 三、资源申请管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 申请资源 | POST | /apply/create | resource:apply:create | 发起资源使用申请 |
| 2 | 撤销申请 | POST | /apply/cancel | resource:apply:cancel | 撤销待审批的申请 |
| 3 | 重新申请 | POST | /apply/reapply | resource:apply:create | 重新发起申请 |
| 4 | 我申请的列表 | GET | /apply/my-page | - | 我发起的申请 |
| 5 | 申请详情 | GET | /apply/get | resource:apply:query | 获取申请详情 |

---

## 四、审批管理（资源管理员）

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 待审批列表 | GET | /approval/pending-page | resource:approval:query | 待我审批的申请 |
| 2 | 已审批列表 | GET | /approval/done-page | resource:approval:query | 我已审批的申请 |
| 3 | 通过申请 | POST | /approval/approve | resource:approval:approve | 审批通过 |
| 4 | 驳回申请 | POST | /approval/reject | resource:approval:reject | 审批驳回 |
| 5 | 转交申请 | POST | /approval/transfer | resource:approval:transfer | 转交他人审批 |

---

## 五、上架审批（运营管理员）

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 待审批列表 | GET | /publish-approval/pending-page | resource:publish:approve | 待审批的上架申请 |
| 2 | 已审批列表 | GET | /publish-approval/done-page | resource:publish:approve | 已审批的上架申请 |
| 3 | 通过上架 | POST | /publish-approval/approve | resource:publish:approve | 通过上架 |
| 4 | 驳回上架 | POST | /publish-approval/reject | resource:publish:approve | 驳回上架 |
| 5 | 转交申请 | POST | /publish-approval/transfer | resource:publish:approve | 转交他人审批 |

---

## 六、资源使用管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 使用列表 | GET | /usage/page | resource:usage:query | 资源使用记录列表 |
| 2 | 使用详情 | GET | /usage/get | resource:usage:query | 使用详情 |
| 3 | 停用资源 | POST | /usage/stop | resource:usage:stop | 停用资源 |
| 4 | 启用资源 | POST | /usage/enable | resource:usage:enable | 重新启用资源 |

---

## 七、我的资源

> 通过 `type` 参数筛选资源类型

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 我的资源列表 | GET | /my/page | - | 我使用的资源，type筛选类型 |
| 2 | 延期申请 | POST | /my/extend | - | 资源延期申请 |
| 3 | 停用资源 | POST | /my/stop | - | 停用我的资源 |
| 4 | 重新申请 | POST | /my/reapply | - | 重新申请已停用资源 |

---

## 八、项目管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 创建项目 | POST | /project/create | resource:project:create | 新增项目 |
| 2 | 更新项目 | PUT | /project/update | resource:project:update | 编辑项目 |
| 3 | 删除项目 | DELETE | /project/delete | resource:project:delete | 删除项目 |
| 4 | 项目详情 | GET | /project/get | resource:project:query | 获取详情 |
| 5 | 项目列表 | GET | /project/page | resource:project:query | 分页列表 |
| 6 | 项目延期 | POST | /project/extend | resource:project:update | 项目延期 |
| 7 | 添加成员 | POST | /project/member/add | resource:project:update | 添加项目成员 |
| 8 | 移除成员 | DELETE | /project/member/remove | resource:project:update | 移除项目成员 |
| 9 | 成员列表 | GET | /project/member/list | resource:project:query | 获取成员列表 |

---

## 九、评分配置（运营管理员）

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 创建评分配置 | POST | /score-config/create | resource:score:config | 新增权重分数配置 |
| 2 | 更新评分配置 | PUT | /score-config/update | resource:score:config | 编辑配置 |
| 3 | 删除评分配置 | DELETE | /score-config/delete | resource:score:config | 删除配置 |
| 4 | 配置列表 | GET | /score-config/list | resource:score:config | 获取配置列表 |

---

## 十、评分标签管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 创建评分标签 | POST | /score-tag/create | resource:score:tag | 新增评分标签 |
| 2 | 更新评分标签 | PUT | /score-tag/update | resource:score:tag | 编辑标签 |
| 3 | 删除评分标签 | DELETE | /score-tag/delete | resource:score:tag | 删除标签 |
| 4 | 标签列表 | GET | /score-tag/list | - | 获取评分标签 |
| 5 | 启用/停用标签 | POST | /score-tag/toggle | resource:score:tag | 切换展示状态 |

---

## 十一、资源评分

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 发布评分 | POST | /evaluate/create | - | 发布评分和评论 |
| 2 | 回复评论 | POST | /evaluate/reply | - | 回复评论 |
| 3 | 评论列表 | GET | /evaluate/list | - | 资源评论列表 |
| 4 | 快捷评分 | POST | /evaluate/quick | - | 快捷评分（仅标签） |

---

## 十二、反馈管理

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 提交反馈 | POST | /feedback/create | - | 提交问题反馈 |
| 2 | 我的反馈列表 | GET | /feedback/my-page | - | 我提交的反馈 |
| 3 | 待处理反馈 | GET | /feedback/pending-page | resource:feedback:query | 待我处理的反馈 |
| 4 | 已处理反馈 | GET | /feedback/done-page | resource:feedback:query | 我已处理的反馈 |
| 5 | 反馈详情 | GET | /feedback/get | - | 获取反馈详情 |
| 6 | 回复反馈 | POST | /feedback/reply | resource:feedback:reply | 回复反馈 |
| 7 | 转交反馈 | POST | /feedback/transfer | resource:feedback:transfer | 转交他人处理 |
| 8 | 标记已解决 | POST | /feedback/resolve | - | 反馈人标记解决 |
| 9 | 继续反馈 | POST | /feedback/continue | - | 未解决继续反馈 |

---

## 十三、浏览与收藏

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 浏览历史 | GET | /browse/page | - | 我的浏览历史 |
| 2 | 收藏列表 | GET | /collect/page | - | 我的收藏列表 |
| 3 | 添加收藏 | POST | /collect/add | - | 收藏资源 |
| 4 | 取消收藏 | DELETE | /collect/cancel | - | 取消收藏 |

---

## 十四、工作台

| 序号 | 接口名称 | 方法 | 路径 | 权限标识 | 说明 |
|:---:|---------|:----:|------|---------|------|
| 1 | 工作台数据 | GET | /statistics/dashboard | - | 根据角色返回不同数据 |

---

## 接口统计

| 模块 | 接口数量 |
|------|:-------:|
| 资源管理（统一） | 7 |
| 资源标签管理 | 7 |
| 资源申请管理 | 5 |
| 审批管理（资源管理员） | 5 |
| 上架审批（运营管理员） | 5 |
| 资源使用管理 | 4 |
| 我的资源 | 4 |
| 项目管理 | 9 |
| 评分配置 | 4 |
| 评分标签管理 | 5 |
| 资源评分 | 4 |
| 反馈管理 | 9 |
| 浏览与收藏 | 4 |
| 工作台 | 1 |
| **合计** | **73** |

---

## 相关文档

- [接口设计文档（详细版）](./资源模块接口设计文档.md)
- [技术设计方案](./资源模块技术设计方案.md)

