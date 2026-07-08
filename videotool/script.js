// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeDropdowns();
    initializeUploadModal();
    initializeMethodTabs();
    initializeScriptMethod();
    initializeCustomInputs();
    initializeTaskManagement();
    initializeScriptList();
    initializeAIModel();
    initializeEditorPreviewOverlays();
    initializeAutomationMode();
    initializeDeepLinkView();
});

function initializeDeepLinkView() {
    if (new URLSearchParams(window.location.search).get('embed') === '1') {
        document.body.classList.add('vt-embed');
    }
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'library') {
        setTimeout(() => showVideoLibrary(), 0);
    } else if (view === 'material') {
        setTimeout(() => showMaterialLibrary(), 0);
    }
}

// 当前步骤
let currentStep = 1;
const totalSteps = 4;
window.currentProductionMode = window.currentProductionMode || 'manual';
const mockTaskCoverUrl = 'https://h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcvis/102824/2026/0414/158/35a89d90-188a-4205-8ddf-20a8cee3c252.jpg';
const libraryCoverUrl = 'https://a.vpimg3.com/upload/otd2/creatives/20251216/1765866477562871_7806.jpg';
const editorSegmentPreviewUrl = 'https://h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcvis/102824/2026/0211/47/b8f189d2-8131-43ef-9873-ffc738bb6afd_750x8000_85.jpg!85.webp';

/** 编辑页时间轴默认片段（含镜头名称，与分镜镜头描述一致） */
const DEFAULT_EDITOR_TIMELINE_SEGMENTS = [
    { id: 1, thumbnail: editorSegmentPreviewUrl, lensName: '开场介绍' },
    { id: 2, thumbnail: editorSegmentPreviewUrl, lensName: '面料质感展示' },
    { id: 3, thumbnail: editorSegmentPreviewUrl, lensName: '荷叶领口设计' },
    { id: 4, thumbnail: editorSegmentPreviewUrl, lensName: '搭配场景展示' }
];
const demoScriptText = '跑步想要轻松，这双运动鞋千万要码住。唯品会大牌好货每天3折疯抢。这双安踏跑步鞋3.5折起，新用户可领至高25元券。双层中底能消化冲击，落地平稳保护膝盖，网眼排气满足慢跑。点击链接赶紧下单吧';
const demoSellingPointText = '双层中底设计消化冲击，落地平稳从而保护膝盖，网眼排气孔设计满足日常慢跑的透气需求';

// BGM 库
var bgmLibraryData = [
    { id: 1, audioName: '我要验牌.mp3', songName: 'nonAbsolute_male_dynamic_我要验牌', creator: '13800138000', category: '运动户外', size: '704KB', createdAt: '2026-05-18 10:50' },
    { id: 2, audioName: 'Peach.mp3', songName: '', creator: '13800138001', category: '服装鞋帽', size: '737KB', createdAt: '2026-05-18 10:48' },
    { id: 3, audioName: '真爱假说DJ.mp3', songName: '真爱假说', creator: '13800138002', category: '服装鞋帽', size: '812KB', createdAt: '2026-05-17 16:22' },
    { id: 4, audioName: 'Online Message.mp3', songName: 'Online Message', creator: '13800138003', category: '家居生活', size: '690KB', createdAt: '2026-05-17 14:10' },
    { id: 5, audioName: '葡萄熟了_新疆民谣女声.娃洗干净.mp3', songName: '葡萄熟了', creator: '13800138004', category: '家居生活', size: '1.2MB', createdAt: '2026-05-16 11:35' },
    { id: 6, audioName: 'Hey, Mickey!.mp3', songName: 'Hey Mickey', creator: '13800138005', category: '运动户外', size: '756KB', createdAt: '2026-05-16 09:18' },
    { id: 7, audioName: 'Send It.mp3', songName: 'Send It', creator: '13800138006', category: '运动户外', size: '668KB', createdAt: '2026-05-15 18:42' },
    { id: 8, audioName: '爱我别走.mp3', songName: '爱我别走', creator: '13800138007', category: '美妆护肤', size: '801KB', createdAt: '2026-05-15 15:06' },
    { id: 9, audioName: '动感节奏01.mp3', songName: '动感节奏01', creator: '13800138008', category: '运动户外', size: '720KB', createdAt: '2026-05-14 12:30' },
    { id: 10, audioName: '温柔女声02.mp3', songName: '温柔女声02', creator: '13800138009', category: '美妆护肤', size: '695KB', createdAt: '2026-05-14 10:15' },
    { id: 11, audioName: '大促氛围BGM.mp3', songName: '3折疯抢氛围', creator: '13800138010', category: '服装鞋帽', size: '880KB', createdAt: '2026-05-13 17:20' },
    { id: 12, audioName: '跑步轻快版.mp3', songName: '跑步轻快版', creator: '13800138011', category: '运动户外', size: '745KB', createdAt: '2026-05-13 09:45' }
];
var selectedBgmId = null;
var currentBgmPage = 1;
var bgmPageSize = 8;
var bgmFilterState = { audioName: '', songName: '', creator: '', category: '', startDate: '', endDate: '' };
var playingBgmId = null;

// 视频替换相关变量
var currentReplaceSegmentIndex = -1;
var newVideoFile = null;
var selectedMaterial = null;
var currentMaterialPage = 1;
var materialPageSize = 10;
var materialSearchKeyword = '';

// 模拟素材库数据
var materialLibraryData = [
    { id: 1, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '3MB', thumbnail: libraryCoverUrl },
    { id: 2, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '5MB', thumbnail: libraryCoverUrl },
    { id: 3, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '4MB', thumbnail: libraryCoverUrl },
    { id: 4, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '3MB', thumbnail: libraryCoverUrl },
    { id: 5, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '5MB', thumbnail: libraryCoverUrl },
    { id: 6, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '4MB', thumbnail: libraryCoverUrl },
    { id: 7, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '3MB', thumbnail: libraryCoverUrl },
    { id: 8, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '5MB', thumbnail: libraryCoverUrl },
    { id: 9, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '4MB', thumbnail: libraryCoverUrl },
    { id: 10, name: '商品名称', title: '【100%纯棉】儿童碎花上衣', duration: '4秒', size: '3MB', thumbnail: libraryCoverUrl }
];

// 生成更多模拟数据
for (let i = 11; i <= 45; i++) {
    materialLibraryData.push({
        id: i,
        name: '商品名称',
        title: '【100%纯棉】儿童碎花上衣',
        duration: '4秒',
        size: Math.floor(Math.random() * 3 + 3) + 'MB',
        thumbnail: libraryCoverUrl
    });
}

// 三级品类数据结构
const categoryData = {
    clothing: {
        name: '服装鞋帽',
        children: {
            women: {
                name: '女装',
                children: {
                    dress: { name: '连衣裙' },
                    tops: { name: '上衣' },
                    pants: { name: '裤装' },
                    skirts: { name: '半身裙' },
                    outerwear: { name: '外套' }
                }
            },
            men: {
                name: '男装',
                children: {
                    shirts: { name: '衬衫' },
                    tshirts: { name: 'T恤' },
                    pants: { name: '裤装' },
                    suits: { name: '西装' },
                    jackets: { name: '夹克' }
                }
            },
            shoes: {
                name: '鞋类',
                children: {
                    sneakers: { name: '运动鞋' },
                    dress: { name: '正装鞋' },
                    casual: { name: '休闲鞋' },
                    boots: { name: '靴子' },
                    sandals: { name: '凉鞋' }
                }
            }
        }
    },
    beauty: {
        name: '美妆护肤',
        children: {
            skincare: {
                name: '护肤',
                children: {
                    cleanser: { name: '洁面' },
                    moisturizer: { name: '面霜' },
                    serum: { name: '精华' },
                    mask: { name: '面膜' },
                    sunscreen: { name: '防晒' }
                }
            },
            makeup: {
                name: '彩妆',
                children: {
                    foundation: { name: '粉底' },
                    lipstick: { name: '口红' },
                    eyeshadow: { name: '眼影' },
                    mascara: { name: '睫毛膏' },
                    blush: { name: '腮红' }
                }
            }
        }
    },
    digital: {
        name: '数码家电',
        children: {
            phones: {
                name: '手机通讯',
                children: {
                    smartphones: { name: '智能手机' },
                    accessories: { name: '手机配件' },
                    cases: { name: '手机壳' },
                    chargers: { name: '充电器' }
                }
            },
            computers: {
                name: '电脑办公',
                children: {
                    laptops: { name: '笔记本' },
                    desktops: { name: '台式机' },
                    tablets: { name: '平板电脑' },
                    accessories: { name: '电脑配件' }
                }
            }
        }
    }
};

// 当前选择的品类状态
let currentCategorySelection = {
    level1: null,
    level2: null,
    level3: null
};

// 初始化导航菜单
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item.has-submenu');
    
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            item.classList.toggle('open');
        });
    });
}

// 初始化标签页切换
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const flatOptions = document.querySelector('.flat-options');
    const videoOptions = document.querySelector('.video-options');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            flatOptions.style.display = 'none';
            videoOptions.style.display = 'none';
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 显示对应的选项
            const category = this.getAttribute('data-category');
            if (category === 'flat') {
                flatOptions.style.display = 'flex';
            } else if (category === 'video') {
                videoOptions.style.display = 'flex';
            }
        });
    });
}

// 初始化下拉菜单
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-btn');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
        
        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            menu.style.display = 'none';
        });
    });
}

// 初始化上传弹窗
function initializeUploadModal() {
    const uploadModal = document.getElementById('uploadModal');
    const uploadProgressModal = document.getElementById('uploadProgressModal');
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            closeUploadModal();
        }
        if (e.target === uploadProgressModal) {
            closeUploadProgressModal();
        }
    });
}

// 初始化方法标签页
function initializeMethodTabs() {
    const methodTabs = document.querySelectorAll('.method-tab');
    
    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            const parentSection = this.closest('.generation-methods');
            
            // 移除同组所有标签的活动状态
            parentSection.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            parentSection.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
            
            // 添加当前标签的活动状态
            this.classList.add('active');
            
            // 显示对应的面板
            const targetPanel = parentSection.querySelector(`#${method}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// 初始化脚本生成方式
function initializeScriptMethod() {
    // 初始化配置标签页切换
    const configTabs = document.querySelectorAll('.config-tab');
    configTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // 记录当前脚本方法
            window.currentScriptMethod = method;
            
            // 移除所有标签的活动状态
            configTabs.forEach(t => t.classList.remove('active'));
            
            // 添加当前标签的活动状态
            this.classList.add('active');
            
            // 切换配置面板
            const configPanels = document.querySelectorAll('.config-panel');
            configPanels.forEach(panel => panel.classList.remove('active'));
            
            const targetPanel = document.getElementById(method + 'Config');
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // 如果是AI裂变面板，初始化品类选择器
                if (method === 'split') {
                    setTimeout(() => {
                        console.log('=== AI裂变面板已激活，开始初始化品类选择器 ===');
                        initCategorySelector();
                    }, 100);
                }
            }
        });
    });
    
    // 初始化AI模型选择
    initializeAIModelSelection();
}

// 初始化AI模型选择
function initializeAIModelSelection() {
    // 设置默认模型为O1
    window.currentAIModel = 'O1';
}

// 切换模型
function toggleModel() {
    const selectedModel = document.querySelector('input[name="aiModel"]:checked');
    if (selectedModel) {
        window.currentAIModel = selectedModel.value;
        console.log('AI模型已切换为:', window.currentAIModel);
    }
}

// 初始化AI模型选择
function initializeAIModel() {
    const modelRadios = document.querySelectorAll('input[name="aiModel"]');
    modelRadios.forEach(radio => {
        radio.addEventListener('change', toggleModel);
    });
    // 设置默认值
    window.currentAIModel = 'deepseekr1';
}

// 初始化自定义输入监听
function initializeCustomInputs() {
    // 不再需要监听，因为不显示已选择结果
}



// 跳转到指定步骤
function showStep(stepNumber) {
    currentStep = stepNumber;
    updateStepDisplay();
    console.log('跳转到步骤:', stepNumber);
}

// 更新步骤显示
function updateStepDisplay() {
    console.log('updateStepDisplay被调用，当前步骤:', currentStep);
    
    // 更新步骤指示器
    const steps = document.querySelectorAll('.step');
    console.log('找到步骤指示器数量:', steps.length);
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
    
    // 更新步骤内容
    const stepContents = document.querySelectorAll('.step-content');
    console.log('找到步骤内容数量:', stepContents.length);
    
    stepContents.forEach((content, index) => {
        const stepNum = index + 1;
        content.classList.remove('active');
        
        if (stepNum === currentStep) {
            content.classList.add('active');
            console.log('激活步骤内容:', stepNum);
            
            // 如果是步骤3（视频混剪），初始化视频编辑功能
            if (stepNum === 3) {
                setTimeout(() => {
                    initializeVideoEditing();
                }, 100);
            }
        }
    });
}

// 验证当前步骤
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateProductIdentification();
        case 2:
            return validateScriptGeneration();
        case 3:
            return validateVideoMixing();
        case 4:
            return true; // 最后一步不需要验证
        default:
            return true;
    }
}

// 验证商品识别
function validateProductIdentification() {
    const productId = document.getElementById('productId');
    const productInfo = document.getElementById('productInfo');
    
    // 检查商品ID是否已输入且商品信息是否已显示
    if (!productId || !productId.value.trim()) {
        showMessage('请输入商品ID或链接', 'warning');
        return false;
    }
    
    // 检查商品信息是否已显示（表示识别成功）
    if (!productInfo || productInfo.style.display === 'none') {
        showMessage('请先识别商品', 'warning');
        return false;
    }
    
    // 检查是否至少选择了一个商品简称或卖点
    const selectedNameTags = document.querySelectorAll('.name-tag.active');
    const selectedPointTags = document.querySelectorAll('.point-tag.active');
    const customName = document.getElementById('customName');
    const customTags = document.querySelectorAll('#existingTags .custom-tag');
    
    if (selectedNameTags.length === 0 && selectedPointTags.length === 0 && 
        (!customName || !customName.value.trim()) && customTags.length === 0) {
        showMessage('请至少选择一个商品简称或卖点', 'warning');
        return false;
    }
    
    // 如果验证通过，显示下一步按钮
    const step1Actions = document.getElementById('step1Actions');
    if (step1Actions) {
        step1Actions.style.display = 'flex';
    }
    
    return true;
}

// 验证卖点提炼
function validateSellingPoints() {
    const selectedItems = document.querySelectorAll('.selected-item');
    if (selectedItems.length === 0) {
        alert('请至少选择一个商品简称和卖点');
        return false;
    }
    return true;
}

// 验证脚本生成
function validateScriptGeneration() {
    const selectedScripts = document.querySelectorAll('.selected-script-item');
    if (selectedScripts.length === 0) {
        alert('请至少选择一个脚本');
        return false;
    }
    return true;
}

// 验证视频混剪
function validateVideoMixing() {
    return true;
}

// 模拟原料库数据查询
function checkMaterialLibrary(productId) {
    // 模拟不同商品ID的原料库状态
    const mockMaterialData = {
        '6921298477540574538': {
            videoCount: 15,
            status: 'available',
            lastUpload: '2024-01-15',
            productId: '6921298477540574538'
        },
        '6921298477540574539': {
            videoCount: 3,
            status: 'limited',
            lastUpload: '2024-01-10',
            productId: '6921298477540574539'
        },
        '6921298477540574540': {
            videoCount: 0,
            status: 'unavailable',
            lastUpload: null,
            productId: '6921298477540574540'
        },
        '6921298477540574541': {
            videoCount: 8,
            status: 'available',
            lastUpload: '2024-01-12',
            productId: '6921298477540574541'
        },
        '6921298477540574542': {
            videoCount: 1,
            status: 'limited',
            lastUpload: '2024-01-08',
            productId: '6921298477540574542'
        }
    };
    
    // 如果没有匹配的商品ID，返回默认数据
    return mockMaterialData[productId] || {
        videoCount: Math.floor(Math.random() * 20),
        status: Math.random() > 0.5 ? 'available' : (Math.random() > 0.5 ? 'limited' : 'unavailable'),
        lastUpload: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        productId: productId
    };
}

// 更新原料库状态提示
function updateMaterialHint(materialData) {
    const materialHint = document.getElementById('materialHint');
    const materialHintText = document.getElementById('materialHintText');
    const materialHintLink = document.getElementById('materialHintLink');
    
    if (materialHint && materialHintText && materialHintLink) {
        if (materialData.videoCount > 0) {
            // 有素材的情况
            materialHintText.textContent = `原料库中有 ${materialData.videoCount} 个相关视频`;
            materialHintText.className = 'hint-text';
            materialHintLink.style.display = 'none';
        } else {
            // 无素材的情况
            materialHintText.textContent = '原料库中暂无相关视频';
            materialHintText.className = 'hint-text no-material';
            materialHintLink.style.display = 'inline';
        }
        
        materialHint.style.display = 'flex';
    }
}

// 识别商品
function identifyProduct() {
    const productId = document.getElementById('productId').value;
    
    if (!productId.trim()) {
        alert('请输入商品ID或链接');
        return;
    }
    
    // 模拟识别商品
    console.log('识别商品:', productId);
    console.log('当前步骤:', currentStep);
    
    // 显示加载状态
    const identifyBtn = document.querySelector('.btn-primary');
    const originalText = identifyBtn.textContent;
    identifyBtn.textContent = '识别中...';
    identifyBtn.disabled = true;
    
    // 模拟API调用延迟
    setTimeout(() => {
        // 显示商品信息
        const productInfo = document.getElementById('productInfo');
        const productName = document.getElementById('productName');
        const productLink = document.getElementById('productLink');
        
        if (productInfo && productName && productLink) {
            // 模拟商品数据
            productName.textContent = '儿童纯棉百搭小清新碎花上衣';
            productLink.textContent = 'https://detail.vip.com/detail-1710616752-6920810386380828624.html';
            
            // 更新商品图片
            const productImage = document.getElementById('productImage');
            if (productImage) {
                productImage.src = 'https://youke1.picui.cn/s1/2025/08/25/68abcee61f235.png';
            }
            
            productInfo.style.display = 'block';
        }
        
        // 显示AI商品信息
        const aiProductInfo = document.getElementById('aiProductInfo');
        if (aiProductInfo) {
            aiProductInfo.style.display = 'block';
        }
        
        // 检查原料库状态
        const materialData = checkMaterialLibrary(productId);
        updateMaterialHint(materialData);
        
        // 显示爆款方案
        const hotSchemes = document.getElementById('hotSchemes');
        if (hotSchemes) {
            hotSchemes.style.display = 'block';
        }
        
        // 显示自定义区域
        const customSection = document.getElementById('customSection');
        if (customSection) {
            customSection.style.display = 'block';
        }
        

        
        // 恢复按钮状态
        identifyBtn.textContent = originalText;
        identifyBtn.disabled = false;
        
        // 不再自动进入下一步，让用户手动选择
        console.log('商品识别完成，等待用户选择卖点');
    }, 2000);
}

// 查看原料库
function viewMaterialLibrary() {
    console.log('跳转到原料库页面...');
    // 切换到原料库页面
    showPage('materialLibrary');
    showMessage('已跳转到原料库页面', 'info');
}

// 上传新素材
function uploadNewMaterial() {
    console.log('打开素材上传弹窗...');
    // 打开上传弹窗
    openUploadModal();
    showMessage('已打开素材上传页面', 'info');
}

// 加载素材
function loadMaterials() {
    console.log('加载商品素材...');
    // 这里可以添加实际的素材加载逻辑
    // 目前使用模拟数据
}

// 打开上传弹窗
function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.add('show');
}

// 关闭上传弹窗
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('show');
}

// 确认上传
function confirmUpload() {
    closeUploadModal();
    openUploadProgressModal();
    
    // 模拟上传过程
    simulateUpload();
}

// 打开上传进度弹窗
function openUploadProgressModal() {
    const modal = document.getElementById('uploadProgressModal');
    modal.classList.add('show');
    
    // 添加模拟的上传项目
    addUploadItems();
}

// 关闭上传进度弹窗
function closeUploadProgressModal() {
    const modal = document.getElementById('uploadProgressModal');
    modal.classList.remove('show');
}

// 添加上传项目
function addUploadItems() {
    const uploadList = document.getElementById('uploadList');
    uploadList.innerHTML = '';
    
    // 模拟上传项目
    const uploadItems = [
        { name: '自运营实拍视频1.mp4', progress: 0 },
        { name: '自运营实拍视频2.mp4', progress: 0 },
        { name: '自运营实拍视频3.mp4', progress: 0 }
    ];
    
    uploadItems.forEach((item, index) => {
        const uploadItem = createUploadItem(item, index);
        uploadList.appendChild(uploadItem);
    });
}

// 创建上传项目元素
function createUploadItem(item, index) {
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';
    uploadItem.innerHTML = `
        <div class="upload-item-thumbnail">
            <img src="https://youke1.picui.cn/s1/2025/08/25/68abcee61f235.png" alt="视频">
        </div>
        <div class="upload-item-info">
            <div class="upload-item-name">${item.name}</div>
            <div class="upload-progress">
                <div class="upload-progress-bar" style="width: ${item.progress}%"></div>
            </div>
        </div>
        <div class="upload-item-actions">
            <button class="upload-item-btn delete" onclick="deleteUploadItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return uploadItem;
}

// 删除上传项目
function deleteUploadItem(index) {
    const uploadItems = document.querySelectorAll('.upload-item');
    if (uploadItems[index]) {
        uploadItems[index].remove();
    }
}

// 切换卖点标签状态
function togglePointTag(tag) {
    tag.classList.toggle('active');
    
    // 检查是否可以显示下一步按钮
    validateProductIdentification();
}

// 切换商品简称标签状态（全局单选）
function toggleNameTag(tag) {
    const isActive = tag.classList.contains('active');
    
    // 如果当前标签已选中，则取消选中
    if (isActive) {
        tag.classList.remove('active');
        return;
    }
    
    // 移除页面中所有商品简称标签的选中状态（全局单选）
    const allNameTags = document.querySelectorAll('.name-tag');
    allNameTags.forEach(t => {
        t.classList.remove('active');
    });
    
    // 选中当前标签
    tag.classList.add('active');
    
    // 检查是否可以显示下一步按钮
    validateProductIdentification();
}

// 刷新AI卖点
function refreshAISellingPoints() {
    const aiSellingPoints = document.querySelector('.ai-selling-points .selling-point-tags');
    if (!aiSellingPoints) return;
    
    // 显示加载状态
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        // 模拟新的卖点
        const newPoints = [
            '舒适透气不闷热',
            '优质纯棉面料',
            '时尚百搭款式',
            '清新淡雅设计',
            '柔软亲肤材质'
        ];
        
        // 随机选择3个卖点
        const selectedPoints = [];
        while (selectedPoints.length < 3) {
            const randomPoint = newPoints[Math.floor(Math.random() * newPoints.length)];
            if (!selectedPoints.includes(randomPoint)) {
                selectedPoints.push(randomPoint);
            }
        }
        
        // 更新卖点标签
        aiSellingPoints.innerHTML = '';
        selectedPoints.forEach(point => {
            const tag = document.createElement('span');
            tag.className = 'point-tag';
            tag.onclick = function() { togglePointTag(this); };
            tag.textContent = point;
            aiSellingPoints.appendChild(tag);
        });
        
        // 恢复按钮状态
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }, 1500);
}

// 添加自定义标签
function addCustomTag(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const value = input.value.trim();
        
        if (value) {
            const existingTags = document.getElementById('existingTags');
            const tag = document.createElement('span');
            tag.className = 'custom-tag';
            tag.innerHTML = `
                ${value}
                <i class="fas fa-times" onclick="removeCustomTag(this)"></i>
            `;
            existingTags.appendChild(tag);
            input.value = '';
            
            // 检查是否可以显示下一步按钮
            validateProductIdentification();
        }
    }
}

// 移除自定义标签
function removeCustomTag(icon) {
    const tag = icon.parentElement;
    tag.remove();
}



// 刷新AI生成结果（保留原有函数以兼容）
function refreshAI() {
    const resultItem = event.target.closest('.result-item');
    const resultText = resultItem.querySelector('.result-text');
    
    // 模拟AI重新生成
    const loadingText = '生成中...';
    resultText.textContent = loadingText;
    
    setTimeout(() => {
        // 模拟新的生成结果
        const newResults = [
            '2024春季新款连衣裙',
            '优雅气质连衣裙',
            '时尚百搭连衣裙',
            '显瘦显高连衣裙',
            '清新淡雅连衣裙'
        ];
        
        const randomResult = newResults[Math.floor(Math.random() * newResults.length)];
        resultText.textContent = randomResult;
    }, 1500);
}

// 移除已选择的项目
function removeItem(button) {
    const item = button.closest('.selected-item');
    item.remove();
}

// 生成脚本
function generateScript() {
    const scriptList = document.getElementById('scriptList');
    if (!scriptList) return;
    
    // 获取视频生成选项
    const enableSubtitles = document.getElementById('scriptEnableSubtitles').checked;
    const enableBGM = document.getElementById('scriptEnableBGM').checked;
    const enableFlowerText = document.getElementById('scriptEnableFlowerText').checked;
    const enableEndBoard = document.getElementById('scriptEnableEndBoard').checked;
    
    // 显示生成中状态
    const generateBtn = document.querySelector('.config-actions .btn-primary');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    // 显示生成选项信息
    const options = [];
    if (enableSubtitles) options.push('字幕');
    if (enableBGM) options.push('BGM');
    if (enableFlowerText) options.push('四要素');
    if (enableEndBoard) options.push('尾板');
    
    let message = '正在生成脚本';
    if (options.length > 0) {
        message += `（包含: ${options.join('、')}）`;
    }
    showMessage(message + '...', 'info');
    
    setTimeout(() => {
        // 获取当前选择的字数范围
        const wordCountRange = getSelectedWordCountRange();
        
        // 根据字数范围生成不同长度的脚本
        const scriptTemplates = getScriptTemplatesByWordCount(wordCountRange);
        
        const randomScript = scriptTemplates[Math.floor(Math.random() * scriptTemplates.length)];
        
        // 获取当前脚本数量，用于编号
        const currentScriptCount = scriptList.children.length + 1;
        
        // 获取当前选择的AI模型
        const currentModel = window.currentAIModel || 'O1';
        
        // 创建新的脚本项目
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        scriptItem.innerHTML = `
            <div class="script-header">
                <h5>脚本${currentScriptCount}<span class="script-model-tag ${currentModel.toLowerCase()}">${currentModel}</span></h5>
            </div>
            <div class="script-content">
                <p>${randomScript}</p>
            </div>
            <div class="script-actions">
                <button class="btn btn-sm btn-outline" onclick="applyScript(this)">直接应用</button>
                <button class="btn btn-sm btn-outline" onclick="editScript(this)">自行修改</button>
                <button class="btn btn-sm btn-outline" onclick="regenerateScript(this)">重新生成</button>
            </div>
        `;
        
        // 添加到脚本列表顶部
        scriptList.insertBefore(scriptItem, scriptList.firstChild);
        
        // 恢复按钮状态
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
        
        let successMessage = `已生成脚本${currentScriptCount}`;
        if (options.length > 0) {
            successMessage += `（已配置${options.join('、')}）`;
        }
        showMessage(successMessage, 'success');
    }, 2000);
}

