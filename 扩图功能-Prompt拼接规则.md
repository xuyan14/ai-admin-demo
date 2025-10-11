# 扩图功能 - Prompt拼接规则分析

## 📋 当前Prompt构建逻辑（已优化）✅

### 代码位置
**文件：** `creative-tools-prototype.html`
**函数：** `callExpandAPIWithNBModel()` (第4929-5027行)

**最后更新：** 2025-10-09 18:51

---

## 🔍 关键参数获取

```javascript
// 第4932-4936行：获取用户选择的参数
const expandType = document.querySelector('input[name="expandType"]:checked')?.value || 'scene';
const expandMethod = document.querySelector('input[name="expandMethod"]:checked')?.value || 'direct';
const expandRatio = document.querySelector('input[name="expandRatio"]:checked')?.value || '9:16';
const expandDirection = document.querySelector('input[name="expandDirection"]:checked')?.value || '向下';
const promptText = document.getElementById('promptText')?.value || '';
```

**参数说明：**
- `expandType` - 扩图类型（scene/color）
- `expandMethod` - 扩图方式（direct/cutFirst）
- `expandRatio` - 扩图比例（9:16、16:9、2:3等）
- `expandDirection` - 扩图方向（**向上、向下、居中、向左、向右**）✅ 中文
- `promptText` - 用户输入的自定义提示词

**扩图方向可选值（中文）：**
- 竖图方向：`向上`、`向下`、`居中`
- 横图方向：`向左`、`向右`、`居中`

---

## 📝 Prompt构建规则

### 1. 显示用Prompt（displayPrompt）

**用途：** 在前端界面展示给用户看的Prompt

#### 规则1：用户有输入自定义promptText
```javascript
// 第4957-4958行
displayPrompt = `扩展图片画面内容，${expandDirection}扩图，最终图片尺寸比例为${expandRatio}。扩图要求：${promptText}`;
```

**示例：**
```
输入参数：
- expandDirection: "向下"
- expandRatio: "9:16"
- promptText: "添加更多的天空和云朵"

生成的displayPrompt：
"扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16。扩图要求：添加更多的天空和云朵"
```

#### 规则2：场景扩图，无自定义promptText
```javascript
// 第4961行
displayPrompt = `根据图片当前内容场景，扩展图片画面内容，${expandDirection}扩图，最终图片尺寸比例为${expandRatio}，扩图后的场景与原图要一致`;
```

**示例：**
```
输入参数：
- expandType: "scene"
- expandDirection: "向下"
- expandRatio: "9:16"
- promptText: ""（空）

生成的displayPrompt：
"根据图片当前内容场景，扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16，扩图后的场景与原图要一致"
```

#### 规则3：颜色扩图，无自定义promptText
```javascript
// 第4963行
displayPrompt = `根据图片主色调，扩展图片画面内容，${expandDirection}扩图，最终图片尺寸比例为${expandRatio}，扩图后的颜色要协调，场景与原图要一致`;
```

**示例：**
```
输入参数：
- expandType: "color"
- expandDirection: "居中"
- expandRatio: "16:9"
- promptText: ""（空）

生成的displayPrompt：
"根据图片主色调，扩展图片画面内容，居中扩图，最终图片尺寸比例为16:9，扩图后的颜色要协调，场景与原图要一致"
```

---

### 2. 实际发送给API的Prompt ⚠️ 问题所在

**代码位置：** 第5000-5007行

```javascript
const apiPayload = {
    image_url: imageUrl,
    prompt: promptText || `扩展图片背景，${expandType === 'scene' ? '场景扩图' : '颜色扩图'}，${expandDirection}扩图`,
    model: 'nb',
    expand_type: expandType,
    expand_direction: expandDirection,
    expand_ratio: expandRatio
};
```

#### 规则1：用户有输入promptText
```javascript
prompt: promptText
```

**示例：**
```
用户输入："添加更多的天空和云朵"
实际发送的prompt："添加更多的天空和云朵"

❌ 问题：缺少尺寸信息！
```

