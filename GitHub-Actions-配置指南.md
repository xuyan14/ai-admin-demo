# GitHub Actions 配置指南

## ⚠️ 如果Actions页面没有workflow运行

说明GitHub Pages的部署方式需要更改。请按照以下步骤操作：

---

## 🔧 **配置步骤**

### **第1步: 访问Pages设置**
```
https://github.com/xuyan14/ai-admin-demo/settings/pages
```

### **第2步: 修改部署方式**

在 "Build and deployment" 部分：

#### **将Source改为GitHub Actions**

之前你可能选择的是：
```
Source: Deploy from a branch ▼
Branch: gh-pages ▼
```

**请改为：**
```
Source: GitHub Actions ▼
```

这样会使用我们创建的 `.github/workflows/deploy.yml` 文件进行部署。

---

### **第3步: 配置Actions权限**

1. 访问 Actions 设置：
   ```
   https://github.com/xuyan14/ai-admin-demo/settings/actions
   ```

2. 找到 **"Workflow permissions"** 部分

3. 选择：
   ```
   ✓ Read and write permissions
   ```

4. 勾选：
   ```
   ✓ Allow GitHub Actions to create and approve pull requests
   ```

5. 点击 **Save** 按钮

---

### **第4步: 手动触发workflow**

1. 访问 Actions 页面：
   ```
   https://github.com/xuyan14/ai-admin-demo/actions
   ```

2. 在左侧找到 "Deploy to GitHub Pages" workflow

3. 点击右侧的 **"Run workflow"** 按钮

4. 选择 `gh-pages` 分支

5. 点击绿色的 **"Run workflow"** 按钮

---

## 📊 **验证部署**

workflow运行后：
1. 等待 2-3 分钟
2. 访问：https://xuyan14.github.io/ai-admin-demo/
3. 应该看到新的欢迎页面
4. 3秒后自动跳转到创意工具页面

---

## 🎯 **完整配置截图说明**

### **Pages设置应该是：**
```
GitHub Pages
─────────────────────────────────────
Build and deployment
  Source: GitHub Actions ▼   ← 选择这个！
  
  Configure: 
    ✓ Deploy to GitHub Pages
─────────────────────────────────────
```

### **Actions权限应该是：**
```
Workflow permissions
  ○ Read repository contents and packages permissions
  ● Read and write permissions    ← 选择这个！
  
  ✓ Allow GitHub Actions to create and approve pull requests
```

---

## 💡 **快速检查清单**

- [ ] Pages Source设置为 "GitHub Actions"
- [ ] Actions权限设置为 "Read and write permissions"  
- [ ] 手动触发了 "Deploy to GitHub Pages" workflow
- [ ] Workflow运行完成（绿色✅）
- [ ] 访问页面看到新版本

---

## 🆘 **如果仍然有问题**

请告诉我你看到的具体情况：
1. Pages设置中Source是什么？
2. Actions页面是否有workflow列表？
3. 是否有权限错误提示？

---

**现在请按照上述步骤配置，然后手动触发workflow！** 🚀



