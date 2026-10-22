/**
 * PantallaDeArranqueVamos — entrada standalone (Figma 13518:47757)
 */
(function () {
  if (!window.PantallaDeArranqueVamos) return;

  function mount() {
    PantallaDeArranqueVamos.mount();
  }

  window.PantallaDeArranqueVamosApp = {
    onComplete() {
      window.location.href = `../sesion-activa/index.html${window.location.search || ''}`;
    },
  };

  window.addEventListener('pagehide', () => {
    PantallaDeArranqueVamos.destroy?.();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