// 初始化脚本列表（添加3条mock脚本）
function initializeScriptList() {
    const scriptList = document.getElementById('scriptList');
    if (!scriptList) return;
    
    const mockScripts = [
        '大家好，今天给大家推荐一款超美的连衣裙！这款时尚连衣裙2024新款，采用优质面料制作，舒适透气，让你在春夏季节也能美美哒~',
        '姐妹们看过来！这款连衣裙真的是绝了！时尚设计展现优雅气质，多种颜色可选，百搭款式让你轻松驾驭各种场合~',
        '今天给大家分享一款超级好穿的连衣裙，面料柔软亲肤，版型显瘦显高，无论是约会还是上班都能轻松驾驭~'
    ];
    
    mockScripts.forEach((script, index) => {
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        scriptItem.innerHTML = `
            <div class="script-header">
                <h5>脚本${index + 1}</h5>
            </div>
            <div class="script-content">
                <p>${script}</p>
            </div>
            <div class="script-actions">
                <button class="btn btn-sm btn-outline" onclick="applyScript(this)">直接应用</button>
                <button class="btn btn-sm btn-outline" onclick="editScript(this)">自行修改</button>
                <button class="btn btn-sm btn-outline" onclick="regenerateScript(this)">重新生成</button>
            </div>
        `;
        scriptList.appendChild(scriptItem);
    });
}

// 重置脚本配置
function resetScriptConfig() {
    // 重置所有输入框
    const inputs = document.querySelectorAll('.config-input');
    inputs.forEach(input => input.value = '');
    
    // 重置单选按钮到默认状态
    const scenarioRadios = document.querySelectorAll('input[name="scenario"]');
    scenarioRadios[0].checked = true;
    
    const styleRadios = document.querySelectorAll('input[name="style"]');
    styleRadios[0].checked = true;
}

// 应用脚本
function applyScript(button) {
    const scriptItem = button.closest('.script-item');
    const scriptContent = scriptItem.querySelector('.script-content p').textContent;
    
    const isActive = button.classList.contains('btn-primary');
    
    if (isActive) {
        // 如果当前是选中状态，取消选中
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline');
        
        // 从选中的脚本列表中移除
        if (!window.selectedScripts) {
            window.selectedScripts = [];
        }
        
        const index = window.selectedScripts.findIndex(script => script.content === scriptContent);
        if (index > -1) {
            window.selectedScripts.splice(index, 1);
        }
        
        showMessage('已取消选择脚本', 'info');
    } else {
        // 如果当前是未选中状态，选中当前脚本
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        
        // 添加到选中的脚本列表
        if (!window.selectedScripts) {
            window.selectedScripts = [];
        }
        
        window.selectedScripts.push({
            content: scriptContent,
            timestamp: new Date()
        });
        
        showMessage(`已选择脚本，当前已选择 ${window.selectedScripts.length} 个脚本`, 'success');
    }
    
    // 更新开始制作按钮的状态
    updateStartProductionButton();
}

// 更新开始制作按钮状态
function updateStartProductionButton() {
    const startBtn = document.querySelector('.results-header .btn-primary');
    if (startBtn) {
        const selectedCount = window.selectedScripts ? window.selectedScripts.length : 0;
        if (selectedCount > 0) {
            startBtn.textContent = `开始制作 (${selectedCount})`;
            startBtn.disabled = false;
        } else {
            startBtn.textContent = '开始制作';
            startBtn.disabled = false;
        }
    }
}

// 音色选择相关函数
let selectedVoiceTone = '甜美女生'; // 默认音色
let tempSelectedTone = null; // 临时选择的音色

// 打开音色选择弹窗
function openVoiceToneModal() {
    const modal = document.getElementById('voiceToneModal');
    modal.style.display = 'block';
    
    // 重置临时选择
    tempSelectedTone = selectedVoiceTone;
    
    // 更新选中状态
    updateVoiceToneSelection();
}

// 关闭音色选择弹窗
function closeVoiceToneModal() {
    const modal = document.getElementById('voiceToneModal');
    modal.style.display = 'none';
    
    // 重置临时选择
    tempSelectedTone = null;
    
    // 清除所有选中状态
    const allItems = document.querySelectorAll('.voice-tone-item');
    allItems.forEach(item => {
        item.classList.remove('selected');
    });
}

// 选择音色
function selectVoiceTone(toneName, element) {
    // 清除其他选中状态
    const allItems = document.querySelectorAll('.voice-tone-item');
    allItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    // 选中当前项
    element.classList.add('selected');
    
    // 更新临时选择
    tempSelectedTone = toneName;
}

// 更新音色选中状态显示
function updateVoiceToneSelection() {
    const allItems = document.querySelectorAll('.voice-tone-item');
    allItems.forEach(item => {
        const toneName = item.querySelector('h5').textContent;
        if (toneName === tempSelectedTone) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// 播放音色试听
function playToneDemo(toneName, event) {
    event.stopPropagation(); // 阻止事件冒泡
    
    // 这里可以实现音色试听功能
    console.log('播放音色示例:', toneName);
    showMessage(`${toneName} 音色试听中...`, 'info');
    
    // 模拟播放效果
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-volume-up"></i> 播放中...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        showMessage(`${toneName} 音色试听完成`, 'success');
    }, 2000);
}

// 保存音色选择
function saveVoiceTone() {
    if (tempSelectedTone) {
        selectedVoiceTone = tempSelectedTone;
        
        // 更新显示
        const toneDisplay = document.getElementById('selectedTone');
        if (toneDisplay) {
            toneDisplay.textContent = selectedVoiceTone;
        }
        
        showMessage(`音色已设置为：${selectedVoiceTone}`, 'success');
        closeVoiceToneModal();
    } else {
        showMessage('请先选择一个音色', 'warning');
    }
}

// 使用默认音色直接创建任务
function createTasksWithDefaultVoice() {
    const scriptsToProcess = window.selectedScripts && window.selectedScripts.length > 0 
        ? window.selectedScripts 
        : [window.selectedScript];
    
    // 为每个选中的脚本创建任务，使用当前选择的音色
    scriptsToProcess.forEach((script, index) => {
        // 确定脚本来源类型
        const scriptSource = window.currentScriptMethod === 'split' ? '脚本裂变' : 'AI脚本';
        
        // 创建子任务数据来演示不同的状态
        const subTasks = [];
        if (index === 0) {
            // 第一个任务：所有子任务都完成
            subTasks.push(
                { id: 'No.1', status: 'completed' },
                { id: 'No.2', status: 'completed' },
                { id: 'No.3', status: 'completed' }
            );
        } else if (index === 1) {
            // 第二个任务：有进行中的任务
            subTasks.push(
                { id: 'No.1', status: 'completed' },
                { id: 'No.2', status: 'processing' },
                { id: 'No.3', status: 'completed' }
            );
        } else {
            // 第三个任务：有失败的任务
            subTasks.push(
                { id: 'No.1', status: 'completed' },
                { id: 'No.2', status: 'failed' },
                { id: 'No.3', status: 'completed' }
            );
        }
        
        const newTask = {
            id: window.taskManager.nextId++,
            title: `视频制作任务 ${window.taskManager.nextId - 1}`,
            description: `脚本: ${script.content.substring(0, 30)}...`,
            status: 'completed', // 直接设置为完成状态
            progress: 100,
            createdAt: new Date(),
            productionMode: '人工模式',
            script: script.content,
            voice: selectedVoiceTone, // 使用当前选择的音色
            scriptSource: scriptSource, // 脚本来源
            videoThumbnail: generateVideoThumbnail(script.content), // 生成视频缩略图
            videoDuration: generateVideoDuration(script.content), // 生成视频时长
            videoFileSize: generateVideoFileSize(), // 生成文件大小
            subTasks: subTasks // 添加子任务数据
        };
        
        // 添加到任务列表
        window.taskManager.tasks.unshift(newTask);
        
        // 静态状态，不进行进度模拟
        // simulateTaskProgress(newTask.id);
    });
    
    // 更新任务显示
    updateTaskCount();
    
    // 显示任务创建成功提示
    const taskCount = scriptsToProcess.length;
    showMessage(`已创建 ${taskCount} 个视频制作任务！音色：${selectedVoiceTone}。您可以在右上角任务列表中查看进度。`, 'success');
    
    // 清理选择状态
    window.selectedScript = null;
    window.selectedScripts = [];
    
    // 重置所有脚本按钮状态
    const allApplyButtons = document.querySelectorAll('.script-actions .btn');
    allApplyButtons.forEach(btn => {
        if (btn.textContent === '直接应用' || btn.textContent.includes('直接应用')) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
    
    // 更新开始制作按钮
    updateStartProductionButton();
    
    // 自动打开任务列表
    openTaskDrawer();
}

// 生成视频缩略图URL
function generateVideoThumbnail(scriptContent) {
    // 根据脚本内容生成不同的缩略图
    const thumbnails = [
        mockTaskCoverUrl,
        mockTaskCoverUrl,
        mockTaskCoverUrl,
        mockTaskCoverUrl,
        mockTaskCoverUrl
    ];
    
    // 根据脚本内容哈希选择缩略图
    const hash = scriptContent.length % thumbnails.length;
    return thumbnails[hash];
}

// 生成视频时长
function generateVideoDuration(scriptContent) {
    // 根据脚本字数估算时长
    const wordCount = scriptContent.length;
    const estimatedSeconds = Math.max(10, Math.min(60, Math.floor(wordCount / 3)));
    const minutes = Math.floor(estimatedSeconds / 60);
    const seconds = estimatedSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 生成视频文件大小
function generateVideoFileSize() {
    // 随机生成文件大小
    const sizes = ['15.2MB', '23.8MB', '18.5MB', '31.2MB', '25.6MB', '20.1MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// 编辑脚本
function editScript(button) {
    const scriptItem = button.closest('.script-item');
    const scriptContent = scriptItem.querySelector('.script-content p');
    const currentText = scriptContent.textContent;
    
    // 创建编辑框
    const textarea = document.createElement('textarea');
    textarea.value = currentText;
    textarea.className = 'custom-textarea';
    textarea.style.marginTop = '10px';
    
    scriptContent.parentNode.appendChild(textarea);
    scriptContent.style.display = 'none';
    
    // 更新按钮
    button.textContent = '保存';
    button.onclick = function() {
        scriptContent.textContent = textarea.value;
        scriptContent.style.display = 'block';
        textarea.remove();
        button.textContent = '自行修改';
        button.onclick = editScript;
    };
}

// 重新生成脚本
function regenerateScript(button) {
    const scriptItem = button.closest('.script-item');
    const scriptList = document.getElementById('scriptList');
    
    // 显示生成中状态
    button.textContent = '生成中...';
    button.disabled = true;
    
    setTimeout(() => {
        // 模拟新的脚本内容
        const newScripts = [
            '这款连衣裙真的是太美了！时尚设计展现优雅气质，多种颜色可选，百搭款式让你轻松驾驭各种场合~',
            '姐妹们看过来！这款连衣裙真的是绝了！优质面料舒适透气，让你在春夏季节也能美美哒~',
            '今天给大家推荐一款超美的连衣裙！这款时尚连衣裙2024新款，采用优质面料制作，舒适透气~',
            '这款连衣裙真的是我的心头爱！荷叶领设计甜美可爱，纯棉面料透气舒适，春夏季节必备单品~',
            '姐妹们一定要看这款连衣裙！版型显瘦显高，面料柔软亲肤，无论是约会还是上班都能轻松驾驭~',
            '这款连衣裙真的是绝了！时尚百搭设计，让你轻松驾驭各种场合，绝对是衣橱必备单品~'
        ];
        
        const randomScript = newScripts[Math.floor(Math.random() * newScripts.length)];
        
        // 获取当前脚本数量，用于编号
        const currentScriptCount = scriptList.children.length + 1;
        
        // 创建新的脚本项目
        const newScriptItem = document.createElement('div');
        newScriptItem.className = 'script-item';
        newScriptItem.innerHTML = `
            <div class="script-header">
                <h5>脚本${currentScriptCount}</h5>
            </div>
            <div class="script-content">
                <p>${randomScript}</p>
            </div>
            <div class="script-actions">
                <button class="btn btn-sm btn-outline" onclick="applyScript(this)">直接应用</button>
                <button class="btn btn-sm btn-outline" onclick="editScript(this)">自行修改</button>
                <button class="btn btn-sm btn-outline" onclick="regenerateScript(this)">重新生成</button>
            </div>
        `;
        
        // 在当前脚本下方插入新脚本
        scriptItem.parentNode.insertBefore(newScriptItem, scriptItem.nextSibling);
        
        // 恢复按钮状态
        button.textContent = '重新生成';
        button.disabled = false;
        
        showMessage(`已重新生成脚本${currentScriptCount}`, 'success');
    }, 2000);
}

// 移除脚本
function removeScript(button) {
    const scriptItem = button.closest('.selected-script-item');
    scriptItem.remove();
}

// 开始制作
function startProduction() {
    // 检查是否已选择脚本
    if (!window.selectedScripts || window.selectedScripts.length === 0) {
        showMessage('请先选择至少一个脚本', 'warning');
        return;
    }
    
    // 使用第一个选中的脚本作为主脚本（向后兼容）
    window.selectedScript = window.selectedScripts[0];
    
    // 直接创建任务，使用默认音色
    createTasksWithDefaultVoice();
}



// 审核通过视频
function approveVideo() {
    alert('视频审核通过！');
    nextStep();
}

// 审核不通过视频
function rejectVideo() {
    alert('视频审核不通过，请重新制作');
}

// 编辑视频
function editVideo() {
    alert('进入视频编辑模式');
}

// 下载视频
function downloadVideo() {
    // 模拟下载
    const link = document.createElement('a');
    link.href = '#';
    link.download = '时尚连衣裙2024新款_混剪视频.mp4';
    link.click();
    
    alert('视频下载开始！');
}

// 分享视频
function shareVideo() {
    alert('分享功能开发中...');
}

// 制作新视频
function createNew() {
    startProduction();
}

// 视频混剪进度模拟
function startVideoMixing() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const videoPreview = document.getElementById('videoPreview');
    
    if (!progressFill || !progressText) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        
        if (progress < 30) {
            progressText.textContent = '分析素材中...';
        } else if (progress < 60) {
            progressText.textContent = '生成脚本中...';
        } else if (progress < 90) {
            progressText.textContent = '混剪视频中...';
        } else {
            progressText.textContent = '添加配音中...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            progressText.textContent = '混剪完成！';
            setTimeout(() => {
                if (videoPreview) videoPreview.style.display = 'block';
            }, 1000);
        }
    }, 500);
}

// 在步骤4激活时自动开始混剪
document.addEventListener('DOMContentLoaded', function() {
    // 监听步骤变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const step4 = document.getElementById('step4');
                if (step4 && step4.classList.contains('active')) {
                    setTimeout(() => {
                        startVideoMixing();
                    }, 1000);
                }
            }
        });
    });
    
    const step4 = document.getElementById('step4');
    if (step4) {
        observer.observe(step4, { attributes: true });
    }
});

// 模拟上传过程
function simulateUpload() {
    const progressBars = document.querySelectorAll('.upload-progress-bar');
    let currentProgress = 0;
    
    const interval = setInterval(() => {
        currentProgress += Math.random() * 10;
        
        progressBars.forEach((bar, index) => {
            const itemProgress = Math.min(currentProgress - (index * 20), 100);
            bar.style.width = Math.max(0, itemProgress) + '%';
        });
        
        if (currentProgress >= 100 + (progressBars.length * 20)) {
            clearInterval(interval);
            setTimeout(() => {
                closeUploadProgressModal();
                showUploadSuccess();
            }, 1000);
        }
    }, 200);
}

// 显示上传成功
function showUploadSuccess() {
    // 添加新的素材卡片到网格中
    const materialsGrid = document.querySelector('.materials-grid');
    const newMaterialCard = createMaterialCard('新上传视频', 'https://youke1.picui.cn/s1/2025/08/25/68abcee61f235.png');
    materialsGrid.appendChild(newMaterialCard);
    
    // 显示成功提示
    alert('视频上传成功！');
}

// 创建素材卡片
function createMaterialCard(title, imageSrc) {
    const materialCard = document.createElement('div');
    materialCard.className = 'material-card';
    materialCard.innerHTML = `
        <div class="material-thumbnail">
            <img src="${imageSrc}" alt="${title}">
            <div class="material-overlay">
                <div class="material-actions">
                    <div class="dropdown">
                        <button class="dropdown-btn">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">预览</a>
                            <a href="#" class="dropdown-item">下载</a>
                            <a href="#" class="dropdown-item">移动</a>
                            <a href="#" class="dropdown-item">隐藏</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="material-info">
            <span class="material-title">${title}</span>
            <button class="status-btn pending">待确定</button>
        </div>
    `;
    
    // 重新初始化下拉菜单
    const dropdown = materialCard.querySelector('.dropdown');
    const button = dropdown.querySelector('.dropdown-btn');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    
    return materialCard;
}

// 全选功能
const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.material-card input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        closeUploadModal();
        closeUploadProgressModal();
    }
    
    // Ctrl+U 打开上传弹窗
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        openUploadModal();
    }
});

// 工具函数：显示提示信息
function showMessage(message, type = 'info') {
    // 创建提示元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // 根据类型设置背景色
    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c'
    };
    messageEl.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(messageEl);
    
    // 3秒后自动移除
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 配音主播选择相关函数
function openVoiceModal() {
    const modal = document.getElementById('voiceModal');
    modal.style.display = 'block';
    
    // 重置选择状态
    const voiceOptions = document.querySelectorAll('.voice-option');
    voiceOptions.forEach(option => {
        option.classList.remove('selected');
        option.addEventListener('click', selectVoiceOption);
    });
    
    // 重置确认按钮状态
    const confirmBtn = document.querySelector('#voiceModal .btn-primary');
    confirmBtn.disabled = true;
}

function closeVoiceModal() {
    const modal = document.getElementById('voiceModal');
    modal.style.display = 'none';
}

function selectVoiceOption(event) {
    const option = event.currentTarget;
    
    // 移除其他选项的选中状态
    const allOptions = document.querySelectorAll('.voice-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // 选中当前选项
    option.classList.add('selected');
    
    // 启用确认按钮
    const confirmBtn = document.querySelector('#voiceModal .btn-primary');
    confirmBtn.disabled = false;
    
    // 存储选择的配音
    window.selectedVoice = option.getAttribute('data-voice');
}

function playVoiceDemo(voiceType) {
    // 这里可以实现配音试听功能
    console.log('播放配音示例:', voiceType);
    showMessage('配音示例播放中...', 'info');
}

function confirmVoiceSelection() {
    if (!window.selectedVoice || (!window.selectedScript && (!window.selectedScripts || window.selectedScripts.length === 0))) {
        showMessage('请先选择配音主播', 'warning');
        return;
    }
    
    const scriptsToProcess = window.selectedScripts && window.selectedScripts.length > 0 
        ? window.selectedScripts 
        : [window.selectedScript];
    
    // 为每个选中的脚本创建任务
    scriptsToProcess.forEach((script, index) => {
        const newTask = {
            id: window.taskManager.nextId++,
            title: `视频制作任务 ${window.taskManager.nextId - 1}`,
            description: `脚本: ${script.content.substring(0, 30)}...`,
            status: 'processing',
            progress: 0,
            createdAt: new Date(),
            productionMode: '人工模式',
            script: script.content,
            voice: window.selectedVoice
        };
        
        // 添加到任务列表
        window.taskManager.tasks.unshift(newTask);
        
        // 模拟任务进度
        simulateTaskProgress(newTask.id);
    });
    
    // 关闭弹窗
    closeVoiceModal();
    
    // 更新任务显示
    updateTaskCount();
    updateTaskDrawer();
    
    // 显示任务创建成功提示
    const taskCount = scriptsToProcess.length;
    showMessage(`已创建 ${taskCount} 个视频制作任务！您可以在右上角任务列表中查看进度。`, 'success');
    
    // 清理选择状态
    window.selectedScript = null;
    window.selectedScripts = [];
    window.selectedVoice = null;
    
    // 重置所有脚本按钮状态
    const allApplyButtons = document.querySelectorAll('.script-actions .btn');
    allApplyButtons.forEach(btn => {
        if (btn.textContent === '直接应用' || btn.textContent.includes('直接应用')) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
    
    // 更新开始制作按钮
    updateStartProductionButton();
}

// 任务抽屉相关函数
function openTaskDrawer(tasksToShow) {
    const drawer = document.getElementById('taskDrawer');
    const overlay = document.getElementById('taskDrawerOverlay');
    
    drawer.classList.add('open');
    drawer.classList.remove('minimized');
    overlay.classList.add('show');

    window.automationState = window.automationState || {};
    if (Array.isArray(tasksToShow)) {
        window.automationState.latestBatchTaskIds = tasksToShow.map(task => task.id);
        updateTaskDrawer(tasksToShow);
    } else {
        window.automationState.latestBatchTaskIds = null;
        updateTaskDrawer();
    }
    
    document.addEventListener('keydown', handleTaskDrawerKeydown);
}

function getAutomationBatchTasksForDrawer() {
    const ids = window.automationState?.latestBatchTaskIds;
    if (!ids?.length || !window.taskManager) return null;

    const idSet = new Set(ids.map(id => String(id)));
    return window.taskManager.tasks.filter(task => idSet.has(String(task.id)));
}

function updateAutomationBatchTaskDrawer() {
    const batchTasks = getAutomationBatchTasksForDrawer();
    updateTaskDrawer(batchTasks || window.taskManager.tasks);
}

function closeTaskDrawer() {
    const drawer = document.getElementById('taskDrawer');
    const overlay = document.getElementById('taskDrawerOverlay');
    
    drawer.classList.remove('open', 'minimized');
    overlay.classList.remove('show');
    
    // 移除ESC键监听
    document.removeEventListener('keydown', handleTaskDrawerKeydown);
}

function minimizeTaskDrawer() {
    const drawer = document.getElementById('taskDrawer');
    const overlay = document.getElementById('taskDrawerOverlay');
    
    if (drawer.classList.contains('minimized')) {
        // 如果已最小化，则恢复
        drawer.classList.remove('minimized');
        overlay.classList.add('show');
    } else {
        // 最小化
        drawer.classList.add('minimized');
        overlay.classList.remove('show');
    }
}

function handleTaskDrawerKeydown(event) {
    if (event.key === 'Escape') {
        closeTaskDrawer();
    }
}

function updateTaskCount() {
    const taskCount = document.getElementById('taskCount');
    if (!window.taskManager) return;
    
    const processingTasks = window.taskManager.tasks.filter(task => task.status === 'processing').length;
    taskCount.textContent = processingTasks;
}

function updateTaskDrawer(tasks = null) {
    const taskList = document.getElementById('drawerTaskList');
    if (!taskList || !window.taskManager) return;
    
    taskList.innerHTML = '';
    const tasksToShow = tasks || window.taskManager.tasks;
    
    tasksToShow.forEach((task, index) => {
        const taskItem = createTaskItem(task, index + 1);
        taskList.appendChild(taskItem);
        
        // 如果是已完成的任务，生成视频网格
        if (task.status === 'completed') {
            setTimeout(() => {
                generateVideoGrid(task.id);
            }, 100);
        }
    });
}

function createTaskItem(task, taskNumber) {
    const taskItem = document.createElement('div');
    taskItem.className = 'drawer-task-item';
    taskItem.setAttribute('data-status', task.status);
    taskItem.setAttribute('data-task-id', task.id);
    
    const timeAgo = getTimeAgo(task.createdAt);
    const scriptPreview = task.script ? task.script.substring(0, 50) + '...' : '';
    const createdTime = formatTaskDateTime(task.createdAt);
    const updatedTime = formatTaskDateTime(task.updatedAt || new Date());
    
    // 检查任务状态，决定是否显示子任务状态
    let shouldShowSubTasks = false;
    const productionMode = task.productionMode || (window.currentProductionMode === 'automation' ? '批量模式' : '人工模式');
    const modeClass = productionMode === '批量模式' ? 'automation' : 'manual';
    const modeBadge = `<span class="task-mode-badge ${modeClass}">${productionMode}</span>`;
    
    const displayVideos = getTaskVideosForDisplay(task);
    const hasVideoSlots = displayVideos.length > 0;

    if (!hasVideoSlots && task.subTasks && task.subTasks.length > 0) {
        const hasProcessing = task.subTasks.some(subTask => subTask.status === 'processing');
        if (hasProcessing) {
            shouldShowSubTasks = true;
        }
    }
    
    // 生成子任务状态HTML（仅在需要时显示）
    let subTasksHtml = '';
    if (shouldShowSubTasks && task.subTasks) {
        subTasksHtml = '<div class="sub-tasks">';
        task.subTasks.forEach(subTask => {
            const statusIcon = getStatusIcon(subTask.status);
            const statusText = getStatusText(subTask.status);
            subTasksHtml += `<span class="sub-task-status">${subTask.id} ${statusIcon} ${statusText}</span>`;
        });
        subTasksHtml += '</div>';
    }
    
    // 移除操作按钮，只保留任务名称点击功能
    
    const productMetaHtml = task.productId ? `
        <div class="task-product-meta">
            商品ID：${task.productId} · 共 ${displayVideos.length} 条视频${task.status === 'processing' ? '生产中' : ''}
        </div>
    ` : '';

    const videoPreviewHtml = hasVideoSlots ? `
        <div class="task-video-results">
            ${displayVideos.map(video => renderTaskVideoCard(video, task)).join('')}
        </div>
    ` : '';

    const progressValue = typeof task.progress === 'number' ? Math.round(task.progress) : (task.status === 'completed' ? 100 : 0);
    const progressHtml = `
        <div class="task-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressValue}%"></div>
            </div>
            <div class="progress-text">
                <span>${task.stage || getStatusText(task.status)}</span>
                <span>${progressValue}%</span>
            </div>
        </div>
    `;
    
    taskItem.innerHTML = `
        <div class="task-meta">
            <h4 class="task-title" onclick="viewTask(${task.id})" style="cursor: pointer;">
                ${task.id}-${task.title}
                ${modeBadge}
            </h4>
            <span class="task-time">${timeAgo}</span>
        </div>
        ${productMetaHtml}
        ${videoPreviewHtml}
        ${task.status === 'completed' ? '' : progressHtml}
        ${subTasksHtml}
        <div class="task-footer-meta">
            <div>任务提交时间：${createdTime}</div>
            <div>任务最后修改时间：${updatedTime}</div>
            <div>创建人：${task.creator || 'yuri.hu'}</div>
        </div>
    `;
    
    return taskItem;
}

function formatTaskDateTime(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return '-';

    const pad = number => String(number).padStart(2, '0');
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}

// 生成视频网格
function generateVideoGrid(taskId) {
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    if (!task || task.status !== 'completed') return;
    
    const videos = generateTaskVideos(task);
    const videoGrid = document.getElementById(`videoGrid-${taskId}`);
    if (!videoGrid) return;
    
    videoGrid.innerHTML = videos.map((video, index) => `
        <div class="video-grid-item" onmouseenter="showVideoPreview('${taskId}-${index}')" onmouseleave="hideVideoPreview('${taskId}-${index}')">
            <div class="video-thumbnail-container">
                <img src="${video.thumbnail}" alt="视频${index + 1}" class="video-thumbnail">
                <div class="script-source-badge">${video.scriptSource}</div>
                ${video.badge ? `<div class="video-badge">${video.badge}</div>` : ''}
                <div class="video-overlay" id="overlay-${taskId}-${index}">
                    <button class="preview-btn" onclick="openVideoPreview('${taskId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <div class="script-preview">${task.script ? task.script.substring(0, 60) + '...' : '暂无脚本内容'}</div>
                    <div class="video-actions">
                        <button class="btn btn-sm btn-primary" onclick="saveToVideoLibrary('${taskId}')">保存</button>
                        <button class="btn btn-sm btn-outline" onclick="editVideo('${taskId}')">编辑</button>
                    </div>
                </div>
            </div>
            <div class="video-info">
                <div class="video-duration">${video.duration}</div>
                <div class="video-size">${video.fileSize}</div>
                <div class="script-number">脚本${getChineseNumber(index + 1)}</div>
            </div>
        </div>
    `).join('');
}

// 获取中文数字
function getChineseNumber(num) {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return chineseNumbers[num - 1] || num.toString();
}

// 获取状态图标
function getStatusIcon(status) {
    const icons = {
        'completed': '✅',
        'processing': '⏳',
        'failed': '❌'
    };
    return icons[status] || '⏳';
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
}

function getStatusText(status) {
    const statusMap = {
        'processing': '进行中',
        'completed': '已完成',
        'failed': '失败'
    };
    return statusMap[status] || status;
}

// 视频预览相关函数
function showVideoPreview(taskId) {
    const overlay = document.getElementById(`overlay-${taskId}`);
    if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }
}

function hideVideoPreview(taskId) {
    const overlay = document.getElementById(`overlay-${taskId}`);
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }
}

function openVideoPreview(taskId) {
    // 打开视频预览页面
    openVideoPreviewModal(taskId);
}

function saveToVideoLibrary(taskId) {
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    if (task) {
        showMessage(`视频已保存到视频库：${task.title}`, 'success');
        // 这里可以添加保存到视频库的逻辑
    }
}

function editVideo(taskId) {
    window.currentEditorTaskId = taskId;
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    if (task) {
        showMessage(`跳转到视频编辑页面：${task.title}`, 'info');
        // 打开视频编辑页面
        openVideoEditor(taskId);
    }
}

// 打开视频编辑页面
function openVideoEditor(taskId) {
    const modal = document.getElementById('videoEditorModal');
    modal.style.display = 'flex';
    
    // 初始化编辑页面
    initializeVideoEditor(taskId);
    
    // 添加点击背景关闭功能
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoEditor();
        }
    });
}

