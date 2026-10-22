/**
 * SesiónActiva — Figma 13518:47767
 */
(function () {
  const spec = window.FIGMA_SESION_ACTIVA;

  function render() {
    const copy = spec?.copy ?? {};
    const assets = spec?.assets ?? {};

    return `
      <section
        class="screen screen--sesion-activa is-active SesionActiva"
        id="sesion-activa"
        data-node-id="${spec?.screenNodeId ?? '13518:47767'}"
        aria-label="Sesión activa"
      >
        <div class="SesionActiva__content">
          <div class="SesionActiva__metadatos">
            <div class="SesionActiva__fases" data-node-id="${spec?.nodes?.indicadorFaseActual ?? '13519:69656'}">
              <div class="SesionActiva__fase-actual">
                <p class="SesionActiva__fase-minutos">${copy.currentPhaseMinutes ?? ''}</p>
                <p class="SesionActiva__fase-nombre">${copy.currentPhaseName ?? ''}</p>
              </div>
              <div class="SesionActiva__fase-siguiente">
                <p class="SesionActiva__siguiente-label">${copy.nextPhaseLabel ?? ''}</p>
                <p class="SesionActiva__siguiente-nombre">${copy.nextPhaseName ?? ''}</p>
              </div>
            </div>

            <div class="SesionActiva__barras" data-node-id="${spec?.nodes?.barrasDeProgreso ?? '13519:69662'}">
              <div class="SesionActiva__barra-progreso" aria-hidden="true">
                <div class="SesionActiva__barra-progreso-base">
                  <img alt="" src="../${assets.progressTrack ?? ''}" />
                </div>
                <div class="SesionActiva__barra-progreso-activo">
                  <img alt="" src="../${assets.progressSegmentActive ?? ''}" />
                </div>
              </div>
              <div class="SesionActiva__barra-fase-inactiva" aria-hidden="true">
                <img alt="" src="../${assets.progressSegmentInactive ?? ''}" />
              </div>
              <div class="SesionActiva__barra-fase-inactiva" aria-hidden="true">
                <img alt="" src="../${assets.progressSegmentInactive ?? ''}" />
              </div>
            </div>

            <div class="SesionActiva__metricas" aria-label="Métricas de sesión">
              <div class="SesionActiva__metrica">
                <p class="SesionActiva__metrica-label">${copy.metricTimeLabel ?? ''}</p>
                <p class="SesionActiva__metrica-valor">${copy.metricTimeValue ?? ''}</p>
              </div>
              <div class="SesionActiva__metrica">
                <p class="SesionActiva__metrica-label">${copy.metricDistanceLabel ?? ''}</p>
                <p class="SesionActiva__metrica-valor">${copy.metricDistanceValue ?? ''}</p>
              </div>
            </div>

            <div class="SesionActiva__pausa" aria-label="Control de pausa">
              ${window.BotonDePausa?.render?.({ state: 'corriendo', ariaLabel: 'Pausar sesión' }) ?? ''}
            </div>

            <div class="SesionActiva__nota" data-node-id="${spec?.nodes?.notaDelMentor ?? '13519:69760'}">
              <p class="SesionActiva__nota-texto">${copy.mentorNote ?? ''}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function mount(target) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root || !window.BotonDePausa) return;
    root.innerHTML = render();
  }

  window.SesionActiva = {
    render,
    mount,
  };
})();

