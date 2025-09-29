# Spec Workflow 使用说明

本目录存放与 Spec Workflow MCP Server 相关的配置、模版与历史数据，便于在项目内高效撰写和审阅规格文档。

## 目录结构
- `config.toml`：当前使用的配置文件，启动服务器时会优先生效。
- `config.example.toml`：示例配置，提供默认推荐值，可复制改名为 `config.toml`。
- `session.json`：运行时生成的会话信息，记录最近一次本地仪表盘的地址与进程。
- `specs/`：项目的规范文档集合，例如产品、结构、技术等说明。
- `templates/`：官方默认模版，适用于快速起草各类规格文档。
- `user-templates/`：自定义模版目录，与默认模版同名文件会被优先加载。
- `archive/`：建议用于存放归档的历史规格。
- `approvals/`：建议用于收纳评审记录或盖章后的规格文档。
- `steering/`：留作存放指导性资料（如架构守则、接口规范）。

## 配置建议
1. `projectDir` 建议保持 `./`，确保工具以仓库根目录为基准解析路径。
2. `port` 统一指定为 `3456`，避免多端口造成沟通成本。
3. `autoStartDashboard = true` 可在启动时自动打开浏览器，若在 CI 或无头环境运行可改为 `false`。
4. `dashboardOnly` 默认为 `false`，如仅需浏览历史文档可暂时改为 `true`。
5. `lang = "zh-CN"` 使仪表盘界面默认显示为中文，方便国内团队协作。

## 模版管理
- 如需调整模版结构，复制 `templates/` 中同名文件到 `user-templates/` 后编辑。
- 模版内可使用占位符 `{{projectName}}`、`{{featureName}}`、`{{date}}`、`{{author}}` 等变量。
- 建议在模版开头注明更新时间和维护人，便于团队同步。

## 维护建议
- `session.json` 为临时文件，建议忽略版本控制（已在根目录 `.gitignore` 处理）。
- 定期整理 `archive/` 与 `approvals/`，保证规范文档版本可追溯。
- 修改配置后建议执行一次 `pnpm spec:dashboard`（若存在）确认生效。
