/**
 * SesiónParada — entrada standalone (Figma 13519:69761)
 */
(function () {
  const spec = window.FIGMA_SESION_PARADA;
  if (!window.SesionParada) return;

  function mount() {
    SesionParada.mount();
    window.PopUpSesionCorta?.mount?.(document.body);

    document.querySelector('.BotonDePlay')?.addEventListener('click', () => {
      const next = spec?.routes?.onPlay || '../sesion-activa/index.html';
      window.location.href = next;
    });

    document.querySelector('.BotonStop')?.addEventListener('click', () => {
      window.PopUpSesionCorta?.open?.();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