// 关闭视频编辑页面
function closeVideoEditor() {
    const modal = document.getElementById('videoEditorModal');
    modal.style.display = 'none';
}

// 初始化视频编辑页面
function initializeVideoEditor(taskId) {
    const task = window.taskManager?.tasks.find(t => t.id == taskId);
    const scriptText = document.getElementById('scriptText');

    if (task && scriptText && task.script) {
        scriptText.value = task.script;
    }

    // 初始化音色选择
    initializeVoiceGrid();
    
    // 初始化时间轴
    initializeTimeline();
    
    // 初始化视频播放器
    initializeEditorVideoPlayer();
    
    // 更新字符计数
    updateCharacterCount();
}

function getTaskSellingPoints(task) {
    if (Array.isArray(task.sellingPoints) && task.sellingPoints.length > 0) {
        return task.sellingPoints;
    }
    if (task.modelConfig?.sellingPoints?.length) {
        return task.modelConfig.sellingPoints;
    }
    if (task.reviewConfig?.sellingPoints?.length) {
        return task.reviewConfig.sellingPoints;
    }
    return [demoSellingPointText];
}

function parseSellingPoints(value) {
    return value
        .split(/[、,，\n]/)
        .map(item => item.trim())
        .filter(Boolean);
}

const editorVoiceGroups = {
    male: [
        { name: '成熟男声', desc: '稳重专业', duration: '55s' },
        { name: '青年男声', desc: '活力阳光', duration: '48s' },
        { name: '磁性男声', desc: '低沉魅力', duration: '52s' }
    ],
    female: [
        { name: '甜美女生', desc: '温柔可爱', duration: '46s' },
        { name: '知性女声', desc: '优雅知性', duration: '50s' },
        { name: '活力女声', desc: '青春活泼', duration: '45s' }
    ],
    neutral: [
        { name: '中性音色', desc: '平衡自然', duration: '47s' },
        { name: '温和音色', desc: '温和亲切', duration: '49s' },
        { name: '专业音色', desc: '专业标准', duration: '51s' }
    ]
};

// 初始化音色网格
function initializeVoiceGrid(group = 'female') {
    switchVoiceTab(group, false);
}

function renderEditorVoiceGrid(group) {
    const voiceGrid = document.getElementById('voiceGrid');
    if (!voiceGrid) return;

    const voices = editorVoiceGroups[group] || editorVoiceGroups.female;
    voiceGrid.innerHTML = voices.map((voice, index) => `
        <div class="voice-option ${index === 0 ? 'selected' : ''}" onclick="selectVoiceOption('${group}', ${index})">
            <div class="voice-info">
                <div class="voice-name">${voice.name}</div>
                <div class="voice-desc">${voice.desc}</div>
            </div>
            <div class="voice-duration">${voice.duration}</div>
        </div>
    `).join('');
}

// 选择音色选项
function selectVoiceOption(group, index) {
    const voices = editorVoiceGroups[group] || editorVoiceGroups.female;
    const selectedVoice = voices[index];
    if (!selectedVoice) return;

    const voiceOptions = document.querySelectorAll('.voice-option');
    voiceOptions.forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });

    window.selectedVoiceTone = selectedVoice.name;
    selectedVoiceTone = selectedVoice.name;
    showMessage(`已选择音色：${selectedVoice.name}`, 'success');
}

// 切换音色标签页
function switchVoiceTab(tab, shouldNotify = true) {
    const tabs = document.querySelectorAll('.voice-tab');
    tabs.forEach(t => {
        const tabText = t.textContent.trim();
        const isActive =
            (tab === 'male' && tabText === '男性') ||
            (tab === 'female' && tabText === '女性') ||
            (tab === 'neutral' && tabText === '中性');
        t.classList.toggle('active', isActive);
    });

    renderEditorVoiceGrid(tab);

    const firstVoice = (editorVoiceGroups[tab] || editorVoiceGroups.female)[0];
    if (firstVoice) {
        window.selectedVoiceTone = firstVoice.name;
        selectedVoiceTone = firstVoice.name;
    }

    if (shouldNotify) {
        const labelMap = { male: '男性', female: '女性', neutral: '中性' };
        showMessage(`切换到${labelMap[tab] || '女性'}音色`, 'info');
    }
}

// 初始化音色配置
function initializeVoiceSelection() {
    initializeVoiceGrid('female');
}

// 更新字符计数
function updateCharacterCount() {
    const textarea = document.getElementById('scriptText');
    const charCount = document.getElementById('charCount');
    const count = textarea.value.length;
    charCount.textContent = count;
}

// 更新语速
function updateSpeechRate() {
    const slider = document.getElementById('speechRate');
    const value = document.getElementById('speechRateValue');
    value.textContent = slider.value;
}

// 更新音量
function updateToneVolume() {
    const slider = document.getElementById('toneVolume');
    const value = document.getElementById('toneVolumeValue');
    value.textContent = slider.value + '%';
}

// 发布视频
function publishVideo() {
    showMessage('视频发布成功！', 'success');
    setTimeout(() => {
        closeVideoEditor();
    }, 1500);
}


// 初始化编辑器视频播放器
function initializeEditorVideoPlayer() {
    const videoPlayer = document.getElementById('editorVideoPlayer');
    
    if (videoPlayer) {
        // 设置视频源
        videoPlayer.src = 'https://www.w3school.com.cn/i/movie.mp4';
        videoPlayer.load();
        
        // 监听视频加载完成事件
        videoPlayer.addEventListener('loadedmetadata', function() {
            console.log('视频加载完成，时长:', videoPlayer.duration);
        });
        
        // 监听播放错误
        videoPlayer.addEventListener('error', function() {
            console.error('视频播放错误');
        });
    }
}

function buildTimelineSegmentHtml(segment, index, isSelected) {
    const lensName = segment.lensName || `镜头${segment.id}`;
    return `
        <div class="timeline-segment ${isSelected ? 'selected' : ''}"
             data-segment-index="${index}"
             data-lens-name="${lensName.replace(/"/g, '&quot;')}"
             title="${lensName} · 单击选择，双击替换视频">
            <div class="segment-thumb-wrap">
                <img src="${segment.thumbnail}" alt="片段${segment.id}">
                <div class="segment-number">${segment.id}</div>
            </div>
            <div class="segment-lens-name">${lensName}</div>
        </div>
    `;
}

// 初始化时间轴
function initializeTimeline() {
    const timelineTrack = document.getElementById('timelineTrack');
    if (!timelineTrack) return;

    timelineTrack.innerHTML = DEFAULT_EDITOR_TIMELINE_SEGMENTS.map((segment, index) =>
        buildTimelineSegmentHtml(segment, index, index === 0)
    ).join('');

    addTimelineSegmentListeners();
}

// 选择时间轴片段
function selectTimelineSegment(index) {
    const segments = document.querySelectorAll('.timeline-segment');
    segments.forEach((segment, i) => {
        segment.classList.toggle('selected', i === index);
    });
    
    // 更新视频播放器显示对应的片段
    updateVideoPlayer(index);
    
    const lensLabel = segments[index]?.dataset.lensName || `镜头${index + 1}`;
    showMessage(`已选择：${lensLabel}`, 'info');
}

// 更新视频播放器
function updateVideoPlayer(segmentIndex) {
    const videoPlayer = document.getElementById('editorVideoPlayer');
    const overlayText = document.querySelector('.video-overlay-text');
    
    // 这里可以根据片段索引切换不同的视频源
    const videoSources = [
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ];
    
    const overlayTexts = [
        '夏日赫本风波点裙',
        '清新优雅设计风格',
        '优质面料舒适透气',
        '经典与时尚的完美诠释'
    ];
    
    if (videoPlayer && videoSources[segmentIndex]) {
        videoPlayer.src = videoSources[segmentIndex];
        videoPlayer.load();
    }
    
    if (overlayText && overlayTexts[segmentIndex]) {
        overlayText.textContent = overlayTexts[segmentIndex];
    }
}

// 添加时间轴片段事件监听器
function addTimelineSegmentListeners() {
    const timelineTrack = document.getElementById('timelineTrack');
    
    if (!timelineTrack) {
        console.error('找不到时间轴容器');
        return;
    }
    
    console.log('正在添加时间轴事件监听器');
    
    // 使用事件委托处理单击和双击
    timelineTrack.addEventListener('click', function(e) {
        const segment = e.target.closest('.timeline-segment');
        if (segment) {
            const index = parseInt(segment.dataset.segmentIndex);
            console.log('单击片段:', index);
            selectTimelineSegment(index);
        }
    });
    
    timelineTrack.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('检测到双击事件');
        const segment = e.target.closest('.timeline-segment');
        if (segment) {
            const index = parseInt(segment.dataset.segmentIndex);
            console.log('双击片段:', index);
            openVideoReplaceModal(index);
        } else {
            console.log('未找到片段元素');
        }
    });
    
    console.log('时间轴事件监听器已添加');
}

// 添加时间轴片段
function addTimelineSegment() {
    const timelineTrack = document.getElementById('timelineTrack');
    const newSegmentId = timelineTrack.children.length + 1;
    const lensName = `镜头${newSegmentId}`;

    const wrap = document.createElement('div');
    wrap.innerHTML = buildTimelineSegmentHtml({
        id: newSegmentId,
        thumbnail: editorSegmentPreviewUrl,
        lensName
    }, newSegmentId - 1, false).trim();
    const newSegment = wrap.firstElementChild;

    timelineTrack.appendChild(newSegment);
    showMessage(`已添加片段 ${newSegmentId}（${lensName}）`, 'success');
}

// 初始化编辑器视频播放器
function initializeEditorVideoPlayer() {
    const videoPlayer = document.getElementById('editorVideoPlayer');
    
    // 监听视频播放进度
    videoPlayer.addEventListener('timeupdate', function() {
        const progressFill = document.getElementById('videoProgressFill');
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');
        
        if (progressFill && currentTime && totalTime) {
            const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
            
            currentTime.textContent = formatTime(videoPlayer.currentTime);
            totalTime.textContent = formatTime(videoPlayer.duration);
        }
    });
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
// 发布视频
function publishVideo() {
    showMessage('视频发布成功！', 'success');
    setTimeout(() => {
        closeVideoEditor();
    }, 1500);
}

// 视频库相关函数
function showVideoLibrary() {
    const modal = document.getElementById('videoLibraryModal');
    modal.style.display = 'flex';
    
    // 初始化视频库数据
    initializeVideoLibrary();
}

function closeVideoLibrary() {
    const modal = document.getElementById('videoLibraryModal');
    modal.style.display = 'none';
}

// 初始化视频库
function initializeVideoLibrary() {
    // 生成模拟视频数据
    const videoData = generateVideoLibraryData();
    
    // 保存到全局变量
    window.videoLibraryData = videoData;
    
    // 渲染视频网格
    renderVideoLibraryGrid(videoData);
    
    // 更新结果计数
    updateResultCount(videoData.length);
}

// 生成模拟视频库数据
function generateVideoLibraryData() {
    const videos = [];
    const thumbnails = [libraryCoverUrl];
    
    const productIds = [
        '6921298477540574538',
        '6921298477540574539',
        '6921298477540574540',
        '6921298477540574541',
        '6921298477540574542',
        '6921298477540574543',
        '6921298477540574544',
        '6921298477540574545',
        '6921298477540574546',
        '6921298477540574547',
        '6921298477540574548',
        '6921298477540574549'
    ];
    
    const taskIds = [
        '6921298477540574538',
        '6921346563316532949',
        '6921457890123456789',
        '6921568901234567890',
        '6921679012345678901',
        '6921780123456789012'
    ];
    
    const taskNames = [
        '儿童纯棉百搭小清新碎花上衣',
        '夏季T恤视频制作',
        '连衣裙推广视频',
        '运动鞋广告制作',
        '化妆品宣传视频',
        '家居用品展示'
    ];
    
    const oaAccounts = ['david01.chen', 'alice.wang', 'bob.zhang', 'carol.li'];
    const durations = ['15S', '18S', '20S', '22S', '25S'];
    const prices = ['¥89', '¥78', '¥99', '¥128', '¥156'];
    
    for (let i = 1; i <= 68; i++) {
        const randomTaskIndex = Math.floor(Math.random() * taskIds.length);
        videos.push({
            id: i,
            number: `NO.${i}`,
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            taskId: taskIds[randomTaskIndex],
            taskName: taskNames[randomTaskIndex],
            oaAccount: oaAccounts[Math.floor(Math.random() * oaAccounts.length)],
            thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
            duration: durations[Math.floor(Math.random() * durations.length)],
            price: Math.random() > 0.5 ? prices[Math.floor(Math.random() * prices.length)] : null,
            status: Math.random() > 0.3 ? 'passed' : 'failed', // 通过或未通过
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 随机30天内
        });
    }
    
    return videos;
}

// 渲染视频库网格
function renderVideoLibraryGrid(videos) {
    const grid = document.getElementById('videoLibraryGrid');
    if (!grid) return;
    
          grid.innerHTML = videos.map(video => `
          <div class="library-video-item">
             <div class="library-video-thumbnail" 
                  onclick="playVideo(${video.id})" 
                  onmouseenter="switchToProcessed(${video.id})"
                  onmouseleave="switchToOriginal(${video.id})"
                  data-video-id="${video.id}">
                 <img class="video-preview-img" src="${video.thumbnail}" alt="视频${video.id}" data-original="${video.thumbnail}" data-processed="${video.thumbnail.replace('.png', '_processed.png').replace('.jpg', '_processed.jpg')}">
                 <div class="play-btn">
                     <i class="fas fa-play"></i>
                 </div>
                 
                 <!-- 视频类型指示器 -->
                 <div class="video-type-indicator">
                     <div class="indicator-item active" data-type="original">
                         <i class="fas fa-video"></i>
                         <span>原片</span>
                     </div>
                     <div class="indicator-item" data-type="processed">
                         <i class="fas fa-magic"></i>
                         <span>优化</span>
                     </div>
                 </div>
                 
                 <!-- 处理状态标签 -->
                 <div class="processing-status" style="display: none;">
                     <div class="processing-tags">
                         <span class="tag">降噪</span>
                         <span class="tag">增强</span>
                         <span class="tag">调色</span>
                     </div>
                 </div>
                 
                 <div class="video-duration">15s</div>
                 <div class="checkbox" onclick="toggleVideoSelection(event, ${video.id})"></div>
                 ${video.price ? `<div class="price-tag">${video.price}</div>` : ''}
             </div>
            <div class="library-video-info">
                <div class="video-id">商品ID: ${video.productId}</div>
                <div class="video-task-id">任务ID: ${video.taskId}</div>
                <div class="video-task-name">任务名称: ${video.taskName}</div>
                <div class="video-status">
                    <label class="toggle-switch">
                        <input type="checkbox" ${video.status === 'passed' ? 'checked' : ''} onchange="toggleVideoStatus(${video.id}, this.checked)">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${video.status === 'passed' ? '通过' : '未通过'}</span>
                    </label>
                </div>
                <div class="library-video-actions">
                    <button class="btn btn-sm btn-outline" onclick="editLibraryVideo(${video.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="deleteLibraryVideo(${video.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 切换到预处理视频预览
function switchToProcessed(videoId) {
    const thumbnail = document.querySelector(`[data-video-id="${videoId}"]`);
    if (!thumbnail) return;
    
    const img = thumbnail.querySelector('.video-preview-img');
    const indicators = thumbnail.querySelectorAll('.indicator-item');
    const processingStatus = thumbnail.querySelector('.processing-status');
    const duration = thumbnail.querySelector('.video-duration');
    
    if (img) {
        img.src = img.dataset.processed;
        img.style.filter = 'brightness(1.1) contrast(1.05) saturate(1.1)';
    }
    
    // 更新指示器状态
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.dataset.type === 'processed') {
            indicator.classList.add('active');
        }
    });
    
    // 显示处理状态标签
    if (processingStatus) {
        processingStatus.style.display = 'block';
    }
    
    // 更新时长（预处理后通常会略短）
    if (duration) {
        duration.textContent = '12s';
    }
}

// 切换到原视频预览
function switchToOriginal(videoId) {
    const thumbnail = document.querySelector(`[data-video-id="${videoId}"]`);
    if (!thumbnail) return;
    
    const img = thumbnail.querySelector('.video-preview-img');
    const indicators = thumbnail.querySelectorAll('.indicator-item');
    const processingStatus = thumbnail.querySelector('.processing-status');
    const duration = thumbnail.querySelector('.video-duration');
    
    if (img) {
        img.src = img.dataset.original;
        img.style.filter = 'none';
    }
    
    // 更新指示器状态
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.dataset.type === 'original') {
            indicator.classList.add('active');
        }
    });
    
    // 隐藏处理状态标签
    if (processingStatus) {
        processingStatus.style.display = 'none';
    }
    
    // 恢复原始时长
    if (duration) {
        duration.textContent = '15s';
    }
}

// 播放视频
function playVideo(videoId) {
    const thumbnail = document.querySelector(`[data-video-id="${videoId}"]`);
    const activeIndicator = thumbnail?.querySelector('.indicator-item.active');
    const videoType = activeIndicator?.dataset.type === 'processed' ? '预处理视频' : '原视频';
    
    showMessage(`播放${videoType} ${videoId}`, 'info');
    // 这里可以添加视频播放逻辑
}

// ===== 原料库视频预览菜单功能 =====

// 切换预览菜单显示/隐藏
function toggleMaterialPreviewMenu(materialId) {
    // 先关闭所有其他菜单
    const allMenus = document.querySelectorAll('.material-preview-menu');
    allMenus.forEach(menu => {
        if (menu.id !== `materialMenu_${materialId}`) {
            menu.style.display = 'none';
        }
    });
    
    // 切换当前菜单
    const currentMenu = document.getElementById(`materialMenu_${materialId}`);
    if (currentMenu) {
        currentMenu.style.display = currentMenu.style.display === 'none' ? 'block' : 'none';
    }
}

// 预览素材视频
function previewMaterialVideo(materialId, type) {
    const thumbnail = document.querySelector(`[data-material-id="${materialId}"]`);
    if (!thumbnail) return;
    
    const img = thumbnail.querySelector('.material-preview-img');
    const menu = document.getElementById(`materialMenu_${materialId}`);
    
    if (img) {
        // 更新图片源和样式
        if (type === 'processed') {
            img.src = img.dataset.processed;
            img.style.filter = 'brightness(1.1) contrast(1.05) saturate(1.1)';
            img.dataset.currentType = 'processed';
        } else {
            img.src = img.dataset.original;
            img.style.filter = 'none';
            img.dataset.currentType = 'original';
        }
    }
    
    // 隐藏菜单
    if (menu) {
        menu.style.display = 'none';
    }
    
    // 显示预览消息
    const typeText = type === 'processed' ? '预处理视频' : '原片视频';
    showMessage(`正在预览${typeText} - 素材ID: ${materialId}`, 'info');
}

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    if (!e.target.closest('.preview-button-container')) {
        const allMenus = document.querySelectorAll('.material-preview-menu');
        allMenus.forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// 切换视频状态
function toggleVideoStatus(videoId, isChecked) {
    // 找到对应的视频数据
    const videoData = window.videoLibraryData || generateVideoLibraryData();
    const video = videoData.find(v => v.id === videoId);
    
    if (video) {
        // 更新状态
        video.status = isChecked ? 'passed' : 'failed';
        
        // 更新标签文本
        const toggleLabel = event.target.parentElement.querySelector('.toggle-label');
        if (toggleLabel) {
            toggleLabel.textContent = isChecked ? '通过' : '未通过';
        }
        
        // 显示提示信息
        const statusText = video.status === 'passed' ? '通过' : '未通过';
        showMessage(`视频状态已更新为: ${statusText}`, 'success');
    }
}

// 切换视频选择
function toggleVideoSelection(event, videoId) {
    event.stopPropagation();
    const checkbox = event.target;
    checkbox.classList.toggle('checked');
    
    // 更新批量导出按钮状态
    updateBatchExportButton();
}

// 更新批量导出按钮状态
function updateBatchExportButton() {
    const checkedBoxes = document.querySelectorAll('.library-video-thumbnail .checkbox.checked');
    const batchExportBtn = document.querySelector('.action-section .btn-primary');
    
    if (checkedBoxes.length > 0) {
        batchExportBtn.textContent = `批量导出 (${checkedBoxes.length})`;
    } else {
        batchExportBtn.innerHTML = '<i class="fas fa-download"></i> 批量导出';
    }
}

// 批量导出
function batchExport() {
    const checkedBoxes = document.querySelectorAll('.library-video-thumbnail .checkbox.checked');
    if (checkedBoxes.length === 0) {
        showMessage('请先选择要导出的视频', 'warning');
        return;
    }
    
    showMessage(`正在导出 ${checkedBoxes.length} 个视频...`, 'info');
    // 这里可以添加批量导出逻辑
}

// 编辑视频库视频
function editLibraryVideo(videoId) {
    showMessage(`编辑视频 ${videoId}`, 'info');
    // 这里可以添加编辑逻辑
}

// 删除视频库视频
function deleteLibraryVideo(videoId) {
    if (confirm('确定要删除这个视频吗？')) {
        showMessage(`已删除视频 ${videoId}`, 'success');
        // 这里可以添加删除逻辑
    }
}

// 清除搜索
function clearSearch(fieldId) {
    document.getElementById(fieldId).value = '';
    // 重新搜索
    searchVideos();
}

// 搜索视频
function searchVideos() {
    const productId = document.getElementById('productIdSearch').value.trim();
    const oaAccount = document.getElementById('oaAccountSearch').value.trim();
    
    // 这里可以添加搜索逻辑
    showMessage('搜索功能开发中...', 'info');
}

// 显示筛选选项
function showFilterOptions() {
    showMessage('筛选功能开发中...', 'info');
}

// 更新结果计数
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `共为你找到${count}个相关的视频`;
    }
}

// 切换页面
function changePage(page) {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => btn.classList.remove('active'));
    
    if (page === 'prev') {
        // 上一页逻辑
        const currentActive = document.querySelector('.page-btn.active');
        const prevBtn = currentActive.previousElementSibling;
        if (prevBtn && prevBtn.classList.contains('page-btn')) {
            prevBtn.classList.add('active');
        }
    } else if (page === 'next') {
        // 下一页逻辑
        const currentActive = document.querySelector('.page-btn.active');
        const nextBtn = currentActive.nextElementSibling;
        if (nextBtn && nextBtn.classList.contains('page-btn')) {
            nextBtn.classList.add('active');
        }
    } else {
        // 具体页面
        const targetBtn = document.querySelector(`.page-btn:nth-child(${page + 1})`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
    
    showMessage(`切换到第${page}页`, 'info');
}

// 侧边栏导航相关函数
function toggleNavGroup(element) {
    const navItem = element.closest('.nav-item');
    const submenu = navItem.querySelector('.submenu');
    const expandIcon = element.querySelector('.expand-icon');
    
    if (submenu) {
        submenu.classList.toggle('expanded');
        if (expandIcon) {
            expandIcon.classList.toggle('rotated');
        }
    }
}

// 初始化侧边栏
function initializeSidebar() {
    // 为所有带子菜单的导航项添加点击事件
    const navItemsWithSubmenu = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
    
    navItemsWithSubmenu.forEach(navLink => {
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleNavGroup(this);
        });
    });
    
    // 默认展开当前活跃的菜单项
    const activeNavItem = document.querySelector('.nav-link.active');
    if (activeNavItem) {
        const parentSubmenu = activeNavItem.closest('.submenu');
        if (parentSubmenu) {
            parentSubmenu.classList.add('expanded');
            const expandIcon = parentSubmenu.previousElementSibling.querySelector('.expand-icon');
            if (expandIcon) {
                expandIcon.classList.add('rotated');
            }
        }
    }
}

// 原料库页面状态
var materialLibData = [];
var materialLibCurrentPage = 1;
var materialLibPageSize = 20;

// 原料库相关函数
function showMaterialLibrary() {
    const modal = document.getElementById('materialLibraryModal');
    modal.style.display = 'flex';
    initializeMaterialLibrary();
}

function closeMaterialLibrary() {
    const modal = document.getElementById('materialLibraryModal');
    modal.style.display = 'none';
}

function initializeMaterialLibrary() {
    if (!materialLibData.length) {
        materialLibData = generateMaterialData();
    }
    materialLibCurrentPage = 1;
    renderMaterialTable();
    updateMaterialLibPagination();
    initializeUploadFunction();
}

function generateMaterialData() {
    const brands = ['骆驼', 'Olay', '安踏', '李宁', '优衣库'];
    const productNames = [
        '【透气网鞋】夏季男鞋运动鞋男网面薄款健步鞋缓震轻便舒适休闲鞋',
        '【100%纯棉】儿童碎花上衣',
        '【保湿修护】精华液30ml',
        '【跑步专用】缓震运动鞋',
        '【轻薄透气】防晒外套'
    ];
    const materialTypes = ['自运营实拍', '代理素材', '混剪AI视频'];
    const sourceTypes = ['人工实拍', 'AI镜头', 'AI爆款复刻'];
    const directors = ['范家荣', '李明', '王芳'];
    const videoTags = ['商品展示', '细节特写', '穿搭场景', '功能演示', '-'];
    const oaAccounts = ['T00068908', 'david01.chen', 'alice.wang', 'bob.zhang'];
    const thumbnails = [libraryCoverUrl];
    const baseProductId = '6920677076083210704';
    const materials = [];

    for (let i = 1; i <= 1312; i++) {
        const brandName = brands[i % brands.length];
        const productId = i <= 20 ? baseProductId : `6920677076083210${String(700 + (i % 100)).padStart(3, '0')}`;
        const batch = Math.floor(Math.random() * 3) + 1;
        const uploadTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const updateTime = new Date(uploadTime.getTime() + Math.random() * 5 * 60 * 1000);
        const seq = 58380 + (i % 200);

        materials.push({
            id: String(87800 - i),
            brandName,
            productId,
            productName: productNames[i % productNames.length],
            batch,
            materialName: `原料库-${seq}-${productId}-20260414`,
            status: i % 17 === 0 ? 'disabled' : (i % 23 === 0 ? 'draft' : 'enabled'),
            fileType: 'mp4',
            materialType: materialTypes[i % materialTypes.length],
            sourceType: sourceTypes[i % sourceTypes.length],
            director: directors[i % directors.length],
            videoTag: videoTags[i % videoTags.length],
            uploadTime,
            updateTime,
            uploadOA: oaAccounts[i % oaAccounts.length],
            thumbnail: thumbnails[i % thumbnails.length],
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        });
    }

    return materials;
}

function getMaterialLibFilters() {
    return {
        brandName: document.getElementById('filterBrandName')?.value.trim() || '',
        productId: document.getElementById('filterProductId')?.value.trim() || '',
        productName: document.getElementById('filterProductName')?.value.trim() || '',
        materialName: document.getElementById('filterMaterialName')?.value.trim() || '',
        status: document.getElementById('filterStatus')?.value || '',
        materialType: document.getElementById('filterMaterialType')?.value || '',
        sourceType: document.getElementById('filterSourceType')?.value || '',
        director: document.getElementById('filterDirector')?.value || '',
        startDate: document.getElementById('startDate')?.value || '',
        endDate: document.getElementById('endDate')?.value || '',
        uploadOA: document.getElementById('filterUploadOA')?.value.trim() || ''
    };
}

function getFilteredMaterialLibData() {
    const filters = getMaterialLibFilters();
    return materialLibData.filter(item => {
        if (filters.brandName && !item.brandName.includes(filters.brandName)) return false;
        if (filters.productId && !item.productId.includes(filters.productId)) return false;
        if (filters.productName && !item.productName.includes(filters.productName)) return false;
        if (filters.materialName && !item.materialName.includes(filters.materialName)) return false;
        if (filters.status && item.status !== filters.status) return false;
        if (filters.materialType && item.materialType !== filters.materialType) return false;
        if (filters.sourceType && item.sourceType !== filters.sourceType) return false;
        if (filters.director && item.director !== filters.director) return false;
        if (filters.uploadOA && !item.uploadOA.toLowerCase().includes(filters.uploadOA.toLowerCase())) return false;
        if (filters.startDate) {
            const start = new Date(filters.startDate + 'T00:00:00');
            if (item.uploadTime < start) return false;
        }
        if (filters.endDate) {
            const end = new Date(filters.endDate + 'T23:59:59');
            if (item.uploadTime > end) return false;
        }
        return true;
    });
}

function renderMaterialTable() {
    const tbody = document.getElementById('materialTableBody');
    if (!tbody) return;

    const filtered = getFilteredMaterialLibData();
    const startIndex = (materialLibCurrentPage - 1) * materialLibPageSize;
    const pageData = filtered.slice(startIndex, startIndex + materialLibPageSize);

    if (!pageData.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="17" class="material-empty-cell">
                    <div class="material-empty-state">暂无符合条件的素材</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = pageData.map(material => `
        <tr>
            <td>
                <div class="material-video-thumbnail" data-material-id="${material.id}" onclick="previewMaterialById('${material.id}')">
                    <img class="material-preview-img" src="${material.thumbnail}" alt="视频封面">
                </div>
            </td>
            <td>${material.id}</td>
            <td>${material.materialType}</td>
            <td>${material.sourceType}</td>
            <td>${material.director}</td>
            <td>${material.videoTag}</td>
            <td>${material.brandName}</td>
            <td>${material.productId}</td>
            <td class="material-name-cell" title="${material.productName}">${material.productName}</td>
            <td>${material.batch}</td>
            <td class="material-name-cell" title="${material.materialName}">${material.materialName}</td>
            <td><span class="status-tag status-${material.status}">${getStatusText(material.status)}</span></td>
            <td>${material.fileType}</td>
            <td>${formatDateTime(material.uploadTime)}</td>
            <td>${formatDateTime(material.updateTime)}</td>
            <td>${material.uploadOA}</td>
            <td class="row-actions">
                <div class="material-row-actions">
                    <button class="material-action-link" onclick="editMaterial('${material.id}')">编辑</button>
                    <button class="material-action-link" onclick="enableMaterial('${material.id}')">启用</button>
                    <button class="material-action-link" onclick="disableMaterial('${material.id}')">屏蔽</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function formatDateTime(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function updateMaterialLibPagination() {
    const filtered = getFilteredMaterialLibData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / materialLibPageSize));
    if (materialLibCurrentPage > totalPages) materialLibCurrentPage = totalPages;

    const totalEl = document.getElementById('materialTotalCount');
    if (totalEl) totalEl.textContent = `共${filtered.length}条`;

    const pagination = document.getElementById('materialPagination');
    if (!pagination) return;

    const pages = [];
    const current = materialLibCurrentPage;
    const addPage = (page) => {
        pages.push(`<button class="page-btn ${page === current ? 'active' : ''}" onclick="changeMaterialLibPage(${page})">${page}</button>`);
    };

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
        addPage(1);
        if (current > 3) pages.push('<span class="page-ellipsis">...</span>');
        const start = Math.max(2, current - 1);
        const end = Math.min(totalPages - 1, current + 1);
        for (let i = start; i <= end; i++) addPage(i);
        if (current < totalPages - 2) pages.push('<span class="page-ellipsis">...</span>');
        addPage(totalPages);
    }

    pagination.innerHTML = pages.join('');
}

function changeMaterialLibPage(page) {
    materialLibCurrentPage = page;
    renderMaterialTable();
    updateMaterialLibPagination();
}

function changeMaterialLibPageSize() {
    const select = document.getElementById('materialLibPageSize');
    materialLibPageSize = parseInt(select?.value || '20', 10);
    materialLibCurrentPage = 1;
    renderMaterialTable();
    updateMaterialLibPagination();
}

function previewMaterialById(materialId) {
    const material = materialLibData.find(item => item.id === materialId);
    if (!material) return;
    previewVideo(material.videoUrl, material.materialName, material.productName);
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        draft: '草稿',
        enabled: '启用',
        disabled: '屏蔽',
        deleted: '删除'
    };
    return statusMap[status] || status;
}

