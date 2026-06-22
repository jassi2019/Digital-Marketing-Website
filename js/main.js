/* ============================================
   DigionTop Agency — Enhanced JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    });
    // Fallback: hide after 3s even if load event doesn't fire
    setTimeout(() => { preloader.classList.add('hidden'); }, 3000);

    // ========== PARTICLE CANVAS ==========
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 30 : 60;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.hue = Math.random() > 0.5 ? 260 : 160; // purple or green
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 60, 225, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            if (!isMobile) drawConnections();
            animId = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Pause when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                animateParticles();
            }
        });
    }

    // ========== CURSOR GLOW (desktop only) ==========
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function updateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateGlow);
        }
        updateGlow();
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ========== MOBILE NAV ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== SCROLL REVEAL ==========
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = easeOutQuart(progress) * target;
            el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }
        requestAnimationFrame(update);
    }

    // ========== RESULT BAR ANIMATION ==========
    const resultCards = document.querySelectorAll('.result-card');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.result-bar-fill');
                if (bar) {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => { bar.style.width = targetWidth; }, 300);
                }
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    resultCards.forEach(card => barObserver.observe(card));

    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========== CONTACT FORM ==========
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.innerHTML = '<span style="color: #00E5A0;">Sent! We\'ll call you within 2 hours.</span>';
                submitBtn.style.opacity = '1';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 4000);
            }, 1500);
        });
    }

    // ========== ACTIVE NAV LINK ==========
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => navObserver.observe(section));

    // ========== SERVICE CARD GLOW FOLLOW ==========
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ========== TILT EFFECT ON CARDS (desktop) ==========
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.service-card, .why-card, .case-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (y - 0.5) * -4;
                const rotateY = (x - 0.5) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Magnetic CTA buttons
        document.querySelectorAll('.btn-glow').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ========== PARALLAX SHAPES ==========
    if (window.innerWidth > 768) {
        const shapes = document.querySelectorAll('.shape');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.02;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // ========== GRADIENT TEXT SHIMMER ==========
    const heroGradient = document.querySelector('.hero-title .gradient-text');
    if (heroGradient) {
        heroGradient.style.backgroundSize = '300% 300%';
    }

});
