/* ======================================
   DigionTop — Main JavaScript
   Particle Canvas, Page Transitions,
   Smooth Animations, Counter, Slider
   ====================================== */

// ---- Preloader ----
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('loaded');
    }, 1800);
});

// ---- Particle Canvas Background ----
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouseRadius = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 230, 118, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 230, 118, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

// ---- Page Transitions ----
function initPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([href^="http"]):not([target="_blank"])');
    const transition = document.getElementById('pageTransition');
    if (!transition) return;

    const slices = transition.querySelectorAll('.pt-slice');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === window.location.pathname.split('/').pop()) return;

            e.preventDefault();

            // Animate slices in
            slices.forEach((slice, i) => {
                slice.style.transition = `transform 0.4s cubic-bezier(0.7, 0, 0.3, 1) ${i * 0.06}s`;
                slice.style.transformOrigin = 'top';
                slice.style.transform = 'scaleY(1)';
            });

            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });

    // Animate slices out on page load
    window.addEventListener('load', () => {
        slices.forEach((slice, i) => {
            slice.style.transform = 'scaleY(1)';
            slice.style.transformOrigin = 'bottom';
            setTimeout(() => {
                slice.style.transition = `transform 0.4s cubic-bezier(0.7, 0, 0.3, 1) ${i * 0.06}s`;
                slice.style.transform = 'scaleY(0)';
            }, 100);
        });
    });
}

// ---- Header Scroll Effect ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ---- Mobile Menu ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    document.querySelectorAll('.dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle('active');
            }
        });
    });
}

// ---- AOS (Custom Scroll Reveal) ----
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ---- Counter Animation ----
function initCounters() {
    const counters = document.querySelectorAll('.counter, .stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                if (!target || el.dataset.counted) return;

                el.dataset.counted = 'true';
                let current = 0;
                const duration = 2200;
                const startTime = performance.now();

                function easeOutExpo(t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    current = Math.floor(easeOutExpo(progress) * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(updateCounter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ---- Testimonial Slider ----
function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % totalCards));
    prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + totalCards) % totalCards));

    let autoPlay = setInterval(() => goToSlide((currentIndex + 1) % totalCards), 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goToSlide((currentIndex + 1) % totalCards), 5000);
    });
}

// ---- Back to Top ----
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 400);
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- Smooth Scroll for Anchor Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const pos = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});

// ---- Parallax Hero ----
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.pageYOffset < window.innerHeight) {
        const scrolled = window.pageYOffset;
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = 1 - scrolled / 700;
    }
});

// ---- Tilt Effect on Cards ----
function initTilt() {
    document.querySelectorAll('.service-card, .process-card, .team-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ---- Contact Form ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#00e676';
            btn.style.borderColor = '#00e676';
            btn.style.color = '#0a0a0a';
            btn.style.opacity = '1';
            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);
        }, 2000);
    });
}

// ---- Navbar Active on Scroll ----
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ---- Magnetic Button Effect ----
function initMagneticButtons() {
    if (window.innerWidth <= 768) return;

    document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ---- Stagger Reveal for Grids ----
function initStaggerReveal() {
    const grids = document.querySelectorAll('.services-grid, .process-grid, .stats-grid, .team-grid');

    grids.forEach(grid => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, i) => {
                        child.style.transitionDelay = `${i * 0.1}s`;
                    });
                }
            });
        }, { threshold: 0.1 });

        observer.observe(grid);
    });
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initPageTransitions();
    initAOS();
    initCounters();
    initTestimonialSlider();
    initTilt();
    initMagneticButtons();
    initStaggerReveal();
});
