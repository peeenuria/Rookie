/**
 * Countdown — Figma 13518:47738
 * Número + arco de progreso animables.
 */
(function () {
  const spec = window.FIGMA_COUNTDOWN;

  function getCircumference() {
    const r = spec?.layout?.arcRadius ?? 85;
    return 2 * Math.PI * r;
  }

  function applyTimingVars() {
    const stepMs = spec?.stepDurationMs ?? 1000;
    const circumference = getCircumference();
    document.documentElement.style.setProperty('--countdown-circumference', String(circumference));
    document.documentElement.style.setProperty('--countdown-step-duration', `${stepMs}ms`);
  }

  /**
   * @param {object} [options]
   * @param {number} [options.value=3]
   * @param {boolean} [options.animate=false]
   */
  function render(options) {
    const { value = 3, animate = false } = options ?? {};
    const layout = spec?.layout ?? {};
    const circumference = getCircumference();
    const stroke = layout.arcStroke ?? 10;
    const radius = layout.arcRadius ?? 85;
    const cx = 90;
    const cy = 90;

    return `
      <div
        class="Countdown"
        data-node-id="${spec?.componentNodeId ?? '13518:47738'}"
        style="width:${layout.width ?? 160}px;height:${layout.height ?? 196}px"
      >
        <div class="Countdown__arc-wrap" aria-hidden="true">
          <svg
            class="Countdown__arc${animate ? ' is-animating' : ''}"
            viewBox="0 0 180 180"
            width="${layout.arcSize ?? 160}"
            height="${layout.arcSize ?? 160}"
          >
            <circle
              class="Countdown__arc-track"
              cx="${cx}"
              cy="${cy}"
              r="${radius}"
              fill="none"
              stroke="var(--color-brand-300)"
              stroke-width="${stroke}"
            />
            <circle
              class="Countdown__arc-progress"
              cx="${cx}"
              cy="${cy}"
              r="${radius}"
              fill="none"
              stroke="var(--color-neutral-50)"
              stroke-width="${stroke}"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${circumference}"
              transform="rotate(-90 ${cx} ${cy})"
            />
          </svg>
        </div>
        <p class="Countdown__number" aria-live="polite" aria-atomic="true">${value}</p>
      </div>
    `;
  }

  function restartArc(countdownRoot) {
    const arc = countdownRoot?.querySelector('.Countdown__arc');
    const progress = countdownRoot?.querySelector('.Countdown__arc-progress');
    const number = countdownRoot?.querySelector('.Countdown__number');
    if (!arc || !progress) return;

    if (!arc.classList.contains('is-animating')) {
      arc.classList.add('is-animating');
    }

    // Reinicia la animación reseteando `animation` en el propio elemento
    // animado (no basta con quitar/poner una clase en el ancestro: una vez
    // que la animación anterior termina con fill:forwards, el navegador deja
    // "pegado" el estado final en el primer intento de reinicio via toggle
    // de clase, y el arco no vuelve a rellenarse en el 2º/3er número).
    const circumference = getCircumference();
    progress.style.animation = 'none';
    progress.style.strokeDashoffset = String(circumference);
    void progress.getBoundingClientRect();
    progress.style.animation = '';

    if (number) {
      number.classList.remove('is-entering');
      void number.offsetWidth;
      number.classList.add('is-entering');
    }
  }

  function setValue(countdownRoot, value) {
    const number = countdownRoot?.querySelector('.Countdown__number');
    if (number) number.textContent = String(value);
    restartArc(countdownRoot);
  }

  window.Countdown = {
    render,
    setValue,
    restartArc,
    getCircumference,
    applyTimingVars,
  };
})();
