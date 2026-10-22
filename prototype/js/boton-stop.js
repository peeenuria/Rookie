/**
 * BotonStop — SesiónParada (Figma 13519:69883)
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
    const { ariaLabel = 'Finalizar sesión', className = '', disabled = false } = options ?? {};
    const iconSrc = spec?.assets?.stopIconBrand ?? '';

    return `
      <button
        type="button"
        class="BotonStop${className ? ` ${className}` : ''}"
        data-node-id="${spec?.nodes?.botonStop ?? '13519:69883'}"
        aria-label="${ariaLabel}"
        ${disabled ? 'disabled' : ''}
      >
        <span class="BotonStop__button" aria-hidden="true">
          <span class="BotonStop__icon">
            <img class="BotonStop__icon-img" alt="" src="../${iconSrc}" />
          </span>
        </span>
      </button>
    `;
  }

  window.BotonStop = { render };
})();

