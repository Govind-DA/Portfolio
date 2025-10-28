document.addEventListener('DOMContentLoaded', () => {
  // --- Set current year ---
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  // --- Dark Mode Toggle ---
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  const setInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) body.setAttribute('data-theme', savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      body.setAttribute('data-theme', 'dark');
  };

  const toggleTheme = () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleTheme);
    setInitialTheme();
  }

  // --- Burger Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.innerHTML = navLinks.classList.contains('open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // --- Reveal Animation ---
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('section').forEach(el => observer.observe(el));

  // --- Smooth Scroll (Ease In-Out) ---
  const SCROLL_DURATION = 1500;
  const slowSmoothScroll = e => {
    if (e.target.hash && e.target.hash.length > 1) {
      e.preventDefault();
      const target = document.querySelector(e.target.hash);
      if (!target) return;

      const start = window.pageYOffset;
      const end = target.getBoundingClientRect().top + start;
      const distance = end - start;
      const startTime = performance.now();

      const ease = t =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const animate = time => {
        const progress = Math.min((time - startTime) / SCROLL_DURATION, 1);
        const eased = ease(progress);
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      if (window.innerWidth <= 768 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', slowSmoothScroll)
  );

  // --- Show More Projects ---
  const showMoreBtn = document.getElementById('showMoreProjectsBtn');
  const projects = Array.from(document.querySelectorAll('.project-card')).slice(2);
  let visible = false;

  const toggleProjects = () => {
    if (!visible) {
      projects.forEach(p => {
        p.style.display = 'block';
        requestAnimationFrame(() => {
          p.classList.remove('project-hidden');
          p.classList.add('project-visible');
        });
      });
      showMoreBtn.textContent = 'Show Less Projects';
      visible = true;
    } else {
      projects.forEach(p => {
        p.classList.remove('project-visible');
        p.classList.add('project-hidden');
        setTimeout(() => (p.style.display = 'none'), 400);
      });
      showMoreBtn.textContent = 'Show More Projects';
      visible = false;
    }
  };

  if (showMoreBtn) showMoreBtn.addEventListener('click', toggleProjects);

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300)
        scrollToTopBtn.classList.add('visible');
      else scrollToTopBtn.classList.remove('visible');
    });
  }
});