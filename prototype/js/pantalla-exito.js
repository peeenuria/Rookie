/**
 * PantallaExito (PantallaÉxito) — Figma 13556:47835
 * Nombre de usuario y logros dinámicos (no hardcodeados en el render).
 */
(function () {
  const spec = window.FIGMA_PANTALLA_EXITO;

  function fillTemplate(template, vars) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => String(vars?.[key] ?? ''));
  }

  /**
   * @param {object} [state]
   * @param {string} [state.userName]
   * @param {string[]} [state.achievements] - 3 items
   */
  function render(state) {
    const s = state || {};
    const assets = spec?.assets ?? {};
    const copy = spec?.copy ?? {};
    const defaultState = spec?.defaultState ?? {};

    const userName = s.userName ?? defaultState.userName ?? '';
    const achievementsRaw = s.achievements ?? defaultState.achievements ?? [];
    const achievements = Array.isArray(achievementsRaw) ? achievementsRaw.slice(0, 3) : [];

    const title = fillTemplate(copy.titleTemplate ?? '', { name: userName });
    const cta = copy.continueCta ?? 'Continuar';

    return `
      <section
        class="screen screen--pantalla-exito is-active PantallaExito"
        id="pantalla-exito"
        data-node-id="${spec?.screenNodeId ?? '13556:47835'}"
        aria-label="Pantalla de éxito"
      >
        <div class="PantallaExito__container" data-node-id="${spec?.containerNodeId ?? '13556:47881'}">
          <div class="appointment-confirmed__hero">
            <div class="appointment-confirmed__confetti" id="appointment-confirmed-confetti" aria-hidden="true"></div>
            <div class="appointment-confirmed__check" id="appointment-confirmed-check"></div>
          </div>

          <div class="PantallaExito__text">
            <h1 class="PantallaExito__title" id="pantalla-exito-title">${title}</h1>
            <ul class="PantallaExito__achievements" aria-label="Logros">
              ${achievements
                .map(
                  (item) => `
                <li class="PantallaExito__achievement">
                  <span class="PantallaExito__achievement-icon" aria-hidden="true">
                    <img src="../${assets.iconAchievementCheck ?? ''}" alt="" />
                  </span>
                  <span class="PantallaExito__achievement-text">${item}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>

          <div class="PantallaExito__actions">
            <button type="button" class="PantallaExito__continue btn btn--secondary" id="pantalla-exito-continue">
              ${cta}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function mount(target, state) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return;
    root.innerHTML = render(state);
  }

  window.PantallaExito = { render, mount };
})();

