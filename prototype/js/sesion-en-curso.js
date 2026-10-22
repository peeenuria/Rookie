/**
 * SesionEnCurso — componente base reutilizado para corriendo/pausado.
 */
(function () {
  /**
   * BarrasDeProgreso (Figma 13519:69662) — la fase en curso es la única
   * barra "grande" y se rellena en vivo (phaseProgress); las demás fases
   * son marcadores pequeños: llenos (brand/600) si ya se completaron,
   * vacíos (neutral/200) si todavía no llegan.
   */
  function renderBars(model) {
    const segments = new Array(model.totalPhases).fill(null).map((_, index) => {
      if (index === model.phaseIndex) {
        const pct = Math.round((model.phaseProgress ?? 0) * 100);
        return `
          <div class="SesionEnCurso__barra-progreso" aria-hidden="true">
            <div class="SesionEnCurso__barra-progreso-base"></div>
            <div class="SesionEnCurso__barra-progreso-activo" style="width:${pct}%"></div>
          </div>
        `;
      }
      const isDone = index < model.phaseIndex;
      return `
        <div class="SesionEnCurso__barra-fase-inactiva${isDone ? ' is-done' : ''}" aria-hidden="true"></div>
      `;
    });

    return segments.join('');
  }

  function renderControls(model) {
    if (model.showPausedControls) {
      return `
        <div class="SesionEnCurso__controles" aria-label="Controles de sesión">
          ${window.BotonDePlay?.render?.({ ariaLabel: 'Reanudar sesión' }) ?? ''}
          ${window.BotonStop?.render?.({ ariaLabel: 'Finalizar sesión' }) ?? ''}
        </div>
      `;
    }

    return `
      <div class="SesionEnCurso__pausa" aria-label="Control de pausa">
        ${window.BotonDePausa?.render?.({ state: 'corriendo', ariaLabel: 'Pausar sesión', elapsedMs: model.totalElapsedMs }) ?? ''}
      </div>
    `;
  }

  function render() {
    const model = window.SessionRuntime?.getViewModel?.();
    const mode = model?.mode === 'paused' ? 'paused' : 'running';

    if (!model) return '';

    return `
      <section
        class="screen screen--sesion-en-curso is-active SesionEnCurso SesionEnCurso--${mode}"
        id="sesion-en-curso"
        aria-label="${mode === 'paused' ? 'Sesión pausada' : 'Sesión activa'}"
      >
        <div class="SesionEnCurso__content">
          <div class="SesionEnCurso__metadatos">
            <div class="SesionEnCurso__fases">
              <div class="SesionEnCurso__fase-actual">
                <p class="SesionEnCurso__fase-minutos">${model.currentPhaseMinutes}</p>
                <p class="SesionEnCurso__fase-nombre">${model.currentPhaseName}</p>
              </div>
              <div class="SesionEnCurso__fase-siguiente">
                <p class="SesionEnCurso__siguiente-label">${model.nextPhaseLabel}</p>
                <p class="SesionEnCurso__siguiente-nombre">${model.nextPhaseName}</p>
              </div>
            </div>

            <div class="SesionEnCurso__barras">
              ${renderBars(model)}
            </div>

            <div class="SesionEnCurso__metricas" aria-label="Métricas de sesión">
              <div class="SesionEnCurso__metrica">
                <p class="SesionEnCurso__metrica-label">Tiempo</p>
                <p class="SesionEnCurso__metrica-valor">${model.elapsedText}</p>
              </div>
              <div class="SesionEnCurso__metrica">
                <p class="SesionEnCurso__metrica-label">Distancia</p>
                <p class="SesionEnCurso__metrica-valor">${model.distanceText}</p>
              </div>
            </div>

            ${renderControls(model)}

            <div class="SesionEnCurso__nota">
              <p class="SesionEnCurso__nota-texto">${model.mentorNote}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function mount(target) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return;
    root.innerHTML = render();
  }

  window.SesionEnCurso = { render, mount };
})();

