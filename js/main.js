/* ==========================================
   STACKLY PHARMA — main.js
   Core: Loader, Nav, Scroll Anims, Particles,
   3D Tilt, Toast, Typewriter, Flip Words
   ========================================== */

/* ---------- Page Loader ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Add a small delay so the loader is visible for a moment
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 400);
  }
});

/* ---------- Navbar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    // Inject close button dynamically
    const closeMenuBtn = document.createElement('button');
    closeMenuBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeMenuBtn.style.cssText = 'position:absolute; top:25px; right:25px; background:none; border:none; cursor:pointer; color:var(--text-main);';
    mobileMenu.appendChild(closeMenuBtn);

    closeMenuBtn.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});

/* ---------- Scroll Animations ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const animEls = document.querySelectorAll('[data-anim]');
  if (!animEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(el => observer.observe(el));
});

/* ---------- Particle Background ---------- */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;
  const particleCount = 60;
  const maxDistance = 120;
  const colors = ['rgba(108,99,255,0.3)', 'rgba(0,180,216,0.3)', 'rgba(16,185,129,0.3)', 'rgba(167,139,250,0.2)'];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / maxDistance)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ---------- 3D Card Tilt ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card-3d').forEach(card => {
    const inner = card.querySelector('.card-3d-inner') || card;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
});

/* ---------- Typewriter Effect ---------- */
function typeWriter(elementId, texts, speed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => { isDeleting = true; type(); }, pauseTime);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(type, isDeleting ? deleteSpeed : speed);
  }

  type();
}

/* ---------- Counter Animation ---------- */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = el.dataset.count;
    const hasDecimal = target.includes('.');
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.]/g, '');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * easeOut;

      if (hasDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// Trigger counter animation when stats are visible
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
});

/* ---------- Toast System ---------- */
window.showToast = function(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

/* ---------- Smooth Scroll ---------- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

/* ---------- Parallax Depth on Scroll ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
});

/* ---------- Active Nav Link Highlight ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});

/* ---------- Ripple Effect on Buttons ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: scale(0);
    animation: ripple 0.6s ease-out forwards;
    left: ${e.clientX - rect.left - size/2}px;
    top: ${e.clientY - rect.top - size/2}px;
    pointer-events: none;
  `;

  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple { to { transform: scale(2); opacity: 0; } }';
    document.head.appendChild(style);
  }

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

/* ---------- Flip Words Animation ---------- */
function initFlipWords(containerId, words, interval = 3000) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  
  const wordSpans = words.map((word, index) => {
    const span = document.createElement('span');
    span.className = 'flip-word';
    if (index === 0) span.classList.add('active');
    span.innerHTML = `<span class="gradient-text">${word}</span>`;
    container.appendChild(span);
    return span;
  });

  let maxWidth = 0;
  wordSpans.forEach(span => {
    span.style.opacity = '1';
    span.style.position = 'relative';
    const width = span.getBoundingClientRect().width;
    if (width > maxWidth) maxWidth = width;
    span.style.opacity = '';
    span.style.position = '';
  });
  container.style.width = `${maxWidth + 10}px`;

  let currentIndex = 0;

  setInterval(() => {
    const currentSpan = wordSpans[currentIndex];
    const nextIndex = (currentIndex + 1) % words.length;
    const nextSpan = wordSpans[nextIndex];

    currentSpan.classList.remove('active');
    currentSpan.classList.add('out');

    setTimeout(() => {
      currentSpan.classList.remove('out');
    }, 600);

    nextSpan.classList.add('active');
    currentIndex = nextIndex;
  }, interval);
}

