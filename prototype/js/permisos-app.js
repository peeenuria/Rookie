/**
 * Permisos — entrada standalone (Figma 13413:5883)
 */
(function () {
  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = `../session-detail/index.html${window.location.search || ''}`;
  }

  function mount() {
    if (!window.PantallaDePermisos) {
      console.error('[permisos] PantallaDePermisos no disponible');
      return;
    }
    if (!window.BarraSuperiorBack) {
      console.error('[permisos] BarraSuperiorBack no disponible');
    }

    PantallaDePermisos.mount(document.querySelector('.phone-shell__body'), {
      onBack: goBack,
    });
  }

  window.PantallaDePermisosApp = {
    onContinue() {
      try {
        sessionStorage.setItem(
          'rookiePermisos',
          JSON.stringify({
            gps: window.PantallaDePermisos.getGpsState?.() || 'pending',
            trackers: Array.from(
              document.querySelectorAll('.PantallaDePermisos__tracker-row .Toggle.is-on')
            ).map((btn) => btn.closest('.PantallaDePermisos__tracker-row')?.dataset.trackerId),
          })
        );
      } catch (_) {
        /* ignore */
      }
      window.location.href = `../countdown/index.html${window.location.search || ''}`;
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
