#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
前端项目后端API服务
提供图片处理接口，调用NanoBanana API
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import base64
from typing import Optional, Dict, Any, List
import os
import sys
from datetime import datetime
import uuid

# 添加nanobanana调用项目路径以导入COS上传器
nanobanana_path = '/Users/lucien.xu/Desktop/代码汇总/nanobanana调用'
if nanobanana_path not in sys.path:
    sys.path.insert(0, nanobanana_path)

try:
    from public_cos_uploader import PublicCOSUploader
    COS_AVAILABLE = True
    print("✅ 腾讯云COS上传器已导入")
except ImportError as e:
    COS_AVAILABLE = False
    print(f"⚠️  腾讯云COS上传器导入失败: {e}")
    print("   将使用本地文件存储")

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 创建uploads目录
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 初始化COS上传器
if COS_AVAILABLE:
    cos_uploader = PublicCOSUploader(
        bucket="12131231-1302391623",
        region="ap-beijing"
    )
    print("✅ 腾讯云COS上传器已初始化")
else:
    cos_uploader = None

# NanoBanana API配置
# 从nanobanana调用项目获取的API密钥
API_KEY = os.environ.get('NANOBANANA_API_KEY', 'sk-95b38b5856e147b9b68e4600f5c584c3')
API_BASE_URL = "https://grsai.dakka.com.cn"


class NanoBananaAPI:
    """NanoBanana绘画API客户端"""
    
    def __init__(self, api_key: str, base_url: str = API_BASE_URL):
        if api_key == "your-api-key-here":
            raise ValueError("请设置正确的API密钥！")
        
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    
    def draw_image(
        self,
        prompt: str,
        image_urls: Optional[List[str]] = None,
        model: str = "nano-banana-fast",
        aspect_ratio: str = "auto",
        webhook: Optional[str] = None,
        shut_progress: bool = False
    ) -> Dict[str, Any]:
        """调用NanoBanana绘画接口"""
        url = f"{self.base_url}/v1/draw/nano-banana"
        
        # 构建请求参数
        payload = {
            "model": model,
            "prompt": prompt,
            "aspectRatio": aspect_ratio,
            "shutProgress": shut_progress
        }
        
        # 添加可选参数
        if image_urls:
            payload["urls"] = image_urls
        
        if webhook:
            payload["webHook"] = webhook
        
        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            
            # 处理响应
            if response.headers.get('content-type', '').startswith('text/event-stream'):
                return self._handle_stream_response(response)
            else:
                result = response.json()
                # 检查积分不足错误
                if result.get('code') == -1 and 'insufficient credits' in result.get('msg', ''):
                    return {"error": "API积分不足，请充值后重试", "status": "failed"}
                return result
                
        except requests.exceptions.RequestException as e:
            return {"error": f"请求失败: {str(e)}", "status": "failed"}
    
    def _handle_stream_response(self, response) -> Dict[str, Any]:
        """处理流式响应"""
        try:
            content = response.text
            lines = content.strip().split('\n')
            
            result = {}
            for line in lines:
                if line.startswith('data: '):
                    try:
                        data = json.loads(line[6:])
                        if data.get('status') in ['succeeded', 'failed', 'running']:
                            result = data
                    except json.JSONDecodeError:
                        continue
            
            return result if result else {"status": "failed", "error": "无效响应"}
            
        except Exception as e:
            return {"status": "failed", "error": f"解析失败: {str(e)}"}


# 初始化API客户端
try:
    nanobanana_client = NanoBananaAPI(API_KEY)
except ValueError as e:
    print(f"警告: {e}")
    nanobanana_client = None


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        "status": "healthy",
        "service": "jarvis-admin-api",
        "nanobanana_configured": nanobanana_client is not None
    })


