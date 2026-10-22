/**
 * SesiónParada — Figma 13519:69761
 */
(function () {
  const spec = window.FIGMA_SESION_PARADA;

  function render() {
    const copy = spec?.copy ?? {};
    const assets = spec?.assets ?? {};

    return `
      <section
        class="screen screen--sesion-parada is-active SesionParada"
        id="sesion-parada"
        data-node-id="${spec?.screenNodeId ?? '13519:69761'}"
        aria-label="Sesión pausada"
      >
        <div class="SesionParada__content">
          <div class="SesionParada__metadatos">
            <div class="SesionParada__fases" data-node-id="${spec?.nodes?.indicadorFaseActual ?? '13519:69767'}">
              <div class="SesionParada__fase-actual">
                <p class="SesionParada__fase-minutos">${copy.currentPhaseMinutes ?? ''}</p>
                <p class="SesionParada__fase-nombre">${copy.currentPhaseName ?? ''}</p>
              </div>
              <div class="SesionParada__fase-siguiente">
                <p class="SesionParada__siguiente-label">${copy.nextPhaseLabel ?? ''}</p>
                <p class="SesionParada__siguiente-nombre">${copy.nextPhaseName ?? ''}</p>
              </div>
            </div>

            <div class="SesionParada__barras" data-node-id="${spec?.nodes?.barrasDeProgreso ?? '13519:69773'}">
              <div class="SesionParada__barra-progreso" aria-hidden="true">
                <div class="SesionParada__barra-progreso-base">
                  <img alt="" src="../${assets.progressTrack ?? ''}" />
                </div>
                <div class="SesionParada__barra-progreso-activo">
                  <img alt="" src="../${assets.progressSegmentActive ?? ''}" />
                </div>
              </div>
              <div class="SesionParada__barra-fase-inactiva" aria-hidden="true">
                <img alt="" src="../${assets.progressSegmentInactive ?? ''}" />
              </div>
              <div class="SesionParada__barra-fase-inactiva" aria-hidden="true">
                <img alt="" src="../${assets.progressSegmentInactive ?? ''}" />
              </div>
            </div>

            <div class="SesionParada__metricas" aria-label="Métricas de sesión">
              <div class="SesionParada__metrica">
                <p class="SesionParada__metrica-label">${copy.metricTimeLabel ?? ''}</p>
                <p class="SesionParada__metrica-valor">${copy.metricTimeValue ?? ''}</p>
              </div>
              <div class="SesionParada__metrica">
                <p class="SesionParada__metrica-label">${copy.metricDistanceLabel ?? ''}</p>
                <p class="SesionParada__metrica-valor">${copy.metricDistanceValue ?? ''}</p>
              </div>
            </div>

            <div class="SesionParada__controles" aria-label="Controles de sesión">
              <div class="SesionParada__control">
                ${window.BotonDePlay?.render?.({ ariaLabel: 'Reanudar sesión' }) ?? ''}
              </div>
              <div class="SesionParada__control">
                ${window.BotonStop?.render?.({ ariaLabel: 'Finalizar sesión' }) ?? ''}
              </div>
            </div>

            <div class="SesionParada__nota" data-node-id="${spec?.nodes?.notaDelMentor ?? '13519:69791'}">
              <p class="SesionParada__nota-texto">${copy.mentorNote ?? ''}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function mount(target) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root || !window.BotonDePlay || !window.BotonStop) return;
    root.innerHTML = render();
  }

  window.SesionParada = { render, mount };
})();

