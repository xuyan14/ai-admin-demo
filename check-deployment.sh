#!/bin/bash

echo "🔍 检查GitHub Pages部署状态"
echo "================================"
echo ""

URL="https://xuyan14.github.io/ai-admin-demo/creative-tools-prototype.html"
MAX_ATTEMPTS=10
WAIT_TIME=30

for i in $(seq 1 $MAX_ATTEMPTS); do
    echo "📡 第 $i 次检查 (等待${WAIT_TIME}秒)..."
    sleep $WAIT_TIME
    
    # 检查是否包含"万能指令"
    COUNT=$(curl -s "$URL" | grep -o "万能指令" | wc -l | tr -d ' ')
    
    if [ "$COUNT" -gt 0 ]; then
        echo ""
        echo "✅ 部署成功！检测到 $COUNT 处'万能指令'文本"
        echo "================================"
        echo "🌐 访问链接："
        echo "   $URL"
        echo ""
        echo "💡 提示：访问时请按 Cmd+Shift+R 强制刷新"
        echo "================================"
        exit 0
    else
        echo "   ⏳ 还未更新，继续等待..."
    fi
done

echo ""
echo "⚠️  已等待 $(($MAX_ATTEMPTS * $WAIT_TIME)) 秒，部署可能需要更多时间"
echo "================================"
echo "📊 请访问 Actions 查看部署状态："
echo "   https://github.com/xuyan14/ai-admin-demo/actions"
echo ""
echo "🌐 或直接访问（使用时间戳绕过缓存）："
echo "   ${URL}?v=$(date +%s)"
echo "================================"