@app.route('/api/expand-image', methods=['POST'])
def expand_image():
    """
    扩图接口
    接收：图片URL、提示词、模型类型等
    返回：生成的图片URL
    """
    try:
        data = request.json
        
        # 获取参数
        image_url = data.get('image_url')
        prompt = data.get('prompt', '扩展图片背景，保持主体清晰')
        model_type = data.get('model', 'basic')  # basic 或 nb
        expand_type = data.get('expand_type', 'scene')  # scene 或 color
        expand_method = data.get('expand_method', 'direct')  # direct 或 cutFirst
        expand_direction = data.get('expand_direction', '向下')
        expand_ratio = data.get('expand_ratio', '9:16')
        
        # 验证必需参数
        if not image_url:
            return jsonify({
                "success": False,
                "error": "缺少图片URL参数"
            }), 400
        
        # 检查API客户端
        if not nanobanana_client:
            return jsonify({
                "success": False,
                "error": "NanoBanana API未配置，请设置API密钥"
            }), 500
        
        # 构建完整的提示词
        # 1. 扩图方式（direct/cutFirst）不影响prompt，只影响预处理
        # 2. 扩图尺寸和方向必须包含在prompt中
        # 3. 扩图类型决定预置prompt（如果用户没有自定义）
        
        user_custom_prompt = prompt if prompt and prompt != '扩展图片背景，保持主体清晰' else ''
        
        # ✅ 使用NanoBanana API的aspectRatio参数控制尺寸，Prompt中不再强调尺寸
        if user_custom_prompt:
            # 用户有自定义prompt
            full_prompt = f"扩展图片画面内容，{expand_direction}扩图，扩图要求：{user_custom_prompt}"
        else:
            # 用户未自定义prompt，使用预置prompt
            if expand_type == 'scene':
                # 场景扩图
                full_prompt = f"根据图片当前内容场景，扩展图片画面内容，{expand_direction}扩图，保持原始图片内容不变，扩图生成的内容与原图要协调"
            else:
                # 颜色扩图
                full_prompt = f"根据图片主色调，扩展图片画面内容，{expand_direction}扩图，扩图后的颜色与原图要一致，保持原始图片内容不变，扩图生成的内容与原图要协调"
        
        # 选择模型（使用fast版本以提高速度）
        model = "nano-banana-fast"
        
        print(f"📸 扩图请求:")
        print(f"  - 图片: {image_url}")
        print(f"  - 扩图类型: {expand_type} ({'场景扩图' if expand_type == 'scene' else '颜色扩图'})")
        print(f"  - 扩图方式: {expand_method} ({'直接扩图' if expand_method == 'direct' else '先切后扩'})")
        print(f"  - 扩图方向: {expand_direction}")
        print(f"  - 扩图比例: {expand_ratio}")
        print(f"  - aspectRatio参数: {expand_ratio} ⭐")
        print(f"  - 用户自定义prompt: {user_custom_prompt if user_custom_prompt else '无'}")
        print(f"  - 最终提示词: {full_prompt}")
        print(f"  - 模型: {model}")
        
        # 调用NanoBanana API（使用aspectRatio参数）
        result = nanobanana_client.draw_image(
            prompt=full_prompt,
            image_urls=[image_url],
            model=model,
            aspect_ratio=expand_ratio,  # ⭐ 使用aspectRatio参数控制尺寸
            shut_progress=False
        )
        
        print(f"📊 API原始响应: {json.dumps(result, ensure_ascii=False, indent=2)}")
        
        # 处理响应 - 兼容多种响应格式
        status = result.get('status', 'unknown')
        
        # 提取输出URL（兼容多种可能的字段名）
        output_url = None
        
        # 优先从results数组中提取（NanoBanana API的标准格式）
        if 'results' in result and result['results'] and len(result['results']) > 0:
            output_url = result['results'][0].get('url')
        # 尝试从不同位置提取URL
        elif 'imageUrl' in result:
            output_url = result.get('imageUrl')
        elif 'data' in result:
            data = result['data']
            output_url = (data.get('imageUrl') or
                         data.get('output_url') or 
                         data.get('url') or 
                         data.get('image_url') or
                         data.get('result_url'))
        elif 'url' in result:
            output_url = result.get('url')
        
        # 提取任务ID
        task_id = None
        if 'id' in result:
            task_id = result.get('id')
        elif 'data' in result:
            task_id = result['data'].get('id') or result['data'].get('task_id')
        elif 'taskId' in result:
            task_id = result.get('taskId')
        
        print(f"  ✅ 提取的output_url: {output_url}")
        print(f"  ✅ 提取的task_id: {task_id}")
        print(f"  ✅ 提取的status: {status}")
        
        # 处理不同的状态
        if status == 'succeeded':
            if output_url:
                return jsonify({
                    "success": True,
                    "status": "succeeded",
                    "data": {
                        "output_url": output_url,
                        "task_id": task_id,
                        "prompt": full_prompt
                    }
                })
            else:
                # API返回成功但没有图片URL，可能需要轮询
                if task_id:
                    return jsonify({
                        "success": True,
                        "status": "processing",
                        "data": {
                            "task_id": task_id,
                            "message": "图片正在生成中，请稍候..."
                        }
                    })
                else:
                    return jsonify({
                        "success": False,
                        "error": "API返回成功但未获取到图片URL和任务ID",
                        "debug_info": result
                    }), 500
        elif status == 'failed':
            return jsonify({
                "success": False,
                "error": result.get('error', '生成失败'),
                "status": "failed"
            })
        elif status == 'running' or status == 'processing':
            # 正在处理，返回任务ID
            return jsonify({
                "success": True,
                "status": "processing",
                "data": {
                    "task_id": task_id,
                    "message": "图片正在生成中，请稍候..."
                }
            })
        else:
            # 未知状态
            return jsonify({
                "success": False,
                "error": f"未知的API响应状态: {status}",
                "debug_info": result
            }), 500
    
    except Exception as e:
        print(f"❌ 扩图错误: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"服务器错误: {str(e)}"
        }), 500