// 搜索素材
function searchMaterials() {
    materialLibCurrentPage = 1;
    renderMaterialTable();
    updateMaterialLibPagination();
    showMessage('查询完成', 'success');
}

// 重置筛选
function resetFilters() {
    const fields = [
        'filterBrandName', 'filterProductId', 'filterProductName', 'filterMaterialName',
        'filterUploadOA', 'startDate', 'endDate'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const statusEl = document.getElementById('filterStatus');
    if (statusEl) statusEl.value = 'enabled';

    const typeEl = document.getElementById('filterMaterialType');
    if (typeEl) typeEl.value = '自运营实拍';

    ['filterSourceType', 'filterDirector'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.selectedIndex = 0;
    });

    materialLibCurrentPage = 1;
    renderMaterialTable();
    updateMaterialLibPagination();
    showMessage('已重置筛选条件', 'success');
}

// 视频预览功能
function previewVideo(videoUrl, materialName, productName) {
    const modal = document.getElementById('videoPreviewModal');
    const video = document.getElementById('previewVideo');
    const title = document.getElementById('previewVideoTitle');
    const desc = document.getElementById('previewVideoDesc');
    
    // 设置视频源
    video.src = videoUrl;
    
    // 设置标题和描述
    title.textContent = materialName;
    desc.textContent = `商品：${productName} | 点击播放按钮开始预览视频`;
    
    // 显示弹窗
    modal.style.display = 'flex';
    
    // 自动播放（需要用户交互）
    video.load();
}

// 关闭视频预览
function closeVideoPreview() {
    const modal = document.getElementById('videoPreviewModal');
    const video = document.getElementById('previewVideo');
    
    // 停止视频播放
    video.pause();
    video.src = '';
    
    // 隐藏弹窗
    modal.style.display = 'none';
}

// 导出素材
function exportMaterials() {
    showMessage('正在导出素材数据...', 'info');
    setTimeout(() => {
        showMessage('导出成功！', 'success');
    }, 2000);
}

// 显示上传弹窗
function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'flex';
    
    // 重置表单
    resetUploadForm();
}

// 关闭上传弹窗
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'none';
}

// 重置上传表单
function resetUploadForm() {
    document.getElementById('uploadProductId').value = '';
    document.getElementById('uploadBatch').value = '';
    document.querySelector('input[name="enableStatus"][value="yes"]').checked = true;
    
    // 清空文件列表
    const uploadList = document.getElementById('uploadList');
    uploadList.innerHTML = '';
    
    // 重置上传区域
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('dragover');
}

// 初始化上传功能
function initializeUploadFunction() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽事件
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

// 处理文件选择
function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

// 处理文件
function handleFiles(files) {
    const uploadList = document.getElementById('uploadList');
    const currentCount = uploadList.children.length;
    
    if (currentCount + files.length > 100) {
        showMessage('总计不能超过100条视频', 'warning');
        return;
    }
    
    if (files.length > 10) {
        showMessage('单次最多上传10个文件', 'warning');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
            addFileToList(file);
        } else {
            showMessage(`${file.name} 不是视频文件`, 'warning');
        }
    });
}

// 添加文件到列表
function addFileToList(file) {
    const uploadList = document.getElementById('uploadList');
    const fileItem = document.createElement('div');
    fileItem.className = 'upload-item';
    fileItem.innerHTML = `
        <div class="upload-item-info">
            <i class="fas fa-video upload-item-icon"></i>
            <div>
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-item-size">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button class="upload-item-remove" onclick="removeFile(this)">删除</button>
    `;
    uploadList.appendChild(fileItem);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 删除文件
function removeFile(button) {
    button.closest('.upload-item').remove();
}

// 提交上传
function submitUpload() {
    const productId = document.getElementById('uploadProductId').value.trim();
    const batch = document.getElementById('uploadBatch').value.trim();
    const enableStatus = document.querySelector('input[name="enableStatus"]:checked').value;
    const videoType = document.querySelector('input[name="videoType"]:checked').value;
    const uploadList = document.getElementById('uploadList');
    
    if (!productId) {
        showMessage('请输入商品ID', 'warning');
        return;
    }
    
    if (!batch) {
        showMessage('请输入批次号', 'warning');
        return;
    }
    
    if (uploadList.children.length === 0) {
        showMessage('请至少上传一个视频文件', 'warning');
        return;
    }
    
    // 模拟上传过程
    showMessage('正在上传素材...', 'info');
    
    setTimeout(() => {
        showMessage('素材上传成功！', 'success');
        closeUploadModal();
        
        // 刷新素材列表
        initializeMaterialLibrary();
    }, 2000);
}

// 素材操作函数
function editMaterial(materialId) {
    showMessage(`编辑素材 ${materialId}`, 'info');
}

function viewMaterial(materialId) {
    showMessage(`查看素材 ${materialId}`, 'info');
}

function deleteMaterial(materialId) {
    if (confirm('请再次确认是否删除素材？')) {
        showMessage(`素材 ${materialId} 删除成功！`, 'success');
    }
}

function enableMaterial(materialId) {
    showMessage(`素材 ${materialId} 已启用`, 'success');
}

function disableMaterial(materialId) {
    showMessage(`素材 ${materialId} 已屏蔽`, 'success');
}

function openVideoPreviewModal(taskId) {
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    if (!task) return;
    
    // 获取当前任务的所有视频（模拟数据）
    const currentTaskVideos = generateTaskVideos(task);
    window.currentPreviewVideos = currentTaskVideos;
    window.currentVideoIndex = 0;
    
    // 创建视频预览弹窗
    const modal = document.createElement('div');
    modal.className = 'modal video-preview-modal';
    modal.id = 'videoPreviewModal';
    
    modal.innerHTML = `
        <div class="modal-content video-preview-content">
            <div class="modal-header">
                <h4>预览视频</h4>
                <button class="close-btn" onclick="closeVideoPreviewModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="video-preview-layout">
                    <!-- 左侧视频列表 -->
                    <div class="video-list-panel">
                        <div class="video-list-header">
                            <span>共${currentTaskVideos.length}个视频</span>
                            <label class="select-all-checkbox">
                                <input type="checkbox" checked onchange="toggleSelectAll(this)">
                                <span>全选</span>
                            </label>
                        </div>
                        <div class="video-list" id="videoList">
                            ${currentTaskVideos.map((video, index) => `
                                <div class="video-list-item ${index === 0 ? 'active' : ''}" onclick="switchVideo(${index})">
                                    <div class="video-thumbnail-small">
                                        <img src="${video.thumbnail}" alt="视频${index + 1}">
                                        ${video.badge ? `<div class="video-badge">${video.badge}</div>` : ''}
                                    </div>
                                    <div class="video-info-small">
                                        <div class="video-title-small">夏季T恤视频制作_${index}</div>
                                        <div class="video-source-small">${video.scriptSource}</div>
                                        <div class="video-duration-small">${video.duration}</div>
                                    </div>
                                    <div class="video-checkbox">
                                        <input type="checkbox" checked>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 右侧视频播放器 -->
                    <div class="video-player-panel">
                        <div class="video-player-container">
                            <button class="nav-btn nav-prev" onclick="switchVideo(${window.currentVideoIndex - 1})">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <video controls class="video-player" id="mainVideoPlayer">
                                <source src="https://www.w3school.com.cn/i/movie.mp4" type="video/mp4">
                                您的浏览器不支持视频播放。
                            </video>
                            <button class="nav-btn nav-next" onclick="switchVideo(${window.currentVideoIndex + 1})">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="video-info-panel">
                            <div class="video-title">夏季T恤视频制作_${window.currentVideoIndex}</div>
                            <div class="script-source">脚本来源: ${currentTaskVideos[window.currentVideoIndex]?.scriptSource || 'AI脚本'}</div>
                            <div class="script-content">
                                <h5>脚本内容:</h5>
                                <p>${task.script || '夏日清新，轻松搭配。这款T恤采用优质棉质面料，透气舒适，是您夏季出行的完美选择。简约设计，百搭时尚，让您在炎热的夏天也能保持清爽优雅的形象。'}</p>
                            </div>
                            <div class="video-meta">
                                <span>时长: ${currentTaskVideos[window.currentVideoIndex]?.duration || '00:23'}</span>
                                <span>大小: ${currentTaskVideos[window.currentVideoIndex]?.fileSize || '2.1MB'}</span>
                                <span>格式: MP4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeVideoPreviewModal()">批量审阅链接</button>
                <button class="btn btn-primary" onclick="downloadVideo('${taskId}')">下载</button>
                <button class="btn btn-outline" onclick="saveToVideoLibrary('${taskId}')">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 初始化视频播放器
    initializeVideoPlayer();
}

function closeVideoPreviewModal() {
    const modal = document.getElementById('videoPreviewModal');
    if (modal) {
        modal.remove();
    }
}

function downloadVideo(taskId) {
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    if (task) {
        showMessage(`开始下载视频：${task.title}`, 'info');
        // 这里可以添加下载逻辑
        setTimeout(() => {
            showMessage(`视频下载完成：${task.title}`, 'success');
        }, 2000);
    }
}

function createTaskVideoSlots(count, status = 'processing', baseProgress = 8) {
    const parsed = parseInt(String(count).replace(/\D/g, ''), 10);
    const total = Math.min(10, Math.max(1, Number.isNaN(parsed) ? 1 : parsed));
    return Array.from({ length: total }, (_, index) => ({
        id: index + 1,
        title: `视频${index + 1}`,
        status,
        progress: status === 'completed' ? 100 : Math.max(5, baseProgress - index * 2),
        thumbnail: mockTaskCoverUrl,
        duration: status === 'completed' ? '15S' : '--',
        fileSize: status === 'completed' ? '2.8MB' : '--',
        scriptSource: 'AI脚本'
    }));
}

function createTaskVideoSlotsFromScripts(scripts, status = 'processing', baseProgress = 8) {
    const list = (scripts || []).filter(Boolean);
    const total = Math.max(1, list.length);
    return list.map((script, index) => ({
        id: index + 1,
        title: `视频${index + 1}`,
        script,
        status,
        progress: status === 'completed' ? 100 : Math.max(5, baseProgress - index * 2),
        thumbnail: mockTaskCoverUrl,
        duration: status === 'completed' ? '15S' : '--',
        fileSize: status === 'completed' ? '2.8MB' : '--',
        scriptSource: '人工脚本'
    }));
}

function getTaskVideosForDisplay(task) {
    if (task.videos?.length) return task.videos;
    if (task.videoCount) {
        return createTaskVideoSlots(task.videoCount, task.status === 'completed' ? 'completed' : 'processing', task.progress || 8);
    }
    if (task.status === 'completed') {
        return generateTaskVideos(task).slice(0, task.videoCount || 1);
    }
    return [];
}

function finalizeAutomationTask(task) {
    if (!task) return;

    task.status = 'completed';
    task.stage = '任务成功';
    task.progress = 100;
    task.updatedAt = new Date();

    if (task.videos?.length) {
        task.videos.forEach((video, index) => {
            video.status = 'completed';
            video.progress = 100;
            if (!video.duration || video.duration === '--') video.duration = '15S';
            if (!video.fileSize || video.fileSize === '--') video.fileSize = '2.8MB';
            if (!video.script && task.scripts?.[index]) video.script = task.scripts[index];
            if (!video.thumbnail) video.thumbnail = mockTaskCoverUrl;
        });
    }

    if (task.subTasks?.length) {
        task.subTasks.forEach(subTask => {
            subTask.status = 'completed';
        });
    }
}

function updateAutomationTaskVideos(task, stage) {
    if (!task.videos?.length) return;

    if (stage.status === 'completed') {
        task.videos.forEach(video => {
            video.status = 'completed';
            video.progress = 100;
            video.duration = '15S';
            video.fileSize = '2.8MB';
        });
        return;
    }

    task.videos.forEach(video => {
        video.status = 'processing';
        video.progress = Math.min(95, Math.max(8, stage.progress + (video.id % 3) * 2));
        video.duration = '--';
        video.fileSize = '--';
    });
}

function renderTaskVideoCard(video, task) {
    const isCompleted = video.status === 'completed' || task.status === 'completed';
    const statusClass = isCompleted ? 'success' : 'processing';
    const statusIcon = isCompleted ? 'fa-check-circle' : 'fa-spinner fa-spin';
    const statusText = isCompleted ? '任务成功' : '生产中';
    const progress = typeof video.progress === 'number' ? Math.round(video.progress) : 0;

    const overlayHtml = isCompleted ? `
        <div class="task-video-mask">
            <button type="button" title="保存" onclick="saveToVideoLibrary('${task.id}')">
                <i class="fas fa-save"></i>
            </button>
            <button type="button" title="编辑" onclick="editVideo('${task.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" title="预览" onclick="openVideoPreview('${task.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button type="button" title="复制">
                <i class="fas fa-copy"></i>
            </button>
        </div>
    ` : `
        <div class="task-video-loading">
            <div class="task-video-mini-progress">
                <div class="task-video-mini-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span>${progress}%</span>
        </div>
    `;

    return `
        <div class="task-video-card ${isCompleted ? '' : 'is-processing'}">
            <div class="task-video-status ${statusClass}">
                <i class="fas ${statusIcon}"></i>
                ${statusText}
            </div>
            <div class="task-video-cover-wrap">
                <img src="${video.thumbnail || mockTaskCoverUrl}" alt="${task.title}" class="task-video-cover">
                ${overlayHtml}
            </div>
            <div class="task-video-script">${video.script || task.script || video.title || task.title}</div>
            <div class="task-video-meta">
                <span>${video.duration || task.videoDuration || '--'}</span>
                <span>${video.fileSize || task.videoFileSize || '--'}</span>
            </div>
        </div>
    `;
}

// 生成任务视频数据
function generateTaskVideos(task) {
    const baseTitle = task.title;
    const scriptSource = task.scriptSource || 'AI脚本';
    
    // 视频封面链接数组
    const videoThumbnails = [
        mockTaskCoverUrl,
        mockTaskCoverUrl,
        mockTaskCoverUrl,
        mockTaskCoverUrl
    ];
    
    const seed = task.id || 1;
    const videoCount = task.videoCount || ((seed % 5) + 1);
    const videos = [];
    
    for (let i = 0; i < videoCount; i++) {
        const thumbnailIndex = i % videoThumbnails.length;
        const isLastVideo = i === videoCount - 1;
        
        videos.push({
            id: i + 1,
            title: `${baseTitle}_${i}`,
            scriptSource: isLastVideo ? 'AI脚本' : '爆款脚本复刻',
            duration: isLastVideo ? '00:16' : '00:23',
            thumbnail: videoThumbnails[thumbnailIndex],
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            badge: i === 2 ? '新人券' : null,
            fileSize: generateVideoFileSize()
        });
    }
    
    return videos;
}

// 切换视频
function switchVideo(index) {
    if (!window.currentPreviewVideos || index < 0 || index >= window.currentPreviewVideos.length) {
        return;
    }
    
    const videos = window.currentPreviewVideos;
    const video = videos[index];
    
    // 更新当前视频索引
    window.currentVideoIndex = index;
    
    // 更新视频播放器
    const videoPlayer = document.getElementById('mainVideoPlayer');
    if (videoPlayer) {
        const currentTime = videoPlayer.currentTime;
        const wasPlaying = !videoPlayer.paused;
        
        videoPlayer.src = "https://www.w3school.com.cn/i/movie.mp4";
        videoPlayer.load();
        
        // 保持播放状态
        if (wasPlaying) {
            videoPlayer.play();
        }
    }
    
    // 更新视频信息
    const videoTitle = document.querySelector('.video-title');
    const scriptSource = document.querySelector('.script-source');
    const scriptContent = document.querySelector('.script-content p');
    const videoMeta = document.querySelector('.video-meta');
    
    if (videoTitle) {
        videoTitle.textContent = `夏季T恤视频制作_${index}`;
    }
    if (scriptSource) {
        scriptSource.textContent = `脚本来源: ${video.scriptSource}`;
    }
    if (scriptContent) {
        scriptContent.textContent = '夏日清新，轻松搭配。这款T恤采用优质棉质面料，透气舒适，是您夏季出行的完美选择。简约设计，百搭时尚，让您在炎热的夏天也能保持清爽优雅的形象。';
    }
    if (videoMeta) {
        videoMeta.innerHTML = `
            <span>时长: ${video.duration}</span>
            <span>大小: ${video.fileSize}</span>
            <span>格式: MP4</span>
        `;
    }
    
    // 更新左侧列表选中状态
    const videoListItems = document.querySelectorAll('.video-list-item');
    videoListItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // 更新导航按钮状态
    updateNavigationButtons();
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    
    if (prevBtn) {
        prevBtn.disabled = window.currentVideoIndex <= 0;
        prevBtn.style.opacity = window.currentVideoIndex <= 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = window.currentVideoIndex >= window.currentPreviewVideos.length - 1;
        nextBtn.style.opacity = window.currentVideoIndex >= window.currentPreviewVideos.length - 1 ? '0.5' : '1';
    }
}

// 全选/取消全选
function toggleSelectAll(checkbox) {
    const videoCheckboxes = document.querySelectorAll('.video-list-item .video-checkbox input');
    videoCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

// 初始化视频播放器
function initializeVideoPlayer() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    if (videoPlayer) {
        // 添加键盘事件监听
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                switchVideo(window.currentVideoIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                switchVideo(window.currentVideoIndex + 1);
            }
        });
        
        // 更新导航按钮状态
        updateNavigationButtons();
    }
}

function initializeTaskFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            // 过滤任务
            const filter = this.getAttribute('data-filter');
            filterTasks(filter);
        });
    });
}

function filterTasks(filter) {
    const taskItems = document.querySelectorAll('.drawer-task-item');
    taskItems.forEach(item => {
        const status = item.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function viewTask(taskId) {
    console.log('viewTask被调用，taskId:', taskId);
    console.log('taskManager:', window.taskManager);
    console.log('tasks:', window.taskManager ? window.taskManager.tasks : 'undefined');
    
    const task = window.taskManager.tasks.find(t => t.id == taskId);
    console.log('找到的任务:', task);
    
    if (!task) {
        console.error('未找到任务:', taskId);
        showMessage('未找到指定任务', 'error');
        return;
    }
    
    // 关闭任务抽屉
    const taskDrawer = document.getElementById('taskDrawer');
    if (taskDrawer) {
        taskDrawer.classList.remove('show');
        console.log('任务抽屉已关闭');
    }
    
    // 跳转到脚本生成页面（步骤2）
    console.log('准备跳转到步骤2');
    showStep(2);
    
    // 预填充任务相关的脚本内容
    console.log('准备预填充任务数据');
    prefillTaskData(task);
    
    console.log('查看任务:', task);
    showMessage(`已跳转到任务 "${task.title}" 的脚本生成页面`, 'success');
}

// 预填充任务数据到脚本生成页面
function prefillTaskData(task) {
    // 更新商品信息显示
    updateProductInfoForTask(task);
    
    // 更新脚本配置区域
    updateScriptConfiguration(task);
    
    // 生成并显示任务相关的脚本列表
    generateTaskScripts(task);
    
    // 更新页面标题显示当前任务
    updatePageTitle(task);
}

// 更新商品信息显示
function updateProductInfoForTask(task) {
    const productInfo = document.getElementById('productInfo');
    const productName = document.getElementById('productName');
    const productLink = document.getElementById('productLink');
    const productImage = document.getElementById('productImage');
    
    if (productInfo && productName && productLink && productImage) {
        productName.textContent = task.productName || '商品名称';
        productLink.textContent = task.productLink || 'https://detail.vip.com/detail-1710616752-6920810386380828624.html';
        productImage.src = task.productImage || 'https://youke1.picui.cn/s1/2025/08/25/68abcee61f235.png';
        productInfo.style.display = 'block';
    }
    
    // 显示AI商品信息
    const aiProductInfo = document.getElementById('aiProductInfo');
    if (aiProductInfo) {
        aiProductInfo.style.display = 'block';
    }
}

// 生成任务相关的脚本
function generateTaskScripts(task) {
    const scriptList = document.getElementById('scriptList');
    if (!scriptList) return;
    
    // 清空现有脚本
    scriptList.innerHTML = '';
    
    // 根据任务类型生成不同的脚本
    const scripts = generateMockScriptsForTask(task);
    
    scripts.forEach((script, index) => {
        // 根据任务类型确定模型
        const model = getModelForTask(task);
        
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        scriptItem.innerHTML = `
            <div class="script-header">
                <h5>脚本${index + 1}<span class="script-model-tag ${model.toLowerCase()}">${model}</span></h5>
                <span class="script-status">${script.status}</span>
            </div>
            <div class="script-content">
                <p>${script.content}</p>
            </div>
            <div class="script-actions">
                <button class="btn btn-sm btn-outline" onclick="applyScript(this)">直接应用</button>
                <button class="btn btn-sm btn-outline" onclick="editScript(this)">自行修改</button>
                <button class="btn btn-sm btn-outline" onclick="regenerateScript(this)">重新生成</button>
            </div>
        `;
        scriptList.appendChild(scriptItem);
    });
}

// 根据任务类型确定使用的模型
function getModelForTask(task) {
    const modelMapping = {
        '儿童纯棉百搭小清新碎花上衣': 'O1',
        '夏季T恤视频制作': 'R1',
        '时尚连衣裙视频制作': 'O1',
        '连衣裙推广视频': 'O1'
    };
    
    return modelMapping[task.title] || 'O1';
}

// 生成任务相关的mock脚本
function generateMockScriptsForTask(task) {
    const scriptTemplates = {
        '儿童纯棉百搭小清新碎花上衣': [
            {
                content: '这款儿童纯棉上衣采用优质纯棉面料，柔软亲肤，透气不闷热。荷叶领口设计，甜美可爱，适合各种场合穿着。小清新碎花图案，让孩子更加活泼可爱。',
                status: '已完成'
            },
            {
                content: '纯棉材质，亲肤透气，荷叶领口设计，甜美可爱。小清新碎花图案，让孩子更加活泼可爱。适合日常穿着，舒适又时尚。',
                status: '已完成'
            },
            {
                content: '优质纯棉面料，柔软亲肤，透气不闷热。荷叶领口设计，甜美可爱，适合各种场合穿着。小清新碎花图案，让孩子更加活泼可爱。',
                status: '已完成'
            }
        ],
        '夏季T恤视频制作': [
            {
                content: '这款夏季T恤采用优质纯棉面料，柔软亲肤，透气不闷热。简约设计，适合各种场合穿着。',
                status: '已完成'
            },
            {
                content: '纯棉材质，亲肤透气，简约设计，适合各种场合穿着。夏季必备单品，舒适又时尚。',
                status: '已完成'
            }
        ],
        '连衣裙推广视频': [
            {
                content: '这款连衣裙采用优质面料，版型优雅，适合各种场合穿着。简约设计，展现女性魅力。',
                status: '已完成'
            },
            {
                content: '优雅版型，优质面料，适合各种场合穿着。简约设计，展现女性魅力。',
                status: '已完成'
            }
        ]
    };
    
    return scriptTemplates[task.title] || [
        {
            content: '这是一个示例脚本，展示了商品的主要特点和卖点。',
            status: '已完成'
        },
        {
            content: '这是另一个示例脚本，从不同角度介绍商品的优势。',
            status: '已完成'
        }
    ];
}

// 更新页面标题
function updatePageTitle(task) {
    const stepHeader = document.querySelector('#step2 .step-header h3');
    if (stepHeader) {
        stepHeader.textContent = `步骤2：脚本生成 - ${task.title}`;
    }
}

// 查看任务详情（在左侧显示脚本配置）
function viewTaskDetails(taskId) {
    const task = window.taskManager.tasks.find(t => t.id === taskId);
    if (task) {
        // 更新左侧脚本配置区域
        updateScriptConfiguration(task);
        showMessage(`已切换到任务 ${taskId} 的脚本配置`, 'success');
    }
}

// 更新脚本配置区域
function updateScriptConfiguration(task) {
    // 更新商品信息
    const productInfo = document.getElementById('productInfo');
    if (productInfo) {
        productInfo.style.display = 'block';
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.src = task.productImage || 'https://youke1.picui.cn/s1/2025/08/25/68abcee61f235.png';
        }
    }
    
    // 更新脚本配置选项
    updateScriptConfigOptions(task);
    
    // 更新音色选择
    if (task.voice) {
        window.selectedVoiceTone = task.voice;
        const toneDisplay = document.getElementById('selectedTone');
        if (toneDisplay) {
            toneDisplay.textContent = task.voice;
        }
    }
    
    // 更新脚本列表
    updateScriptList(task);
}

// 更新脚本配置选项
function updateScriptConfigOptions(task) {
    // 根据任务类型设置不同的配置选项
    const configOptions = getTaskConfigOptions(task);
    
    // 更新应用场景
    const scenarioRadios = document.querySelectorAll('input[name="scenario"]');
    scenarioRadios.forEach(radio => {
        if (radio.value === configOptions.scenario) {
            radio.checked = true;
        }
    });
    
    // 更新优惠信息
    const discountInput = document.querySelector('.config-input[placeholder="请输入描述内容"]');
    if (discountInput) {
        discountInput.value = configOptions.discount || '';
    }
    
    // 更新脚本风格
    const styleRadios = document.querySelectorAll('input[name="style"]');
    styleRadios.forEach(radio => {
        if (radio.value === configOptions.style) {
            radio.checked = true;
        }
    });
    
    // 更新适用人群
    const audienceInput = document.querySelector('.config-input[placeholder="请输入适用人群"]');
    if (audienceInput) {
        audienceInput.value = configOptions.audience || '';
    }
    
    // 更新字数范围
    const wordCountRadios = document.querySelectorAll('input[name="wordCount"]');
    wordCountRadios.forEach(radio => {
        if (radio.value === configOptions.wordCount) {
            radio.checked = true;
        }
    });
}

// 获取任务配置选项
function getTaskConfigOptions(task) {
    const configTemplates = {
        '儿童纯棉百搭小清新碎花上衣': {
            scenario: 'daily',
            discount: '限时优惠，买二送一',
            style: 'cute',
            audience: '3-8岁儿童',
            wordCount: 'medium'
        },
        '夏季T恤视频制作': {
            scenario: 'daily',
            discount: '夏季特惠，全场8折',
            style: 'casual',
            audience: '18-35岁年轻人',
            wordCount: 'short'
        },
        '连衣裙推广视频': {
            scenario: 'platform',
            discount: '新品上市，限时优惠',
            style: 'elegant',
            audience: '25-40岁女性',
            wordCount: 'long'
        }
    };
    
    return configTemplates[task.title] || {
        scenario: 'daily',
        discount: '',
        style: 'casual',
        audience: '',
        wordCount: 'medium'
    };
}

// 更新脚本列表
function updateScriptList(task) {
    const scriptList = document.getElementById('scriptList');
    if (scriptList) {
        // 清空现有脚本
        scriptList.innerHTML = '';
        
        // 添加当前任务的脚本
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        scriptItem.innerHTML = `
            <div class="script-header">
                <h5>脚本1</h5>
            </div>
            <div class="script-content">
                <p>${task.script || '暂无脚本内容'}</p>
            </div>
            <div class="script-actions">
                <button class="btn btn-sm btn-outline" onclick="applyScript(this, '${task.id}')">直接应用</button>
                <button class="btn btn-sm btn-secondary" onclick="regenerateScript('${task.id}')">重新生成</button>
            </div>
        `;
        scriptList.appendChild(scriptItem);
    }
}

function viewVideo(taskId) {
    const task = window.taskManager.tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'completed') return;
    
    showMessage(`查看视频: ${task.title}`, 'success');
    console.log('查看视频:', task);
}

function downloadVideo(taskId) {
    const task = window.taskManager.tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'completed') return;
    
    showMessage(`开始下载视频: ${task.title}`, 'success');
    console.log('下载视频:', task);
}

function simulateTaskProgress(taskId) {
    const task = window.taskManager.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 静态状态，不进行自动更新
    // 注释掉自动刷新逻辑，保持任务列表稳定
    /*
    const interval = setInterval(() => {
        task.progress += Math.random() * 15 + 5; // 每次增加5-20%
        
        if (task.progress >= 100) {
            task.progress = 100;
            task.status = 'completed';
            clearInterval(interval);
            showMessage(`任务完成: ${task.title}`, 'success');
        }
        
        // 更新显示
        updateTaskCount();
        updateTaskDrawer();
    }, 3000); // 每3秒更新一次
    */
}

// 初始化任务管理
function initializeTaskManagement() {
    // 初始化任务数据
    if (!window.taskManager) {
        window.taskManager = {
            tasks: [],
            nextId: 1
        };
    }
    
    // 更新任务计数
    updateTaskCount();
    
    // 加载示例任务
    loadSampleTasks();
}

// 加载示例任务
function loadSampleTasks() {
    console.log('开始加载示例任务');
    const sampleTasks = [
        {
            id: 'BFKQ77CW-6920689926607786454',
            title: '【Palermo】男女同款经典复古T头德训鞋休闲鞋板鞋-视频制作任务',
            description: 'PUMA Palermo 复古德训鞋视频制作任务',
            status: 'completed',
            progress: 100,
            createdAt: new Date('2026-05-22T17:20:52'),
            updatedAt: new Date('2026-05-22T18:01:29'),
            creator: 'yuri.hu',
            sellingPoints: [demoSellingPointText],
            script: demoScriptText,
            videoCount: 1,
            videos: [
                {
                    thumbnail: mockTaskCoverUrl,
                    duration: '23.07 秒',
                    fileSize: '27.92 MB'
                }
            ],
            subTasks: [
                { id: 'No.1', status: 'completed' }
            ]
        },
        {
            id: 'BGTBBC3K-6920689926607786454',
            title: '【Palermo】男女同款经典复古T头德训鞋休闲鞋板鞋-视频制作任务',
            description: 'PUMA Palermo 爆款脚本复刻视频制作任务',
            status: 'completed',
            progress: 100,
            createdAt: new Date('2026-05-22T11:42:46'),
            updatedAt: new Date('2026-05-22T18:08:41'),
            creator: 'T00048891',
            sellingPoints: [demoSellingPointText],
            script: demoScriptText,
            videoCount: 2,
            videos: [
                {
                    thumbnail: mockTaskCoverUrl,
                    duration: '29.6 秒',
                    fileSize: '36.36 MB'
                },
                {
                    thumbnail: mockTaskCoverUrl,
                    duration: '18.4 秒',
                    fileSize: '22.18 MB'
                }
            ],
            subTasks: [
                { id: 'No.1', status: 'completed' },
                { id: 'No.2', status: 'completed' }
            ]
        },
        {
            id: 'BHHY9ND2-6920810386380828624',
            title: '儿童纯棉百搭小清新碎花上衣-视频制作任务',
            description: '儿童纯棉碎花上衣视频制作任务',
            status: 'completed',
            progress: 100,
            createdAt: new Date('2026-05-23T09:18:12'),
            updatedAt: new Date('2026-05-23T09:42:36'),
            creator: 'david01.chen',
            sellingPoints: [demoSellingPointText],
            script: demoScriptText,
            videoCount: 1,
            videos: [
                {
                    thumbnail: mockTaskCoverUrl,
                    duration: '16.8 秒',
                    fileSize: '19.64 MB'
                }
            ],
            subTasks: [
                { id: 'No.1', status: 'completed' }
            ]
        }
    ];
    
    window.taskManager.tasks = sampleTasks;
    window.taskManager.nextId = 4;
    console.log('示例任务已加载:', window.taskManager.tasks);
    updateTaskDrawer();
}

// 任务搜索功能
function searchTasks() {
    const taskIdSearch = document.getElementById('taskIdSearch').value.trim();
    const taskNameSearch = document.getElementById('taskNameSearch').value.trim();
    
    const filteredTasks = window.taskManager.tasks.filter(task => {
        const matchId = !taskIdSearch || task.id.includes(taskIdSearch);
        const matchName = !taskNameSearch || task.title.includes(taskNameSearch) || task.description.includes(taskNameSearch);
        return matchId && matchName;
    });
    
    updateTaskDrawer(filteredTasks);
    updateTaskCount(filteredTasks.length);
}

// 重置任务搜索
function resetTaskSearch() {
    document.getElementById('taskIdSearch').value = '';
    document.getElementById('taskNameSearch').value = '';
    updateTaskDrawer();
    updateTaskCount(window.taskManager.tasks.length);
}

// 更新任务计数显示
function updateTaskCount(count) {
    const actualCount = typeof count === 'number'
        ? count
        : (window.taskManager?.tasks?.length || 0);
    const taskCountText = document.getElementById('taskCountText');
    if (taskCountText) {
        taskCountText.textContent = `共为您找到 ${actualCount} 个相关的任务`;
    }

    const taskCount = document.getElementById('taskCount');
    if (taskCount && window.taskManager?.tasks) {
        const processingTasks = window.taskManager.tasks.filter(task => task.status === 'processing').length;
        taskCount.textContent = processingTasks;
    }
}

// AI裂变相关函数
function changeRecommendation() {
    const textarea = document.querySelector('.config-textarea');
    const categorySelect = document.getElementById('categorySelect');
    if (!textarea || !categorySelect) return;
    
    const selectedCategory = categorySelect.value;
    const recommendations = getRecommendationsByCategory(selectedCategory);
    
    if (recommendations && recommendations.length > 0) {
        const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
        textarea.value = randomRecommendation;
        showMessage('已更换推荐脚本', 'success');
    } else {
        showMessage('请先选择商品品类', 'warning');
    }
}

// 根据品类获取推荐脚本
function getRecommendationsByCategory(category) {
    const recommendations = {
        'clothing': [
            '给大家推荐一款绝对让你爱不释脚的男鞋——我们的经典百搭男板鞋！这款鞋子采用优质帆布面料，鞋底采用耐磨橡胶材质，不仅舒适透气，而且非常耐穿。无论是搭配牛仔裤还是休闲裤，都能轻松驾驭各种场合。鞋子的设计简约时尚，经典的黑白配色永远不会过时。最重要的是，这款鞋子的性价比超高，绝对是学生党和上班族的首选！',
            '姐妹们看过来！这款连衣裙真的是绝了！时尚设计展现优雅气质，多种颜色可选，百搭款式让你轻松驾驭各种场合。面料柔软亲肤，版型显瘦显高，无论是约会还是上班都能轻松驾驭。最重要的是，这款连衣裙的性价比超高，绝对是衣橱必备单品！',
            '这款T恤真的是太舒服了！采用100%纯棉面料，透气性好，穿着舒适。简约的设计风格，百搭不挑人，无论是搭配牛仔裤还是休闲裤都很好看。多种颜色可选，满足不同搭配需求。绝对是夏季必备单品！'
        ],
        'beauty': [
            '今天给大家推荐一款超级好用的护肤品！这款面霜采用天然植物精华，温和不刺激，适合各种肤质。质地清爽不油腻，吸收快，保湿效果好。使用后肌肤水润有光泽，绝对是护肤必备单品！',
            '这款面膜真的是太神奇了！富含玻尿酸精华，深层补水保湿，使用后肌肤水润有弹性。面膜纸贴合度很好，精华液充足，敷完后面部肌肤明显改善。绝对是护肤必备神器！',
            '这款口红真的是太美了！丝滑质地，显色度高，不易掉色。多种色号可选，满足不同场合需求。无论是日常妆容还是重要场合，都能让你光彩照人！'
        ],
        'digital': [
            '这款手机真的是太棒了！搭载最新处理器，性能强劲，运行流畅。高清摄像头，拍照效果出色，无论是日常拍照还是专业摄影都能满足需求。大容量电池，续航能力强，绝对是换机首选！',
            '这款耳机音质真的是太震撼了！采用最新降噪技术，音质清晰，低音浑厚。佩戴舒适，长时间使用也不会感到不适。无论是听音乐还是通话，都能提供出色的体验！',
            '这款平板电脑真的是太实用了！大屏幕显示效果出色，适合看视频、玩游戏、办公等多种用途。轻薄便携，续航能力强，绝对是工作和娱乐的好帮手！'
        ],
        'food': [
            '这款零食真的是太美味了！采用优质原料制作，口感酥脆，味道浓郁。多种口味可选，满足不同口味需求。独立包装，携带方便，绝对是休闲时光的最佳伴侣！',
            '这款饮料真的是太清爽了！天然果汁制作，无添加剂，健康美味。多种口味可选，满足不同喜好。冰镇后饮用更加爽口，绝对是夏季解暑必备！',
            '这款茶叶真的是太香了！精选优质茶叶，香气浓郁，口感醇厚。多种茶类可选，满足不同口味需求。无论是自己享用还是送礼都是不错的选择！'
        ],
        'home': [
            '这款床上用品真的是太舒适了！采用优质棉质面料，柔软亲肤，透气性好。简约的设计风格，百搭不挑装修风格。多种尺寸可选，满足不同床型需求。绝对是提升睡眠质量的好选择！',
            '这款厨房用品真的是太实用了！采用优质不锈钢材质，耐用不易生锈。设计合理，使用方便，能大大提高烹饪效率。多种规格可选，满足不同需求。绝对是厨房必备神器！',
            '这款收纳用品真的是太方便了！采用环保材质制作，轻便耐用。设计合理，收纳效果好，能让家居环境更加整洁。多种规格可选，满足不同收纳需求。绝对是整理家居的好帮手！'
        ],
        'sports': [
            '这款运动鞋真的是太舒适了！采用专业运动科技，缓震效果好，保护脚部健康。轻便透气，适合各种运动项目。多种颜色可选，满足不同搭配需求。绝对是运动爱好者的首选！',
            '这款运动服装真的是太棒了！采用速干面料，透气性好，运动时不会感到闷热。弹性设计，活动自如，不会束缚身体。多种款式可选，满足不同运动需求。绝对是运动必备装备！',
            '这款健身器材真的是太实用了！设计合理，使用方便，能有效锻炼身体各个部位。材质坚固，安全可靠，适合家庭使用。多种功能可选，满足不同健身需求。绝对是居家健身的好选择！'
        ]
    };
    
    return recommendations[category] || [];
}

// 根据选择的品类更新推荐脚本
function updateRecommendationByCategory() {
    const categorySelect = document.getElementById('categorySelect');
    const textarea = document.querySelector('.config-textarea');
    
    if (!categorySelect || !textarea) return;
    
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
        const recommendations = getRecommendationsByCategory(selectedCategory);
        if (recommendations.length > 0) {
            textarea.value = recommendations[0]; // 默认显示第一个推荐
            showMessage(`已切换到${categorySelect.options[categorySelect.selectedIndex].text}品类推荐`, 'success');
        }
    } else {
        textarea.value = '请先选择商品品类，系统将为您推荐相应的爆款脚本。';
    }
}

function editRecommendation() {
    const textarea = document.querySelector('.config-textarea');
    if (!textarea) return;
    
    // 移除只读属性，允许编辑
    textarea.removeAttribute('readonly');
    textarea.focus();
    
    // 添加保存按钮
    const actions = document.querySelector('.recommendation-actions');
    if (actions && !actions.querySelector('.save-btn')) {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-sm btn-primary save-btn';
        saveBtn.textContent = '保存';
        saveBtn.onclick = saveRecommendation;
        actions.appendChild(saveBtn);
    }
}

function saveRecommendation() {
    const textarea = document.querySelector('.config-textarea');
    if (!textarea) return;
    
    // 恢复只读属性
    textarea.setAttribute('readonly', true);
    
    // 移除保存按钮
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.remove();
    }
    
    showMessage('推荐脚本已保存', 'success');
}

// 跳转到脚本生成页面
function goToScriptGeneration() {
    if (validateProductIdentification()) {
        currentStep = 2;
        updateStepDisplay();
        
        // 隐藏步骤1的下一步按钮
        const step1Actions = document.getElementById('step1Actions');
        if (step1Actions) {
            step1Actions.style.display = 'none';
        }
        
        // 更新商品信息展示
        updateProductInfoDisplay();
        
        showMessage('已跳转到脚本生成页面', 'success');
    }
}

// 提交视频修改
function submitVideoChanges() {
    showMessage('正在提交修改...', 'info');
    
    setTimeout(() => {
        // 关闭视频编辑页面
        closeVideoEditor();
        
        // 创建新的重新生成任务
        const newTask = {
            id: window.taskManager.nextId++,
            title: '视频重新生成任务',
            description: '基于编辑后的配置重新生成视频',
            status: 'processing',
            progress: 0,
            createdAt: new Date(),
            productionMode: window.currentProductionMode === 'automation' ? '批量模式' : '人工模式',
            script: document.getElementById('scriptText')?.value || '',
            sellingPoints: getTaskSellingPoints(window.taskManager?.tasks.find(t => t.id == window.currentEditorTaskId) || {}),
            voice: window.selectedVoiceTone || '甜美女生',
            scriptSource: 'AI脚本',
            videoThumbnail: 'https://youke1.picui.cn/s1/2025/08/25/68abd1330b651.png',
            videoDuration: '15S',
            videoFileSize: '2.5MB',
            subTasks: [
                { id: 'No.1', status: 'processing' },
                { id: 'No.2', status: 'processing' },
                { id: 'No.3', status: 'processing' }
            ]
        };
        
        // 添加到任务列表开头
        window.taskManager.tasks.unshift(newTask);
        
        // 更新任务显示
        updateTaskCount();
        updateTaskDrawer();
        
        // 打开任务抽屉
        openTaskDrawer();
        
        showMessage('视频修改已提交，正在重新生成中...', 'success');
        
        // 模拟任务进度
        simulateTaskProgress(newTask.id);
    }, 1000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 保留前面 initializeTaskManagement() 已加载的示例任务，避免重复初始化时清空任务列表
    if (!window.taskManager) {
        window.taskManager = {
            tasks: [],
            nextId: 1
        };
    }
    
    // 初始化选中的脚本
    window.selectedScripts = [];
    
    // 初始化选中的音色
    window.selectedVoiceTone = '甜美女生';
    
    // 初始化脚本生成方法
    window.currentScriptMethod = 'ai';
    
    // 初始化AI模型选择
    window.currentAIModel = 'O1';
    
    // 初始化预览视频相关
    window.currentPreviewVideos = [];
    window.currentVideoIndex = 0;
    
    // 初始化脚本列表
    initializeScriptList();
    
    // 初始化任务抽屉
    updateTaskDrawer();
    
    // 初始化视频库
    initializeVideoLibrary();
    
    // 初始化侧边栏
    initializeSidebar();
});

