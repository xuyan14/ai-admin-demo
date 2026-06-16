# 仿写裂变 PRD

> 文档版本：v1.1  
> 模块定位：创意工具 / 万能指令 / 仿写裂变 Tab  
> 上级文档：[PRD-万能指令.md](./PRD-万能指令.md)  
> 接口文档：[外投图-仿写裂变接口文档.md](./外投图-仿写裂变接口文档.md)  
> 原型参考：`creative-tools-prototype.html`（万能指令 → 仿写裂变 Tab）  
> 文档说明：描述仿写裂变能力的功能要求、表单逻辑、接口映射与正式版开发约束；视觉风格对齐 Arco Design（参考 `AI内容管理后台-万能指令参考风格.html`）

---

## 1. 模块概述

### 1.1 业务目标

「仿写裂变」面向唯品会外投/营销素材生产场景，基于**参考素材图 + 商品 MID**，调用 Jarvis Admin 异步任务接口（`genType = imitate_fission`），自动完成：

| 能力 | 说明 |
|------|------|
| **仿写** | 将参考素材的设计版式复刻到新商品（替换商品信息，保留版式结构） |
| **裂变** | 在商品信息不变的前提下，生成多种视觉风格变体（Auto / 场景风 / 纯色风） |
| **仿写 & 裂变** | 先完成仿写，再按裂变方向批量产出变体 |

### 1.2 模块边界

- **入口**：万能指令左侧面板第二个 Tab「仿写裂变」，与「指令生成」互斥。
- **不在范围内**：Prompt 输入、模型选择、图片本地上传（仿写裂变 Tab 内不提供上传区）。
- **参考图输入方式**：用户粘贴**外网可访问**的图片 URL（非本地上传）；接口字段为 `referenceMaterialInfoList`。
- **正式版后端**：Jarvis Admin `POST /v1/crecTool/submitTask` + `POST /v1/crecTool/queryTaskDetail`（异步轮询）。

### 1.3 用户场景（摘要）

1. **单品仿写**：上传参考 URL + 新商品 MID + 生图比例 + 生成数量 → 产出 N 张仿写图。
2. **单品裂变**：参考 URL + 原商品 MID + 裂变方向数量 → 产出多风格变体。
3. **仿写后裂变**：参考 URL + 新商品 MID + 比例 + 裂变方向 → 仿写并裂变。
4. **多品多图**：多条参考 URL（`;` 或换行分隔）+ 对应 MID → 按组产出结果（`logicGenerateType = 104`）。

---

## 2. 功能点总览

| 编号 | 功能点 | 是否必填 | 说明 |
|------|--------|----------|------|
| FF1 | Tab 切换 | - | 进入仿写裂变时隐藏指令生成专属表单与图片上传区 |
| FF2 | 复刻策略 | 是 | 仅仿写 / 仅裂变 / 仿写&裂变 |
| FF3 | 素材类型 | 是 | 单品单图(101) / 多品多图(104) |
| FF4 | 参考图 URL | 是 | 单品单行；多品 **9 条** URL，支持预览 |
| FF5 | 商品 ID | 是 | 全模式必填；文案随复刻策略变化 |
| FF6 | 生图比例 | 条件 | 仅「单品单图」展示；映射 targetWidth/Height |
| FF7 | 生成数量 | 条件 | 仅「仅仿写」展示；1~4 张 |
| FF8 | 裂变方向 | 条件 | 仅「仅裂变 / 仿写&裂变」展示；Auto / 场景风 / 纯色风 |
| FF9 | 预计产出摘要 | - | 单品按「张」；多品按「套九宫格」汇总方向组数 |
| FF10 | 提交生成 | - | 校验 → submitTask → 轮询 queryTaskDetail → 生成记录展示 |
| FF11 | 生成记录展示 | - | 中间面板：单图/画廊（101）或 N 套九宫格（104） |
| FF12 | 任务历史回溯 | - | 回填配置 + 中间面板展示完整生成记录 |
| FF13 | 重新生成 | - | 复用当前表单参数再次提交 |

---

## 3. 页面与 Tab 行为

