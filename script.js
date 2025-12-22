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
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', function() {
      const email = 'dzimaartizd@gmail.com';
      navigator.clipboard.writeText(email).then(function() {
        // Visual feedback
        const originalHTML = emailCopyBtn.innerHTML;
        emailCopyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4.5L6 12M13.5 4.5L10 4.5M13.5 4.5L13.5 8M6 12L2.5 12M6 12L6 8.5M2.5 12L2.5 3.5L10 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        emailCopyBtn.style.color = 'var(--text)';
        setTimeout(function() {
          emailCopyBtn.innerHTML = originalHTML;
          emailCopyBtn.style.color = '';
        }, 2000);
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
