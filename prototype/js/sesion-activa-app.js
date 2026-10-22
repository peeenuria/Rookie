/**
 * SesiónActiva — entrada standalone (Figma 13518:47767)
 */
(function () {
  const spec = window.FIGMA_SESION_ACTIVA;
  if (!window.SesionActiva) return;

  function mount() {
    SesionActiva.mount();

    const pauseBtn = document.querySelector('.BotonDePausa');
    pauseBtn?.addEventListener('click', () => {
      const next = spec?.routes?.onPause || '../sesion-parada/index.html';
      window.location.href = next;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