### 3.1 FF1 - Tab 切换

切换到「仿写裂变」时：

| 区域 | 行为 |
|------|------|
| 指令 Prompt | 隐藏 |
| 模型选择 | 隐藏 |
| 背景图比例（指令生成） | 隐藏 |
| 生成数量（指令生成） | 隐藏 |
| **图片上传区** | **隐藏**（仿写裂变不使用 `universalUploadedImages`） |
| 仿写裂变表单 | 显示（FF2~FF9） |

切换 Tab **不清空**仿写裂变 Tab 内已填字段；**不依赖**指令生成 Tab 的上传图片数组。

> **正式版约束**：提交仿写裂变时，不得校验 `universalUploadedImages`；仅校验 FF4 参考图 URL 与 FF5 商品 ID 等仿写裂变字段。

---

## 4. 表单字段规格

### 4.1 字段顺序（自上而下）

1. 复刻策略（FF2）  
2. 素材类型（FF3）  
3. 参考图 URL（FF4）  
4. 商品 ID（FF5）  
5. 生图比例（FF6）  
6. 生成数量（FF7）  
7. 裂变方向（FF8）

### 4.2 FF2 - 复刻策略

| UI 选项 | 内部值 | 接口 `copyStrategy` | 默认 |
|---------|--------|----------------------|------|
| 仅仿写 | `copy` | `"3"` | **是（默认选中）** |
| 仅裂变 | `fission` | `"4"` | 否 |
| 仿写&裂变 | `both` | `"2"` | 否 |

控件：分段按钮（Arco `radio-group-button`）。

### 4.3 FF3 - 素材类型

| UI 选项 | 接口 `logicGenerateType` | 默认 |
|---------|--------------------------|------|
| 单品单图 | `101` | **是** |
| 多品多图 | `104` | 否 |

切换素材类型时联动 FF4 输入控件（单行 / 多行）及 FF6 显隐。

### 4.4 FF4 - 参考图 URL

| 素材类型 | 输入控件 | 规则 |
|----------|----------|------|
| 单品单图(101) | 单行文本框 | 恰好 1 条 URL |
| 多品多图(104) | 多行文本域 | **恰好 9 条** URL，以 `;` 或换行分隔 |

**校验：**

- 至少 1 条非空 URL（101）；**104 模式必须恰好 9 条**。
- 必须以 `http://` 或 `https://` 开头。
- 单品单图模式下 URL 条数必须为 1。

**预览：**

| 素材类型 | 预览样式 | 显隐与尺寸 |
|----------|----------|------------|
| 单品单图(101) | **单张缩略图**（120×120） | 有有效 URL 后显示；无 URL 时隐藏预览区 |
| 多品多图(104) | **固定 3×3 九宫格**（280×280） | 选中 104 后**立即显示**；尺寸**不随**粘贴数量变化 |

**多品多图预览细则：**

- 预览区标题：`参考图预览 · 3×3（N/9 张）`，仅 **N** 随输入变化，**格子区域大小固定**。
- 始终渲染 9 格：已填格显示图片 + 序号角标；未填格为虚线占位。
- 点击已填格 → 新窗口预览大图。
- 图片加载失败时该格降级为占位样式，不阻断提交。

**接口映射：** `referenceMaterialInfoList: string[]`

### 4.5 FF5 - 商品 ID

| 复刻策略 | 标签文案 | 占位提示 |
|----------|----------|----------|
| 仅仿写 / 仿写&裂变 | 新商品 ID | 请输入唯品会商品 ID |
| 仅裂变 | 商品 ID | 请输入参考图中的商品 ID |

- **全模式必填**（含仅裂变）。
- 前端不做格式校验；合法性由后端校验。
- 接口映射：`midList: number[]`。

**多品多图（104）待确认（见 §9）：** 当前原型为单个 ID 输入框；若后端要求 URL 与 MID 一一对应，正式版需支持多 MID 输入或结构化表单。

### 4.6 FF6 - 生图比例

| 选项 | 接口映射 |
|------|----------|
| Auto（默认） | `targetWidth = null`, `targetHeight = null`（服务端从首图解析） |
| 1:1 | 800 × 800 |
| 3:4 | 750 × 1000 |
| 9:16 | 1080 × 1920 |
| 16:9 | 1920 × 1080 |

