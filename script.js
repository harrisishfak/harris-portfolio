/* ═══════════════════════════════════════════════════════════
   HARRIS ISHFAQ — PORTFOLIO v2
   script.js — Vanilla JS, no dependencies
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM ready guard ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initTypewriter();
  initScrollAnimations();
  initActiveNavHighlight();
  initSmoothScroll();
});

/* ════════════════════════════════════════════
   1. NAVIGATION — scroll behaviour
════════════════════════════════════════════ */
function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  const onScroll = () => {
    const scrollY = window.scrollY;

    /* Add scrolled class for backdrop blur */
    navbar.classList.toggle('scrolled', scrollY > 40);

    lastScroll = scrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ════════════════════════════════════════════
   2. HAMBURGER MENU
════════════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggle(!isOpen);
  });

  /* Close when a nav link is clicked */
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  /* Close on backdrop click (outside nav area) */
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggle(false);
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle(false);
      hamburger.focus();
    }
  });
}

/* ════════════════════════════════════════════
   3. TYPEWRITER EFFECT
════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const strings = [
    'AI-Integrated Software Engineer',
    'Full-Stack Web Engineer',
    'LLM Integration Specialist',
    'Digital Health Builder',
  ];

  let stringIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let paused      = false;

  const TYPING_SPEED  = 60;   // ms per char (typing)
  const DELETE_SPEED  = 30;   // ms per char (deleting)
  const PAUSE_AFTER   = 2000; // ms to pause after fully typed
  const PAUSE_BEFORE  = 400;  // ms to pause before typing next

  function tick() {
    const current = strings[stringIndex];

    if (paused) return;

    if (!deleting) {
      /* Typing */
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        /* Fully typed — pause, then start deleting */
        paused = true;
        setTimeout(() => {
          paused   = false;
          deleting = true;
          setTimeout(tick, DELETE_SPEED);
        }, PAUSE_AFTER);
        return;
      }

      setTimeout(tick, TYPING_SPEED);
    } else {
      /* Deleting */
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        /* Fully deleted — move to next string */
        deleting     = false;
        stringIndex  = (stringIndex + 1) % strings.length;
        paused       = true;
        setTimeout(() => {
          paused = false;
          setTimeout(tick, TYPING_SPEED);
        }, PAUSE_BEFORE);
        return;
      }

      setTimeout(tick, DELETE_SPEED);
    }
  }

  /* Small initial delay so page loads first */
  setTimeout(tick, 800);
}

/* ════════════════════════════════════════════
   4. SCROLL-TRIGGERED ANIMATIONS
════════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  /* Use IntersectionObserver for performance */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        /* Stagger siblings within the same parent */
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('[data-animate]')
        );
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80; // 80ms stagger per sibling

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   5. SKILL BAR ANIMATIONS
════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width') || '0';
        /* Tiny rAF delay ensures transition fires */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = width + '%';
          });
        });
        observer.unobserve(fill);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -40px 0px',
  });

  fills.forEach(fill => observer.observe(fill));
}

/* ════════════════════════════════════════════
   6. ACTIVE NAV LINK HIGHLIGHT
════════════════════════════════════════════ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const OFFSET = 120; // px — consider section "active" when within this from top

  const highlight = () => {
    let current = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= OFFSET) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
}

/* ════════════════════════════════════════════
   7. SMOOTH SCROLL (fallback for older browsers)
════════════════════════════════════════════ */
function initSmoothScroll() {
  /* CSS scroll-behavior: smooth covers modern browsers.
     This polyfill handles anchor clicks for any edge cases. */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   8. CONTACT FORM — Formspree
════════════════════════════════════════════ */
/* Form submits natively to Formspree via action/method attributes.
   No JS interception needed — Formspree handles delivery and redirect. */

/* ════════════════════════════════════════════
   9. PARALLAX ORBS (subtle, rAF-based)
════════════════════════════════════════════ */
(function initParallaxOrbs() {
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  if (!orb1 || !orb2) return;

  /* Only on devices that can handle it (non-touch, prefers-motion not reduced) */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let mouseX = 0;
  let mouseY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
  }, { passive: true });

  function update() {
    orb1.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    orb2.style.transform = `translate(${mouseX * -15}px, ${mouseY * -15}px)`;
    raf = requestAnimationFrame(update);
  }

  update();

  /* Pause when hero is not visible */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) raf = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, { threshold: 0 });
    io.observe(heroEl);
  }
})();

/* ════════════════════════════════════════════
   10. TERMINAL TYPING EFFECT (hero code block)
════════════════════════════════════════════ */
(function initTerminalEffect() {
  const terminal = document.querySelector('.terminal');
  if (!terminal) return;

  /* Add a subtle scanline shimmer on hover */
  terminal.addEventListener('mouseenter', () => {
    terminal.style.boxShadow = '0 20px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.45)';
  });
  terminal.addEventListener('mouseleave', () => {
    terminal.style.boxShadow = '';
  });
})();

/* ════════════════════════════════════════════
   11. PROJECT CARD TILT (subtle 3D on hover)
════════════════════════════════════════════ */
(function initCardTilt() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 4;   // max 4deg
      const tiltY  = ((cx - x) / cx) * 4;

      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ════════════════════════════════════════════
   12. STAT COUNTER ANIMATION
════════════════════════════════════════════ */
(function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-card__number');
  if (!statNumbers.length) return;

  const parse = (text) => {
    /* Extract leading number and trailing suffix */
    const match = text.match(/^([\d.]+)(\D*)$/);
    if (!match) return null;
    return { value: parseFloat(match[1]), suffix: match[2] };
  };

  const animateCounter = (el, target, suffix, duration = 1200) => {
    const start     = performance.now();
    const startVal  = 0;

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease out quad */
      const eased    = 1 - (1 - progress) * (1 - progress);
      const current  = startVal + (target - startVal) * eased;

      /* Format: show integer if target is integer, else 1 decimal */
      const display  = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      el.textContent = display + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const raw     = el.textContent.trim();
        const parsed  = parse(raw);
        if (parsed) animateCounter(el, parsed.value, parsed.suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* ════════════════════════════════════════════
   13. COPY EMAIL ON CLICK (contact link)
════════════════════════════════════════════ */
(function initEmailCopy() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      /* Let the mailto: open but also copy to clipboard */
      const email = link.href.replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {/* silent fail */});
      }
    });
  });
})();