/* ---------- Hover Glow Spotlight Effect ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.hover-glow-card, .service-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (
        e.clientX > rect.left - 300 && 
        e.clientX < rect.right + 300 &&
        e.clientY > rect.top - 300 && 
        e.clientY < rect.bottom + 300
      ) {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  });
});

/* ---------- FAQ Accordion ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});

/* ---------- GSAP-Style Text Reveal ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('h1, h2, .section-title, .hero-title, .gsap-reveal');
  
  revealElements.forEach(el => {
    function wrapWords(node) {
      if (node.nodeType === 3) {
        const words = node.nodeValue.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
          if (word.trim() !== '') {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';
            const anim = document.createElement('span');
            anim.className = 'word-anim';
            
            let isGradient = false;
            let p = node.parentNode;
            while(p && p !== el) {
              if (p.classList && (p.classList.contains('gradient-text') || p.classList.contains('was-gradient'))) {
                isGradient = true;
                p.classList.remove('gradient-text');
                p.classList.add('was-gradient');
              }
              p = p.parentNode;
            }
            if (isGradient) {
              anim.classList.add('gradient-text');
            }
            
            anim.textContent = word;
            wrapper.appendChild(anim);
            fragment.appendChild(wrapper);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === 1) {
        if (node.tagName !== 'BR' && node.tagName !== 'SVG' && !node.classList.contains('word-wrapper')) {
          Array.from(node.childNodes).forEach(wrapWords);
        }
      }
    }
    
    Array.from(el.childNodes).forEach(wrapWords);
  });

  // Ensure GSAP and ScrollTrigger are available before executing
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    revealElements.forEach(el => {
      const words = el.querySelectorAll('.word-anim');
      
      // Override CSS default hidden state if any, let GSAP handle it
      gsap.set(words, { opacity: 1, y: 0, transform: 'none' });

      gsap.from(words, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    // Fallback if GSAP fails to load
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll('.word-anim');
          words.forEach((word, idx) => {
            setTimeout(() => {
              word.classList.add('visible');
            }, idx * 40);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => observer.observe(el));
  }
});

/* ---------- Scroll Container 3D Flip ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.scroll-container-wrapper');
  const scrollCard = document.querySelector('.scroll-card-3d');
  
  if (!scrollContainer || !scrollCard) return;

  window.addEventListener('scroll', () => {
    const rect = scrollContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    let progress = 1 - (rect.top / windowHeight);
    progress = Math.max(0, Math.min(1, progress * 1.2));
    
    const rotateX = 25 - (25 * progress);
    const scale = 0.85 + (0.15 * progress);
    const translateY = 100 - (100 * progress);
    
    scrollCard.style.transform = `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`;
    
    if (progress > 0.4 && !scrollCard.classList.contains('animated')) {
      scrollCard.classList.add('animated');
    }
  }, { passive: true });
});

/* ---------- Init Particles on DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('particles-canvas')) {
    initParticles('particles-canvas');
  }
});

/* ---------- Aceternity UI Text Generate (Paragraphs) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const textGenElements = document.querySelectorAll('.hero-desc, .section-desc, .about-desc, .auth-subtitle');
  
  textGenElements.forEach(el => {
    // Split into characters for typewriter effect
    const text = el.innerText;
    el.innerHTML = ''; // Clear existing text
    
    // Split into words, then characters to maintain word wrapping
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = word.split('');
      chars.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.display = 'inline-block';
        charSpan.className = 'text-gen-char';
        wordSpan.appendChild(charSpan);
      });
      
      el.appendChild(wordSpan);
      
      // Add space after word, except for the last word
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        el.appendChild(spaceSpan);
      }
    });

    // Animate
    gsap.to(el.querySelectorAll('.text-gen-char'), {
      opacity: 1,
      duration: 0.1,
      stagger: 0.015,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
});

/* ---------- Aceternity UI Split Hover Links ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a');
  
  links.forEach(link => {
    const text = link.textContent;
    if (text.trim() === '') return;
    
    link.textContent = ''; // clear original
    link.classList.add('hover-link');
    
    const topText = document.createElement('span');
    topText.className = 'hover-text-top';
    topText.textContent = text;
    
    const bottomText = document.createElement('span');
    bottomText.className = 'hover-text-bottom';
    bottomText.textContent = text;
    
    link.appendChild(topText);
    link.appendChild(bottomText);
  });
});
