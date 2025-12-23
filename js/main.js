// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('鸿百年科技网站已加载');
    
    // 1. 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // 2. 导航栏滚动效果
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 更新导航激活状态
        updateActiveNav();
    });
    
    // 3. 平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 关闭移动端菜单
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // 计算偏移量
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // 平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL（可选）
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 4. 导航激活状态更新
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 5. 联系方式复制功能
    const copyableElements = document.querySelectorAll('.copyable');
    const copyToast = document.getElementById('copyToast');
    
    copyableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止事件冒泡
            
            let textToCopy = this.textContent.trim();
            
            // 处理电话格式
            if (textToCopy.includes(' ')) {
                textToCopy = textToCopy.replace(/\s/g, '');
            }
            
            // 复制到剪贴板
            copyToClipboard(textToCopy);
            
            // 显示成功提示
            showToast('已复制到剪贴板！', 'success');
            
            // 视觉反馈
            this.style.color = 'var(--success)';
            setTimeout(() => {
                this.style.color = '';
            }, 1000);
        });
    });
    
    // 6. 复制到剪贴板函数
    function copyToClipboard(text) {
        // 创建临时输入框
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        
        // 选中并复制
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // 移动端兼容
        
        try {
            document.execCommand('copy');
            console.log('已复制: ' + text);
        } catch (err) {
            console.error('复制失败:', err);
            // 使用现代API
            navigator.clipboard.writeText(text).catch(err => {
                console.error('复制失败:', err);
                showToast('复制失败，请手动复制', 'error');
            });
        }
        
        // 清理
        document.body.removeChild(tempInput);
    }
    
    // 7. 显示提示消息
    function showToast(message, type = 'success') {
        if (copyToast) {
            copyToast.textContent = message;
            
            // 设置类型样式
            copyToast.className = 'toast';
            if (type === 'success') {
                copyToast.style.background = 'var(--success)';
            } else if (type === 'error') {
                copyToast.style.background = 'var(--danger)';
            } else if (type === 'warning') {
                copyToast.style.background = 'var(--warning)';
            }
            
            copyToast.classList.add('show');
            
            // 3秒后隐藏
            setTimeout(() => {
                copyToast.classList.remove('show');
            }, 3000);
        } else {
            // 回退方案
            alert(message);
        }
    }
    
    // 8. 卡片悬停效果增强
    const cards = document.querySelectorAll('.service-card, .feature, .project-card, .equipment-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // 9. 服务标签点击效果
    const serviceTags = document.querySelectorAll('.service-tag');
    
    serviceTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const serviceName = this.textContent;
            showToast(`已选择: ${serviceName}`, 'info');
            
            // 视觉反馈
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
    
    // 10. 业务项目点击效果
    const businessItems = document.querySelectorAll('.business-item');
    
    businessItems.forEach(item => {
        item.addEventListener('click', function() {
            const service = this.querySelector('span').textContent;
            showToast(`主营业务: ${service}`, 'info');
        });
    });
    
    // 11. 更新当前年份
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // 12. 初始化滚动效果
    window.addEventListener('load', function() {
        // 触发一次滚动事件来初始化
        window.dispatchEvent(new Event('scroll'));
        
        // 初始化页面动画
        initPageAnimations();
    });
    
    // 13. 页面动画初始化
    function initPageAnimations() {
        // 为各个区域添加动画类
        const animateSections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateSections.forEach(section => {
            observer.observe(section);
        });
        
        // 英雄区域按钮动画
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            setTimeout(() => {
                heroButtons.classList.add('animated');
            }, 1500);
        }
    }
    
    // 14. 表单验证（如果有表单的话）
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredInputs = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--danger)';
                    isValid = false;
                    
                    // 添加错误提示
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.style.color = 'var(--danger)';
                        errorMsg.style.fontSize = '12px';
                        errorMsg.textContent = '此字段为必填项';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    input.style.borderColor = '';
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                showToast('提交成功！我们会尽快联系您。', 'success');
                this.reset();
            } else {
                showToast('请填写所有必填字段', 'error');
            }
        });
    });
    
    // 15. 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 回退方案
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // 16. 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animated {
            animation: fadeIn 1s ease forwards;
        }
        
        .section.animated .section-header {
            animation: slideInUp 0.8s ease forwards;
        }
        
        .hero-buttons.animated a {
            animation: slideInUp 0.8s ease forwards;
        }
        
        .hero-buttons.animated a:first-child {
            animation-delay: 0.2s;
        }
        
        .hero-buttons.animated a:last-child {
            animation-delay: 0.4s;
        }
        
        .hero-stats.animated .stat-item {
            animation: slideInUp 0.8s ease forwards;
        }
        
        .hero-stats.animated .stat-item:nth-child(1) {
            animation-delay: 0.6s;
        }
        
        .hero-stats.animated .stat-item:nth-child(2) {
            animation-delay: 0.8s;
        }
        
        .hero-stats.animated .stat-item:nth-child(3) {
            animation-delay: 1s;
        }
        
        .error-message {
            display: block;
            margin-top: 5px;
        }
        
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // 17. 性能优化：预加载关键图片
    const criticalImages = [
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // 18. 键盘导航支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭移动端菜单
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
        
        // Tab键导航
        if (e.key === 'Tab') {
            document.body.classList.add('tab-navigation');
        }
    });
    
    document.addEventListener('click', function() {
        document.body.classList.remove('tab-navigation');
    });
    
    // 19. 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 移除加载动画
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }, 500);
        }
    });
});