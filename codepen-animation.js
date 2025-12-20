// GSAP Animations (simplified)
document.addEventListener('DOMContentLoaded', function() {
  // Check if ScrollTrigger is available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // Optional: Add fade-in animation for header
  const headerContent = document.querySelector('.header-content');
  if (headerContent) {
    gsap.from(headerContent, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    });
  }
});
