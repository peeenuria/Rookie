/**
 * Countdown — entrada standalone (Figma 13516:47558)
 */
(function () {
  if (!window.PantallaDeArranqueNumeros) return;

  function mount() {
    PantallaDeArranqueNumeros.mount();
  }

  window.PantallaDeArranqueNumerosApp = {
    onComplete() {
      window.location.href = `../vamos/index.html${window.location.search || ''}`;
    },
  };

  window.addEventListener('pagehide', () => {
    PantallaDeArranqueNumeros.destroy?.();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