@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """
    图片上传接口
    接收：图片文件
    返回：图片URL（存储到云端）
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "error": "没有上传图片"
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "文件名为空"
            }), 400
        
        # 生成唯一文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        ext = os.path.splitext(file.filename)[1]
        filename = f"{timestamp}_{unique_id}{ext}"
        local_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # 保存到本地
        file.save(local_path)
        print(f"📁 图片已保存到本地: {local_path}")
        print(f"📊 COS上传器状态: {'可用' if cos_uploader else '不可用'}")
        
        try:
            # 上传到腾讯云COS（公有桶）
            if cos_uploader:
                print(f"☁️  开始上传到腾讯云COS...")
                print(f"   桶名: 12131231-1302391623")
                print(f"   地域: ap-beijing")
                print(f"   文件夹: nanobanana/web")
                
                upload_result = cos_uploader.upload_image(
                    local_file_path=local_path,
                    folder="nanobanana/web"
                )
                
                print(f"📊 COS上传结果: {upload_result}")
                
                if upload_result["success"]:
                    cos_url = upload_result["url"]
                    print(f"✅ COS上传成功: {cos_url}")
                    
                    return jsonify({
                        "success": True,
                        "data": {
                            "url": cos_url,
                            "filename": filename,
                            "original_name": file.filename,
                            "upload_type": "cos"
                        }
                    })
                else:
                    print(f"⚠️  COS上传失败: {upload_result.get('error')}")
                    # 降级使用本地URL
            
            # 降级：使用本地URL（如果COS上传失败）
            local_url = f"http://localhost:5000/uploads/{filename}"
            print(f"⚠️  使用本地URL: {local_url}")
            print(f"   注意：本地URL可能无法被NanoBanana API访问")
            
            return jsonify({
                "success": True,
                "data": {
                    "url": local_url,
                    "filename": filename,
                    "original_name": file.filename,
                    "upload_type": "local",
                    "warning": "使用本地URL，NanoBanana API可能无法访问"
                }
            })
        
        finally:
            # 如果使用了COS，清理本地临时文件
            if cos_uploader and os.path.exists(local_path):
                os.remove(local_path)
                print(f"🗑️  已清理本地临时文件")
    
    except Exception as e:
        print(f"❌ 上传错误: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"上传失败: {str(e)}"
        }), 500


@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    """提供上传的图片文件"""
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/api/change-background', methods=['POST'])
def change_background():
    """
    换背景接口
    接收：图片URL、提示词、模型类型等
    返回：生成的图片URL
    """
    try:
        data = request.json
        
        # 获取参数
        image_url = data.get('image_url')
        image_urls = data.get('image_urls', [image_url] if image_url else [])  # 支持多图片
        prompt = data.get('prompt', '请帮我替换图片背景')
        model = data.get('model', 'nb')
        bg_ratio = data.get('bg_ratio')
        bg_method = data.get('bg_method', 'generate')  # 背景生成或背景上传
        
        print(f"\n{'='*50}")
        print(f"🎨 换背景请求")
        print(f"{'='*50}")
        print(f"📷 图片URL: {image_url}")
        print(f"📷 图片列表: {image_urls}")
        print(f"📝 Prompt: {prompt}")
        print(f"🤖 模型: {model}")
        print(f"📐 背景比例: {bg_ratio}")
        print(f"🎯 背景方法: {bg_method}")
        
        if not image_urls or len(image_urls) == 0:
            return jsonify({
                "success": False,
                "error": "缺少图片URL"
            }), 400
        
        if not nanobanana_client:
            return jsonify({
                "success": False,
                "error": "NanoBanana API客户端未初始化"
            }), 500
        
        # 调用NanoBanana API
        print(f"\n🚀 开始调用NanoBanana API进行换背景...")
        print(f"   传递图片数量: {len(image_urls)}张")
        print(f"   aspectRatio: {bg_ratio if bg_ratio else 'auto'}")
        result = nanobanana_client.draw_image(
            prompt=prompt,
            image_urls=image_urls,  # 使用完整的图片列表
            model="nano-banana-fast",
            aspect_ratio=bg_ratio if bg_ratio else "auto"  # ⭐ 使用aspectRatio参数
        )
        
        print(f"📥 API原始返回:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # 解析返回结果
        status = result.get('status', 'unknown')
        output_url = None
        
        # 尝试从不同位置提取URL
        if 'results' in result and result['results'] is not None and len(result['results']) > 0:
            output_url = result['results'][0].get('url')
        elif 'imageUrl' in result:
            output_url = result.get('imageUrl')
        elif 'data' in result:
            data_obj = result['data']
            output_url = (data_obj.get('imageUrl') or
                         data_obj.get('output_url') or 
                         data_obj.get('url') or 
                         data_obj.get('image_url') or
                         data_obj.get('result_url'))
        elif 'url' in result:
            output_url = result.get('url')
        
        # 提取任务ID
        task_id = None
        if 'id' in result:
            task_id = result.get('id')
        elif 'data' in result:
            task_id = result['data'].get('id') or result['data'].get('task_id')
        elif 'taskId' in result:
            task_id = result.get('taskId')
        
        print(f"  ✅ 提取的output_url: {output_url}")
        print(f"  ✅ 提取的task_id: {task_id}")
        print(f"  ✅ 提取的status: {status}")
        
        # 处理不同的状态
        if status == 'succeeded':
            if output_url:
                return jsonify({
                    "success": True,
                    "status": "succeeded",
                    "data": {
                        "output_url": output_url,
                        "task_id": task_id,
                        "prompt": prompt
                    }
                })
            else:
                # API返回成功但没有图片URL，可能需要轮询
                if task_id:
                    return jsonify({
                        "success": True,
                        "status": "processing",
                        "data": {
                            "task_id": task_id,
                            "message": "图片正在生成中，请稍候..."
                        }
                    })
                else:
                    return jsonify({
                        "success": False,
                        "error": "API返回成功但未获取到图片URL和任务ID",
                        "debug_info": result
                    }), 500
        elif status == 'failed':
            return jsonify({
                "success": False,
                "error": result.get('error', '生成失败'),
                "status": "failed"
            })
        elif status == 'running' or status == 'processing':
            return jsonify({
                "success": True,
                "status": "processing",
                "data": {
                    "task_id": task_id,
                    "message": "图片正在生成中，请稍候..."
                }
            })
        else:
            return jsonify({
                "success": False,
                "error": f"未知的API响应状态: {status}",
                "debug_info": result
            }), 500
    
    except Exception as e:
        print(f"❌ 换背景错误: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"服务器错误: {str(e)}"
        }), 500


@app.route('/api/repair-image', methods=['POST'])
def repair_image():
    """
    图像修复接口
    接收：图片URL、修复要求（Prompt）
    返回：修复后的图片URL
    """
    try:
        data = request.json
        
        # 获取参数
        image_url = data.get('image_url')
        prompt = data.get('prompt', '修复图片中的瑕疵和错误')
        model = data.get('model', 'nb')
        
        print(f"\n{'='*50}")
        print(f"🔧 图像修复请求")
        print(f"{'='*50}")
        print(f"📷 图片URL: {image_url}")
        print(f"📝 修复要求: {prompt}")
        print(f"🤖 模型: {model}")
        
        if not image_url:
            return jsonify({
                "success": False,
                "error": "缺少图片URL"
            }), 400
        
        if not nanobanana_client:
            return jsonify({
                "success": False,
                "error": "NanoBanana API客户端未初始化"
            }), 500
        
        # 调用NanoBanana API
        print(f"\n🚀 开始调用NanoBanana API进行图像修复...")
        print(f"   aspectRatio: auto（保持原图比例）")
        result = nanobanana_client.draw_image(
            prompt=prompt,
            image_urls=[image_url],
            model="nano-banana-fast",
            aspect_ratio="auto"  # 修复时保持原图比例
        )
        
        print(f"📥 API原始返回:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # 解析返回结果
        status = result.get('status', 'unknown')
        output_url = None
        
        # 尝试从不同位置提取URL
        if 'results' in result and result['results'] is not None and len(result['results']) > 0:
            output_url = result['results'][0].get('url')
        elif 'imageUrl' in result:
            output_url = result.get('imageUrl')
        elif 'data' in result:
            data_obj = result['data']
            output_url = (data_obj.get('imageUrl') or
                         data_obj.get('output_url') or 
                         data_obj.get('url') or 
                         data_obj.get('image_url') or
                         data_obj.get('result_url'))
        elif 'url' in result:
            output_url = result.get('url')
        
        # 提取任务ID
        task_id = None
        if 'id' in result:
            task_id = result.get('id')
        elif 'data' in result:
            task_id = result['data'].get('id') or result['data'].get('task_id')
        elif 'taskId' in result:
            task_id = result.get('taskId')
        
        print(f"  ✅ 提取的output_url: {output_url}")
        print(f"  ✅ 提取的task_id: {task_id}")
        print(f"  ✅ 提取的status: {status}")
        
        # 处理不同的状态
        if status == 'succeeded':
            if output_url:
                return jsonify({
                    "success": True,
                    "status": "succeeded",
                    "data": {
                        "output_url": output_url,
                        "task_id": task_id,
                        "prompt": prompt
                    }
                })
            else:
                if task_id:
                    return jsonify({
                        "success": True,
                        "status": "processing",
                        "data": {
                            "task_id": task_id,
                            "message": "图片正在修复中，请稍候..."
                        }
                    })
                else:
                    return jsonify({
                        "success": False,
                        "error": "API返回成功但未获取到图片URL和任务ID",
                        "debug_info": result
                    }), 500
        elif status == 'failed':
            return jsonify({
                "success": False,
                "error": result.get('error', '修复失败'),
                "status": "failed"
            })
        elif status == 'running' or status == 'processing':
            return jsonify({
                "success": True,
                "status": "processing",
                "data": {
                    "task_id": task_id,
                    "message": "图片正在修复中，请稍候..."
                }
            })
        else:
            return jsonify({
                "success": False,
                "error": f"未知的API响应状态: {status}",
                "debug_info": result
            }), 500
    
    except Exception as e:
        print(f"❌ 图像修复错误: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"服务器错误: {str(e)}"
        }), 500


@app.route('/api/check-task/<task_id>', methods=['GET'])
def check_task_status(task_id):
    """
    查询任务状态
    用于轮询异步任务的结果
    """
    # TODO: 实现任务状态查询
    # 这需要根据NanoBanana API的具体文档来实现
    return jsonify({
        "success": True,
        "status": "processing",
        "message": "任务查询功能待实现"
    })


if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Jarvis Admin API Server")
    print("=" * 50)
    print(f"📡 API服务地址: http://localhost:5000")
    print(f"🔑 NanoBanana API配置: {'✅ 已配置' if nanobanana_client else '❌ 未配置'}")
    print("=" * 50)
    print("\n可用接口:")
    print("  GET  /api/health             - 健康检查")
    print("  POST /api/expand-image       - 扩图接口")
    print("  POST /api/change-background  - 换背景接口")
    print("  POST /api/repair-image       - 图像修复接口")
    print("  POST /api/upload-image       - 图片上传")
    print("  GET  /api/check-task/:id     - 查询任务状态")
    print("\n" + "=" * 50)
    print("⚠️  注意: 请设置环境变量 NANOBANANA_API_KEY 或修改代码中的API密钥")
    print("=" * 50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
