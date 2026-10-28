(() => {
  async function loadAssets() {
    const response = await fetch('assets.json');
    if (!response.ok) throw new Error(`Asset manifest: ${response.status}`);
    const assets = await response.json();
    for (const figure of document.querySelectorAll('[data-asset]')) {
      const asset = assets[figure.dataset.asset];
      if (!asset?.src) continue;
      const image = new Image();
      image.alt = asset.alt;
      image.decoding = 'async';
      image.loading = figure.classList.contains('hero-asset') ? 'eager' : 'lazy';
      image.addEventListener('load', () => {
        figure.querySelector('.asset-placeholder').hidden = true;
        figure.querySelector('.asset-status').textContent = 'Design artifact';
      });
      image.addEventListener('error', () => {
        image.remove();
        figure.querySelector('.asset-status').textContent = 'Asset unavailable · placeholder retained';
        console.error(`Could not load case study asset: ${figure.dataset.asset}`);
      });
      image.src = asset.src;
      figure.querySelector('.asset-stage').append(image);
    }
  }
  loadAssets().catch(error => console.error('Case study assets could not be loaded.', error));
})();
