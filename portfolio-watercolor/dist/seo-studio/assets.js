(() => {
  async function loadAssets() {
    const response = await fetch('assets.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Asset manifest: ${response.status}`);
    const assets = await response.json();
    for (const figure of document.querySelectorAll('[data-asset]')) {
      const asset = assets[figure.dataset.asset];
      if (!asset?.src) continue;
      const video = asset.type === 'video';
      const media = video ? document.createElement('video') : new Image();
      const placeholder = figure.querySelector('.asset-placeholder');
      const status = figure.querySelector('.asset-status');
      if (video) {
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.setAttribute('aria-label', asset.alt);
        if (asset.poster) media.poster = asset.poster;
      } else {
        media.alt = asset.alt;
        media.decoding = 'async';
        media.loading = figure.classList.contains('hero-asset') ? 'eager' : 'lazy';
      }
      media.addEventListener(video ? 'loadedmetadata' : 'load', () => {
        placeholder.hidden = true;
        status.textContent = `${asset.category} ready`;
      }, { once: true });
      media.addEventListener('error', () => {
        media.remove();
        placeholder.hidden = false;
        status.textContent = 'Asset unavailable · placeholder retained';
        console.error(`Could not load case study asset: ${figure.dataset.asset}`);
      }, { once: true });
      media.src = asset.src;
      figure.querySelector('.asset-stage').append(media);
    }
  }
  loadAssets().catch(error => console.error('Case study assets could not be loaded.', error));
})();
