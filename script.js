/* ============================================================
   AURORA COFFEE ROASTERS — Interactive Animations
   ============================================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursorGlow();
    initParticleCanvas();
    initNavigation();
    initHeroAnimation();
    initParallaxSection();
    initBeansGallery();
    initHorizontalScroll();
    initAboutSection();
    initJournalSection();
    initScrollReveal();
});

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Start hero animation after preloader
            setTimeout(() => {
                triggerHeroSequence();
            }, 400);
        }, 2800);
    });
    
    // Fallback
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => triggerHeroSequence(), 400);
    }, 4000);
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.innerWidth < 768) return;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
        requestAnimationFrame(updateGlow);
    }
    updateGlow();
}

/* ============================================================
   PARTICLE CANVAS — Ambient coffee particles
   ============================================================ */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Create ambient particles
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = -Math.random() * 0.5 - 0.1;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
            // Coffee-like colors
            const colors = [
                [201, 169, 110],
                [139, 94, 60],
                [107, 58, 31],
                [74, 46, 24]
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            
            if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
                this.y = height + 10;
            }
        }
        
        draw() {
            const fadeRatio = this.life / this.maxLife;
            const alpha = this.opacity * fadeRatio;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha})`;
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = Math.min(80, Math.floor(width / 20));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 80 },
                    duration: 1.2,
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

/* ============================================================
   HERO ANIMATION SEQUENCE
   ============================================================ */
let heroSequenceTriggered = false;

function initHeroAnimation() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Set initial states
    const beanImg = document.getElementById('hero-bean-img');
    if (beanImg) {
        gsap.set(beanImg, { opacity: 0, scale: 0.3, rotation: -30 });
    }
}

function triggerHeroSequence() {
    if (heroSequenceTriggered) return;
    heroSequenceTriggered = true;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const beanImg = document.getElementById('hero-bean-img');
    const beanContainer = document.getElementById('hero-bean');
    const cupContainer = document.getElementById('hero-cup');
    const cupImg = document.getElementById('hero-cup-img');
    const chars = document.querySelectorAll('.char');
    const subtitle = document.querySelector('.subtitle-text');
    const desc = document.getElementById('hero-desc');
    const cta = document.getElementById('hero-cta');
    const steam = document.getElementById('cup-steam');
    
    // Phase 1: Bean flies in and lands
    tl.to(beanImg, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'back.out(1.4)',
        onStart: () => beanImg.classList.add('visible')
    })
    
    // Phase 2: Bean pulses / glows
    .to(beanImg, {
        scale: 1.1,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    }, '+=0.3')
    
    // Phase 3: Bean EXPLODES into particles
    .to(beanImg, {
        scale: 1.5,
        opacity: 0,
        duration: 0.5,
        ease: 'power4.in',
        onComplete: () => {
            createBeanExplosion(beanContainer);
        }
    }, '+=0.2')
    
    // Phase 4: Cup rises up with splash
    .to(cupContainer, {
        opacity: 1,
        duration: 0.1,
        onStart: () => cupContainer.classList.add('visible')
    }, '+=0.6')
    
    .to(cupImg, {
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.2)',
        onStart: () => {
            cupImg.classList.add('visible');
            // Trigger splash rings
            document.querySelectorAll('.splash-ring').forEach(ring => {
                ring.classList.add('animate');
            });
        }
    }, '<')
    
    // Phase 5: Steam appears
    .to(steam, {
        opacity: 1,
        duration: 0.5,
        onStart: () => steam.classList.add('visible')
    }, '+=0.3')
    
    // Phase 6: Text reveal - character by character
    .add(() => {
        chars.forEach((char, i) => {
            setTimeout(() => {
                char.classList.add('revealed');
            }, i * 100);
        });
    }, '-=0.2')
    
    // Phase 7: Subtitle
    .add(() => {
        setTimeout(() => subtitle.classList.add('revealed'), 600);
    }, '+=0.2')
    
    // Phase 8: Description
    .add(() => {
        desc.classList.add('revealed');
    }, '+=0.4')
    
    // Phase 9: CTA button
    .add(() => {
        cta.classList.add('revealed');
    }, '+=0.2');
}

/* ============================================================
   BEAN EXPLOSION — Particle System
   ============================================================ */
function createBeanExplosion(container) {
    const particleContainer = document.getElementById('bean-particles');
    if (!particleContainer) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Create 60 particles
    const particleCount = 60;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bean-particle';
        
        const size = Math.random() * 12 + 4;
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 300 + 100;
        const brown = Math.floor(Math.random() * 80 + 40);
        const green = Math.floor(Math.random() * 30 + 15);
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size * 1.3}px;
            left: ${centerX}px;
            top: ${centerY}px;
            background: radial-gradient(ellipse at 35% 25%, 
                rgb(${brown + 60}, ${green + 30}, ${Math.floor(brown * 0.3)}), 
                rgb(${brown}, ${green}, ${Math.floor(brown * 0.2)}));
            transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
        `;
        
        particleContainer.appendChild(particle);
        
        particles.push({
            el: particle,
            targetX: Math.cos(angle) * distance,
            targetY: Math.sin(angle) * distance,
            rotation: Math.random() * 720 - 360,
            delay: Math.random() * 0.2
        });
    }
    
    // Animate particles outward
    particles.forEach(p => {
        gsap.to(p.el, {
            x: p.targetX,
            y: p.targetY,
            rotation: p.rotation,
            opacity: 1,
            duration: 0.6,
            delay: p.delay,
            ease: 'power3.out'
        });
        
        // Then fade and fall
        gsap.to(p.el, {
            y: p.targetY + 200,
            opacity: 0,
            scale: 0.3,
            duration: 1,
            delay: p.delay + 0.5,
            ease: 'power2.in',
            onComplete: () => p.el.remove()
        });
    });
    
    // Create coffee droplets
    for (let i = 0; i < 30; i++) {
        const droplet = document.createElement('div');
        droplet.className = 'bean-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 200 + 50;
        
        droplet.style.cssText = `
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            left: ${centerX}px;
            top: ${centerY}px;
            background: rgba(201, 169, 110, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
        
        particleContainer.appendChild(droplet);
        
        gsap.to(droplet, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            duration: 0.8,
            delay: Math.random() * 0.3,
            ease: 'power3.out',
            onComplete: () => droplet.remove()
        });
    }
}

/* ============================================================
   PARALLAX SECTION
   ============================================================ */
function initParallaxSection() {
    const section = document.getElementById('parallax-section');
    if (!section) return;
    
    // Parallax background image
    gsap.to('.parallax-img', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Parallax beans (front layer moves faster)
    gsap.to('.p-bean-1', {
        y: -150,
        rotation: 45,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
        }
    });
    
    gsap.to('.p-bean-2', {
        y: -100,
        rotation: -30,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
        }
    });
    
    gsap.to('.p-bean-3', {
        y: -200,
        rotation: 60,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3
        }
    });
    
    // Text reveal
    const label = section.querySelector('.parallax-label');
    const heading = section.querySelector('.parallax-heading');
    
    gsap.fromTo(label, 
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1
            }
        }
    );
    
    gsap.fromTo(heading,
        { opacity: 0, y: 50, scale: 0.95 },
        {
            opacity: 1, y: 0, scale: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 55%',
                end: 'top 25%',
                scrub: 1
            }
        }
    );
}

/* ============================================================
   3D BEANS GALLERY — Tilt Effect
   ============================================================ */
function initBeansGallery() {
    const cards = document.querySelectorAll('.bean-card[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = -(y - centerY) / 15;
            const rotateY = (x - centerX) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Scroll reveal for cards
    gsap.utils.toArray('.bean-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 60, rotationY: -10 },
            {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/* ============================================================
   HORIZONTAL SCROLL — Brew Cards
   ============================================================ */
function initHorizontalScroll() {
    const section = document.querySelector('.brew-section');
    const track = document.getElementById('horizontal-track');
    const progressFill = document.getElementById('brew-progress');
    
    if (!section || !track) return;
    
    // Calculate total scroll width
    const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + 100);
    };
    
    // Create horizontal scroll animation
    const horizontalTween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                if (progressFill) {
                    progressFill.style.width = `${self.progress * 100}%`;
                }
            }
        }
    });
    
    // Animate brew cards as they come into view
    gsap.utils.toArray('.brew-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontalTween,
                    start: 'left 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/* ============================================================
   ABOUT SECTION
   ============================================================ */
function initAboutSection() {
    const section = document.querySelector('.about-section');
    if (!section) return;
    
    // Image reveal
    gsap.fromTo('.about-img-1',
        { opacity: 0, x: -60 },
        {
            opacity: 1, x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%'
            }
        }
    );
    
    gsap.fromTo('.about-img-2',
        { opacity: 0, x: 60, y: 40 },
        {
            opacity: 1, x: 0, y: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%'
            }
        }
    );
    
    // Text reveal
    gsap.fromTo('.about-right .section-label',
        { opacity: 0, y: 20 },
        {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: '.about-right', start: 'top 75%' }
        }
    );
    
    gsap.fromTo('.about-title',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            delay: 0.1,
            scrollTrigger: { trigger: '.about-right', start: 'top 75%' }
        }
    );
    
    gsap.fromTo('.about-text',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            delay: 0.2,
            scrollTrigger: { trigger: '.about-right', start: 'top 75%' }
        }
    );
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });
}

/* ============================================================
   JOURNAL SECTION
   ============================================================ */
function initJournalSection() {
    gsap.utils.toArray('.journal-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            }
        );
    });
}

/* ============================================================
   SCROLL REVEAL — General purpose
   ============================================================ */
function initScrollReveal() {
    // Section headers
    gsap.utils.toArray('.section-header, .brew-header, .journal-header').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%'
                }
            }
        );
    });
    
    // Footer elements
    gsap.fromTo('.footer-brand',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: '.site-footer', start: 'top 85%' }
        }
    );
    
    gsap.utils.toArray('.footer-col').forEach((col, i) => {
        gsap.fromTo(col,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                delay: i * 0.1,
                scrollTrigger: { trigger: '.site-footer', start: 'top 85%' }
            }
        );
    });
    
    // Hero scroll indicator hide on scroll
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: '30% top',
        onLeave: () => {
            gsap.to('#scroll-indicator', { opacity: 0, duration: 0.3 });
        },
        onEnterBack: () => {
            gsap.to('#scroll-indicator', { opacity: 1, duration: 0.3 });
        }
    });
    
    // Parallax effect on hero cup
    gsap.to('#hero-cup', {
        y: -80,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Parallax on hero content
    gsap.to('#hero-content', {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: '40% top',
            end: 'bottom top',
            scrub: 1
        }
    });
}