// ===== 品类选择器相关函数 =====

// 初始化品类选择器
function initCategorySelector() {
    try {
        console.log('开始初始化品类选择器...');
        
        // 检查AI裂变面板是否可见
        const splitConfig = document.getElementById('splitConfig');
        console.log('splitConfig面板:', splitConfig);
        console.log('splitConfig是否可见:', splitConfig && splitConfig.classList.contains('active'));
        
        if (!splitConfig || !splitConfig.classList.contains('active')) {
            console.warn('AI裂变面板未激活，跳过初始化');
            return;
        }
        
        // 设置默认选择状态
        currentCategorySelection = {
            level1: { key: 'clothing', name: '服装鞋帽' },
            level2: { key: 'women', name: '女装' },
            level3: { key: 'tops', name: '上衣' }
        };
        console.log('已设置默认品类选择:', currentCategorySelection);
        
        // 生成所有级别的选项
        generateCategoryOptions();
        
        // 绑定事件处理器
        bindCategoryEventHandlers();
        
        console.log('品类选择器初始化完成');
    } catch (error) {
        console.error('初始化品类选择器时出错:', error);
    }
}

// 生成所有级别的品类选项
function generateCategoryOptions() {
    // 生成一级品类选项
    const level1Options = document.getElementById('level1Options');
    if (level1Options) {
        level1Options.innerHTML = '';
        Object.keys(categoryData).forEach(key => {
            const category = categoryData[key];
            const option = document.createElement('div');
            option.className = 'category-option';
            option.dataset.value = key;
            option.innerHTML = `
                <span class="category-option-name">${category.name}</span>
                <span class="category-option-count">${Object.keys(category.children).length}个子类</span>
            `;
            option.onclick = () => selectLevel1Category(key, category.name);
            level1Options.appendChild(option);
        });
        console.log('已生成一级品类选项');
    }
    
    // 生成二级品类选项（基于默认选择的一级品类）
    generateLevel2Options(currentCategorySelection.level1.key);
    
    // 生成三级品类选项（基于默认选择的一级和二级品类）
    generateLevel3Options(currentCategorySelection.level1.key, currentCategorySelection.level2.key);
}

// 绑定品类事件处理器
function bindCategoryEventHandlers() {
    const level1Header = document.querySelector('#level1 .category-header');
    if (level1Header) {
        level1Header.onclick = null;
        level1Header.addEventListener('click', function(e) {
            console.log('点击一级品类头部');
            e.preventDefault();
            e.stopPropagation();
            toggleCategoryLevel('level1');
        });
    }
    
    const level2Header = document.querySelector('#level2 .category-header');
    if (level2Header) {
        level2Header.onclick = null;
        level2Header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCategoryLevel('level2');
        });
    }
    
    const level3Header = document.querySelector('#level3 .category-header');
    if (level3Header) {
        level3Header.onclick = null;
        level3Header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCategoryLevel('level3');
        });
    }
    
    console.log('已绑定所有品类事件处理器');
}

// 切换品类级别显示/隐藏
function toggleCategoryLevel(level) {
    console.log('=== toggleCategoryLevel 被调用 ===');
    console.log('切换品类层级:', level);
    
    const levelElement = document.getElementById(level);
    console.log('找到levelElement:', levelElement);
    
    if (!levelElement) {
        console.error('未找到品类层级元素:', level);
        alert('未找到品类层级元素: ' + level);
        return;
    }
    
    const optionsElement = document.getElementById(level + 'Options');
    console.log('找到optionsElement:', optionsElement);
    
    if (!optionsElement) {
        console.error('未找到选项容器:', level + 'Options');
        alert('未找到选项容器: ' + level + 'Options');
        return;
    }
    
    const expandIcon = levelElement.querySelector('.expand-icon');
    console.log('找到expandIcon:', expandIcon);
    
    // 切换显示状态
    const isCurrentlyVisible = optionsElement.style.display === 'block';
    console.log('当前是否可见:', isCurrentlyVisible);
    
    if (isCurrentlyVisible) {
        optionsElement.style.display = 'none';
        if (expandIcon) {
            expandIcon.style.transform = 'rotate(0deg)';
        }
        console.log('已隐藏选项');
    } else {
        optionsElement.style.display = 'block';
        if (expandIcon) {
            expandIcon.style.transform = 'rotate(180deg)';
        }
        console.log('已显示选项，内容:', optionsElement.innerHTML);
        
        // 如果是重新选择上级品类，需要重置下级选择
        if (level === 'level1' && currentCategorySelection.level1) {
            // 重新选择一级品类时，清空二级和三级选择
            currentCategorySelection.level2 = null;
            currentCategorySelection.level3 = null;
            updateCategoryHeader('level2', '请选择二级品类');
            updateCategoryHeader('level3', '请选择三级品类');
            hideCategoryLevel('level2');
            hideCategoryLevel('level3');
        } else if (level === 'level2' && currentCategorySelection.level2) {
            // 重新选择二级品类时，清空三级选择
            currentCategorySelection.level3 = null;
            updateCategoryHeader('level3', '请选择三级品类');
            hideCategoryLevel('level3');
        }
        
        // 更新选择路径显示
        showSelectedCategory();
    }
}

// 选择一级品类
function selectLevel1Category(key, name) {
    console.log('选择一级品类:', key, name);
    
    currentCategorySelection.level1 = { key, name };
    currentCategorySelection.level2 = null; // 重置二级品类选择
    currentCategorySelection.level3 = null; // 重置三级品类选择
    
    updateCategoryHeader('level1', name);
    hideCategoryLevel('level1');
    
    // 重置二级和三级品类头部显示
    updateCategoryHeader('level2', '请选择二级品类');
    updateCategoryHeader('level3', '请选择三级品类');
    
    // 生成二级品类选项
    generateLevel2Options(key);
    showCategoryLevel('level2');
    
    // 隐藏三级品类
    hideCategoryLevel('level3');
    
    showSelectedCategory();
}

// 选择二级品类
function selectLevel2Category(key, name) {
    console.log('选择二级品类:', key, name);
    
    currentCategorySelection.level2 = { key, name };
    currentCategorySelection.level3 = null; // 重置三级品类选择
    
    updateCategoryHeader('level2', name);
    hideCategoryLevel('level2');
    
    // 重置三级品类头部显示
    updateCategoryHeader('level3', '请选择三级品类');
    
    // 生成三级品类选项
    generateLevel3Options(currentCategorySelection.level1.key, key);
    showCategoryLevel('level3');
    
    showSelectedCategory();
}

// 选择三级品类
function selectLevel3Category(key, name) {
    console.log('选择三级品类:', key, name);
    
    currentCategorySelection.level3 = { key, name };
    
    updateCategoryHeader('level3', name);
    hideCategoryLevel('level3');
    
    showSelectedCategory();
}

// 生成二级品类选项
function generateLevel2Options(level1Key) {
    const level2Options = document.getElementById('level2Options');
    if (!level2Options) return;
    
    level2Options.innerHTML = '';
    const level1Data = categoryData[level1Key];
    
    if (level1Data && level1Data.children) {
        Object.keys(level1Data.children).forEach(key => {
            const category = level1Data.children[key];
            const option = document.createElement('div');
            option.className = 'category-option';
            option.dataset.value = key;
            option.innerHTML = `
                <span class="category-option-name">${category.name}</span>
                <span class="category-option-count">${category.children ? Object.keys(category.children).length : 0}个子类</span>
            `;
            option.onclick = () => selectLevel2Category(key, category.name);
            level2Options.appendChild(option);
        });
    }
}

// 生成三级品类选项
function generateLevel3Options(level1Key, level2Key) {
    const level3Options = document.getElementById('level3Options');
    if (!level3Options) return;
    
    level3Options.innerHTML = '';
    const level2Data = categoryData[level1Key]?.children?.[level2Key];
    
    if (level2Data && level2Data.children) {
        Object.keys(level2Data.children).forEach(key => {
            const category = level2Data.children[key];
            const option = document.createElement('div');
            option.className = 'category-option';
            option.dataset.value = key;
            option.innerHTML = `
                <span class="category-option-name">${category.name}</span>
            `;
            option.onclick = () => selectLevel3Category(key, category.name);
            level3Options.appendChild(option);
        });
    }
}

// 更新品类头部显示
function updateCategoryHeader(level, selectedName) {
    const header = document.querySelector(`#${level} .category-placeholder`);
    if (header) {
        header.textContent = selectedName;
        header.style.color = '#333';
    }
}

// 显示品类级别
function showCategoryLevel(level) {
    const levelElement = document.getElementById(level);
    if (levelElement) {
        levelElement.style.display = 'block';
    }
}

// 隐藏品类级别
function hideCategoryLevel(level) {
    const levelElement = document.getElementById(level);
    const optionsElement = document.getElementById(level + 'Options');
    const expandIcon = levelElement?.querySelector('.expand-icon');
    
    if (optionsElement) {
        optionsElement.style.display = 'none';
    }
    if (expandIcon) {
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

// 显示已选择的品类路径
function showSelectedCategory() {
    const selectedCategory = document.getElementById('selectedCategory');
    const selectedPath = document.getElementById('selectedPath');
    
    if (selectedCategory && selectedPath) {
        let path = '';
        if (currentCategorySelection.level1) {
            path += currentCategorySelection.level1.name;
            if (currentCategorySelection.level2) {
                path += ' > ' + currentCategorySelection.level2.name;
                if (currentCategorySelection.level3) {
                    path += ' > ' + currentCategorySelection.level3.name;
                }
            }
        }
        
        selectedPath.textContent = path;
        selectedCategory.style.display = path ? 'flex' : 'none';
    }
}

// 隐藏已选择的品类路径
function hideSelectedCategory() {
    const selectedCategory = document.getElementById('selectedCategory');
    if (selectedCategory) {
        selectedCategory.style.display = 'none';
    }
}

// 清空品类选择
function clearCategorySelection() {
    currentCategorySelection = {
        level1: null,
        level2: null,
        level3: null
    };
    
    // 重置所有头部显示
    updateCategoryHeader('level1', '请选择一级品类');
    updateCategoryHeader('level2', '请选择二级品类');
    updateCategoryHeader('level3', '请选择三级品类');
    
    // 隐藏所有级别
    hideCategoryLevel('level2');
    hideCategoryLevel('level3');
    
    // 隐藏已选择显示
    hideSelectedCategory();
    
    // 重新显示一级品类
    showCategoryLevel('level1');
}

// 获取当前选择的品类路径（用于推荐系统）
function getCurrentCategoryPath() {
    if (currentCategorySelection.level3) {
        return `${currentCategorySelection.level1.key}.${currentCategorySelection.level2.key}.${currentCategorySelection.level3.key}`;
    } else if (currentCategorySelection.level2) {
        return `${currentCategorySelection.level1.key}.${currentCategorySelection.level2.key}`;
    } else if (currentCategorySelection.level1) {
        return currentCategorySelection.level1.key;
    }
    return '';
}

// 更新商品信息展示
function updateProductInfoDisplay() {
    const confirmedProductTitle = document.getElementById('confirmedProductTitle');
    const confirmedSellingPoints = document.getElementById('confirmedSellingPoints');
    
    // Mock 默认数据
    const mockProductInfo = {
        title: '儿童纯棉百搭小清新碎花上衣',
        sellingPoints: ['亲肤柔软', '透气不闷热', '荷叶领口', '纯棉面料']
    };
    
    // 更新商品标题
    if (confirmedProductTitle) {
        confirmedProductTitle.textContent = mockProductInfo.title;
    }
    
    // 更新商品卖点
    if (confirmedSellingPoints) {
        confirmedSellingPoints.innerHTML = '';
        mockProductInfo.sellingPoints.forEach(point => {
            const tag = document.createElement('span');
            tag.className = 'selling-point-tag';
            tag.textContent = point;
            confirmedSellingPoints.appendChild(tag);
        });
    }
}

// 获取确认的商品信息
function getConfirmedProductInfo() {
    // 从第一步中获取选中的爆款方案信息
    const selectedScheme = getSelectedScheme();
    
    if (selectedScheme) {
        return {
            title: selectedScheme.title,
            sellingPoints: selectedScheme.sellingPoints
        };
    }
    
    return null;
}

// 获取选中的爆款方案
function getSelectedScheme() {
    // 查找选中的商品简称标签
    const selectedNameTags = document.querySelectorAll('.name-tag.selected');
    // 查找选中的卖点标签
    const selectedPointTags = document.querySelectorAll('.point-tag.selected');
    
    if (selectedNameTags.length > 0) {
        const title = selectedNameTags[0].textContent.trim();
        const sellingPoints = Array.from(selectedPointTags).map(tag => tag.textContent.trim());
        
        return {
            title: title,
            sellingPoints: sellingPoints
        };
    }
    
    return null;
}

// 更新字数范围显示（当前主要用于记录选择状态）
function updateWordCountDisplay() {
    const wordCountRange = document.getElementById('wordCountRange');
    if (wordCountRange) {
        const selectedValue = wordCountRange.value;
        console.log('选择的字数范围:', selectedValue);
        
        // 可以在这里添加其他逻辑，比如根据字数范围筛选脚本等
        // 目前主要用于记录用户的选择
        window.selectedWordCountRange = selectedValue;
    }
}

// 获取当前选择的字数范围
function getSelectedWordCountRange() {
    const wordCountRange = document.getElementById('wordCountRange');
    return wordCountRange ? wordCountRange.value : '50-75';
}

// ===== 视频编辑页面相关函数 =====

// 选择镜头
function selectShot(segmentNumber) {
    console.log('选择镜头:', segmentNumber);
    
    // 移除所有镜头的选中状态
    const allShots = document.querySelectorAll('.shot-item');
    allShots.forEach(shot => shot.classList.remove('selected'));
    
    // 移除所有脚本句子的高亮状态
    const allSentences = document.querySelectorAll('.script-sentence');
    allSentences.forEach(sentence => sentence.classList.remove('highlighted'));
    
    // 选中当前镜头
    const selectedShot = document.querySelector(`.shot-item[data-segment="${segmentNumber}"]`);
    if (selectedShot) {
        selectedShot.classList.add('selected');
    }
    
    // 高亮对应的脚本句子
    const correspondingSentence = document.querySelector(`.script-sentence[data-segment="${segmentNumber}"]`);
    if (correspondingSentence) {
        correspondingSentence.classList.add('highlighted');
        
        // 滚动到对应的脚本句子
        correspondingSentence.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // 显示选择反馈
    showMessage(`已选择镜头${segmentNumber}`, 'info');
}

// 选择脚本句子（反向选择镜头）
function selectScriptSentence(segmentNumber) {
    console.log('选择脚本句子:', segmentNumber);
    
    // 移除所有状态
    const allShots = document.querySelectorAll('.shot-item');
    const allSentences = document.querySelectorAll('.script-sentence');
    
    allShots.forEach(shot => shot.classList.remove('selected'));
    allSentences.forEach(sentence => sentence.classList.remove('highlighted'));
    
    // 选中对应的镜头和句子
    const selectedShot = document.querySelector(`.shot-item[data-segment="${segmentNumber}"]`);
    const selectedSentence = document.querySelector(`.script-sentence[data-segment="${segmentNumber}"]`);
    
    if (selectedShot) {
        selectedShot.classList.add('selected');
        
        // 滚动到对应的镜头
        selectedShot.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    if (selectedSentence) {
        selectedSentence.classList.add('highlighted');
    }
}

// 初始化视频编辑页面
function initializeVideoEditing() {
    // 为脚本句子添加点击事件
    const scriptSentences = document.querySelectorAll('.script-sentence');
    scriptSentences.forEach(sentence => {
        sentence.addEventListener('click', function() {
            const segmentNumber = this.dataset.segment;
            selectScriptSentence(parseInt(segmentNumber));
        });
    });
    
    console.log('视频编辑页面初始化完成');
}

// 预览视频
function previewVideo() {
    showMessage('正在生成视频预览...', 'info');
    
    setTimeout(() => {
        showMessage('视频预览已准备就绪！', 'success');
        // 这里可以添加实际的预览逻辑
    }, 2000);
}

// 编辑镜头
function editShots() {
    showMessage('镜头编辑功能开发中...', 'info');
    // 这里可以添加镜头编辑的逻辑
}

// 打开视频替换弹窗
function openVideoReplaceModal(segmentIndex) {
    console.log('打开视频替换弹窗，片段索引:', segmentIndex);
    currentReplaceSegmentIndex = segmentIndex;
    const modal = document.getElementById('videoReplaceModal');
    
    if (!modal) {
        console.error('找不到视频替换弹窗元素');
        return;
    }
    
    modal.style.display = 'flex';
    console.log('弹窗已显示');
    
    // 重置状态
    document.getElementById('confirmReplaceBtn').disabled = true;
    selectedMaterial = null;
    newVideoFile = null;
    
    // 初始化素材库
    initializeMaterialLibrary();
    showMessage('视频替换弹窗已打开', 'info');
}

// 关闭视频替换弹窗
function closeVideoReplaceModal() {
    const modal = document.getElementById('videoReplaceModal');
    modal.style.display = 'none';
    currentReplaceSegmentIndex = -1;
    newVideoFile = null;
}

// 初始化视频上传功能
function initializeVideoUpload() {
    const uploadArea = document.getElementById('videoUploadArea');
    const fileInput = document.getElementById('videoFileInput');
    
    // 点击上传区域
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', handleVideoFileSelect);
    
    // 拖拽事件
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleVideoFile(files[0]);
        }
    });
}

// 处理视频文件选择
function handleVideoFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleVideoFile(file);
    }
}

// 处理视频文件
function handleVideoFile(file) {
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
        showMessage('请选择视频文件', 'warning');
        return;
    }
    
    newVideoFile = file;
    
    // 创建视频URL用于预览
    const videoUrl = URL.createObjectURL(file);
    
    // 显示预览区域
    const previewSection = document.getElementById('videoPreviewSection');
    previewSection.style.display = 'block';
    
    // 设置预览视频
    const previewVideo = document.getElementById('newVideoPreview');
    previewVideo.src = videoUrl;
    
    // 更新视频信息
    document.getElementById('newVideoName').textContent = file.name;
    
    // 获取视频时长
    previewVideo.addEventListener('loadedmetadata', () => {
        const duration = previewVideo.duration;
        document.getElementById('newVideoDuration').textContent = `时长: ${duration.toFixed(1)}s`;
    });
    
    // 启用确认按钮
    document.getElementById('confirmReplaceBtn').disabled = false;
    
    showMessage('视频文件已选择，可以预览', 'success');
}

// 确认视频替换
function confirmVideoReplace() {
    if (!selectedMaterial && !newVideoFile || currentReplaceSegmentIndex === -1) {
        showMessage('请先选择要替换的视频文件', 'warning');
        return;
    }
    
    const segments = document.querySelectorAll('.timeline-segment');
    const targetSegment = segments[currentReplaceSegmentIndex];
    const segmentImg = targetSegment.querySelector('.segment-thumb-wrap img');
    const lensNameEl = targetSegment.querySelector('.segment-lens-name');

    if (selectedMaterial) {
        segmentImg.src = selectedMaterial.thumbnail;
        const lensLabel = selectedMaterial.title || selectedMaterial.name || '素材库视频';
        if (lensNameEl) lensNameEl.textContent = lensLabel;
        targetSegment.dataset.lensName = lensLabel;
        targetSegment.title = `${lensLabel} · 单击选择，双击替换视频`;
        showMessage(`片段 ${currentReplaceSegmentIndex + 1} 已替换为「${lensLabel}」`, 'success');
    } else if (newVideoFile) {
        // 使用上传的视频
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 60;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 100, 60);
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('新视频', 50, 35);
        
        segmentImg.src = canvas.toDataURL();
        const uploadLabel = newVideoFile.name ? newVideoFile.name.replace(/\.[^.]+$/, '') : '自定义上传';
        if (lensNameEl) lensNameEl.textContent = uploadLabel;
        targetSegment.dataset.lensName = uploadLabel;
        targetSegment.title = `${uploadLabel} · 单击选择，双击替换视频`;
        showMessage(`片段 ${currentReplaceSegmentIndex + 1} 已替换为「${uploadLabel}」`, 'success');
    }

    closeVideoReplaceModal();
}

// 初始化素材库
function initializeMaterialLibrary() {
    renderMaterialGrid();
    updateMaterialPagination();
}

// 渲染素材网格
function renderMaterialGrid() {
    const materialGrid = document.getElementById('materialGrid');
    const filteredData = getFilteredMaterials();
    const startIndex = (currentMaterialPage - 1) * materialPageSize;
    const endIndex = startIndex + materialPageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    materialGrid.innerHTML = pageData.map(material => `
        <div class="material-item" onclick="selectMaterial(${material.id})">
            <input type="radio" name="materialSelect" value="${material.id}" ${selectedMaterial && selectedMaterial.id === material.id ? 'checked' : ''}>
            <img src="${material.thumbnail}" alt="${material.title}" class="material-thumbnail">
            <div class="material-info">
                <div class="product-name">${material.name}</div>
                <div class="product-title">${material.title}</div>
                <div class="video-duration">视频时长: ${material.duration}</div>
                <div class="video-size">视频大小: ${material.size}</div>
            </div>
        </div>
    `).join('');
}

// 获取过滤后的素材数据
function getFilteredMaterials() {
    if (!materialSearchKeyword) {
        return materialLibraryData;
    }
    return materialLibraryData.filter(material => 
        material.title.toLowerCase().includes(materialSearchKeyword.toLowerCase()) ||
        material.name.toLowerCase().includes(materialSearchKeyword.toLowerCase())
    );
}

// 选择素材
function selectMaterial(materialId) {
    selectedMaterial = materialLibraryData.find(m => m.id === materialId);
    
    // 更新选中状态
    document.querySelectorAll('.material-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 启用确认按钮
    document.getElementById('confirmReplaceBtn').disabled = false;
    
    showMessage('已选择素材', 'success');
}


// 搜索素材（视频替换弹窗内的素材网格）
function searchMaterialGrid() {
    materialSearchKeyword = document.getElementById('materialSearchInput').value;
    currentMaterialPage = 1;
    renderMaterialGrid();
    updateMaterialPagination();
}

// 更新素材分页
function updateMaterialPagination() {
    const filteredData = getFilteredMaterials();
    const totalPages = Math.ceil(filteredData.length / materialPageSize);
    
    document.getElementById('materialCount').textContent = `共${filteredData.length}条`;
    
    // 更新分页按钮
    const pagination = document.querySelector('.library-pagination .pagination');
    const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');
    
    pageButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        btn.textContent = pageNum;
        btn.classList.toggle('active', pageNum === currentMaterialPage);
        btn.style.display = pageNum <= totalPages ? 'block' : 'none';
    });
}

// 切换素材页面
function changeMaterialPage(page) {
    const filteredData = getFilteredMaterials();
    const totalPages = Math.ceil(filteredData.length / materialPageSize);
    
    if (page === 'prev') {
        if (currentMaterialPage > 1) {
            currentMaterialPage--;
        }
    } else if (page === 'next') {
        if (currentMaterialPage < totalPages) {
            currentMaterialPage++;
        }
    } else {
        currentMaterialPage = page;
    }
    
    renderMaterialGrid();
    updateMaterialPagination();
}

// 前往指定页面
function goToMaterialPage() {
    const pageSizeSelect = document.getElementById('materialPageSize');
    materialPageSize = parseInt(pageSizeSelect.value);
    currentMaterialPage = 1;
    renderMaterialGrid();
    updateMaterialPagination();
}

// 打开视频上传弹窗
function openVideoUploadModal() {
    const modal = document.getElementById('videoUploadModal');
    modal.style.display = 'flex';
    
    // 初始化上传功能
    initializeVideoUploadFunction();
}

// 关闭视频上传弹窗
function closeVideoUploadModal() {
    const modal = document.getElementById('videoUploadModal');
    modal.style.display = 'none';
}

// 初始化视频上传功能
function initializeVideoUploadFunction() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // 点击上传区域
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽事件
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

// 处理文件选择
function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

// 处理文件
function handleFiles(files) {
    const uploadList = document.getElementById('uploadList');
    const currentCount = uploadList.children.length;
    
    if (currentCount + files.length > 10) {
        showMessage('最多只能上传10个文件', 'warning');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
            addFileToList(file);
        } else {
            showMessage(`文件 ${file.name} 不是视频格式`, 'warning');
        }
    });
}

