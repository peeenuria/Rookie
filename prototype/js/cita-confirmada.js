/**
 * CitaConfirmada — Pantalla de éxito, confirmación de 1ª cita (Figma 13694:16006)
 */
(function () {
  const spec = window.FIGMA_CITA_CONFIRMADA;

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/cita-confirmada/')) return `../${path}`;
    return path;
  }

  function fillTemplate(template, vars) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => String(vars?.[key] ?? ''));
  }

  function renderDetailRow(icon, text) {
    return `
      <div class="CitaConfirmada__detail-row">
        <img class="CitaConfirmada__detail-icon" src="${resolveAsset(icon)}" alt="" width="24" height="24" />
        <p class="CitaConfirmada__detail-text">${text}</p>
      </div>
    `;
  }

  /**
   * @param {object} state
   * @param {string} state.mentorFullName
   * @param {string} state.dateLabel
   * @param {string} state.time
   * @param {string} state.firstName
   * @param {string} state.weekday
   */
  function render(state) {
    const s = state || {};
    const assets = spec?.assets ?? {};
    const copy = spec?.copy ?? {};
    const subtitle = fillTemplate(copy.subtitleTemplate, { firstName: s.firstName, weekday: s.weekday });

    return `
      <section
        class="screen screen--cita-confirmada is-active CitaConfirmada"
        id="cita-confirmada"
        data-node-id="${spec?.screenNodeId ?? '13694:16006'}"
        aria-label="Cita confirmada"
      >
        <div class="CitaConfirmada__container">
          <div class="appointment-confirmed__hero">
            <div class="appointment-confirmed__confetti" id="appointment-confirmed-confetti" aria-hidden="true"></div>
            <div class="appointment-confirmed__check" id="appointment-confirmed-check"></div>
          </div>

          <div class="CitaConfirmada__text">
            <h1 class="CitaConfirmada__title">${copy.title ?? ''}</h1>
            <p class="CitaConfirmada__subtitle">${subtitle}</p>
          </div>

          <div class="CitaConfirmada__card" aria-label="Recordatorio de la cita">
            ${renderDetailRow(assets.iconUser, s.mentorFullName ?? '')}
            ${renderDetailRow(assets.iconCalendarCheck, s.dateLabel ?? '')}
            ${renderDetailRow(assets.iconClock, s.time ?? '')}
            ${renderDetailRow(assets.iconLaptop, copy.meetingType ?? '')}
          </div>

          <div class="CitaConfirmada__actions">
            <button type="button" class="btn btn--secondary CitaConfirmada__continue" id="cita-confirmada-continue">
              ${copy.continueCta ?? ''}
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

  window.CitaConfirmada = { render, mount };
})();
