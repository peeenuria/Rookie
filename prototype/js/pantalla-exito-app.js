/**
 * PantallaExito — entrada standalone
 * Soporta overrides por query params:
 * - name=...
 * - a1=...&a2=...&a3=...
 */
(function () {
  const spec = window.FIGMA_PANTALLA_EXITO;
  if (!window.PantallaExito) return;

  function readStateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const userName = params.get('name') || null;

    const achievements = [params.get('a1'), params.get('a2'), params.get('a3')].filter(Boolean);

    const state = {};
    if (userName) state.userName = userName;
    if (achievements.length) state.achievements = achievements;
    return state;
  }

  function readStateFromRuntime() {
    return window.SessionRuntime?.loadSuccess?.() || null;
  }

  function mount() {
    const state = readStateFromRuntime() || readStateFromQuery();
    PantallaExito.mount(null, state);

    document.getElementById('pantalla-exito-continue')?.addEventListener('click', () => {
      const next = spec?.routes?.onContinue || '../esfuerzo-percibido/index.html';
      window.location.href = next;
    });

    if (window.AppointmentConfirmedCelebration) {
      requestAnimationFrame(() =>
        window.AppointmentConfirmedCelebration.play('#appointment-confirmed-check')
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

