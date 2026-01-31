// GSAP Animations - Coordinated Site Entrance
document.addEventListener('DOMContentLoaded', function () {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available (for future use)
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Create a master timeline for the initial load
  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "power2.out"
    }
  });

  // 1. Header Elements (Profile / Project Info)
  const headerProfile = document.querySelector('.header-profile');
  const projectInfo = document.querySelector('.header-project-info');
  const headerContent = document.querySelector('.header-content'); // For index page

  if (headerProfile || projectInfo || headerContent) {
    tl.from([headerProfile, projectInfo, headerContent].filter(Boolean), {
      opacity: 0,
      y: 20,
      stagger: 0.1
    });
  }

  // 2. Header Email (slight delay)
  const headerEmail = document.querySelector('.header-email');
  if (headerEmail) {
    tl.from(headerEmail, {
      opacity: 0,
      y: 15
    }, "-=0.6");
  }

  // 3. Project Sidebars (ToC)
  const projectSidebar = document.querySelector('.project-sidebar');
  if (projectSidebar) {
    tl.from(projectSidebar, {
      opacity: 0,
      x: -20
    }, "-=0.6");
  }

  // 4. Grid Items / Project Items (staggered entry)
  const projectItems = document.querySelectorAll('.project-item');
  const gridItems = document.querySelectorAll('.grid-item');

  if (projectItems.length > 0 || gridItems.length > 0) {
    tl.from([...projectItems, ...gridItems], {
      opacity: 0,
      y: 30,
      stagger: 0.1
    }, "-=0.4");
  }

  // 5. Footer
  const footer = document.querySelector('.footer');
  if (footer) {
    tl.from(footer, {
      opacity: 0,
      y: 10
    }, "-=0.4");
  }
});