**显隐规则：**

| 素材类型 | 是否展示 |
|----------|----------|
| 单品单图(101) | 展示（所有复刻策略均展示） |
| 多品多图(104) | 隐藏（不传 targetWidth/Height） |

### 4.7 FF7 - 生成数量

| 选项 | 值 |
|------|-----|
| 1 张（默认） | 1 |
| 2 张 | 2 |
| 3 张 | 3 |
| 4 张 | 4 |

**显隐规则：** 仅在「仅仿写」模式下展示。

**接口映射（待确认）：** 当前 Jarvis 接口文档**无**独立「仿写张数」字段；正式版对接前须与后端确认映射方式（见 §9.1）。

### 4.8 FF8 - 裂变方向

**显隐规则：**「仅仿写」隐藏；「仅裂变 / 仿写&裂变」展示。

每个方向包含：**名称 + 描述 + 步进器（0~10）**。

| 方向 | 描述文案 | 默认值 | 接口字段 |
|------|----------|--------|----------|
| Auto | 系统自动分配裂变风格 | 2 | **待确认**（见 §9.2） |
| 场景风 | 生活化/主题化场景，氛围感强 | 1 | `sceneFissionNum` |
| 纯色风 | 纯色/简洁色块背景，突出商品 | 1 | `solidFissionNum` |

**校验（裂变相关模式）：** Auto + 场景风 + 纯色风 三者之和必须 **> 0**。

**预计产出摘要（FF9）：**

| 素材类型 | 文案模板 |
|----------|----------|
| 单品单图(101) | `预计产出约 {total} 张（Auto {auto} + 场景 {scene} + 纯色 {solid}）` |
| 多品多图(104) | `预计产出 {total} 套九宫格（每套 9 张 · Auto {auto} + 场景 {scene} + 纯色 {solid}）` |

- `total` = Auto + 场景风 + 纯色风步进器之和（裂变相关模式）；多品下 **1 组方向 = 1 套九宫格**。
- 仅仿写 + 多品：`copyCount` 套九宫格（摘要区隐藏时由生成数量字段体现）。
- UI 估算，最终以接口返回 `generationRecord.groups.length` 为准。

---

## 5. 字段联动矩阵

### 5.1 复刻策略 × 字段显隐

| 字段 | 仅仿写 | 仅裂变 | 仿写&裂变 |
|------|--------|--------|-----------|
| 参考图 URL | ✓ | ✓ | ✓ |
| 商品 ID | ✓ | ✓ | ✓ |
| 生图比例（101） | ✓ | ✓ | ✓ |
| 生成数量 | ✓ | ✗ | ✗ |
| 裂变方向 | ✗ | ✓ | ✓ |

### 5.2 素材类型 × 字段差异

| 字段 | 单品单图(101) | 多品多图(104) |
|------|---------------|---------------|
| 参考图输入 | 单行 1 URL | 多行，**恰好 9 条** URL |
| 参考图预览 | 单张缩略图 120×120 | **固定** 3×3 九宫格 280×280 |
| 生图比例 | 展示 | 隐藏 |
| 生成数量 | 按复刻策略 | 按复刻策略 |
| 裂变方向 | 按复刻策略 | 按复刻策略 |

### 5.3 提交参数清零规则

| 复刻策略 | sceneFissionNum | solidFissionNum | Auto 步进值 | copyCount |
|----------|-----------------|-----------------|-------------|-----------|
| 仅仿写 | 0 | 0 | 0 | 取 UI 值 |
| 仅裂变 | 取 UI 值 | 取 UI 值 | 取 UI 值 | 不传 |
| 仿写&裂变 | 取 UI 值 | 取 UI 值 | 取 UI 值 | 不传 |

---

## 6. 提交流程（FF10）

### 6.1 提交前校验

按顺序执行，任一失败则中断并 Toast/Alert 提示：

