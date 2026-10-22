/**
 * BotonDePausa — SesiónActiva (Figma 13519:69639)
 * Variantes: corriendo | pausado | pressed | deshabilitado.
 */
(function () {
  const spec = window.FIGMA_SESION_ACTIVA;

  const STATES = /** @type {const} */ ({
    running: 'corriendo',
    paused: 'pausado',
    pressed: 'pressed',
    disabled: 'deshabilitado',
  });

  /**
   * @param {object} [options]
   * @param {'corriendo'|'pausado'|'deshabilitado'} [options.state]
   * @param {string} [options.ariaLabel]
   * @param {string} [options.className]
   */
  /** Minutero (Figma 13519:69620): anillo brand/200 que da una vuelta
   * completa cada 60s mientras la sesión corre, como un minutero real.
   * `sesion-en-curso.js` re-renderiza (innerHTML) el botón entero cada
   * segundo para refrescar el resto de la UI, lo que recrea este SVG y
   * reiniciaría la animación CSS a 0 en cada tick si no se compensara.
   * Para que se vea como una vuelta continua de 60s, cada render fija un
   * `animation-delay` negativo igual al tiempo ya transcurrido dentro del
   * ciclo actual (elapsedMs), de forma que la animación "retoma" desde el
   * punto correcto en vez de reiniciarse. */
  function renderMinutero(animate, elapsedMs) {
    const size = 120;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;
    const cycleSeconds = 60;
    const offsetSeconds = animate ? ((elapsedMs ?? 0) / 1000) % cycleSeconds : 0;
    const progressStyle = `--minutero-circumference: ${circumference};${
      animate ? ` animation-delay: -${offsetSeconds}s;` : ''
    }`;

    return `
      <svg
        class="BotonDePausa__minutero-svg${animate ? ' is-animating' : ''}"
        viewBox="0 0 ${size} ${size}"
        width="100%"
        height="100%"
      >
        <circle
          class="BotonDePausa__minutero-track"
          cx="${cx}"
          cy="${cy}"
          r="${radius}"
          fill="none"
          stroke-width="${stroke}"
        />
        <circle
          class="BotonDePausa__minutero-progress"
          cx="${cx}"
          cy="${cy}"
          r="${radius}"
          fill="none"
          stroke-width="${stroke}"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          transform="rotate(-90 ${cx} ${cy})"
          style="${progressStyle}"
        />
      </svg>
    `;
  }

  function render(options) {
    const { state = STATES.running, ariaLabel = 'Pausar sesión', className = '', elapsedMs = 0 } = options ?? {};
    const disabled = state === STATES.disabled;

    const isPressedVisual = state === STATES.paused || state === STATES.pressed;

    const iconSrc = isPressedVisual ? spec?.assets?.pauseIconWhite ?? '' : spec?.assets?.pauseIconBrand ?? '';

    return `
      <button
        type="button"
        class="BotonDePausa BotonDePausa--${state}${isPressedVisual ? ' BotonDePausa--pressed-visual' : ''}${
          className ? ` ${className}` : ''
        }"
        data-node-id="${spec?.nodes?.botonDePausa ?? '13519:69639'}"
        aria-label="${ariaLabel}"
        ${disabled ? 'disabled' : ''}
      >
        <span class="BotonDePausa__minutero" aria-hidden="true">
          ${renderMinutero(state === STATES.running, elapsedMs)}
        </span>
        <span class="BotonDePausa__button" aria-hidden="true">
          <span class="BotonDePausa__icon">
            <img class="BotonDePausa__icon-img" alt="" src="../${iconSrc}" />
          </span>
        </span>
      </button>
    `;
  }

  window.BotonDePausa = {
    render,
    STATES,
  };
})();

