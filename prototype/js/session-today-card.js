/**
 * SessionTodayCard — CardSesiónDeHoy
 * Running: Figma 13207:90371 (Propiedad 1=Predeterminada)
 * Descanso: Figma 13207:90606 (Propiedad 1=Variante4)
 */
(function () {
  const spec = window.FIGMA_HOME;

  const SESSION_TYPES = {
    running: 'running',
    descanso: 'descanso',
    locked: 'locked',
  };

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/home/')) return `../${path}`;
    return path;
  }

  function renderRunning(session, sessionChecked, assets) {
    return `
      <article
        class="SessionTodayCard SessionTodayCard--running"
        data-session-type="${SESSION_TYPES.running}"
        data-node-id="${spec?.sessionTodayCard?.nodeIdRunning ?? '13207:90371'}"
        aria-label="Sesión de hoy"
      >
        <div class="SessionTodayCard__body">
          <div class="SessionTodayCard__header">
            <div class="SessionTodayCard__text">
              <p class="SessionTodayCard__date">${session.dateLabel}</p>
              <h3 class="SessionTodayCard__title">${session.sesionNombre}</h3>
            </div>
            <span
              class="SessionTodayCard__checkbox${sessionChecked ? ' is-checked' : ''}"
              role="img"
              aria-label="${sessionChecked ? 'Sesión completada' : 'Sesión pendiente'}"
            ></span>
          </div>
          <img class="SessionTodayCard__divider" src="${resolveAsset(assets.dividerLine)}" alt="" width="282" height="1" />
          <div class="SessionTodayCard__meta">
            <div class="SessionTodayCard__stat">
              <div class="SessionTodayCard__stat-inner">
                <p class="SessionTodayCard__stat-value">${session.targetDistance}</p>
                <p class="SessionTodayCard__stat-label">${session.targetDistanceLabel[0]}<br />${session.targetDistanceLabel[1]}</p>
              </div>
            </div>
            <div class="SessionTodayCard__stat">
              <div class="SessionTodayCard__stat-inner">
                <p class="SessionTodayCard__stat-value">${session.targetTime}</p>
                <p class="SessionTodayCard__stat-label">${session.targetTimeLabel[0]}<br />${session.targetTimeLabel[1]}</p>
              </div>
            </div>
            <div class="SessionTodayCard__stat">
              <div class="SessionTodayCard__stat-inner">
                <p class="SessionTodayCard__stat-value">${session.weeklySession}</p>
                <p class="SessionTodayCard__stat-label">${session.weeklySessionLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderDescanso(restDay, dateLabel, assets) {
    const divider = assets.dividerLineDescanso || assets.dividerLine;

    return `
      <article
        class="SessionTodayCard SessionTodayCard--descanso"
        data-session-type="${SESSION_TYPES.descanso}"
        data-node-id="${spec?.sessionTodayCard?.nodeIdDescanso ?? '13207:90606'}"
        aria-label="${restDay.title}"
      >
        <div class="SessionTodayCard__body SessionTodayCard__body--descanso">
          <div class="SessionTodayCard__header SessionTodayCard__header--descanso">
            <div class="SessionTodayCard__text SessionTodayCard__text--descanso">
              <p class="SessionTodayCard__date">${dateLabel}</p>
              <h3 class="SessionTodayCard__title">${restDay.title}</h3>
            </div>
          </div>
          <img
            class="SessionTodayCard__divider SessionTodayCard__divider--descanso"
            src="${resolveAsset(divider)}"
            alt=""
            width="293"
            height="1"
          />
          <div class="SessionTodayCard__message">
            <p class="SessionTodayCard__message-text">${restDay.message}</p>
          </div>
        </div>
      </article>
    `;
  }

  /** Bloqueada — sin primera cita con mentor completada (reutiliza .SessionTodayCard--empty) */
  function renderLocked(message) {
    return `
      <article
        class="SessionTodayCard SessionTodayCard--empty"
        data-session-type="${SESSION_TYPES.locked}"
        aria-label="Sesión bloqueada"
      >
        <p class="SessionTodayCard__empty-text">${message}</p>
      </article>
    `;
  }

  /**
   * @param {object} options
   * @param {'running'|'descanso'|'locked'} options.sessionType
   * @param {object} [options.session]
   * @param {string} [options.dateLabel]
   * @param {boolean} [options.sessionChecked]
   * @param {string} [options.lockedMessage]
   */
  function render(options) {
    if (!spec) return '';

    const { sessionType, session, dateLabel = '', sessionChecked = false, lockedMessage = '' } = options ?? {};
    const assets = spec.assets ?? {};

    if (sessionType === SESSION_TYPES.locked) {
      return renderLocked(lockedMessage);
    }

    if (sessionType === SESSION_TYPES.descanso) {
      return renderDescanso(spec.restDay, dateLabel, assets);
    }

    if (!session) return '';
    return renderRunning(session, sessionChecked, assets);
  }

  window.SessionTodayCard = {
    render,
    SESSION_TYPES,
    resolveAsset,
  };
})();