1. 参考图 URL 非空且格式合法（FF4）。
2. 单品单图 URL 条数为 1；**多品多图 URL 条数必须为 9**。
3. 商品 ID 非空（FF5）。
4. 非「仅仿写」模式下，裂变方向总量 > 0（FF8）。

**不得**校验指令生成 Tab 的上传图片数组。

### 6.2 请求体组装

调用 `POST /v1/crecTool/submitTask`，结构如下：

```json
{
  "genType": "imitate_fission",
  "operateUser": "<当前登录用户或场景标识>",
  "taskParam": {
    "bizCode": "crec_tool",
    "taskName": "仿写裂变-<可选自定义>",
    "imitateFissionTaskParam": {
      "copyStrategy": "2 | 3 | 4",
      "logicGenerateType": 101,
      "referenceMaterialInfoList": ["https://..."],
      "midList": [6921884166766247117],
      "targetWidth": 800,
      "targetHeight": 800,
      "sceneFissionNum": 1,
      "solidFissionNum": 1,
      "modelName": "nano-banana-pro",
      "imageSize": "2K"
    }
  }
}
```

**UI → 接口字段映射表：**

| UI 字段 | 接口路径 | 类型 | 备注 |
|---------|----------|------|------|
| 复刻策略 | `copyStrategy` | string | `"2"`/`"3"`/`"4"` |
| 素材类型 | `logicGenerateType` | int | `101` / `104` |
| 参考图 URL | `referenceMaterialInfoList` | string[] | 必填 |
| 商品 ID | `midList` | number[] | 必填；字符串转 number，注意大整数精度 |
| 生图比例 | `targetWidth` / `targetHeight` | int? | Auto 时不传或传 null；104 不传 |
| 场景风数量 | `sceneFissionNum` | int | 仅仿写时传 0 |
| 纯色风数量 | `solidFissionNum` | int | 仅仿写时传 0 |
| Auto 数量 | — | — | **待确认**，见 §9.2 |
| 生成数量 | — | — | **待确认**，见 §9.1 |
| — | `modelName` | string | 默认 `nano-banana-pro`，V1 可不暴露 UI |
| — | `imageSize` | string | 默认 `2K`，V1 可不暴露 UI |
| — | `bizCode` | string | 默认 `crec_tool`，可配置 |
| — | `operateUser` | string | 从登录态注入 |

### 6.3 提交响应处理

1. 检查外层 `code === 200` 且 `data.code === 200`。
2. 读取 `data.taskId`。
3. 失败时展示 `data.msg`，保留表单，提供「重新生成」。

### 6.4 轮询 queryTaskDetail

| 项 | 规范 |
|----|------|
| 接口 | `POST /v1/crecTool/queryTaskDetail` |
| 请求体 | `{ "taskId": <long> }` |
| 间隔 | **10 秒**（建议） |
| 超时 | 可配置，如 10 分钟无终态则提示超时 |
| 结束条件 | 展平所有 `taskMaterialDetailGroupVOList → taskMaterialDetailRowVOList → taskMaterialDetailVOList`，当全部 `status !== 0` 时结束 |
| 成功 | `status === 10`，读取 `showMaterialUrl`（展示）/ `materialUrl`（下载） |
| 失败 | `status === 11` 或 `26`，展示 `statusDesc` |

**多图结果：**

- 一次任务可能返回多条成功明细，中间面板须支持**按组展示**（见 §6.6）。
- 多品多图(104) 可能分布在多个 `taskMaterialDetailRowVOList` 下标，须遍历全部 row。

### 6.6 生成记录展示（FF11）

#### 展示规则

| 素材类型 | 输入 | 中间面板输出 | 右侧任务卡片 |
|----------|------|-------------|-------------|
| 单品单图(101) | 1 条参考 URL | **单图**或**多图画廊**（仿写 `copyCount` 张 / 裂变每方向 1 张） | 单张缩略；多张角标「N 张」 |
| 多品多图(104) | **恰好 9 条**参考 URL | 裂变方向 **N 组 → N 套九宫格**（每套 9 张）；仅仿写时 **`copyCount` 套** | 首套迷你九宫格；多套角标「N 套」 |

**组（Group）展开规则：**