#### 规则2：用户没有输入promptText
```javascript
prompt: `扩展图片背景，${expandType === 'scene' ? '场景扩图' : '颜色扩图'}，${expandDirection}扩图`
```

**示例（场景扩图）：**
```
expandType: "scene"
expandDirection: "向下"

实际发送的prompt："扩展图片背景，场景扩图，向下扩图"

❌ 问题：也缺少尺寸信息！
```

**示例（颜色扩图）：**
```
expandType: "color"
expandDirection: "居中"

实际发送的prompt："扩展图片背景，颜色扩图，居中扩图"

❌ 问题：同样缺少尺寸信息！
```

---

## ❌ 问题诊断

### 问题1：实际Prompt太简单

**当前实际发送的Prompt：**
- 有自定义：直接使用用户输入（可能不包含尺寸）
- 无自定义：`"扩展图片背景，场景扩图，向下扩图"`（没有尺寸信息）

**问题：**
- ❌ 没有包含 `expandRatio`（扩图比例）
- ❌ NanoBanana API无法知道目标尺寸
- ❌ 可能按默认尺寸或自行判断生成

**后果：**
- 生成的图片尺寸不符合预期
- 用户选择的比例（9:16、16:9等）没有生效

---

### 问题2：displayPrompt vs 实际Prompt不一致

**显示给用户看的（displayPrompt）：**
```
"扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16。扩图要求：xxx"
                                    ↑
                              包含尺寸信息
```

**实际发送给API的（apiPayload.prompt）：**
```
"扩展图片背景，场景扩图，向下扩图"
                          ↑
                     没有尺寸信息！
```

**问题：**
- ❌ 用户以为发送的是完整的Prompt（含尺寸）
- ❌ 实际发送的是简化版本（不含尺寸）
- ❌ 导致生成结果不符合预期

---

### 问题3：参数传递方式不明确

**当前传递方式：**
```javascript
{
    prompt: "扩展图片背景，场景扩图，向下扩图",  // 文本描述
    expand_ratio: "9:16"                         // 单独的参数
}
```

**可能的问题：**
1. NanoBanana API是否支持 `expand_ratio` 参数？
2. 如果不支持，只能通过Prompt传递尺寸信息
3. 如果支持，是否正确解析和应用？

---

## ✅ 建议的修复方案

### 方案1：将尺寸信息加入Prompt（推荐）

**修改代码：**
```javascript
// 第5002行修改为：
prompt: promptText 
    ? `${promptText}，最终图片尺寸比例为${expandRatio}` 
    : `扩展图片背景，${expandType === 'scene' ? '场景扩图' : '颜色扩图'}，${expandDirection}扩图，最终图片尺寸比例为${expandRatio}`
```

**效果：**

**有自定义promptText：**
```
用户输入："添加更多的天空和云朵"
实际发送："添加更多的天空和云朵，最终图片尺寸比例为9:16"
✅ 包含尺寸信息
```

**无自定义promptText（场景扩图）：**
```
实际发送："扩展图片背景，场景扩图，向下扩图，最终图片尺寸比例为9:16"
✅ 包含尺寸信息
```

**无自定义promptText（颜色扩图）：**
```
实际发送："扩展图片背景，颜色扩图，居中扩图，最终图片尺寸比例为16:9"
✅ 包含尺寸信息
```

---

### 方案2：使用完整的displayPrompt（更推荐）

**修改代码：**
```javascript
// 第5002行修改为：
prompt: displayPrompt
```

**优势：**
- ✅ 显示和实际发送的Prompt一致
- ✅ 用户看到什么就发送什么
- ✅ 包含完整的参数信息（类型、方向、尺寸、要求）

**效果：**

**有自定义promptText：**
```
实际发送："扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16。扩图要求：添加更多的天空和云朵"
✅ 完整详细
```

**无自定义promptText（场景扩图）：**
```
实际发送："根据图片当前内容场景，扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16，扩图后的场景与原图要一致"
✅ 完整详细
```

