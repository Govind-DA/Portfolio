document.addEventListener('DOMContentLoaded', () => {

    // --- Initial Setup ---
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Dark Mode Toggle Logic ---
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

    // --- Reveal Animation (Intersection Observer) ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // When a hidden section enters the viewport, add 'show'
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Stop observing after it's shown once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(el => observer.observe(el));


    // --- Hamburger Menu Toggle (for Mobile) ---
    const navLinks = document.getElementById('navLinks');

    if (darkModeToggle && navLinks) {
        // Use darkModeToggle as the hamburger icon on small screens (assuming you use CSS to make it act as a button)
        darkModeToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { 
                // Delay menu toggle slightly to allow theme change animation if needed
                setTimeout(() => {
                    navLinks.classList.toggle('open');
                }, 50); 
            }
        });
    }

    // --- SLOW, SMOOTH SCROLLING LOGIC (800ms) ---
    const SCROLL_DURATION = 1500; // Corrected to 800ms for slow scroll

    const slowSmoothScroll = (e) => {
        // Ensure it is an internal anchor link
        if (e.target.hash && e.target.hash.length > 1) {
            e.preventDefault(); 
            
            const targetId = e.target.hash;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Determine start and end positions
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
                const distance = targetPosition - startPosition;
                const startTime = performance.now();

                // Easing function: easeInOutQuad (for smooth acceleration/deceleration)
                const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                const animateScroll = (currentTime) => {
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / SCROLL_DURATION, 1);
                    
                    const easedProgress = easeInOutQuad(progress);

                    window.scrollTo(0, startPosition + distance * easedProgress);

                    if (timeElapsed < SCROLL_DURATION) {
                        requestAnimationFrame(animateScroll);
                    }
                };
                
                requestAnimationFrame(animateScroll);
                
                // If on mobile, close the menu after clicking a link
                if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                }
            }
        }
    };

    // Apply the custom slow scroll handler to all internal links (navbar and scroll-to-top button)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', slowSmoothScroll);
    });


    // --- Project Show More/Show Less Logic ---
    const showMoreBtn = document.getElementById('showMoreProjectsBtn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsToHide = Array.from(projectCards).slice(2);
    let allProjectsVisible = false;

    const initializeProjects = () => {
        projectsToHide.forEach(card => {
            card.classList.add('project-hidden');
            card.style.display = 'none'; 
        });
        if (showMoreBtn) {
            showMoreBtn.textContent = `Show More Projects`;
        }
    };

    const toggleProjects = () => {
        if (!allProjectsVisible) {
            projectsToHide.forEach(card => {
                card.style.display = 'grid'; // Use 'grid' to match project-grid
                requestAnimationFrame(() => {
                    card.classList.remove('project-hidden');
                    card.classList.add('project-visible');
                });
            });
            showMoreBtn.textContent = 'Show Less Projects';
            allProjectsVisible = true;
        } else {
            projectsToHide.forEach(card => {
                card.classList.remove('project-visible');
                card.classList.add('project-hidden');
            });
            setTimeout(() => {
                projectsToHide.forEach(card => {
                    card.style.display = 'none';
                });
            }, 400); // Wait for CSS transition before setting display: none
            showMoreBtn.textContent = 'Show More Projects';
            allProjectsVisible = false;
        }
    };

    initializeProjects();
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', toggleProjects);
    }

    // --- Scroll To Top Button Visibility ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // Show the button when scrolling past 300px
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }

});