| 模式 | 单品(101) | 多品(104) |
|------|-----------|-----------|
| 仅仿写 | `copyCount` 个单图组 | `copyCount` 个九宫格组 |
| 仅裂变 / 仿写&裂变 | Auto×N + 场景×N + 纯色×N 个**单图**组 | 同上，每组为**一套九宫格** |

示例：多品 + 裂变，Auto=2、场景=1、纯色=1 → **4 套**九宫格，中间面板纵向排列 4 个 3×3 区块，组标题如「Auto 裂变 1」「场景风」等。

**与参考图预览的区别：**

| | 参考图预览（FF4） | 生成记录（FF11） |
|--|------------------|-----------------|
| 位置 | 左侧表单下方 | 中间面板 / 右侧历史卡片 |
| 多品样式 | 固定 280×280 输入预览 | 结果九宫格（可更大，如 max 420px） |
| 数据来源 | 用户粘贴 URL | 接口 `showMaterialUrl` / 演示数据 |

#### 数据结构（建议）

```typescript
interface GenerationCell {
  index: number;       // 1-9（九宫格内序号）
  url: string;
  status: number;    // 10=成功
}

interface GenerationGroup {
  type: 'single' | 'grid';
  groupIndex: number;
  label: string;     // 如「仿写组」「场景裂变组」
  cells: GenerationCell[];  // grid 类型固定 9 个
}

interface GenerationRecord {
  displayType: 'single' | 'multi' | 'grouped';
  groups: GenerationGroup[];
  meta: {
    tab: 'fission' | 'generate';
    materialType?: 101 | 104;
    mode?: string;
    inputCount?: number;
    groupCount?: number;
    setCount?: number;   // 多品：九宫格套数
    taskId?: number;
  };
}
```

#### 组展开算法（前端 `collectFissionGroupSpecs`）

1. **仅仿写**：按 `copyCount` 循环，101 → `type: single`，104 → `type: grid`（每套 9 格）。
2. **仅裂变 / 仿写&裂变**：按步进器数值展开——Auto 有 2 则 2 组、场景 1 则 1 组……组数之和 = `autoFissionNum + sceneFissionNum + solidFissionNum`。
3. 每组 `label` 含方向名与序号（如「Auto 裂变 2」「场景风」）。

#### 解析规则（queryTaskDetail → GenerationRecord）

1. 遍历 `taskMaterialDetailGroupVOList[*].taskMaterialDetailRowVOList[*]`。
2. `logicGenerateType === 104`：每个 row 下 `status=10` 的明细 → 填满 9 格 `cells`，`type: 'grid'`。
3. `logicGenerateType === 101`：每条成功明细 → `type: 'single'` 的独立组，或同 label 合并为画廊。
4. 展示 URL 优先 `showMaterialUrl`，下载用 `materialUrl`。
5. `ext.materialLabels` 可作为组标题。

#### 交互

- 点击九宫格单格 / 单图 → 新窗口预览大图。
- 点击右侧任务卡片 → 中间面板展示完整生成记录 + 左侧表单回溯。
- 重新生成 → 复用当前表单再次提交。

### 6.5 加载态信息

中间面板加载中展示：

- 参考图数量
- 复刻策略名称
- 生图比例（若有）
- 预计产出张数（裂变模式）

---

## 7. 任务历史与回溯（FF12）

### 7.1 任务卡片

- 徽章文案：`仿写裂变`
- **单品单图**：单张结果缩略图；多张角标「N 张」
- **多品多图**：首套迷你 **3×3 九宫格**；多套角标「**N 套**」
- 展示：任务名、时间、操作人；左上角叠原图（首张参考图）
- 点击卡片：中间面板展示 `generationRecord` + 左侧表单回溯

### 7.2 回溯字段

点击历史任务卡片后：

1. 中间面板展示该任务 `generationRecord`（完整单图/九宫格组）。
2. 左侧切换到仿写裂变 Tab 并回填：

