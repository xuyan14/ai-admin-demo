# GitHub Pages 配置指南

## 🎯 需要在GitHub网站上配置

### **步骤1: 访问仓库设置**

1. 打开浏览器，访问：
   ```
   https://github.com/xuyan14/ai-admin-demo/settings/pages
   ```

2. 或者手动导航：
   - 访问 https://github.com/xuyan14/ai-admin-demo
   - 点击顶部的 **Settings** (设置)
   - 在左侧菜单找到 **Pages**

---

### **步骤2: 配置GitHub Pages**

在 "GitHub Pages" 设置页面：

#### **Build and deployment (构建和部署)**

1. **Source (来源)**: 
   - 选择 `Deploy from a branch`

2. **Branch (分支)**:
   - 下拉菜单选择: `gh-pages`
   - 文件夹选择: `/ (root)`
   - 点击 **Save** 按钮

配置应该如下：
```
Source: Deploy from a branch
Branch: gh-pages    / (root)    [Save]
```

---

### **步骤3: 等待部署**

保存后：
1. 页面会显示部署进度
2. 等待 2-5 分钟
3. 页面顶部会显示：
   ```
   Your site is live at https://xuyan14.github.io/ai-admin-demo/
   ```

---

### **步骤4: 验证部署**

访问以下链接：
```
https://xuyan14.github.io/ai-admin-demo/creative-tools-prototype.html
```

**验证要点**：
- ✅ 左侧菜单有"万能指令"
- ❌ 左侧菜单没有"虚拟换衣"
- ✅ 换背景功能顶部有"换背景"和"背景裂变"tab

---

## 📊 **查看部署状态**

访问 Actions 页面：
```
https://github.com/xuyan14/ai-admin-demo/actions
```

查看 "pages build and deployment" workflow 的状态：
- 🟡 黄色：正在部署
- 🟢 绿色：部署成功
- 🔴 红色：部署失败

---

## 🔧 **如果部署失败**

### **常见问题：**

1. **没有配置Pages**
   - 解决：按照上面的步骤2配置

2. **分支选择错误**
   - 解决：确保选择 `gh-pages` 分支

3. **权限问题**
   - 解决：确保你有仓库的管理员权限

---

## 💡 **快速验证命令**

配置完成后，在本地终端运行：

```bash
# 等待30秒后检查
sleep 30 && curl -I https://xuyan14.github.io/ai-admin-demo/creative-tools-prototype.html
```

如果返回 `200 OK`，说明部署成功。

---

## 📝 **当前状态**

- ✅ 本地代码已准备完毕
- ✅ 代码已推送到GitHub (`gh-pages`分支)
- ⏳ **等待你在GitHub网站配置Pages设置**

---

## 🎯 **配置链接（直达）**

👉 **立即配置**: https://github.com/xuyan14/ai-admin-demo/settings/pages

配置完成后，等待5分钟，然后访问：
👉 **查看效果**: https://xuyan14.github.io/ai-admin-demo/creative-tools-prototype.html?v=20251011183200

---

**更新时间**: 2025-10-11 18:32
**状态**: ⏳ 等待GitHub Pages配置