// 添加文件到列表
function addFileToList(file) {
    const uploadList = document.getElementById('uploadList');
    const fileItem = document.createElement('div');
    fileItem.className = 'upload-item';
    fileItem.innerHTML = `
        <div class="upload-item-info">
            <i class="fas fa-video upload-item-icon"></i>
            <div>
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-item-size">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button class="upload-item-remove" onclick="removeFile(this)">删除</button>
    `;
    uploadList.appendChild(fileItem);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 删除文件
function removeFile(button) {
    button.closest('.upload-item').remove();
}

// 提交视频上传
function submitVideoUpload() {
    const uploadList = document.getElementById('uploadList');
    const syncToLibrary = document.getElementById('syncToLibrary').checked;
    
    if (uploadList.children.length === 0) {
        showMessage('请选择要上传的文件', 'warning');
        return;
    }
    
    const fileCount = uploadList.children.length;
    const syncText = syncToLibrary ? '并同步至原料库' : '';
    
    showMessage(`正在上传${fileCount}个视频文件${syncText}...`, 'info');
    
    // 模拟上传过程
    setTimeout(() => {
        if (syncToLibrary) {
            showMessage('视频上传成功并已同步至原料库！', 'success');
        } else {
            showMessage('视频上传成功！', 'success');
        }
        
        closeVideoUploadModal();
        
        // 重置表单
        document.getElementById('uploadList').innerHTML = '';
        document.getElementById('syncToLibrary').checked = false;
    }, 2000);
}

// 生成视频
function generateVideo() {
    // 获取视频生成选项
    const enableSubtitles = document.getElementById('enableSubtitles').checked;
    const enableBGM = document.getElementById('enableBGM').checked;
    const enableFlowerText = document.getElementById('enableFlowerText').checked;
    const enableEndBoard = document.getElementById('enableEndBoard').checked;
    
    let message = '正在生成最终视频';
    const options = [];
    
    if (enableSubtitles) options.push('字幕');
    if (enableBGM) options.push('BGM');
    if (enableFlowerText) options.push('四要素');
    if (enableEndBoard) options.push('尾板');
    
    if (options.length > 0) {
        message += `（包含: ${options.join('、')}）`;
    }
    
    showMessage(message + '...', 'info');
    
    setTimeout(() => {
        let successMessage = '视频生成完成';
        if (options.length > 0) {
            successMessage += `（已添加${options.join('、')}）`;
        }
        successMessage += '！';
        showMessage(successMessage, 'success');
        
        // 跳转到下载页面
        currentStep = 4;
        updateStepDisplay();
    }, 3000);
}

// 初始化编辑页预览覆盖层与尾板逻辑
function initializeEditorPreviewOverlays() {
    const subtitleChecked = document.getElementById('enableSubtitles')?.checked;
    const fourChecked = document.getElementById('enableFlowerText')?.checked;
    const subtitleOverlay = document.getElementById('subtitleOverlay');
    const fourOverlay = document.getElementById('fourElementsOverlay');
    if (subtitleOverlay) subtitleOverlay.style.display = subtitleChecked ? 'block' : 'none';
    if (fourOverlay) fourOverlay.style.display = fourChecked ? 'block' : 'none';

    const video = document.getElementById('editorVideoPlayer');
    if (!video) return;

    // 当主视频播放结束，若勾选尾板，则切换到尾板视频并循环播放
    video.onended = () => {
        const enableEndBoard = document.getElementById('enableEndBoard')?.checked;
        if (!enableEndBoard) return;
        const tailUrl = 'https://12131231-1302391623.cos.ap-beijing.myqcloud.com/%E5%B0%BE%E6%9D%BF%E8%A7%86%E9%A2%91.mp4';
        if (video.currentSrc !== tailUrl) {
            video.src = tailUrl;
            video.loop = true;
            video.play().catch(() => {});
        }
    };
}

// 处理视频生成选项变化
function handleVideoOptionChange(optionName, isEnabled) {
    const optionNames = {
        'enableSubtitles': '字幕',
        'enableBGM': 'BGM',
        'enableFlowerText': '四要素',
        'enableEndBoard': '尾板'
    };
    
    const status = isEnabled ? '已启用' : '已禁用';
    const optionText = optionNames[optionName] || optionName;
    
    showMessage(`${optionText}${status}`, 'info');

    // 同步预览覆盖层显示/隐藏
    if (optionName === 'enableSubtitles') {
        const el = document.getElementById('subtitleOverlay');
        if (el) el.style.display = isEnabled ? 'block' : 'none';
    }
    if (optionName === 'enableFlowerText') {
        const el = document.getElementById('fourElementsOverlay');
        if (el) el.style.display = isEnabled ? 'block' : 'none';
    }
}

// 处理脚本生成页面的视频选项变化
function handleScriptVideoOptionChange(optionName, isEnabled) {
    const optionNames = {
        'scriptEnableSubtitles': '字幕',
        'scriptEnableBGM': 'BGM',
        'scriptEnableFlowerText': '四要素',
        'scriptEnableEndBoard': '尾板'
    };
    
    const status = isEnabled ? '已启用' : '已禁用';
    const optionText = optionNames[optionName] || optionName;
    
    showMessage(`脚本生成${optionText}${status}`, 'info');
}

// 根据字数范围获取脚本模板
function getScriptTemplatesByWordCount(wordCountRange) {
    const templates = {
        '50-75': [
            '大家好，今天给大家推荐一款超美的连衣裙！这款时尚连衣裙2024新款，采用优质面料制作，舒适透气，让你在春夏季节也能美美哒~',
            '姐妹们看过来！这款连衣裙真的是绝了！时尚设计展现优雅气质，多种颜色可选，百搭款式让你轻松驾驭各种场合~',
            '今天给大家分享一款超级好穿的连衣裙，面料柔软亲肤，版型显瘦显高，无论是约会还是上班都能轻松驾驭~'
        ],
        '75-150': [
            '大家好，今天给大家推荐一款超美的儿童连衣裙！这款小清新碎花上衣采用100%纯棉面料制作，亲肤柔软透气不闷热，特别适合活泼好动的小朋友。荷叶领口设计甜美可爱，碎花图案时尚百搭，无论是日常穿搭还是聚会场合都能轻松驾驭。妈妈们快来给宝贝选购吧！',
            '姐妹们看过来！这款儿童连衣裙真的是绝了！采用优质纯棉面料，手感柔软舒适，透气性超好，宝宝穿着不会闷热。荷叶领口设计增添甜美气息，小碎花图案清新可爱，版型宽松舒适不束缚，让孩子自由活动。这样的好衣服，妈妈们一定不要错过哦！',
            '今天给大家分享一款超级好穿的儿童上衣，面料选用优质纯棉，亲肤柔软透气，宝宝穿着舒适不过敏。荷叶领口设计时尚甜美，碎花图案清新自然，无论搭配裤子还是裙子都很好看。这款上衣质量超棒，性价比很高，强烈推荐给各位妈妈！'
        ],
        '150-300': [
            '大家好，今天给大家推荐一款超美的儿童纯棉碎花上衣！作为一个有着多年育儿经验的妈妈，我深知给孩子选择衣服的重要性。这款上衣采用100%优质纯棉面料制作，经过精心挑选的棉花纤维，手感柔软细腻，透气性极佳，即使在炎热的夏天，宝宝穿着也不会感到闷热不适。荷叶领口的设计非常贴心，不仅增添了甜美可爱的气息，还能很好地修饰宝宝的脸型。小碎花图案清新自然，颜色搭配和谐，无论是搭配牛仔裤还是小裙子都非常好看。版型设计宽松舒适，不会束缚孩子的活动，让他们可以自由奔跑玩耍。这款上衣质量过硬，做工精细，性价比超高，真的是妈妈们的不二选择！',
            '姐妹们，今天必须给大家安利这款儿童纯棉上衣！我家宝宝已经穿了好几个月了，真的是越穿越喜欢。首先说说面料，这款上衣采用的是高品质纯棉材质，我特意摸过很多品牌的童装，这个手感真的是数一数二的。棉质柔软亲肤，透气性超好，我家孩子皮肤比较敏感，穿这个完全没有过敏反应。荷叶领口的设计真的太可爱了，显得宝宝特别精神，而且这个领口不会勒脖子，孩子穿着很舒服。碎花图案的选择也很用心，不会过于花哨，但又不失童趣，搭配性很强。我给孩子配过很多下装，都很好看。最重要的是，这个价格真的很实惠，质量这么好的衣服，价格却很亲民，性价比绝对没话说！',
            '各位宝妈们，今天要给大家推荐一款我觉得特别值得入手的儿童上衣！这款纯棉碎花上衣从面料到设计都让我非常满意。面料方面，选用的是优质纯棉，我专门查过这个品牌的面料来源，都是经过严格筛选的天然棉花，无添加化学物质，对孩子的皮肤非常友好。透气性也很好，我家孩子比较活泼，经常跑来跑去，穿这个上衣从来不会出现闷热的情况。设计方面，荷叶领口真的很有特色，既优雅又可爱，而且这个领口的处理很细致，边缘都做了特殊处理，不会刮到孩子的皮肤。碎花图案的配色也很考究，既有童真的感觉，又不会显得过于幼稚，随着孩子长大也不会过时。版型设计考虑到了孩子的成长需要，宽松但不臃肿，既舒适又美观。'
        ],
        '300+': [
            '大家好，今天我要给各位宝妈们详细介绍一款真正值得信赖的儿童纯棉上衣！作为一个有着十年育儿经验的妈妈，我对童装的要求可以说是非常严格的。这款儿童纯棉百搭小清新碎花上衣，从我第一眼看到就被它的品质所吸引。首先，让我们来谈谈面料。这款上衣采用的是100%优质长绒棉，这种棉花的纤维更长更细腻，制作出来的面料不仅手感柔软如丝，而且透气性能极佳。我特意做过对比测试，将这件衣服和其他品牌的童装放在一起，无论是柔软度还是透气性，这款都明显胜出。更重要的是，这种纯棉面料经过了严格的安全检测，不含任何有害化学物质，完全符合婴幼儿纺织品安全标准，即使是最敏感的宝宝皮肤也能安心穿着。再来说说设计细节。荷叶领口的设计真的是这款上衣的点睛之笔，不仅增添了甜美可爱的气息，还能很好地修饰宝宝的脸型，让孩子看起来更加精神可爱。这个领口的制作工艺也很考究，采用了特殊的滚边技术，确保边缘平整不起毛，不会刮伤孩子娇嫩的皮肤。碎花图案的选择更是经过了精心设计，颜色搭配和谐自然，既有童真的味道，又不失时尚感，无论搭配什么下装都能展现出不同的风格。版型设计方面，这款上衣充分考虑了儿童的生长发育特点，采用宽松舒适的剪裁，既不会束缚孩子的活动，又能很好地展现出孩子的可爱身形。袖口和下摆的处理也很到位，松紧适中，既保证了穿着的舒适度，又能有效防止变形。在做工方面，每一个细节都体现出了匠心品质，走线平整，缝合牢固，经得起孩子日常的活动和多次洗涤。最后说说性价比，这样高品质的童装，价格却非常亲民，真的是每个家庭都能承受的范围。我真心推荐给每一位关爱孩子的妈妈，相信你们的宝贝穿上这款上衣，一定会更加可爱迷人！',
            '各位宝妈们，今天我要跟大家分享一个真正的好物发现！这款儿童纯棉碎花上衣绝对是我今年买过最满意的童装之一。作为一个对孩子穿着要求极高的妈妈，我在选择童装时总是格外谨慎，不仅要考虑美观，更要注重安全和舒适。这款上衣在各个方面都让我非常满意，今天就来详细给大家介绍一下。首先是面料品质，这款上衣使用的是精选优质纯棉，我专门了解过这个品牌的供应链，他们的棉花都来自于世界知名的优质产区，经过严格的筛选和处理。这种纯棉面料的特点是纤维长度适中，柔软度极高，同时具有优异的吸湿透气性能。我做过实际测试，在同样的环境下，孩子穿这件衣服比穿其他品牌的衣服明显感觉更加干爽舒适。而且这种面料经过了多重安全检测，完全符合国际婴幼儿纺织品安全标准，不含甲醛、重金属等有害物质，家长们可以完全放心。设计方面，荷叶领口的创意真的让人眼前一亮。这个设计不仅仅是为了美观，更多的是考虑到了实用性。荷叶边的设计能够很好地修饰孩子的脸型，让宝宝看起来更加精神可爱。同时，这个领口的开合设计也很人性化，既方便穿脱，又不会过于宽松导致走光。碎花图案的选择更是体现了设计师的用心，采用了清新自然的色彩搭配，既符合儿童活泼可爱的天性，又不会过于花哨显得俗气。这种图案的搭配性很强，无论是配牛仔裤、休闲裤还是小裙子都能展现出不同的风格。在版型设计上，这款上衣充分考虑了儿童的身体特点和活动需求。采用了适度宽松的剪裁，既保证了穿着的舒适度，又不会显得过于臃肿。袖子的长度设计得恰到好处，既能保护孩子的手臂，又不会影响日常活动。下摆的设计也很贴心，长度适中，既能很好地搭配各种下装，又能保证孩子在活动时不会走光。做工品质方面，这款上衣的每一个细节都体现出了精工细作的品质。所有的缝线都非常平整牢固，经得起孩子日常的各种活动。特别是容易磨损的部位，如领口、袖口等地方，都做了特殊的加固处理，大大延长了衣服的使用寿命。最让我满意的是这款上衣的性价比，如此高品质的童装，价格却非常合理，真正做到了物超所值。我已经为我家宝宝购买了多件不同颜色的，准备作为日常的主要搭配。强烈推荐给所有注重品质的宝妈们！'
        ]
    };
    
    return templates[wordCountRange] || templates['50-75'];
}

// ===== 批量模式相关函数 =====

const AUTOMATION_DEFAULT_SCRIPT_COUNT = 3;

function initializeAutomationMode() {
    if (!window.automationState) {
        window.automationState = {
            batchNo: 0,
            jobs: [],
            selectedJobId: null,
            productRowSeq: 0
        };
    }
    initAutomationProductForm();
    renderAutomationDashboard();
}

function initAutomationProductForm() {
    const container = document.getElementById('automationProductRows');
    if (!container) return;

    if (!container.children.length) {
        addAutomationProductRow();
    }
    updateAutomationInputHint();
}

function addAutomationProductRow(productId = '', scripts = null) {
    const container = document.getElementById('automationProductRows');
    if (!container) return;

    window.automationState = window.automationState || { productRowSeq: 0 };
    const rowId = ++window.automationState.productRowSeq;
    const row = document.createElement('div');
    row.className = 'automation-product-row';
    row.dataset.rowId = String(rowId);

    const scriptValues = Array.isArray(scripts) && scripts.length
        ? scripts
        : Array.from({ length: AUTOMATION_DEFAULT_SCRIPT_COUNT }, (_, i) => (i === 0 ? demoScriptText : ''));

    row.innerHTML = `
        <div class="automation-product-row-header">
            <div class="field-grow">
                <label>商品 ID</label>
                <div class="automation-product-id-row">
                    <input type="text" class="automation-product-id-input" placeholder="请输入商品 ID" value="${escapeAttribute(productId)}">
                    <button type="button" class="btn btn-outline btn-sm automation-ai-generate-btn" onclick="generateAutomationScriptsForRow(this)">
                        <i class="fas fa-wand-magic-sparkles"></i>
                        AI脚本生成
                    </button>
                </div>
            </div>
            <button type="button" class="automation-product-remove" title="删除该商品" onclick="removeAutomationProductRow(this)">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="automation-scripts-block">
            <div class="automation-scripts-header">
                <label>脚本文案（${scriptValues.length} 条，可继续添加）</label>
            </div>
            <p class="automation-scripts-tip">AI 生成条数与下方输入框数量一致；生成后可自行修改，或单条点击「重新生成」。</p>
            <div class="automation-script-list"></div>
            <button type="button" class="automation-add-script-btn" onclick="addAutomationScriptField(this)">
                <i class="fas fa-plus"></i>
                添加脚本
            </button>
        </div>
    `;

    const scriptList = row.querySelector('.automation-script-list');
    scriptValues.forEach((text, index) => {
        scriptList.appendChild(createAutomationScriptFieldElement(text, index + 1));
    });

    container.appendChild(row);
    bindAutomationFormEvents(row);
    updateAutomationInputHint();
}

function createAutomationScriptFieldElement(value = '', index = 1) {
    const item = document.createElement('div');
    item.className = 'automation-script-item';
    item.innerHTML = `
        <span class="automation-script-index">脚本 ${index}</span>
        <div class="automation-script-editor-wrap">
            <textarea class="automation-script-input" placeholder="请输入该条视频脚本文案，或使用 AI 脚本生成">${escapeHtml(value)}</textarea>
            <div class="automation-script-item-actions">
                <button type="button" class="btn btn-outline btn-sm" onclick="regenerateAutomationScriptField(this)">重新生成</button>
            </div>
        </div>
        <button type="button" class="automation-script-remove" title="删除脚本" onclick="removeAutomationScriptField(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    return item;
}

function getAutomationAiScripts(productId, count) {
    const shortId = productId ? productId.slice(-6) : '商品';
    const templates = [
        demoScriptText,
        `跑步想要轻松，这双运动鞋千万要码住。唯品会大牌好货每天3折疯抢，商品ID ${shortId} 同款3.5折起，新用户可领至高25元券。双层中底护膝，网眼透气，点击链接赶紧下单吧`,
        `姐妹们注意了，${shortId} 这款跑鞋正在唯品会疯抢！中底减震落地稳，日常慢跑不闷脚，叠加新人券更划算，喜欢跑步的别错过。`,
        `每天慢跑的姐妹看过来，这双鞋真的舒服。唯品会3折起，双层中底消化冲击，网眼排气孔透气，现在下单还有优惠券，链接在下面。`,
        `这双运动鞋我穿了一周真的推荐：护膝、透气、脚感稳。唯品会限时特惠，新用户领券再减，商品 ${shortId} 同款链接已放好。`
    ];

    return Array.from({ length: Math.max(1, count) }, (_, index) => templates[index % templates.length]);
}

function generateAutomationScriptsForRow(triggerBtn) {
    const row = triggerBtn?.closest('.automation-product-row');
    if (!row) return;

    const productId = row.querySelector('.automation-product-id-input')?.value.trim();
    if (!productId) {
        showMessage('请先填写商品 ID，再使用 AI 脚本生成', 'warning');
        return;
    }

    const inputs = [...row.querySelectorAll('.automation-script-input')];
    if (!inputs.length) {
        showMessage('请先添加至少 1 个脚本输入框', 'warning');
        return;
    }

    const btn = triggerBtn;
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
    showMessage(`正在为商品 ${productId} 生成 ${inputs.length} 条 AI 脚本...`, 'info');

    setTimeout(() => {
        const scripts = getAutomationAiScripts(productId, inputs.length);
        inputs.forEach((input, index) => {
            input.value = scripts[index] || demoScriptText;
            input.dataset.aiGenerated = '1';
        });

        btn.disabled = false;
        btn.innerHTML = originalHtml;
        showMessage(`已生成 ${inputs.length} 条 AI 脚本，可继续编辑或单条重新生成`, 'success');
        updateAutomationInputHint();
    }, 1200);
}

function regenerateAutomationScriptField(triggerBtn) {
    const row = triggerBtn?.closest('.automation-product-row');
    const item = triggerBtn?.closest('.automation-script-item');
    const input = item?.querySelector('.automation-script-input');
    if (!row || !input) return;

    const productId = row.querySelector('.automation-product-id-input')?.value.trim();
    if (!productId) {
        showMessage('请先填写商品 ID', 'warning');
        return;
    }

    const inputs = [...row.querySelectorAll('.automation-script-input')];
    const scriptIndex = inputs.indexOf(input);
    const btn = triggerBtn;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '生成中...';

    setTimeout(() => {
        const pool = getAutomationAiScripts(productId, Math.max(inputs.length, scriptIndex + 3));
        input.value = pool[(scriptIndex + 1) % pool.length] || demoScriptText;
        input.dataset.aiGenerated = '1';
        btn.disabled = false;
        btn.textContent = originalText;
        showMessage(`脚本 ${scriptIndex + 1} 已重新生成`, 'success');
        updateAutomationInputHint();
    }, 800);
}

function addAutomationScriptField(triggerBtn) {
    const row = triggerBtn?.closest('.automation-product-row');
    if (!row) return;

    const scriptList = row.querySelector('.automation-script-list');
    if (!scriptList) return;

    const index = scriptList.children.length + 1;
    scriptList.appendChild(createAutomationScriptFieldElement('', index));
    refreshAutomationScriptIndexes(row);
    updateAutomationInputHint();
}

function removeAutomationScriptField(triggerBtn) {
    const row = triggerBtn?.closest('.automation-product-row');
    const scriptList = row?.querySelector('.automation-script-list');
    if (!scriptList) return;

    if (scriptList.children.length <= 1) {
        showMessage('每个商品至少保留 1 条脚本', 'warning');
        return;
    }

    triggerBtn.closest('.automation-script-item')?.remove();
    refreshAutomationScriptIndexes(row);
    updateAutomationInputHint();
}

function removeAutomationProductRow(triggerBtn) {
    const container = document.getElementById('automationProductRows');
    const rows = container?.querySelectorAll('.automation-product-row') || [];
    if (rows.length <= 1) {
        showMessage('至少保留 1 个商品配置', 'warning');
        return;
    }

    triggerBtn?.closest('.automation-product-row')?.remove();
    updateAutomationInputHint();
}

function refreshAutomationScriptIndexes(row) {
    const scriptItems = row.querySelectorAll('.automation-script-item');
    scriptItems.forEach((item, index) => {
        const label = item.querySelector('.automation-script-index');
        if (label) label.textContent = `脚本 ${index + 1}`;
    });

    const headerLabel = row.querySelector('.automation-scripts-header > label');
    if (headerLabel) {
        headerLabel.textContent = `脚本文案（${scriptItems.length} 条，可继续添加）`;
    }
}

function bindAutomationFormEvents(scope = document) {
    scope.querySelectorAll('.automation-product-id-input, .automation-script-input').forEach(el => {
        if (el.dataset.bound === '1') return;
        el.dataset.bound = '1';
        el.addEventListener('input', updateAutomationInputHint);
    });
}

function triggerAutomationExcelUpload() {
    const input = document.getElementById('automationExcelInput');
    if (!input) return;
    input.value = '';
    input.click();
}

function normalizeExcelHeaderCell(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/_/g, '');
}

function parseAutomationExcelSheet(rows) {
    if (!Array.isArray(rows) || !rows.length) return [];

    const normalizedRows = rows
        .map(row => (Array.isArray(row) ? row : Object.values(row)).map(cell => String(cell ?? '').trim()))
        .filter(row => row.some(cell => cell));

    if (!normalizedRows.length) return [];

    const header = normalizedRows[0].map(normalizeExcelHeaderCell);
    const hasHeader = header.some(cell => cell.includes('商品id') || cell === 'id' || cell.includes('productid'))
        && header.some(cell => cell.includes('脚本') || cell.includes('script') || cell.includes('文案'));

    let startIndex = 0;
    let idCol = 0;
    let scriptCol = 1;

    if (hasHeader) {
        startIndex = 1;
        const idIndex = header.findIndex(cell => cell.includes('商品id') || cell === 'id' || cell.includes('productid'));
        const scriptIndex = header.findIndex(cell => cell.includes('脚本') || cell.includes('script') || cell.includes('文案'));
        idCol = idIndex >= 0 ? idIndex : 0;
        scriptCol = scriptIndex >= 0 ? scriptIndex : (idCol === 0 ? 1 : 0);
    }

    const grouped = new Map();
    normalizedRows.slice(startIndex).forEach(row => {
        const productId = String(row[idCol] ?? '').trim();
        const script = String(row[scriptCol] ?? '').trim();
        if (!productId || !script) return;

        if (!grouped.has(productId)) {
            grouped.set(productId, []);
        }
        grouped.get(productId).push(script);
    });

    return [...grouped.entries()].map(([productId, scripts]) => ({ productId, scripts }));
}

function applyAutomationExcelConfig(items) {
    const container = document.getElementById('automationProductRows');
    if (!container) return;

    container.innerHTML = '';
    items.forEach(({ productId, scripts }) => {
        addAutomationProductRow(productId, scripts);
    });
    updateAutomationInputHint();
}

function handleAutomationExcelUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        showMessage('Excel 解析组件未加载，请刷新页面后重试', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        try {
            const data = new Uint8Array(loadEvent.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            const items = parseAutomationExcelSheet(rows);

            if (!items.length) {
                showMessage('未识别到有效数据，请确认 Excel 包含「商品ID」「脚本」两列', 'warning');
                return;
            }

            applyAutomationExcelConfig(items);
            const scriptCount = items.reduce((sum, item) => sum + item.scripts.length, 0);
            showMessage(`已从 Excel 导入 ${items.length} 个商品，共 ${scriptCount} 条脚本`, 'success');
        } catch (error) {
            console.error('Excel parse failed:', error);
            showMessage('Excel 解析失败，请使用与模板一致的两列结构', 'error');
        } finally {
            event.target.value = '';
        }
    };

    reader.onerror = () => {
        showMessage('Excel 文件读取失败', 'error');
        event.target.value = '';
    };

    reader.readAsArrayBuffer(file);
}

function collectAutomationBatchItems() {
    const rows = document.querySelectorAll('#automationProductRows .automation-product-row');
    const items = [];

    rows.forEach(row => {
        const productId = row.querySelector('.automation-product-id-input')?.value.trim();
        if (!productId) return;

        const scripts = [...row.querySelectorAll('.automation-script-input')]
            .map(el => el.value.trim())
            .filter(Boolean);

        if (scripts.length) {
            items.push({ productId, scripts });
        }
    });

    return items;
}

function switchProductionMode(mode) {
    const manualMode = document.getElementById('manualProductionMode');
    const automationMode = document.getElementById('automationProductionMode');
    const manualTab = document.getElementById('manualModeTab');
    const automationTab = document.getElementById('automationModeTab');

    if (!manualMode || !automationMode || !manualTab || !automationTab) return;

    const isAutomation = mode === 'automation';
    window.currentProductionMode = isAutomation ? 'automation' : 'manual';
    manualMode.style.display = isAutomation ? 'none' : 'block';
    automationMode.style.display = isAutomation ? 'flex' : 'none';
    
    [manualTab, automationTab].forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    const activeTab = isAutomation ? automationTab : manualTab;
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');

    if (isAutomation) {
        initAutomationProductForm();
    }

    showMessage(isAutomation ? '已切换到批量模式' : '已切换到人工模式', 'info');
}

function getAutomationStrategy() {
    return {
        model: '后端自动选择',
        goal: '基于人工前置脚本执行视频生产',
        enableSubtitles: Boolean(document.getElementById('automationSubtitles')?.checked),
        enableBGM: Boolean(document.getElementById('automationBGM')?.checked),
        enableFlowerText: Boolean(document.getElementById('automationFlowerText')?.checked),
        enableEndBoard: Boolean(document.getElementById('automationEndBoard')?.checked)
    };
}

function startAutomationBatch() {
    const batchItems = collectAutomationBatchItems();
    const rows = document.querySelectorAll('#automationProductRows .automation-product-row');

    if (!rows.length) {
        showMessage('请先添加商品配置', 'warning');
        return;
    }

    const missingIdRows = [...rows].filter(row => !row.querySelector('.automation-product-id-input')?.value.trim());
    if (missingIdRows.length) {
        showMessage('请为每个商品填写商品 ID', 'warning');
        return;
    }

    if (!batchItems.length) {
        showMessage('每个商品至少填写 1 条有效脚本文案', 'warning');
        return;
    }

    const strategy = getAutomationStrategy();
    window.automationState.batchNo += 1;
    window.automationState.selectedJobId = null;
    window.automationState.jobs = batchItems.map((item, index) => createAutomationJob(item.productId, index, strategy, item.scripts));

    renderAutomationDashboard();
    const createdTasks = createTaskManagerTasksFromAutomationJobs(window.automationState.jobs);
    updateTaskCount(window.taskManager.tasks.length);
    openTaskDrawer(createdTasks);

    const totalVideos = batchItems.reduce((sum, item) => sum + item.scripts.length, 0);
    createdTasks.forEach(finalizeAutomationTask);
    window.automationState.jobs.forEach(job => {
        job.status = 'review';
        job.stage = '待审核';
        job.progress = 100;
    });

    updateAutomationBatchTaskDrawer();
    updateTaskCount(window.taskManager.tasks.length);
    showMessage(`已提交：${createdTasks.length} 个商品任务，共 ${totalVideos} 条视频已完成`, 'success');
}

function createAutomationJob(productId, index, strategy, scripts = []) {
    const productSamples = [
        {
            title: '儿童纯棉百搭小清新碎花上衣',
            shortName: '儿童纯棉碎花上衣',
            category: '服装鞋帽 > 女装 > 上衣',
            sellingPoints: ['柔软亲肤', '透气不闷热', '荷叶领口', '纯棉面料'],
            voice: '甜美女生'
        },
        {
            title: '夏季轻薄百搭短袖 T 恤',
            shortName: '夏季轻薄短袖T恤',
            category: '服装鞋帽 > 男装 > T恤',
            sellingPoints: ['轻薄透气', '百搭不挑人', '不易变形', '亲肤棉感'],
            voice: '活力女声'
        },
        {
            title: '赫本风气质波点连衣裙',
            shortName: '赫本风波点裙',
            category: '服装鞋帽 > 女装 > 连衣裙',
            sellingPoints: ['显瘦版型', '复古波点', '通勤约会皆可', '垂感面料'],
            voice: '甜美女生'
        },
        {
            title: '高保湿修护精华面霜',
            shortName: '修护保湿面霜',
            category: '美妆护肤 > 护肤 > 面霜',
            sellingPoints: ['长效保湿', '修护屏障', '清爽不黏腻', '敏感肌友好'],
            voice: '温柔女声'
        }
    ];
    const sample = productSamples[index % productSamples.length];
    const confirmedScripts = (scripts || []).filter(Boolean);
    const scriptList = confirmedScripts.length ? confirmedScripts : [demoScriptText];
    const options = {
        subtitles: strategy.enableSubtitles,
        bgm: strategy.enableBGM,
        flowerText: strategy.enableFlowerText,
        endBoard: strategy.enableEndBoard
    };

    return {
        id: `auto-${Date.now()}-${index}`,
        productId,
        title: sample.title,
        shortName: sample.shortName,
        category: sample.category,
        status: 'processing',
        stage: '商品识别中',
        progress: 8,
        confidence: Math.min(98, 86 + index * 3),
        thumbnail: getAutomationThumbnail(index),
        createdAt: new Date(),
        strategy,
        modelConfig: {
            sellingPoints: [demoSellingPointText],
            scripts: scriptList,
            script: scriptList[0],
            voice: sample.voice,
            options
        },
        reviewConfig: {
            sellingPoints: [demoSellingPointText],
            scripts: [...scriptList],
            script: scriptList[0],
            voice: sample.voice,
            options: { ...options }
        },
        modifiedFields: [],
        reviewer: 'david01.chen'
    };
}

function createTaskManagerTasksFromAutomationJobs(jobs) {
    if (!window.taskManager) {
        window.taskManager = { tasks: [], nextId: 1 };
    }

    const createdTasks = jobs.map((job) => {
        const taskId = window.taskManager.nextId || Date.now();
        window.taskManager.nextId = taskId + 1;
        const scripts = job.modelConfig.scripts || [job.modelConfig.script].filter(Boolean);
        const videoCount = scripts.length;

        const task = {
            id: taskId,
            title: `商品 ${job.productId}`,
            description: `商品ID：${job.productId}，共 ${videoCount} 条脚本`,
            status: 'completed',
            stage: '任务成功',
            progress: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            productionMode: '批量模式',
            script: scripts[0],
            scripts,
            voice: job.modelConfig.voice,
            sellingPoints: [...job.modelConfig.sellingPoints],
            scriptSource: '人工前置脚本',
            productId: job.productId,
            videoCount,
            videos: createTaskVideoSlotsFromScripts(scripts, 'completed', 100),
            videoThumbnail: job.thumbnail,
            videoDuration: '15S',
            videoFileSize: '2.8MB',
            automationOptions: job.modelConfig.options,
            subTasks: [
                { id: '商品识别', status: 'completed' },
                { id: '参数配置', status: 'completed' },
                { id: '视频生产', status: 'completed' }
            ]
        };
        return task;
    });

    window.taskManager.tasks.unshift(...createdTasks);
    return createdTasks;
}

function simulateAutomationTaskProgress(taskId, index) {
    const stages = [
        { stage: '商品识别中', progress: 20, subTasks: ['processing', 'processing', 'processing'] },
        { stage: '脚本校验与参数配置中', progress: 45, subTasks: ['completed', 'processing', 'processing'] },
        { stage: '音色与素材匹配中', progress: 68, subTasks: ['completed', 'completed', 'processing'] },
        { stage: '视频生产中', progress: 88, subTasks: ['completed', 'completed', 'processing'] },
        { stage: '待审核', progress: 100, status: 'completed', subTasks: ['completed', 'completed', 'completed'] }
    ];

    stages.forEach((stage, stageIndex) => {
        setTimeout(() => {
            const task = window.taskManager?.tasks.find(item => item.id === taskId);
            if (!task || task.status !== 'processing') return;

            task.stage = stage.stage;
            task.progress = stage.progress;
            task.updatedAt = new Date();
            updateAutomationTaskVideos(task, stage);
            if (stage.status) task.status = stage.status;
            if (task.subTasks && stage.subTasks) {
                task.subTasks.forEach((subTask, subTaskIndex) => {
                    subTask.status = stage.subTasks[subTaskIndex] || subTask.status;
                });
            }

            updateAutomationBatchTaskDrawer();
            updateTaskCount(window.taskManager.tasks.length);

            if (stage.status === 'completed') {
                showMessage(`${task.title} 已完成，进入待审核`, 'success');
            }
        }, 900 * (stageIndex + 1) + index * 280);
    });
}

function getAutomationThumbnail(index) {
    return mockTaskCoverUrl;
}

function simulateAutomationJob(jobId, index) {
    const stages = [
        { stage: '商品识别中', progress: 18 },
        { stage: '卖点选择中', progress: 35 },
        { stage: '脚本生成中', progress: 55 },
        { stage: '音色与参数配置中', progress: 72 },
        { stage: '视频生产中', progress: 90 },
        { stage: '待审核', progress: 100, status: 'review' }
    ];

    stages.forEach((step, stepIndex) => {
        setTimeout(() => {
            const job = findAutomationJob(jobId);
            if (!job || job.status !== 'processing') return;

            job.stage = step.stage;
            job.progress = step.progress;
            if (step.status) job.status = step.status;
            renderAutomationDashboard();

            if (step.status === 'review' && !window.automationState.selectedJobId) {
                selectAutomationJob(job.id);
            }
        }, 700 * (stepIndex + 1) + index * 260);
    });
}

function findAutomationJob(jobId) {
    return window.automationState?.jobs.find(job => job.id === jobId);
}

function renderAutomationDashboard() {
    renderAutomationMetrics();
    renderAutomationJobs();
    renderAutomationReview();
    updateAutomationInputHint();
}

function renderAutomationMetrics() {
    const jobs = window.automationState?.jobs || [];
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('automationTotalCount', jobs.length);
    setText('automationReviewCount', jobs.filter(job => job.status === 'review').length);
    setText('automationApprovedCount', jobs.filter(job => job.status === 'approved').length);
    setText('automationRegeneratedCount', jobs.filter(job => job.status === 'regenerated').length);

    const batchLabel = document.getElementById('automationBatchLabel');
    if (batchLabel) {
        batchLabel.textContent = window.automationState?.batchNo ? `批次 AUTO-${window.automationState.batchNo}` : '未启动';
    }
}

function renderAutomationJobs() {
    const list = document.getElementById('automationJobList');
    const jobs = window.automationState?.jobs || [];
    if (!list) return;

    if (jobs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-layer-group"></i>
                <p>输入商品 ID 后开始自动生产，任务会显示在这里。</p>
            </div>
        `;
        return;
    }

    list.innerHTML = jobs.map(job => `
        <div class="automation-job-card ${job.id === window.automationState.selectedJobId ? 'active' : ''}" onclick="selectAutomationJob('${job.id}')">
            <div class="job-card-header">
                <div>
                    <div class="job-card-title">${job.title}</div>
                    <div class="job-card-subtitle">${job.productId} · ${job.category}</div>
                </div>
                <span class="status-pill ${getAutomationStatusClass(job.status)}">${getAutomationStatusText(job.status)}</span>
            </div>
            <div class="automation-progress"><span style="width: ${job.progress}%"></span></div>
            <div class="job-card-footer">
                <span class="job-card-subtitle">${job.stage}</span>
                <span class="confidence-score">模型置信度 ${job.confidence}%</span>
            </div>
        </div>
    `).join('');
}

