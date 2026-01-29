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

  // 1. Header Content
  const headerContent = document.querySelector('.header-content');
  if (headerContent) {
    tl.from(headerContent, {
      opacity: 0,
      y: 20
    });
  }

  // 2. Header Email (slight delay after main header)
  const headerEmail = document.querySelector('.header-email');
  if (headerEmail) {
    tl.from(headerEmail, {
      opacity: 0,
      y: 15
    }, "-=0.6");
  }

  // 3. Project Items (staggered entry)
  const projectItems = document.querySelectorAll('.project-item');
  if (projectItems.length > 0) {
    tl.from(projectItems, {
      opacity: 0,
      y: 30,
      stagger: 0.15
    }, "-=0.4");
  }

  // 4. Footer
  const footer = document.querySelector('.footer');
  if (footer) {
    tl.from(footer, {
      opacity: 0,
      y: 10
    }, "-=0.4");
  }
});
