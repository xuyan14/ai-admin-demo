# jarvis-admin · AI内容管理后台 Demo

统一原型仓库，包含平面创意与 AIGC 视频两大模块。

## 模块

| 模块 | 入口 | 说明 |
|------|------|------|
| **平面创意工具** | `creative-tools-prototype.html` | 万能指令（指令生成 / 仿写裂变）、爆款创意通晒 |
| **AIGC 视频工具** | `videotool/index.html` | 视频创作（人工/批量）、视频库、原料库 |
| **本地 API** | `api_server.py` | 万能指令图片上传与生成（可选） |

## 项目结构

```
jarvis-admin-master/
├── index.html                      # Demo 首页（双模块入口）
├── creative-tools-prototype.html   # 平面创意原型
├── videotool/                      # AIGC 视频工具（自 videotool 项目合并）
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── 需求文档.md
├── PRD-万能指令.md
├── PRD-仿写裂变.md
├── PRD-裂变思路.md
└── api_server.py
```

## 本地预览

```bash
python3 -m http.server 8877
```

- 首页：http://localhost:8877/
- 平面创意：http://localhost:8877/creative-tools-prototype.html
- 视频工具：http://localhost:8877/videotool/index.html

```bash
# 万能指令真实生成（可选）
python3 api_server.py
```

## 模块互通

- 平面创意侧边栏 **AI视频工具** → 跳转 `videotool/`
- 视频工具侧边栏 **万能指令 / 爆款创意通晒** → 跳回 `creative-tools-prototype.html`

## 在线 Demo

https://xuyan14.github.io/ai-admin-demo/

## 部署

推送到 `gh-pages` 分支后，GitHub Actions 自动发布 Pages。