**无自定义promptText（颜色扩图）：**
```
实际发送："根据图片主色调，扩展图片画面内容，居中扩图，最终图片尺寸比例为16:9，扩图后的颜色要协调，场景与原图要一致"
✅ 完整详细
```

---

## 📊 对比分析

### 当前Prompt vs 建议Prompt

| 场景 | 当前Prompt | 建议Prompt（方案2） | 差异 |
|------|-----------|-------------------|------|
| **有自定义** | "添加天空" | "扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16。扩图要求：添加天空" | +尺寸+方向 |
| **场景扩图** | "扩展图片背景，场景扩图，向下扩图" | "根据图片当前内容场景，扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16，扩图后的场景与原图要一致" | +尺寸+场景一致性要求 |
| **颜色扩图** | "扩展图片背景，颜色扩图，居中扩图" | "根据图片主色调，扩展图片画面内容，居中扩图，最终图片尺寸比例为16:9，扩图后的颜色要协调，场景与原图要一致" | +尺寸+颜色协调要求 |

---

## 🔧 其他传递的参数

虽然Prompt中可能缺少尺寸，但代码中确实传递了独立的参数：

```javascript
{
    image_url: imageUrl,
    prompt: "...",
    model: 'nb',
    expand_type: expandType,        // "scene" 或 "color"
    expand_direction: expandDirection,  // "向下"、"向上"、"居中"
    expand_ratio: expandRatio       // "9:16"、"16:9"等
}
```

**问题：**
- 这些参数（`expand_ratio`、`expand_type`等）是自定义的
- NanoBanana API可能不认识这些参数
- 只能通过 `prompt` 文本来控制生成结果

---

## ⚠️ 根本原因

### NanoBanana API的工作原理

NanoBanana是基于Prompt的AI绘画API，主要通过 **自然语言Prompt** 来控制生成结果。

**它识别：**
- ✅ `prompt` - 文本指令（核心）
- ✅ `image_urls` - 参考图片
- ✅ `model` - 模型名称
- ❌ `expand_ratio` - **可能不识别**（自定义参数）
- ❌ `expand_type` - **可能不识别**（自定义参数）
- ❌ `expand_direction` - **可能不识别**（自定义参数）

**结论：**
如果NanoBanana API不支持这些自定义参数，那么控制尺寸的唯一方法就是在 **Prompt文本中明确说明**。

---

## ✅ 推荐的修复方案

### 立即修复：使用displayPrompt

**修改前：**
```javascript
const apiPayload = {
    image_url: imageUrl,
    prompt: promptText || `扩展图片背景，${expandType === 'scene' ? '场景扩图' : '颜色扩图'}，${expandDirection}扩图`,
    // ❌ Prompt太简单，缺少尺寸信息
    model: 'nb',
    expand_type: expandType,
    expand_direction: expandDirection,
    expand_ratio: expandRatio
};
```

**修改后：**
```javascript
const apiPayload = {
    image_url: imageUrl,
    prompt: displayPrompt,  // ✅ 使用完整的displayPrompt
    model: 'nb',
    expand_type: expandType,      // 保留（可能有用）
    expand_direction: expandDirection,  // 保留（可能有用）
    expand_ratio: expandRatio     // 保留（可能有用）
};
```

**优势：**
1. ✅ Prompt包含完整信息（类型、方向、**尺寸**、要求）
2. ✅ 用户看到的和实际发送的一致
3. ✅ 即使API不支持自定义参数，Prompt也足够详细
4. ✅ 提高AI理解准确性

---

## 📊 修复前后对比

### 场景1：场景扩图，向下，9:16，无自定义

| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| **Prompt** | "扩展图片背景，场景扩图，向下扩图" | "根据图片当前内容场景，扩展图片画面内容，向下扩图，**最终图片尺寸比例为9:16**，扩图后的场景与原图要一致" |
| **尺寸信息** | ❌ 无 | ✅ 有 |
| **场景要求** | ❌ 无 | ✅ 有 |
| **详细程度** | 简单 | 详细 |

