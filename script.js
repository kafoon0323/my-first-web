const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || window.pageYOffset;
  if (header) {
    header.style.borderBottomColor = y > 8 ? '#e5e7eb' : '#eef2f7';
  }
  lastY = y;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

const revealTargets = [
  ...document.querySelectorAll('.section .section-inner'),
  ...document.querySelectorAll('.card'),
  ...document.querySelectorAll('.event'),
  ...document.querySelectorAll('.media'),
  ...document.querySelectorAll('.step'),
  ...document.querySelectorAll('.contact-grid > div')
];
revealTargets.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

if (window.matchMedia('(pointer: fine)').matches) {
  const tiltTargets = [
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('.event'),
    ...document.querySelectorAll('.media')
  ];
  tiltTargets.forEach(el => {
    const rect = () => el.getBoundingClientRect();
    el.addEventListener('mousemove', (e) => {
      const r = rect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 6;
      const ry = (x - 0.5) * 6;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

const galleries = document.querySelectorAll('.hero-gallery, .gallery, .gallery-combined');
const allImgs = document.querySelectorAll('.gallery-item img');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

allImgs.forEach(img => {
  img.addEventListener('error', () => {
    const parent = img.parentElement;
    img.remove();
    const ph = document.createElement('div');
    ph.style.width = '100%';
    ph.style.height = '100%';
    ph.style.background = 'linear-gradient(135deg, rgba(148,163,255,.25), rgba(255,148,208,.22))';
    parent.appendChild(ph);
  });
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.add('open');
  });
});

galleries.forEach(g => {
  const track = g.querySelector('.gallery-track');
  const prev = g.querySelector('.gallery-prev');
  const next = g.querySelector('.gallery-next');
  const dots = g.querySelector('.gallery-dots');
  const items = Array.from(g.querySelectorAll('.gallery-item'));
  let index = 0;
  if (dots) {
    dots.innerHTML = '';
    items.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i));
      dots.appendChild(b);
    });
  }
  function step(dir) {
    if (!track) return;
    const s = track.clientWidth * 0.8;
    track.scrollBy({ left: dir * s, behavior: 'smooth' });
  }
  function measure() {
    if (items.length < 2) return items[0]?.offsetLeft || 0;
    return items[1].offsetLeft - items[0].offsetLeft;
  }
  function goTo(i) {
    if (!track) return;
    index = (i + items.length) % items.length;
    const w = measure();
    const left = items[0].offsetLeft + w * index;
    track.scrollTo({ left, behavior: 'smooth' });
    if (dots) {
      dots.querySelectorAll('button').forEach((d, di) => {
        d.classList.toggle('active', di === index);
      });
    }
  }
  if (prev && next) {
    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));
  }
  let timer = setInterval(() => goTo(index + 1), 4000);
  g.addEventListener('mouseenter', () => { clearInterval(timer); });
  g.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(index + 1), 4000); });
});

if (lightbox) {
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
    if (lightboxImg) lightboxImg.src = '';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      if (lightboxImg) lightboxImg.src = '';
    }
  });
}
