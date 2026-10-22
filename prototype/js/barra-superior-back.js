/**
 * BarraSuperiorBack — Figma 13278:5021
 * Variantes: Predeterminada (+ Pressed) | Variante4/claro (+ PressedClaro)
 */
(function () {
  const ARROW_SVG = `
    <svg class="BarraSuperiorBack__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5L5 12L12 19M5 12H19"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;

  /**
   * @param {object} options
   * @param {string} options.id — id del botón
   * @param {'predeterminada'|'claro'} [options.variant='predeterminada']
   * @param {string} [options.ariaLabel='Volver']
   * @param {string} [options.className='']
   */
  function render(options) {
    const id = options.id;
    const variant = options.variant === 'claro' ? 'claro' : 'predeterminada';
    const ariaLabel = options.ariaLabel || 'Volver';
    const extraClass = options.className ? ` ${options.className}` : '';
    const variantClass =
      variant === 'claro' ? ' BarraSuperiorBack--claro' : ' BarraSuperiorBack--predeterminada';

    return `
      <nav
        class="BarraSuperiorBack${variantClass}${extraClass}"
        data-barra-superior-back
        data-variant="${variant}"
        aria-label="Navegación"
      >
        <button
          type="button"
          class="BarraSuperiorBack__btn"
          id="${id}"
          aria-label="${ariaLabel}"
          data-barra-superior-back-btn
        >
          <span class="BarraSuperiorBack__hit" aria-hidden="true"></span>
          ${ARROW_SVG}
        </button>
      </nav>
    `;
  }

  /**
   * Feedback Pressed / PressedClaro vía pointer (mismo patrón táctil del prototipo).
   * @param {HTMLElement|string|null} target — botón o id
   * @param {() => void} [onClick]
   */
  function bind(target, onClick) {
    const btn =
      typeof target === 'string' ? document.getElementById(target) : target;
    if (!btn || btn.dataset.barraSuperiorBound === 'true') return btn;

    btn.dataset.barraSuperiorBound = 'true';

    const setPressed = (pressed) => {
      btn.classList.toggle('is-pressed', pressed);
    };

    btn.addEventListener('pointerdown', () => setPressed(true));
    btn.addEventListener('pointerup', () => setPressed(false));
    btn.addEventListener('pointercancel', () => setPressed(false));
    btn.addEventListener('pointerleave', () => setPressed(false));
    btn.addEventListener('blur', () => setPressed(false));

    if (typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    return btn;
  }

  window.BarraSuperiorBack = { render, bind };
})();