function renderAutomationReview() {
    const panel = document.getElementById('automationReviewPanel');
    if (!panel) return;

    const job = findAutomationJob(window.automationState?.selectedJobId);
    if (!job) {
        panel.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-check"></i>
                <p>选择一个批量任务，审核模型自主生成的配置与视频结果。</p>
            </div>
        `;
        return;
    }

    const disabled = job.status === 'processing' ? 'disabled' : '';
    const optionChecked = key => job.reviewConfig.options[key] ? 'checked' : '';

    panel.innerHTML = `
        <div class="review-header">
            <div>
                <span class="mode-eyebrow">审核工作台</span>
                <h4>${job.title}</h4>
                <p>${job.productId} · 基于 ${(job.reviewConfig.scripts || []).length} 条人工前置脚本进行视频生产。</p>
            </div>
            <span class="status-pill ${getAutomationStatusClass(job.status)}">${getAutomationStatusText(job.status)}</span>
        </div>

        <div class="review-content">
            <div class="review-video-card">
                <img src="${job.thumbnail}" alt="${job.title}">
                <div class="review-video-meta">
                    <h4>${job.shortName}</h4>
                    <p>已确认 ${(job.reviewConfig.scripts || [job.reviewConfig.script]).filter(Boolean).length} 条人工脚本，系统基于脚本执行视频生产。</p>
                    <div class="review-tags">
                        ${job.modelConfig.sellingPoints.map(point => `<span class="review-tag">${point}</span>`).join('')}
                    </div>
                    <div class="config-diff">
                        ${getAutomationDiffText(job)}
                    </div>
                </div>
            </div>

            <div>
                <div class="review-form-grid">
                    <div class="review-field">
                        <label>商品简称</label>
                        <input value="${escapeAttribute(job.shortName)}" disabled>
                    </div>
                    <div class="review-field">
                        <label>音色</label>
                        <select ${disabled} onchange="updateAutomationReviewField('${job.id}', 'voice', this.value)">
                            ${['甜美女生', '活力女声', '温柔女声', '磁性男声'].map(voice => `<option value="${voice}" ${job.reviewConfig.voice === voice ? 'selected' : ''}>${voice}</option>`).join('')}
                        </select>
                    </div>
                    <div class="review-field full-width">
                        <label>卖点，使用顿号分隔</label>
                        <input ${disabled} value="${escapeAttribute(job.reviewConfig.sellingPoints.join('、'))}" onchange="updateAutomationReviewField('${job.id}', 'sellingPoints', this.value)">
                    </div>
                    <div class="review-field full-width">
                        <label>已确认脚本（${(job.reviewConfig.scripts || []).length} 条）</label>
                        <textarea ${disabled} readonly>${(job.reviewConfig.scripts || [job.reviewConfig.script]).map((s, i) => `【脚本${i + 1}】${s}`).join('\n\n')}</textarea>
                    </div>
                    <div class="review-field">
                        <label>视频选项</label>
                        <div class="automation-option-row">
                            <label class="checkbox-label small">
                                <input type="checkbox" ${disabled} ${optionChecked('subtitles')} onchange="updateAutomationReviewOption('${job.id}', 'subtitles', this.checked)">
                                <span class="checkmark"></span>
                                字幕
                            </label>
                            <label class="checkbox-label small">
                                <input type="checkbox" ${disabled} ${optionChecked('bgm')} onchange="updateAutomationReviewOption('${job.id}', 'bgm', this.checked)">
                                <span class="checkmark"></span>
                                BGM
                            </label>
                            <label class="checkbox-label small">
                                <input type="checkbox" ${disabled} ${optionChecked('flowerText')} onchange="updateAutomationReviewOption('${job.id}', 'flowerText', this.checked)">
                                <span class="checkmark"></span>
                                四要素
                            </label>
                            <label class="checkbox-label small">
                                <input type="checkbox" ${disabled} ${optionChecked('endBoard')} onchange="updateAutomationReviewOption('${job.id}', 'endBoard', this.checked)">
                                <span class="checkmark"></span>
                                尾板
                            </label>
                        </div>
                    </div>
                </div>

                <div class="review-actions">
                    <button class="btn btn-outline" ${job.status === 'processing' ? 'disabled' : ''} onclick="approveAutomationJob('${job.id}')">审核通过</button>
                    <button class="btn btn-primary" ${job.status === 'processing' ? 'disabled' : ''} onclick="regenerateAutomationJob('${job.id}')">
                        <i class="fas fa-redo"></i>
                        修改后重新生成
                    </button>
                </div>
            </div>
        </div>
    `;
}

function selectAutomationJob(jobId) {
    window.automationState.selectedJobId = jobId;
    renderAutomationDashboard();
}

function updateAutomationReviewField(jobId, field, value) {
    const job = findAutomationJob(jobId);
    if (!job) return;

    if (field === 'sellingPoints') {
        job.reviewConfig.sellingPoints = value.split(/[、,，]/).map(item => item.trim()).filter(Boolean);
    } else {
        job.reviewConfig[field] = value;
    }

    markAutomationDiff(job);
    renderAutomationDashboard();
}

function updateAutomationReviewOption(jobId, option, value) {
    const job = findAutomationJob(jobId);
    if (!job) return;

    job.reviewConfig.options[option] = value;
    markAutomationDiff(job);
    renderAutomationDashboard();
}

function markAutomationDiff(job) {
    const modifiedFields = [];
    if (job.reviewConfig.voice !== job.modelConfig.voice) modifiedFields.push('音色');
    const modelScripts = (job.modelConfig.scripts || [job.modelConfig.script]).join('|');
    const reviewScripts = (job.reviewConfig.scripts || [job.reviewConfig.script]).join('|');
    if (modelScripts !== reviewScripts) modifiedFields.push('脚本');
    if (job.reviewConfig.sellingPoints.join('|') !== job.modelConfig.sellingPoints.join('|')) modifiedFields.push('卖点');

    const optionNames = {
        subtitles: '字幕',
        bgm: 'BGM',
        flowerText: '四要素',
        endBoard: '尾板'
    };

    Object.keys(optionNames).forEach(key => {
        if (job.reviewConfig.options[key] !== job.modelConfig.options[key]) {
            modifiedFields.push(optionNames[key]);
        }
    });

    job.modifiedFields = modifiedFields;
}

function approveAutomationJob(jobId) {
    const job = findAutomationJob(jobId);
    if (!job || job.status === 'processing') return;

    job.status = 'approved';
    job.stage = '审核通过';
    job.progress = 100;
    renderAutomationDashboard();
    showMessage(`${job.shortName} 已审核通过`, 'success');
}

function regenerateAutomationJob(jobId) {
    const job = findAutomationJob(jobId);
    if (!job || job.status === 'processing') return;

    markAutomationDiff(job);
    job.status = 'regenerated';
    job.stage = '已提交重新生成';
    job.progress = 100;
    job.regeneratedAt = new Date();

    if (!window.taskManager) {
        window.taskManager = { tasks: [], nextId: 1 };
    }

    const scripts = job.reviewConfig.scripts || [job.reviewConfig.script].filter(Boolean);
    const taskId = window.taskManager.nextId || Date.now();
    window.taskManager.nextId = taskId + 1;
    const reworkTask = {
        id: taskId,
        title: `商品 ${job.productId} 批量返工`,
        description: `人工修改字段：${job.modifiedFields.length ? job.modifiedFields.join('、') : '无'}`,
        status: 'completed',
        stage: '任务成功',
        progress: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        productionMode: '批量模式',
        productId: job.productId,
        script: scripts[0],
        scripts,
        voice: job.reviewConfig.voice,
        scriptSource: '批量模式-人工审核',
        videoCount: scripts.length,
        videos: createTaskVideoSlotsFromScripts(scripts, 'completed', 100),
        videoThumbnail: job.thumbnail,
        videoDuration: '15S',
        videoFileSize: '2.8MB',
        subTasks: [
            { id: '商品识别', status: 'processing' },
            { id: '参数配置', status: 'processing' },
            { id: '视频生产', status: 'processing' }
        ]
    };
    window.taskManager.tasks.unshift(reworkTask);

    finalizeAutomationTask(reworkTask);
    window.automationState.latestBatchTaskIds = [taskId];
    resetTaskDrawerRender();
    openTaskDrawer([reworkTask]);
    updateTaskCount(window.taskManager.tasks.length);
    renderAutomationDashboard();
    showMessage(`${job.shortName} 已基于审核配置重新生成`, 'success');
}

function resetTaskDrawerRender() {
    const taskList = document.getElementById('drawerTaskList');
    if (!taskList) return;

    taskList.removeAttribute('data-initialized');
    taskList.innerHTML = '';
}

function getAutomationStatusText(status) {
    const statusMap = {
        processing: '自动生产中',
        review: '待审核',
        approved: '已通过',
        regenerated: '已返工'
    };
    return statusMap[status] || status;
}

function getAutomationStatusClass(status) {
    const classMap = {
        processing: 'status-processing',
        review: 'status-review',
        approved: 'status-approved',
        regenerated: 'status-regenerated'
    };
    return classMap[status] || 'status-processing';
}

function getAutomationDiffText(job) {
    if (job.status === 'processing') {
        return '模型正在自动配置中，完成后可进入审核。';
    }

    if (!job.modifiedFields || job.modifiedFields.length === 0) {
        return '暂无人工修改。通过或返工后，后端可记录模型配置与人工配置差异。';
    }

    return `已修改：${job.modifiedFields.join('、')}。这些差异可回流给模型团队优化自动决策。`;
}

function updateAutomationInputHint() {
    const hint = document.getElementById('automationInputHint');
    if (!hint) return;

    const items = collectAutomationBatchItems();
    const productRows = document.querySelectorAll('#automationProductRows .automation-product-row').length;
    const totalScripts = items.reduce((sum, item) => sum + item.scripts.length, 0);

    if (!productRows) {
        hint.textContent = '请至少添加 1 个商品并填写脚本';
    } else if (!items.length) {
        hint.textContent = `已添加 ${productRows} 个商品，请填写商品 ID 与至少 1 条脚本`;
    } else {
        hint.textContent = `已配置 ${items.length} 个商品，共 ${totalScripts} 条脚本（视频条数随脚本数）`;
    }
}

function escapeAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function openBgmLibrary() {
    const modal = document.getElementById('bgmLibraryModal');
    if (!modal) return;

    if (!document.getElementById('enableBGM')?.checked) {
        const enableBgm = document.getElementById('enableBGM');
        if (enableBgm) enableBgm.checked = true;
    }

    modal.style.display = 'flex';
    currentBgmPage = 1;
    renderBgmLibraryGrid();
}

function closeBgmLibrary() {
    const modal = document.getElementById('bgmLibraryModal');
    if (modal) modal.style.display = 'none';
    playingBgmId = null;
}

function getFilteredBgmList() {
    return bgmLibraryData.filter(item => {
        if (bgmFilterState.audioName && !item.audioName.toLowerCase().includes(bgmFilterState.audioName.toLowerCase())) return false;
        if (bgmFilterState.songName) {
            const song = item.songName || '';
            if (!song.toLowerCase().includes(bgmFilterState.songName.toLowerCase())) return false;
        }
        if (bgmFilterState.creator && !item.creator.includes(bgmFilterState.creator)) return false;
        if (bgmFilterState.category && item.category !== bgmFilterState.category) return false;
        if (bgmFilterState.startDate) {
            const itemDate = item.createdAt.slice(0, 10);
            if (itemDate < bgmFilterState.startDate) return false;
        }
        if (bgmFilterState.endDate) {
            const itemDate = item.createdAt.slice(0, 10);
            if (itemDate > bgmFilterState.endDate) return false;
        }
        return true;
    });
}

function renderBgmLibraryGrid() {
    const grid = document.getElementById('bgmGrid');
    const countText = document.getElementById('bgmCountText');
    const paginationControls = document.getElementById('bgmPaginationControls');
    if (!grid) return;

    const filtered = getFilteredBgmList();
    const totalPages = Math.max(1, Math.ceil(filtered.length / bgmPageSize));
    if (currentBgmPage > totalPages) currentBgmPage = totalPages;

    const start = (currentBgmPage - 1) * bgmPageSize;
    const pageData = filtered.slice(start, start + bgmPageSize);

    if (countText) countText.textContent = `共${filtered.length}条`;

    grid.innerHTML = pageData.map(item => {
        const isSelected = selectedBgmId === item.id;
        const isPlaying = playingBgmId === item.id;
        const songDisplay = item.songName
            ? `<span class="bgm-song-name">${escapeHtml(item.songName)}</span>`
            : `<span class="bgm-song-placeholder">点击添加歌曲名称</span><i class="fas fa-pen bgm-song-edit-icon"></i>`;

        return `
            <div class="bgm-card ${isSelected ? 'selected' : ''}" onclick="selectBgmItem(${item.id}, event)">
                <label class="bgm-card-checkbox" onclick="event.stopPropagation()">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="selectBgmItem(${item.id}, event)">
                </label>
                <button type="button" class="bgm-play-btn ${isPlaying ? 'playing' : ''}" onclick="toggleBgmPreview(${item.id}, event)" title="试听">
                    <i class="fas fa-${isPlaying ? 'pause' : 'play'}"></i>
                </button>
                <div class="bgm-card-body">
                    <div class="bgm-audio-name" title="${escapeAttribute(item.audioName)}">${escapeHtml(item.audioName)}</div>
                    <div class="bgm-song-row">${songDisplay}</div>
                    <div class="bgm-card-meta">
                        <span>--:--</span>
                        <span>${escapeHtml(item.size)}</span>
                        <span>${escapeHtml(item.createdAt)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (paginationControls) {
        let pagesHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `<button type="button" class="page-btn ${i === currentBgmPage ? 'active' : ''}" onclick="changeBgmPage(${i})">${i}</button>`;
        }
        paginationControls.innerHTML = pagesHtml;
    }

    const confirmBtn = document.getElementById('confirmBgmBtn');
    if (confirmBtn) confirmBtn.disabled = !selectedBgmId;
}

function selectBgmItem(bgmId, event) {
    if (event) event.stopPropagation();
    selectedBgmId = bgmId;
    renderBgmLibraryGrid();
}

function toggleBgmPreview(bgmId, event) {
    if (event) event.stopPropagation();
    const item = bgmLibraryData.find(b => b.id === bgmId);
    if (!item) return;

    if (playingBgmId === bgmId) {
        playingBgmId = null;
        showMessage(`已停止试听：${item.audioName}`, 'info');
    } else {
        playingBgmId = bgmId;
        showMessage(`正在试听：${item.audioName}`, 'info');
    }
    renderBgmLibraryGrid();
}

function searchBgmLibrary() {
    bgmFilterState = {
        audioName: document.getElementById('bgmFilterAudioName')?.value.trim() || '',
        songName: document.getElementById('bgmFilterSongName')?.value.trim() || '',
        creator: document.getElementById('bgmFilterCreator')?.value.trim() || '',
        category: document.getElementById('bgmFilterCategory')?.value || '',
        startDate: document.getElementById('bgmFilterStartDate')?.value || '',
        endDate: document.getElementById('bgmFilterEndDate')?.value || ''
    };
    currentBgmPage = 1;
    renderBgmLibraryGrid();
    showMessage('BGM 搜索完成', 'info');
}

function resetBgmLibraryFilters() {
    ['bgmFilterAudioName', 'bgmFilterSongName', 'bgmFilterCreator', 'bgmFilterStartDate', 'bgmFilterEndDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const categoryEl = document.getElementById('bgmFilterCategory');
    if (categoryEl) categoryEl.value = '';
    bgmFilterState = { audioName: '', songName: '', creator: '', category: '', startDate: '', endDate: '' };
    currentBgmPage = 1;
    renderBgmLibraryGrid();
}

function changeBgmPage(page) {
    currentBgmPage = page;
    renderBgmLibraryGrid();
}

function confirmBgmSelection() {
    const selected = bgmLibraryData.find(item => item.id === selectedBgmId);
    if (!selected) {
        showMessage('请先选择 BGM', 'warning');
        return;
    }

    const label = document.getElementById('selectedBgmLabel');
    if (label) {
        label.textContent = selected.songName || selected.audioName;
        label.title = selected.audioName;
    }

    closeBgmLibrary();
    showMessage(`已更换 BGM：${selected.audioName}`, 'success');
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// 兼容页面内联 onclick / onchange 调用。
window.switchProductionMode = switchProductionMode;
window.startAutomationBatch = startAutomationBatch;
window.addAutomationProductRow = addAutomationProductRow;
window.addAutomationScriptField = addAutomationScriptField;
window.removeAutomationScriptField = removeAutomationScriptField;
window.removeAutomationProductRow = removeAutomationProductRow;
window.generateAutomationScriptsForRow = generateAutomationScriptsForRow;
window.regenerateAutomationScriptField = regenerateAutomationScriptField;
window.triggerAutomationExcelUpload = triggerAutomationExcelUpload;
window.handleAutomationExcelUpload = handleAutomationExcelUpload;
window.selectAutomationJob = selectAutomationJob;
window.updateAutomationReviewField = updateAutomationReviewField;
window.updateAutomationReviewOption = updateAutomationReviewOption;
window.approveAutomationJob = approveAutomationJob;
window.regenerateAutomationJob = regenerateAutomationJob;
window.openBgmLibrary = openBgmLibrary;
window.closeBgmLibrary = closeBgmLibrary;
window.searchBgmLibrary = searchBgmLibrary;
window.resetBgmLibraryFilters = resetBgmLibraryFilters;
window.selectBgmItem = selectBgmItem;
window.toggleBgmPreview = toggleBgmPreview;
window.confirmBgmSelection = confirmBgmSelection;
window.changeBgmPage = changeBgmPage;
