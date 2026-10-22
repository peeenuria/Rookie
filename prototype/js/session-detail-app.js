/**
 * Detalle de sesión — Figma 13276:2216
 */
(function () {
  const spec = window.FIGMA_SESSION_DETAIL;
  const plan = window.PlanSessions;
  if (!spec || !plan) return;

  /** @type {object|null} */
  let activeSession = null;
  let expandedAccordionId = 'exercise';
  let unbindIntroScroll = null;
  /** @type {'ready'|'loading'|'offline'} */
  let viewState = 'ready';

  function resolveViewState() {
    if (window.AppConnectivity?.isOffline()) return 'offline';
    if (window.AppConnectivity?.isLoadingScenario()) return 'loading';
    return 'ready';
  }

  function isPrimaryActionsDisabled() {
    return viewState === 'offline' || activeSession?.status === 'skipped';
  }

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/session-detail/')) return `../${path}`;
    return path;
  }

  function resolveRequestedDateIso() {
    const params = new URLSearchParams(window.location.search);
    return params.get('fecha') || params.get('sesion') || plan.getDefaultDateIso();
  }

  function loadActiveSession() {
    const dateIso = resolveRequestedDateIso();
    activeSession = plan.getViewModel(dateIso);

    if (!activeSession) {
      activeSession = plan.getViewModel(plan.getDefaultDateIso());
    }

    if (!activeSession) {
      const scheduledDates = plan.getScheduledDateIsos();
      if (scheduledDates.length) {
        activeSession = plan.getViewModel(scheduledDates[0]);
      }
    }

    if (!activeSession) {
      const firstSessionId = Object.keys(plan.catalog)[0];
      if (firstSessionId) {
        activeSession = plan.getViewModelById(firstSessionId);
      }
    }

    if (activeSession) {
      spec.accordion = activeSession.accordion;
      spec.mentor = activeSession.mentor;
      expandedAccordionId =
        activeSession.accordion.find((item) => item.defaultExpanded)?.id || 'exercise';
      document.title = `Rookie — ${activeSession.sesionNombre}`;
    }
  }

  function renderAccordionCard(item) {
    const isExpanded = item.id === expandedAccordionId;
    const listItems = item.items.map((text) => `<li>${text}</li>`).join('');

    return `
      <article
        class="SessionAccordionCard${isExpanded ? ' is-expanded' : ''}"
        data-accordion-id="${item.id}"
      >
        <button
          type="button"
          class="SessionAccordionCard__header"
          aria-expanded="${isExpanded}"
          aria-controls="accordion-panel-${item.id}"
          id="accordion-trigger-${item.id}"
        >
          <span class="SessionAccordionCard__text">
            <span class="SessionAccordionCard__title">${item.title}</span>
            <span class="SessionAccordionCard__subtitle">${item.subtitle}</span>
          </span>
          <span class="SessionAccordionCard__step">${item.step}</span>
        </button>
        <div
          class="SessionAccordionCard__panel"
          id="accordion-panel-${item.id}"
          role="region"
          aria-labelledby="accordion-trigger-${item.id}"
        >
          <div class="SessionAccordionCard__panel-inner">
            <div class="SessionAccordionCard__panel-content">
              <img
                class="SessionAccordionCard__divider"
                src="${resolveAsset(spec.assets.cardDivider)}"
                alt=""
                width="282"
                height="1"
              />
              <div class="SessionAccordionCard__list-wrap">
                <ul class="SessionAccordionCard__list">${listItems}</ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderIntro() {
    if (!window.IntroDetalleSesion || !activeSession) return '';
    return IntroDetalleSesion.render(activeSession);
  }

  function bindIntroScrollController() {
    if (unbindIntroScroll) {
      unbindIntroScroll();
      unbindIntroScroll = null;
    }
    if (window.IntroDetalleSesion) {
      unbindIntroScroll = IntroDetalleSesion.bindScroll();
    }
  }

  function renderMentorCard() {
    if (!window.ConsejoMentor || !activeSession) return '';
    return window.ConsejoMentor.render(activeSession.mentor);
  }

  function renderOfflineScreen() {
    const offlineCopy = spec.sinConexion || window.EstadoSinConexion?.DEFAULT;

    return `
      <section class="screen screen--session-detail is-active session-detail--offline" aria-label="Detalle de sesión">
        <div class="session-detail">
          <div class="session-detail__scroll" id="session-detail-scroll">
            <div class="session-detail__offline-topbar">
              <button type="button" class="IntroDetalleSesion__icon-btn IntroDetalleSesion__icon-btn--back" id="session-detail-back" aria-label="Volver">
                <img src="${resolveAsset(spec.assets.arrowLeft)}" alt="" width="24" height="24" />
              </button>
            </div>
            <div class="session-detail__scroll-inner session-detail__scroll-inner--offline">
              ${window.EstadoSinConexion.render(offlineCopy)}
            </div>
            <div class="session-detail__actions session-detail__actions--offline">
              <button type="button" class="btn btn--primary session-detail__start" id="session-detail-start" disabled>
                ${spec.buttons.start}
              </button>
              <button type="button" class="btn btn--secondary session-detail__tracking" id="session-detail-tracking" disabled>
                ${spec.buttons.tracking}
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderLoadingScreen() {
    return window.SessionDetailSkeleton.render();
  }

  function renderScreen() {
    if (!activeSession) {
      return '<p class="session-detail__error">No se encontró la sesión solicitada.</p>';
    }

    const isSkipped = activeSession.status === 'skipped';
    const actionsDisabled = isPrimaryActionsDisabled();

    return `
      <section class="screen screen--session-detail is-active" id="screen-session-detail" aria-label="Detalle de sesión">
        <div class="session-detail">
          <div class="session-detail__scroll" id="session-detail-scroll">
            ${renderIntro()}
            <div class="session-detail__scroll-inner">
              <section class="session-detail__section" aria-labelledby="session-description-title">
                <h2 class="session-detail__section-title" id="session-description-title">${spec.sections.description}</h2>
                <div class="SessionAccordion" id="session-accordion">
                  ${activeSession.accordion.map(renderAccordionCard).join('')}
                </div>
              </section>

              <section class="session-detail__section" aria-labelledby="session-mentor-title">
                <h2 class="session-detail__section-title" id="session-mentor-title">${spec.sections.mentorAdvice}</h2>
                <div id="session-mentor-slot">${renderMentorCard()}</div>
              </section>

              <div class="session-detail__actions">
                <button type="button" class="btn btn--primary session-detail__start" id="session-detail-start" ${actionsDisabled ? 'disabled' : ''}>
                  ${spec.buttons.start}
                </button>
                <button type="button" class="btn btn--secondary session-detail__tracking" id="session-detail-tracking" ${actionsDisabled ? 'disabled' : ''}>
                  ${spec.buttons.tracking}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function refreshHero() {
    const scrollEl = document.getElementById('session-detail-scroll');
    const scrollTop = scrollEl?.scrollTop ?? 0;
    const intro = document.getElementById('intro-detalle-sesion');
    if (!intro) return;

    intro.outerHTML = renderIntro();
    bindHeroEvents();
    bindIntroScrollController();

    if (scrollEl) {
      scrollEl.scrollTop = scrollTop;
      window.IntroDetalleSesion?.applyScrollProgress(
        scrollEl,
        document.getElementById('intro-detalle-sesion')
      );
    }
  }

  function refreshMentor() {
    const slot = document.getElementById('session-mentor-slot');
    if (slot) slot.innerHTML = renderMentorCard();
  }

  function refreshActions() {
    const actionsDisabled = isPrimaryActionsDisabled();
    const startBtn = document.getElementById('session-detail-start');
    const trackingBtn = document.getElementById('session-detail-tracking');
    if (startBtn) startBtn.disabled = actionsDisabled;
    if (trackingBtn) trackingBtn.disabled = actionsDisabled;
  }

  function getRootElement() {
    return (
      document.getElementById('session-detail-root') ||
      document.querySelector('.phone-shell__body') ||
      document.querySelector('.phone-shell__scroll')
    );
  }

  function mountSheet() {
    const sheetRoot = document.getElementById('bottom-sheet-reprogramar-root');
    if (sheetRoot && window.BottomSheetReprogramarSesion) {
      window.BottomSheetReprogramarSesion.mount(sheetRoot);
    }
  }

  function mountReadyContent() {
    viewState = 'ready';
    loadActiveSession();

    const root = getRootElement();
    if (!root) return;

    root.innerHTML = renderScreen();
    bindEvents();
    bindIntroScrollController();
    mountSheet();
  }

  function mountOfflineContent() {
    viewState = 'offline';

    const root = getRootElement();
    if (!root) return;

    root.innerHTML = renderOfflineScreen();
    bindHeroEvents();
    mountSheet();
  }

  function mountLoadingContent() {
    viewState = 'loading';

    const root = getRootElement();
    if (!root) return;

    root.innerHTML = renderLoadingScreen();

    if (window.AppConnectivity?.shouldPersistLoading()) return;

    const delayMs = spec.loading?.delayMs ?? 1400;
    window.AppConnectivity.resolveAfterLoading(() => {
      window.AppConnectivity.clearScenario();
      mountReadyContent();
    }, delayMs);
  }

  function handleRescheduleConfirm(newDateIso) {
    if (!activeSession) return;

    const sessionId = activeSession.initialDateIso;

    plan.saveSessionState(sessionId, {
      status: 'rescheduled',
      originalDateIso: sessionId,
      currentDateIso: newDateIso,
    });

    sessionStorage.setItem(
      plan.pendingToastStorageKey,
      JSON.stringify({
        type: 'rescheduled',
        sessionId,
        newDateIso,
      })
    );

    window.location.href = '../home/index.html';
  }

  function handleSkipSession() {
    if (!activeSession) return;

    const sessionId = activeSession.initialDateIso;

    plan.saveSessionState(sessionId, {
      status: 'skipped',
      originalDateIso: sessionId,
      currentDateIso: activeSession.dateIso,
    });

    sessionStorage.setItem(
      plan.pendingToastStorageKey,
      JSON.stringify({
        type: 'skipped',
        sessionId,
      })
    );

    window.location.href = '../home/index.html';
  }

  function openRescheduleSheet() {
    if (!window.BottomSheetReprogramarSesion) return;

    window.BottomSheetReprogramarSesion.open({
      onConfirm: handleRescheduleConfirm,
      onSkip: handleSkipSession,
    });
  }

  function refreshAccordion() {
    const accordionRoot = document.getElementById('session-accordion');
    if (!accordionRoot || !activeSession) return;
    accordionRoot.innerHTML = activeSession.accordion.map(renderAccordionCard).join('');
    bindAccordion();
  }

  function bindAccordion() {
    document.querySelectorAll('.SessionAccordionCard__header').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.SessionAccordionCard');
        const id = card?.dataset.accordionId;
        if (!id) return;

        expandedAccordionId = expandedAccordionId === id ? '' : id;
        refreshAccordion();
      });
    });
  }

  function bindHeroEvents() {
    document.getElementById('session-detail-back')?.addEventListener('click', () => {
      window.location.href = '../home/index.html';
    });

    document.getElementById('session-detail-reschedule')?.addEventListener('click', openRescheduleSheet);
  }

  function bindEvents() {
    bindHeroEvents();

    document.getElementById('session-detail-start')?.addEventListener('click', () => {
      if (window.SessionDetailApp?.onStartSession) {
        window.SessionDetailApp.onStartSession();
      }
    });

    document.getElementById('session-detail-tracking')?.addEventListener('click', () => {
      if (window.SessionDetailApp?.onConnectTracking) {
        window.SessionDetailApp.onConnectTracking();
      }
    });

    bindAccordion();
  }

  function mount() {
    viewState = resolveViewState();

    if (viewState === 'offline') {
      mountOfflineContent();
      return;
    }

    if (viewState === 'loading') {
      mountLoadingContent();
      return;
    }

    mountReadyContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.SessionDetailApp = {
    mount,
    refreshAccordion,
    refreshHero,
    refreshMentor,
    openRescheduleSheet,
    onStartSession: () => {
      const sessionId = activeSession?.initialDateIso || activeSession?.dateIso || '';
      const suffix = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      window.location.href = `../permisos/index.html${suffix}`;
    },
    onConnectTracking: () => {
      const sessionId = activeSession?.initialDateIso || activeSession?.dateIso || '';
      const suffix = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      window.location.href = `../permisos/index.html${suffix}`;
    },
    getActiveSession: () => activeSession,
    getExpandedAccordionId: () => expandedAccordionId,
    setExpandedAccordionId: (id) => {
      expandedAccordionId = id;
      refreshAccordion();
    },
  };
})();
