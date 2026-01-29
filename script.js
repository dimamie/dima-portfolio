// Smooth scrolling and Spotify integration
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

  // Email copy to clipboard
  const emailCopyBtn = document.querySelector('.email-copy-btn');
  if (emailCopyBtn && typeof gsap !== 'undefined') {
    emailCopyBtn.addEventListener('click', function () {
      const email = 'dzimaartizd@gmail.com';
      navigator.clipboard.writeText(email).then(function () {
        // Visual feedback - swap to check icon with GSAP animation
        const copyText = emailCopyBtn.querySelector('.copy-text');
        if (copyText) {
          // Fade out copy text
          gsap.to(copyText, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            onComplete: function () {
              // Create and add check icon
              const checkIcon = document.createElement('img');
              checkIcon.src = 'assets/Check.svg';
              checkIcon.alt = 'Copied';
              checkIcon.className = 'check-icon';
              checkIcon.style.opacity = '0';
              checkIcon.style.transform = 'scale(0.8)';
              copyText.replaceWith(checkIcon);

              // Fade in check icon
              gsap.to(checkIcon, {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                delay: 0.1
              });

              // After 2 seconds, fade out check and fade in copy text
              setTimeout(function () {
                gsap.to(checkIcon, {
                  opacity: 0,
                  scale: 0.8,
                  duration: 0.2,
                  onComplete: function () {
                    checkIcon.replaceWith(copyText);
                    gsap.fromTo(copyText,
                      { opacity: 0, scale: 0.8 },
                      { opacity: 1, scale: 1, duration: 0.2 }
                    );
                  }
                });
              }, 2000);
            }
          });
        }
      }).catch(function (err) {
        console.error('Failed to copy email:', err);
      });
    });
  } else if (emailCopyBtn) {
    // Fallback if GSAP is not loaded
    emailCopyBtn.addEventListener('click', function () {
      const email = 'dzimaartizd@gmail.com';
      navigator.clipboard.writeText(email).then(function () {
        const copyText = emailCopyBtn.querySelector('.copy-text');
        if (copyText) {
          const checkIcon = document.createElement('img');
          checkIcon.src = 'assets/Check.svg';
          checkIcon.alt = 'Copied';
          checkIcon.className = 'check-icon';
          copyText.replaceWith(checkIcon);
          setTimeout(function () {
            checkIcon.replaceWith(copyText);
          }, 2000);
        }
      }).catch(function (err) {
        console.error('Failed to copy email:', err);
      });
    });
  }

  // Spotify last played (if API connected)
  const spotifyEl = document.getElementById('spotify-last-played');
  if (spotifyEl) {
    fetch('/api/spotify-last-played')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.item) return;
        var track = data.item.name;
        var artists = (data.item.artists || []).map(function (a) { return a.name; }).join(', ');
        var art = (data.item.album && Array.isArray(data.item.album.images) && data.item.album.images.length)
          ? data.item.album.images[0].url
          : '';
        var url = (data.item.external_urls && data.item.external_urls.spotify) ? data.item.external_urls.spotify : '#';
        var artImg = art ? '<img class="spotify-art" src="' + art + '" alt="album art" width="40" height="40" loading="lazy" />' : '';
        var info = '<div class="spotify-info">'
          + '<span class="spotify-artist">' + artists + '</span>'
          + '<a class="spotify-track" href="' + url + '" target="_blank" rel="noopener">' + track + '</a>'
          + '</div>';

        // Populate content and animate with GSAP if available
        spotifyEl.innerHTML = artImg + info;

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(spotifyEl.children,
            { opacity: 0, y: 5 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
          );
        }
      })
      .catch(function () { });
  }
})();