| 字段 | 存储键（建议） |
|------|----------------|
| 复刻策略 | `fissionMode`: `copy` / `fission` / `both` |
| 素材类型 | `fissionMaterialType`: `101` / `104` |
| 参考图 URL | `fissionRefUrls`: string[] |
| 商品 ID | `fissionGoodsId`: string |
| 生图比例 | `fissionOutputRatio`: `auto` / `1:1` / … |
| 生成数量 | `fissionCopyCount`: `1`~`4` |
| Auto 数量 | `fissionAutoNum`: number |
| 场景风数量 | `fissionSceneNum`: number |
| 纯色风数量 | `fissionSolidNum`: number |
| 生成记录 | `generationRecord`: GenerationRecord |
| 服务端任务 ID | `taskId`: number（用于查看详情，可选） |

回溯后调用 `updateFissionPanelState()` 刷新显隐与摘要。

---

## 8. 视觉与交互约束（正式版）

| 项 | 要求 |
|----|------|
| 设计体系 | Arco Design，对齐 `AI内容管理后台-万能指令参考风格.html` |
| 左侧面板 | 标题「生图任务信息编辑」；Tab 为 Arco 线型 Tab + ink 指示条 |
| 表单控件 | Arco 表单项、分段按钮、圆形 Radio、步进器 |
| 主色 | `#165dff` |
| 侧边栏 | Arco 浅色 Sider（220px），与万能指令模块一致 |
| 多品参考预览 | 固定 **280×280** 九宫格，选中 104 即显示，不随粘贴张数改变尺寸 |
| 单品参考预览 | **120×120** 单图缩略，有 URL 后显示 |
| 结果九宫格 | 3×3 网格，格序号 1~9，组标题 + 「九宫格 · 9 张/套」徽章 |
| 错误提示 | Toast 优先；阻断型校验可用 Alert |

---

## 9. 待确认项（对接前必须闭环）

以下项在原型/UI 已体现，但与当前接口文档存在 gap，**正式版 AI Coding 前须产品 + 后端确认**：

### 9.1 仅仿写「生成数量」(copyCount)

- **UI 要求**：1~4 张可选。
- **接口现状**：`imitate_fission` 无对应字段。
- **待确认**：是否多次 submit、是否有未文档化字段、或由服务端按 copyStrategy=3 默认 1 张。

### 9.2 裂变方向「Auto」数量 (autoFissionNum)

- **UI 要求**：独立步进器，默认 2，范围 0~10。
- **接口现状**：仅有 `sceneFissionNum`、`solidFissionNum`。
- **待确认**：Auto 如何映射（合并进 scene/solid、服务端自动分配、或新增字段）。

### 9.3 多品多图 midList 与 URL 对应关系

- **UI 现状**：多 URL + 单 MID 输入。
- **接口示例**：104 模式下 `midList` 可含多个 MID。
- **待确认**：是否要求 `midList.length === referenceMaterialInfoList.length` 及顺序一致；若要求，UI 需升级为「URL + MID」成对录入。

### 9.4 midList 数值类型

- 唯品会 MID 为大整数，前端须使用 **字符串传输 + 后端转 long**，或 JSON 数字安全处理，避免 JavaScript 精度丢失。

---

## 10. 异常与边界

| 场景 | 处理 |
|------|------|
| 参考图 URL 不可访问 | 提交可能成功但生成失败；轮询后展示 `statusDesc` |
| 商品 ID 无效 | 业务层 `data.code != 200` 或明细 `status = 11/26` |
| 轮询超时 | 提示用户稍后到任务列表查看；保留 taskId |
| 部分成功部分失败 | 展示成功图 + 失败条目的 statusDesc |
| 网络错误 | Toast + 中间面板错误态 + 重新生成按钮 |
| 权限不足 | 接口受创意工具菜单权限控制，需统一鉴权拦截 |

---

## 11. 正式版验收标准（AI Coding Checklist）

### 11.1 表单与联动

- [ ] 仿写裂变 Tab 不展示图片上传区
- [ ] 字段顺序：复刻策略 → 素材类型 → URL → 商品 ID → 生图比例 → 生成数量 → 裂变方向
- [ ] 复刻策略默认「仅仿写」
- [ ] 联动矩阵（§5）全部生效
- [ ] 裂变方向描述文案与 §4.8 一致
- [ ] 预计产出摘要：101 按张、104 按套九宫格
- [ ] 多品参考预览：固定 280×280 九宫格，选中 104 即显示
- [ ] 单品参考预览：120×120 单图，有 URL 后显示

