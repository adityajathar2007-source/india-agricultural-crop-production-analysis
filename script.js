/**
 * India's Agricultural Crop Production Analysis
 * BTech AI & Data Science Academic Project
 * JavaScript Functionality & Tableau Embedding API v3 Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------ 1. Mobile Menu Toggle ------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------ 2. Header Scroll Effect & Active Navigation Link ------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    // Add enhanced shadow on scroll
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.03)';
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  // ------------------ 3. Back to Top Button ------------------
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------ 4. Tableau Embedding API v3 Integration ------------------
  const dashboardViz = document.getElementById('tableauDashboardViz');
  const dashboardLoader = document.getElementById('dashboardLoader');
  const storyViz = document.getElementById('tableauStoryViz');
  const storyLoader = document.getElementById('storyLoader');

  // Utility to safely hide loader
  const hideLoader = (loader) => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  };

  // Tableau Dashboard event listeners
  if (dashboardViz) {
    dashboardViz.addEventListener('firstinteractive', () => {
      console.log('Tableau Public Dashboard: firstinteractive event received');
      hideLoader(dashboardLoader);
    });

    dashboardViz.addEventListener('vizloaderror', (err) => {
      console.warn('Tableau Public Dashboard load error:', err);
      hideLoader(dashboardLoader);
    });

    // Fallback: hide loader after 3.5s so user sees the native Tableau interface immediately
    setTimeout(() => {
      hideLoader(dashboardLoader);
    }, 3500);
  }

  // Tableau Story event listeners
  if (storyViz) {
    storyViz.addEventListener('firstinteractive', () => {
      console.log('Tableau Public Story: firstinteractive event received');
      hideLoader(storyLoader);
    });

    storyViz.addEventListener('vizloaderror', (err) => {
      console.warn('Tableau Public Story load error:', err);
      hideLoader(storyLoader);
    });

    // Fallback: hide loader after 3.5s
    setTimeout(() => {
      hideLoader(storyLoader);
    }, 3500);
  }

  // Pre-warm / trigger loading when scrolling near dashboard or story
  const vizObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const viz = entry.target.querySelector('tableau-viz');
        if (viz && !viz.getAttribute('data-prewarmed')) {
          viz.setAttribute('data-prewarmed', 'true');
        }
      }
    });
  }, { rootMargin: '400px' });

  const dashboardContainer = document.getElementById('dashboardContainer');
  const storyContainer = document.getElementById('storyContainer');
  if (dashboardContainer) vizObserver.observe(dashboardContainer);
  if (storyContainer) vizObserver.observe(storyContainer);

  // ------------------ 5. Fullscreen & Reload Controls ------------------
  // Fullscreen Dashboard
  const btnDashboardFullscreen = document.getElementById('btnDashboardFullscreen');
  if (btnDashboardFullscreen && dashboardContainer) {
    btnDashboardFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        dashboardContainer.requestFullscreen().catch(err => {
          console.error(`Fullscreen request failed: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Reload Dashboard
  const btnDashboardReload = document.getElementById('btnDashboardReload');
  if (btnDashboardReload && dashboardViz) {
    btnDashboardReload.addEventListener('click', () => {
      if (dashboardLoader) {
        dashboardLoader.classList.remove('hidden');
      }
      const currentSrc = dashboardViz.src;
      dashboardViz.src = '';
      setTimeout(() => {
        dashboardViz.src = currentSrc;
      }, 100);
    });
  }

  // Fullscreen Story
  const btnStoryFullscreen = document.getElementById('btnStoryFullscreen');
  if (btnStoryFullscreen && storyContainer) {
    btnStoryFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        storyContainer.requestFullscreen().catch(err => {
          console.error(`Fullscreen request failed: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Reload Story
  const btnStoryReload = document.getElementById('btnStoryReload');
  if (btnStoryReload && storyViz) {
    btnStoryReload.addEventListener('click', () => {
      if (storyLoader) {
        storyLoader.classList.remove('hidden');
      }
      const currentSrc = storyViz.src;
      storyViz.src = '';
      setTimeout(() => {
        storyViz.src = currentSrc;
      }, 100);
    });
  }
});
