/**
 * EstadoSinConexion — Figma 12903:7162 / bloque Sin red 12903:7300
 */
(function () {
  const DEFAULT = {
    nodeId: '12903:7300',
    title: 'Sin red',
    message: 'Conéctate para acceder a esta funcionalidad.',
    icon: 'assets/figma-session-detail/c194801f9565088be78a08aa9914286ab083756d.svg',
  };

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (
      base.includes('/session-detail/') ||
      base.includes('/home/') ||
      base.includes('/mentor/')
    ) {
      return `../${path}`;
    }
    return path;
  }

  /**
   * @param {object} [options]
   * @param {string} [options.title]
   * @param {string} [options.message]
   * @param {string} [options.icon]
   * @param {string} [options.nodeId]
   */
  function render(options) {
    const cfg = { ...DEFAULT, ...(options ?? {}) };

    return `
      <div
        class="EstadoSinConexion offline-panel"
        data-node-id="${cfg.nodeId}"
        role="status"
        aria-live="polite"
      >
        <img
          class="EstadoSinConexion__icon offline-panel__icon"
          src="${resolveAsset(cfg.icon)}"
          alt=""
          width="24"
          height="24"
        />
        <div class="EstadoSinConexion__text offline-panel__text">
          <h2 class="EstadoSinConexion__title offline-panel__title">${cfg.title}</h2>
          <p class="EstadoSinConexion__message offline-panel__message">${cfg.message}</p>
        </div>
      </div>
    `;
  }

  window.EstadoSinConexion = {
    render,
    resolveAsset,
    DEFAULT,
  };
})();
