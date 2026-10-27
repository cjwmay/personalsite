(() => {
  const portrait = document.querySelector('#dotted-artist');
  const page = document.querySelector('.page');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layers = ['back', 'front'].map(depth => {
    const layer = document.createElement('div');
    layer.className = `petal-layer petal-layer--${depth}`;
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
    return layer;
  });
  const hand = document.createElement('span');
  hand.className = 'petal-hand';
  hand.textContent = '🤲🏻';
  hand.setAttribute('aria-hidden', 'true');
  document.body.append(hand);
  const falling = new Map();
  const petals = new Set();
  let pointer = null;
  let pointerFrame = 0;
  let timer;
  let settled = 0;
  let pageHeight = 0;
  const hair = [[120,825],[140,775],[160,720],[105,690],[190,800]];

  function restingX(petal, position) {
    const edge = document.documentElement.clientWidth - parseFloat(petal.style.width) - 14;
    const start = Math.min(page.getBoundingClientRect().right + 4, Math.max(14, edge - 120));
    return start + position * Math.min(120, edge - start);
  }
  function resize() {
    pageHeight = innerHeight;
    for (const layer of layers) layer.style.height = `${pageHeight}px`;
    for (const petal of petals) {
      if (petal.dataset.landingPosition) petal.style.left = `${restingX(petal, Number(petal.dataset.landingPosition))}px`;
    }
  }
  function release() {
    const box = portrait.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight || falling.size >= 7 || settled + falling.size >= 120) return;
    const scale = Math.min(portrait.clientWidth / 1089, portrait.clientHeight / 1445) * 1.18;
    const [hx, hy] = hair[Math.floor(Math.random() * hair.length)];
    const x = box.left + box.width / 2 + (hx - 544.5) * scale;
    const y = box.top + box.height / 2 + (hy - 722.5) * scale;
    const content = page.getBoundingClientRect();
    const room = Math.max(0, x - content.left - 12);
    const sway = Math.min(15 + Math.random() * 20, room * 0.2);
    const turn = Math.random() * 360;
    const spin = (180 + Math.random() * 480) * (Math.random() < 0.5 ? -1 : 1);
    const flutter = 3 + Math.random() * 5;
    const petal = document.createElement('i');
    petal.className = 'flower-petal';
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    const slender = Math.random() < 0.4;
    petal.style.width = `${slender ? 4 + Math.random() * 3 : 7 + Math.random() * 5}px`;
    petal.style.height = `${8 + Math.random() * 7}px`;
    const shapes = [
      [85,15,70,30,75,25,80,35],
      [55,70,45,65,85,50,45,30],
      [90,10,80,20,60,20,90,40],
      [35,65,85,55,70,85,30,45]
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
      .map(value => `${Math.max(5, Math.min(95, value + (Math.random() - 0.5) * 24))}%`);
    petal.style.borderRadius = `${shape.slice(0,4).join(' ')} / ${shape.slice(4).join(' ')}`;
    petal.style.setProperty('--petal-hue', String(8 + Math.random() * 20));
    const position = Math.random();
    const bottom = 4 + Math.pow(Math.random(), 1.7) * 30;
    const drift = restingX(petal, position) - x;
    const distance = pageHeight - bottom - parseFloat(petal.style.height) - y;
    const resting = `rotate(${turn + spin}deg) scaleX(0.9)`;
    layers[Math.random() < 0.7 ? 0 : 1].append(petal);
    petals.add(petal);
    if (pointer && !pointerFrame) pointerFrame = requestAnimationFrame(reactToPointer);
    const frames = Array.from({length:17}, (_,i) => {
      const t = i / 16;
      const dx = drift * t * t * t - 50 * Math.sin(t * Math.PI) * (1 - t) + Math.sin(t * Math.PI * 4) * sway * Math.sin(t * Math.PI);
      return {
        transform: `translate(${dx}px,${distance*t}px) rotate(${turn + t*spin}deg) scaleX(${0.65 + Math.cos(t*Math.PI*flutter)*0.35})`,
        opacity: i === 0 ? 0 : 0.7,
        offset: t
      };
    });
    frames[16].transform = `translate(${drift}px,${distance}px) ${resting}`;
    const animation = petal.animate(frames, {duration: 9000 + Math.random()*10000, easing:'linear', fill:'forwards'});
    falling.set(petal, animation);
    animation.onfinish = () => {
      falling.delete(petal);
      settled++;
      petal.style.left = `${restingX(petal, position)}px`;
      petal.dataset.landingPosition = String(position);
      petal.style.top = 'auto';
      petal.style.right = 'auto';
      petal.style.bottom = `${bottom}px`;
      petal.style.transform = resting;
      petal.style.opacity = '0.7';
      animation.cancel();
    };
  }
  function schedule() {
    timer = setTimeout(() => {
      release();
      if (settled + falling.size < 120) schedule();
    }, 800 + Math.random() * 5000);
  }
  function sync() {
    clearTimeout(timer);
    for (const [petal, animation] of falling) {
      animation.cancel();
      petal.remove();
      petals.delete(petal);
    }
    falling.clear();
    if (reduced.matches || document.hidden) { clearPointer(); return; }
    schedule();
  }
  function reactToPointer() {
    pointerFrame = 0;
    if (!pointer || reduced.matches || document.hidden) return;
    const updates = [];
    let interacting = false;
    for (const petal of petals) {
      const box = petal.getBoundingClientRect();
      const translation = getComputedStyle(petal).translate.split(' ');
      const tx = parseFloat(translation[0]) || 0;
      const ty = parseFloat(translation[1]) || 0;
      const dx = box.left + box.width / 2 - tx - pointer.x;
      const dy = box.top + box.height / 2 - ty - pointer.y;
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - distance / 26);
      if (strength > 0) interacting = true;
      const push = strength * strength * 18;
      const offsetX = distance > 0 ? dx / distance * push : 12;
      const offsetY = distance > 0 ? dy / distance * push : -12;
      updates.push([petal,
        Math.max(4 - box.left + tx, Math.min(document.documentElement.clientWidth - box.right + tx - 4, offsetX)),
        Math.min(pageHeight - box.bottom + ty - 4, offsetY)]);
    }
    document.documentElement.classList.toggle('petal-interaction', interacting);
    if (interacting) {
      const x = Math.max(11, Math.min(innerWidth - 11, pointer.x));
      const y = Math.max(11, Math.min(innerHeight - 11, pointer.y));
      hand.style.transform = `translate3d(${x}px,${y}px,0)`;
    }
    for (const [petal, dx, dy] of updates) petal.style.translate = `${dx}px ${dy}px`;
    if (falling.size) pointerFrame = requestAnimationFrame(reactToPointer);
  }
  function clearPointer() {
    pointer = null;
    document.documentElement.classList.remove('petal-interaction');
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    for (const petal of petals) petal.style.translate = '0px 0px';
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches) return;
    pointer = {x:event.clientX, y:event.clientY};
    if (!pointerFrame) pointerFrame = requestAnimationFrame(reactToPointer);
  }, {passive:true});
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) clearPointer();
  });
  addEventListener('blur', clearPointer);
  addEventListener('resize', resize);
  addEventListener('scroll', () => {
    if (pointer && !pointerFrame) pointerFrame = requestAnimationFrame(reactToPointer);
  }, {passive:true});
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  addEventListener('pagehide', () => { clearTimeout(timer); }, {once:true});
  resize();
  sync();
})();
