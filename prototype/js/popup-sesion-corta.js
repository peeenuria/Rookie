/**
 * PopUpSesionCorta — Figma 13555:1962
 */
(function () {
  function preserveQuery(url) {
    return `${url}${window.location.search || ''}`;
  }

  const ASSETS = {
    closeIcon: '../assets/figma-popup-sesion-corta/67ffb78d869835aa63955c1a5e6591fc9b65c4fd.svg',
  };

  let rootEl = null;

  function render() {
    return `
      <div class="PopUpSesionCorta" id="popup-sesion-corta" hidden role="presentation">
        <div class="PopUpSesionCorta__backdrop" id="popup-sesion-corta-backdrop"></div>
        <div
          class="PopUpSesionCorta__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-sesion-corta-title"
        >
          <button type="button" class="PopUpSesionCorta__close" id="popup-sesion-corta-close" aria-label="Cerrar">
            <img src="${ASSETS.closeIcon}" alt="" aria-hidden="true" />
          </button>

          <div class="PopUpSesionCorta__content">
            <div class="PopUpSesionCorta__intro">
              <h2 class="PopUpSesionCorta__title" id="popup-sesion-corta-title">¿Sesión corta hoy?</h2>
              <p class="PopUpSesionCorta__subtitle">Tranquilo, lo entendemos</p>
            </div>

            <div class="PopUpSesionCorta__actions">
              <button type="button" class="btn btn--primary PopUpSesionCorta__action" id="popup-sesion-corta-resume">
                Reanudar sesión
              </button>
              <button
                type="button"
                class="btn btn--secondary PopUpSesionCorta__action PopUpSesionCorta__action--outline"
                id="popup-sesion-corta-save"
              >
                Parar y guardar
              </button>
              <button type="button" class="PopUpSesionCorta__link" id="popup-sesion-corta-delete">
                Borrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function open() {
    const popup = document.getElementById('popup-sesion-corta');
    if (!popup) return;
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add('is-visible'));
  }

  function close() {
    const popup = document.getElementById('popup-sesion-corta');
    if (!popup) return;
    popup.classList.remove('is-visible');
    window.setTimeout(() => {
      popup.hidden = true;
    }, 180);
  }

  function navigate(url) {
    window.location.href = url;
  }

  function bindEvents() {
    document.getElementById('popup-sesion-corta-backdrop')?.addEventListener('click', close);
    document.getElementById('popup-sesion-corta-close')?.addEventListener('click', close);
    document.getElementById('popup-sesion-corta-resume')?.addEventListener('click', () => {
      close();
      window.SessionRuntime?.setMode?.('running');
      navigate(preserveQuery('../sesion-activa/index.html'));
    });
    document.getElementById('popup-sesion-corta-save')?.addEventListener('click', () => {
      close();
      window.SessionRuntime?.finish?.('saved');
      navigate(preserveQuery('../pantalla-exito/index.html'));
    });
    document.getElementById('popup-sesion-corta-delete')?.addEventListener('click', () => {
      close();
      window.SessionRuntime?.deleteSessionAndRecalculate?.();
      navigate('../home/index.html');
    });
  }

  function mount(target) {
    const container = target || document.body;
    if (!container) return;
    if (rootEl && rootEl.isConnected) return;

    const wrap = document.createElement('div');
    wrap.innerHTML = render();
    rootEl = wrap.firstElementChild;
    container.appendChild(rootEl);
    bindEvents();
  }

  window.PopUpSesionCorta = { mount, open, close };
})();

