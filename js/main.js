// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Hero slider
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.slider-dots .dot'));
const slider = document.querySelector('.hero-slider');
let current = 0;
let sliderTimer;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function startAutoplay() {
  stopAutoplay();
  sliderTimer = setInterval(() => showSlide(current + 1), 6000);
}

function stopAutoplay() {
  if (sliderTimer) clearInterval(sliderTimer);
}

document.querySelector('.slider-arrow.prev').addEventListener('click', () => {
  showSlide(current - 1);
  startAutoplay();
});
document.querySelector('.slider-arrow.next').addEventListener('click', () => {
  showSlide(current + 1);
  startAutoplay();
});
dots.forEach((dot, i) =>
  dot.addEventListener('click', () => {
    showSlide(i);
    startAutoplay();
  })
);

slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) startAutoplay();

// Animated stat counters (count up when scrolled into view)
const counters = document.querySelectorAll('.counter');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (reducedMotion) {
    el.textContent = target.toLocaleString();
    return;
  }
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
counters.forEach((el) => counterObserver.observe(el));

// Scroll-reveal animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Scroll-to-top button
const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 500);
});
scrollTopBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
