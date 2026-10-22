/**
 * SesionEnCursoApp — controlador compartido de corriendo/pausado.
 */
(function () {
  if (!window.SesionEnCurso || !window.SessionRuntime) return;

  let intervalId = null;

  function getModeFromPath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    return path.includes('/sesion-parada/') ? 'paused' : 'running';
  }

  function preserveQuery(url) {
    return `${url}${window.location.search || ''}`;
  }

  function stopTimer() {
    if (intervalId != null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function bind() {
    document.querySelector('.BotonDePausa')?.addEventListener('click', () => {
      stopTimer();
      window.SessionRuntime.setMode('paused');
      window.location.href = preserveQuery('../sesion-parada/index.html');
    });

    document.querySelector('.BotonDePlay')?.addEventListener('click', () => {
      window.SessionRuntime.setMode('running');
      window.location.href = preserveQuery('../sesion-activa/index.html');
    });

    document.querySelector('.BotonStop')?.addEventListener('click', () => {
      window.PopUpSesionCorta?.open?.();
    });
  }

  function navigateToSuccess(outcome) {
    stopTimer();
    window.SessionRuntime.finish(outcome);
    window.location.href = preserveQuery('../pantalla-exito/index.html');
  }

  function startTimerIfNeeded() {
    const model = window.SessionRuntime.getViewModel();
    if (model.mode !== 'running') return;

    stopTimer();
    window.SessionRuntime.startGpsTracking();

    // Delta real desde el último tick (no se asume que pasen exactos
    // 1000ms — un tab en segundo plano puede retrasar el intervalo, y el
    // contador debe seguir reflejando el tiempo real transcurrido).
    let lastTickAt = Date.now();
    intervalId = window.setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickAt;
      lastTickAt = now;
      const { completed } = window.SessionRuntime.tick(deltaMs);
      if (completed) {
        navigateToSuccess('completed');
        return;
      }
      SesionEnCurso.mount();
      bind();
    }, 1000);
  }

  function mount() {
    const mode = getModeFromPath();
    const current = window.SessionRuntime.ensure();
    if (!current || current.mode !== mode) {
      window.SessionRuntime.setMode(mode);
    }

    if (mode === 'paused') {
      window.SessionRuntime.stopGpsTracking();
    }

    SesionEnCurso.mount();
    window.PopUpSesionCorta?.mount?.(document.body);
    bind();
    startTimerIfNeeded();
  }

  window.addEventListener('pagehide', () => {
    stopTimer();
    window.SessionRuntime.stopGpsTracking();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