### 11.2 校验与提交

- [ ] 提交不依赖 `universalUploadedImages`
- [ ] §6.1 校验规则全部实现
- [ ] 多品多图 URL 恰好 9 条校验
- [ ] 正确组装 `submitTask` 请求体（§6.2）
- [ ] `midList` 类型安全

### 11.3 生成记录与异步

- [ ] 10 秒轮询 `queryTaskDetail`
- [ ] 正确处理 status 0 / 10 / 11 / 26
- [ ] 101：单图 / 画廊；104：N 套九宫格（方向组数 = 套数）
- [ ] `collectFissionGroupSpecs` 按步进器展开组数
- [ ] 加载态 / 成功态 / 失败态 / 重新生成

### 11.4 历史回溯

- [ ] 任务卡片可回填 §7.2 全部字段
- [ ] 点击卡片中间面板展示完整 `generationRecord`
- [ ] 回填后显隐与摘要正确

### 11.5 待确认项

- [ ] §9.1 ~ §9.4 已与后端对齐并实现

---

## 12. 附录

### 12.1 枚举速查

**copyStrategy**

| 值 | 含义 |
|----|------|
| 2 | 仿写 + 裂变 |
| 3 | 仅仿写 |
| 4 | 仅裂变 |

**logicGenerateType**

| 值 | 含义 |
|----|------|
| 101 | 单品单图 |
| 104 | 多品多图 |

**任务明细 status**

| 值 | 含义 |
|----|------|
| 0 | 生成中，继续轮询 |
| 10 | 生成成功 |
| 11 | 生成失败 |
| 26 | 仿写裂变处理失败 |

### 12.2 前端数据结构（建议）

```typescript
interface FissionFormData {
  mode: 'copy' | 'fission' | 'both';
  materialType: 101 | 104;
  referenceUrls: string[];
  goodsId: string; // 或多品模式下 GoodsPair[]
  outputRatio: 'auto' | '1:1' | '3:4' | '9:16' | '16:9' | null;
  copyCount: 1 | 2 | 3 | 4 | null;
  autoNum: number;
  sceneNum: number;
  solidNum: number;
}

interface FissionSubmitPayload {
  genType: 'imitate_fission';
  operateUser: string;
  taskParam: {
    bizCode: string;
    taskName?: string;
    imitateFissionTaskParam: {
      copyStrategy: '2' | '3' | '4';
      logicGenerateType: 101 | 104;
      referenceMaterialInfoList: string[];
      midList: number[];
      targetWidth?: number | null;
      targetHeight?: number | null;
      sceneFissionNum: number;
      solidFissionNum: number;
      modelName?: string;
      imageSize?: string;
    };
  };
}
```

### 12.3 与上级 PRD 的差异说明

| 项 | PRD-万能指令.md（旧） | 本模块定稿 |
|----|----------------------|------------|
| 参考图输入 | 与指令生成共用上传 | **URL 粘贴，隐藏上传区** |
| 复刻策略默认 | 仿写&裂变 | **仅仿写** |
| 商品 ID（仅裂变） | 隐藏 | **展示且必填**，文案为「参考图中的商品 ID」 |
| 后端接口 | `/api/change-background` | **Jarvis crecTool 异步接口** |
| 素材类型 | 未描述 | **新增 101 / 104** |
| 裂变方向 | 未描述 | **Auto / 场景风 / 纯色风 + 步进器** |
| 参考图预览 | 未描述 | **101 单图；104 固定 3×3** |
| 生成记录 | 未描述 | **101 单图/画廊；104 N 套九宫格** |

### 12.4 变更记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-05-19 | v1.0 | 初版：基于原型与接口文档整理，含待确认项 |
| 2026-05-19 | v1.1 | 生成记录（单图/九宫格组）；多品方向 N 组=N 套；参考预览 104 固定 3×3；验收清单更新 |
