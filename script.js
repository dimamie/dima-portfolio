// Smooth scrolling and current year
(function () {

  // Smooth scroll for on-page anchors
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Current year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Project hover interactions
  const projectNames = document.querySelectorAll('.project-name');
  const projectPreview = document.querySelector('.project-preview');

  projectNames.forEach(project => {
    project.addEventListener('mouseenter', () => {
      const imageSrc = project.getAttribute('data-image');
      if (projectPreview && imageSrc) {
        projectPreview.src = imageSrc;
        projectPreview.alt = `${project.textContent} preview`;
      }
    });
  });

  // GSAP Hero Animation
  const heroTitles = document.querySelectorAll('.hero .hero-title');
  
  // Animation Switcher - Change the number to switch animations
  const animationType = 3; // Change this number: 1, 2, 3, 4, or 5

  const animations = {
    1: {
      from: { opacity: 0, x: -100 },
      to: { opacity: 1, x: 0, duration: 1.4, ease: "power3.out", stagger: 0.25 }
    },
    2: {
      from: { opacity: 0, scale: 0.5 },
      to: { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out", stagger: 0.3 }
    },
    3: {
      from: { opacity: 0, y: 100 },
      to: { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.2 }
    },
    4: {
      from: { opacity: 0, y: -200 },
      to: { opacity: 1, y: 0, duration: 1.4, ease: "power2.out", stagger: 0.25 }
    },
    5: {
      from: { opacity: 0, rotation: 180, scale: 0 },
      to: { opacity: 1, rotation: 0, scale: 1, duration: 1.8, ease: "power2.out", stagger: 0.3 }
    }
  };

  // Apply the selected animation
  const selectedAnimation = animations[animationType];
  gsap.fromTo(heroTitles, selectedAnimation.from, selectedAnimation.to);

  // Spotify last played (if API connected)
  const spotifyEl = document.getElementById('spotify-last-played');
  if (spotifyEl) {
    fetch('/api/spotify-last-played')
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if (!data || !data.item) return;
        var track = data.item.name;
        var artists = (data.item.artists || []).map(function(a){ return a.name; }).join(', ');
        var art = (data.item.album && Array.isArray(data.item.album.images) && data.item.album.images.length)
          ? data.item.album.images[0].url
          : '';
        var url = (data.item.external_urls && data.item.external_urls.spotify) ? data.item.external_urls.spotify : '#';
        var artImg = art ? '<img class="spotify-art" src="' + art + '" alt="album art" width="40" height="40" loading="lazy" />' : '';
        var info = '<div class="spotify-info">'
          + '<span class="spotify-artist">' + artists + '</span>'
          + '<a class="spotify-track" href="' + url + '" target="_blank" rel="noopener">' + track + '</a>'
          + '</div>';
        spotifyEl.innerHTML = artImg + info;
      })
      .catch(function(){});
  }

  // Calendar project animation - DISABLED
  /*
  const calendarProject = document.querySelector('[data-project="calendar"]');
  if (calendarProject) {
    const calendarImageContainer = calendarProject.querySelector('.project-image');
    const calendarImage = calendarProject.querySelector('.project-preview');
    const calendarImages = [
      'assets/Calendar/Calendar.png',
      'assets/Calendar/Calendar-1.png',
      'assets/Calendar/Calendar-2.png',
      'assets/Calendar/Calendar-3.png',
      'assets/Calendar/Calendar-4.png'
    ];
    const originalSrc = calendarImage.getAttribute('src') || 'assets/Calendar.png';
    const originalSrcset = calendarImage.getAttribute('srcset');
    const originalSizes = calendarImage.getAttribute('sizes');
    let currentFrame = 0;
    let animationInterval = null;
    const frameDelay = 300; // milliseconds between frames

    // Preload images
    calendarImages.forEach(function(src) {
      const img = new Image();
      img.src = src;
    });

    // Start animation on hover (only on the image container, not the whole project item)
    calendarImageContainer.addEventListener('mouseenter', function() {
      // Clear any existing interval
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
      
      // Add class to prevent CSS content property from interfering
      calendarProject.classList.add('is-animating');
      
      // Remove srcset and sizes to prevent conflicts
      calendarImage.removeAttribute('srcset');
      calendarImage.removeAttribute('sizes');
      
      currentFrame = 0;
      // Set first frame immediately
      calendarImage.src = calendarImages[0];
      
      // Start animation
      animationInterval = setInterval(function() {
        currentFrame = (currentFrame + 1) % calendarImages.length;
        calendarImage.src = calendarImages[currentFrame];
      }, frameDelay);
    });

    // Stop animation and reset on mouse leave (from image container)
    calendarImageContainer.addEventListener('mouseleave', function() {
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
      // Remove animation class
      calendarProject.classList.remove('is-animating');
      
      // Restore srcset and sizes
      if (originalSrcset) {
        calendarImage.setAttribute('srcset', originalSrcset);
      }
      if (originalSizes) {
        calendarImage.setAttribute('sizes', originalSizes);
      }
      // Reset to original image
      calendarImage.src = originalSrc;
      currentFrame = 0;
    });
  }
  */
})();

