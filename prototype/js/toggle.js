/**
 * Toggle — Design System (Figma 13413:6106 on / 13413:6107 off)
 * Propiedad 1: true = activado, false = desactivado
 */
(function () {
  const NODE_IDS = {
    on: '13413:6106',
    off: '13413:6107',
  };

  /**
   * @param {object} options
   * @param {boolean} [options.checked=false]
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @param {string} [options.ariaLabel]
   * @param {string} [options.className]
   */
  function render(options) {
    const {
      checked = false,
      id = '',
      name = '',
      ariaLabel = '',
      className = '',
    } = options ?? {};

    const idAttr = id ? ` id="${id}"` : '';
    const nameAttr = name ? ` name="${name}"` : '';
    const ariaLabelAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
    const nodeId = checked ? NODE_IDS.on : NODE_IDS.off;

    return `
      <button
        type="button"
        class="Toggle${checked ? ' is-on' : ' is-off'}${className ? ` ${className}` : ''}"
        role="switch"
        ${idAttr}
        ${nameAttr}
        ${ariaLabelAttr}
        aria-checked="${checked}"
        data-node-id="${nodeId}"
      >
        <span class="Toggle__track" aria-hidden="true"></span>
        <span class="Toggle__thumb" aria-hidden="true"></span>
      </button>
    `;
  }

  function setChecked(button, checked) {
    if (!button) return;
    button.classList.toggle('is-on', checked);
    button.classList.toggle('is-off', !checked);
    button.setAttribute('aria-checked', String(checked));
    button.dataset.nodeId = checked ? NODE_IDS.on : NODE_IDS.off;
  }

  function bind(root) {
    const scope = root || document;
    scope.querySelectorAll('.Toggle').forEach((btn) => {
      if (btn.dataset.toggleBound === 'true') return;
      btn.dataset.toggleBound = 'true';
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('aria-checked') !== 'true';
        setChecked(btn, next);
        btn.dispatchEvent(
          new CustomEvent('toggle:change', {
            bubbles: true,
            detail: { checked: next, id: btn.id || null },
          })
        );
      });
    });
  }

  window.Toggle = {
    render,
    bind,
    setChecked,
    NODE_IDS,
  };
})();
