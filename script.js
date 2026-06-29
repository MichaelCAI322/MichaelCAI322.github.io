document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const backToTopBtn = document.getElementById('backToTop');
    const revealElements = document.querySelectorAll('.reveal');

    /* ============================================================
       1. 精准平滑滚动（解决吸顶导航栏遮挡问题）
       ============================================================ */
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // 动态获取当前导航栏的高度（因为滚动后高度会变窄）
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================================
       2. 滚动监听器（并合处理：导航背景渐变、返回顶部显隐、高亮追踪）
       ============================================================ */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // 【功能：导航栏背景渐变】超过 30 像素即变磨砂玻璃
        if (scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 【功能：返回顶部按钮】超过 400 像素显示
        if (scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // 【功能：导航栏滚动高亮 (Scroll Spy)】
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 40;
            // 只要滚过该区域的头部，就把当前激活 ID 设为此区域
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ============================================================
       3. 元素滚动淡入（基于现代高效的 IntersectionObserver）
       ============================================================ */
    const observerOptions = {
        root: null,         // 相对视口滚动
        threshold: 0.15,    // 元素露出 15% 的时候触发动画
        rootMargin: '0px 0px -20px 0px' // 视口底部稍微收缩，防止刚露头就闪现
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 触发后立即注销监听，保证动画只执行一次，避免重复滚动时反复闪烁
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ============================================================
       4. 返回顶部按钮点击事件
       ============================================================ */
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
