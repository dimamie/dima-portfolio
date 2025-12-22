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
    emailCopyBtn.addEventListener('click', function() {
      const email = 'dzimaartizd@gmail.com';
      navigator.clipboard.writeText(email).then(function() {
        // Visual feedback - swap to check icon and text with GSAP animation
        const copyIcon = emailCopyBtn.querySelector('.copy-icon');
        const copyText = emailCopyBtn.querySelector('.copy-text');
        if (copyIcon && copyText) {
          // Fade out copy icon and text
          gsap.to([copyIcon, copyText], {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            onComplete: function() {
              // Create and add check icon
              const checkIcon = document.createElement('img');
              checkIcon.src = 'assets/Check.svg';
              checkIcon.alt = 'Copied';
              checkIcon.className = 'check-icon';
              checkIcon.style.opacity = '0';
              checkIcon.style.transform = 'scale(0.8)';
              copyIcon.replaceWith(checkIcon);
              
              // Update text to "Copied"
              copyText.textContent = 'Copied';
              copyText.style.opacity = '0';
              copyText.style.transform = 'scale(0.8)';
              
              // Fade in check icon and text
              gsap.to([checkIcon, copyText], {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                delay: 0.1
              });
              
              // After 2 seconds, fade out check and fade in copy
              setTimeout(function() {
                gsap.to([checkIcon, copyText], {
                  opacity: 0,
                  scale: 0.8,
                  duration: 0.2,
                  onComplete: function() {
                    checkIcon.replaceWith(copyIcon);
                    copyText.textContent = 'Copy';
                    gsap.fromTo([copyIcon, copyText], 
                      { opacity: 0, scale: 0.8 },
                      { opacity: 1, scale: 1, duration: 0.2 }
                    );
                  }
                });
              }, 2000);
            }
          });
        }
      }).catch(function(err) {
        console.error('Failed to copy email:', err);
      });
    });
  } else if (emailCopyBtn) {
    // Fallback if GSAP is not loaded
    emailCopyBtn.addEventListener('click', function() {
      const email = 'dzimaartizd@gmail.com';
      navigator.clipboard.writeText(email).then(function() {
        const copyIcon = emailCopyBtn.querySelector('.copy-icon');
        const copyText = emailCopyBtn.querySelector('.copy-text');
        if (copyIcon && copyText) {
          const checkIcon = document.createElement('img');
          checkIcon.src = 'assets/Check.svg';
          checkIcon.alt = 'Copied';
          checkIcon.className = 'check-icon';
          copyIcon.replaceWith(checkIcon);
          copyText.textContent = 'Copied';
          setTimeout(function() {
            checkIcon.replaceWith(copyIcon);
            copyText.textContent = 'Copy';
          }, 2000);
        }
      }).catch(function(err) {
        console.error('Failed to copy email:', err);
      });
    });
  }

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
})();
