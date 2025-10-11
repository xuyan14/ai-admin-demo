#!/bin/bash
# 启动脚本 - 确保打开最新版本的网页

echo "🚀 启动AI创意工具预览"
echo "================================"

# HTML文件路径
HTML_FILE="/Users/lucien.xu/Desktop/代码汇总/jarvis-admin-master/creative-tools-prototype.html"

# 检查文件是否存在
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ 错误: 找不到HTML文件"
    exit 1
fi

# 显示文件最后修改时间
echo "📄 HTML文件: creative-tools-prototype.html"
echo "📅 最后修改: $(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$HTML_FILE")"
echo ""

# 清除Safari缓存（如果使用Safari）
echo "🧹 清除Safari缓存..."
rm -rf ~/Library/Caches/com.apple.Safari/* 2>/dev/null
rm -rf ~/Library/Safari/LocalStorage/* 2>/dev/null

# 清除Chrome缓存（如果使用Chrome）
echo "🧹 清除Chrome缓存..."
rm -rf ~/Library/Caches/Google/Chrome/* 2>/dev/null

echo ""
echo "✅ 浏览器缓存已清除"
echo ""

# 添加时间戳参数，确保浏览器不使用缓存
TIMESTAMP=$(date +%s)
URL="file://$HTML_FILE?v=$TIMESTAMP"

echo "🌐 打开页面: $URL"
echo ""

# 使用默认浏览器打开，带时间戳参数
open "$URL"

echo "================================"
echo "✅ 页面已打开！"
echo ""
echo "💡 提示:"
echo "   - 如果仍然看到旧版本，请按 Cmd+Shift+R 强制刷新"
echo "   - Chrome用户: Cmd+Shift+Delete 打开清除缓存窗口"
echo "   - Safari用户: Cmd+Option+E 清空缓存"
echo ""