### 场景2：颜色扩图，居中，16:9，无自定义

| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| **Prompt** | "扩展图片背景，颜色扩图，居中扩图" | "根据图片主色调，扩展图片画面内容，居中扩图，**最终图片尺寸比例为16:9**，扩图后的颜色要协调，场景与原图要一致" |
| **尺寸信息** | ❌ 无 | ✅ 有 |
| **颜色要求** | ❌ 无 | ✅ 有 |
| **详细程度** | 简单 | 详细 |

### 场景3：场景扩图，向下，9:16，有自定义"添加天空"

| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| **Prompt** | "添加天空" | "扩展图片画面内容，向下扩图，**最终图片尺寸比例为9:16**。扩图要求：添加天空" |
| **尺寸信息** | ❌ 无 | ✅ 有 |
| **方向信息** | ❌ 无 | ✅ 有 |
| **详细程度** | 简单 | 详细 |

---

## 🎯 为什么尺寸没有生效

### 根本原因

1. **Prompt中没有尺寸信息**
   - 当前Prompt：`"扩展图片背景，场景扩图，向下扩图"`
   - AI无法从这个Prompt中得知目标尺寸是9:16还是16:9

2. **自定义参数可能不被识别**
   - `expand_ratio: "9:16"` 可能不是NanoBanana API的标准参数
   - AI模型可能忽略这个参数

3. **用户自定义Prompt直接使用**
   - 用户输入："添加天空"
   - 直接发送："添加天空"
   - 完全没有尺寸、方向等信息

### 预期 vs 实际

**用户的预期：**
```
用户看到界面显示：
"扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16。扩图要求：添加天空"

用户认为发送的就是这个完整Prompt
```

**实际情况：**
```
实际发送给API的：
"添加天空"

❌ 完全不同！
```

---

## 💡 推荐实施方案

### 步骤1：修改代码（1行改动）

**位置：** `creative-tools-prototype.html` 第5002行

**修改：**
```javascript
// 原来
prompt: promptText || `扩展图片背景，${expandType === 'scene' ? '场景扩图' : '颜色扩图'}，${expandDirection}扩图`,

// 修改为
prompt: displayPrompt,
```

### 步骤2：验证修复效果

**测试步骤：**
1. 选择扩图比例：9:16
2. 选择扩图方向：向下
3. 不输入自定义Prompt
4. 点击"生产"
5. **查看控制台日志中的"📤 发送扩图请求"**
6. **确认Prompt包含"最终图片尺寸比例为9:16"**

---

## 📈 预期改进效果

### 修复前

```javascript
📤 发送扩图请求: {
  image_url: "https://...",
  prompt: "扩展图片背景，场景扩图，向下扩图",  // ❌ 无尺寸
  model: "nb",
  expand_ratio: "9:16"  // ❓ 可能不被识别
}
```

### 修复后

```javascript
📤 发送扩图请求: {
  image_url: "https://...",
  prompt: "根据图片当前内容场景，扩展图片画面内容，向下扩图，最终图片尺寸比例为9:16，扩图后的场景与原图要一致",  // ✅ 包含尺寸
  model: "nb",
  expand_ratio: "9:16"  // 保留（如果API支持则双保险）
}
```

---

## 🎓 总结

### 核心问题

1. ❌ **实际Prompt太简单** - 缺少尺寸信息
2. ❌ **Prompt不一致** - 显示的 ≠ 实际发送的
3. ❌ **尺寸控制失效** - AI无法得知目标尺寸

### 解决方案

✅ **使用displayPrompt代替简单的Prompt**
- 一行代码修改
- 立即生效
- 确保尺寸信息传递给AI

### 修复优先级

🔴 **高优先级** - 直接影响功能可用性

---

**建议立即修复！** 这个问题导致用户选择的扩图比例无法生效，严重影响用户体验。

