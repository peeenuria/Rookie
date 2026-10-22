/**
 * BotonDePlay — SesiónParada (Figma 13519:69854)
 */
(function () {
  const spec = window.FIGMA_SESION_PARADA;

  /**
   * @param {object} [options]
   * @param {string} [options.ariaLabel]
   * @param {string} [options.className]
   * @param {boolean} [options.disabled]
   */
  function render(options) {
    const { ariaLabel = 'Reanudar sesión', className = '', disabled = false } = options ?? {};
    const iconSrc = spec?.assets?.playIconBrand ?? '';

    return `
      <button
        type="button"
        class="BotonDePlay${className ? ` ${className}` : ''}"
        data-node-id="${spec?.nodes?.botonPlay ?? '13519:69854'}"
        aria-label="${ariaLabel}"
        ${disabled ? 'disabled' : ''}
      >
        <span class="BotonDePlay__button" aria-hidden="true">
          <span class="BotonDePlay__icon">
            <img class="BotonDePlay__icon-img" alt="" src="../${iconSrc}" />
          </span>
        </span>
      </button>
    `;
  }

  window.BotonDePlay = { render };
})();

