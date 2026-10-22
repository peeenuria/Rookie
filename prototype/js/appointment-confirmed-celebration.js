/**
 * Celebración 4.2.5 — check progresivo + confetti sutil (solo cita confirmada)
 */
(function () {
  const CHECK_VERSION = '4';
  const PARTICLE_COUNT = 12;
  const CONFETTI_DURATION_MS = 1800;

  const ARC_PATH =
    'M109.005 50C111.288 61.2065 109.661 72.8571 104.394 83.009C99.1274 93.1608 90.5395 101.2 80.0626 105.787C69.5857 110.373 57.8531 111.229 46.8215 108.212C35.7899 105.195 26.126 98.487 19.4414 89.2071C12.7568 79.9272 9.45561 68.6362 10.0883 57.2169C10.721 45.7977 15.2494 34.9405 22.9183 26.4559C30.5871 17.9713 40.9329 12.3722 52.2303 10.5923C63.5278 8.81238 75.0939 10.9593 85 16.675';
  const TICK_PATH = 'M45 55L60 70L110 20';

  const PARTICLE_COLORS = [
    'var(--color-brand-600)',
    'var(--color-brand-400)',
    'var(--color-brand-100)',
    'var(--color-neutral-50)',
    'var(--color-neutral-300)',
  ];

  function prepareStrokePaths(root) {
    root.querySelectorAll('.appointment-confirmed__check-path').forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }

  function mountCheck(mountEl) {
    if (!mountEl) return mountEl;
    if (mountEl.dataset.checkReady === 'true' && mountEl.dataset.checkVersion === CHECK_VERSION) {
      return mountEl;
    }

    mountEl.classList.add('appointment-confirmed__check');
    mountEl.setAttribute('aria-hidden', 'true');
    mountEl.innerHTML = `
      <svg class="appointment-confirmed__check-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="appointment-confirmed__check-path appointment-confirmed__check-path--arc" d="${ARC_PATH}"></path>
        <path class="appointment-confirmed__check-path appointment-confirmed__check-path--tick" d="${TICK_PATH}"></path>
      </svg>
    `;

    prepareStrokePaths(mountEl);
    mountEl.dataset.checkReady = 'true';
    mountEl.dataset.checkVersion = CHECK_VERSION;
    return mountEl;
  }

  function buildParticles(container) {
    container.innerHTML = '';

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.55;
      const burstDist = 42 + Math.random() * 48;
      const burstX = Math.round(Math.cos(angle) * burstDist);
      const burstY = Math.round(Math.sin(angle) * burstDist * 0.8 - (8 + Math.random() * 12));
      const driftX = Math.round((Math.random() - 0.5) * 24);
      const fallY = Math.round(44 + Math.random() * 52);
      const fallX = burstX + driftX;
      const fallYPos = burstY + fallY;
      const size = Math.round(4 + Math.random() * 3);
      const rotMid = Math.round((Math.random() - 0.5) * 120);
      const rotEnd = rotMid + Math.round((Math.random() - 0.5) * 160);
      const delay = Math.round(Math.random() * 80);
      const duration = 1650 + Math.round(Math.random() * 250);
      const isCircle = Math.random() > 0.45;
      const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];

      const particle = document.createElement('span');
      particle.className = 'appointment-confirmed__confetti-particle';
      particle.style.setProperty('--burst-x', `${burstX}px`);
      particle.style.setProperty('--burst-y', `${burstY}px`);
      particle.style.setProperty('--fall-x', `${fallX}px`);
      particle.style.setProperty('--fall-y', `${fallYPos}px`);
      particle.style.setProperty('--rot-mid', `${rotMid}deg`);
      particle.style.setProperty('--rot-end', `${rotEnd}deg`);
      particle.style.setProperty('--size', `${size}px`);
      particle.style.setProperty('--delay', `${delay}ms`);
      particle.style.setProperty('--duration', `${duration}ms`);
      particle.style.setProperty('--particle-color', color);
      particle.style.setProperty('--radius', isCircle ? '50%' : '2px');
      container.appendChild(particle);
    }
  }

  function playConfetti(container) {
    if (!container) return;

    buildParticles(container);
    container.classList.remove('appointment-confirmed__confetti--playing');
    void container.offsetWidth;
    container.classList.add('appointment-confirmed__confetti--playing');

    clearTimeout(container._confettiTimer);
    container._confettiTimer = setTimeout(() => {
      container.classList.remove('appointment-confirmed__confetti--playing');
      container.innerHTML = '';
    }, CONFETTI_DURATION_MS + 200);
  }

  function playConfirmedCheck(target) {
    const mountEl =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (!mountEl) return;

    const confettiEl = document.getElementById('appointment-confirmed-confetti');

    mountCheck(mountEl);
    mountEl.classList.remove('appointment-confirmed__check--done');
    prepareStrokePaths(mountEl);

    mountEl.classList.remove('appointment-confirmed__check--playing');
    void mountEl.offsetWidth;
    mountEl.classList.add('appointment-confirmed__check--playing');
    playConfetti(confettiEl);

    clearTimeout(mountEl._celebrationTimer);
    mountEl._celebrationTimer = setTimeout(() => {
      mountEl.classList.remove('appointment-confirmed__check--playing');
      mountEl.classList.add('appointment-confirmed__check--done');
      mountEl.querySelectorAll('.appointment-confirmed__check-path').forEach((path) => {
        path.style.strokeDashoffset = '0';
      });
    }, 1500);
  }

  window.AppointmentConfirmedCelebration = { play: playConfirmedCheck, mount: mountCheck };
})();
