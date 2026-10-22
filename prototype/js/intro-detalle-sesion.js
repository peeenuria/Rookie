/**
 * IntroDetalleSesion — Figma 13373:90689
 * Predeterminada 500px → Variante2/Encogida 252px con scroll progresivo.
 */
(function () {
  const spec = window.FIGMA_SESSION_DETAIL;

  const DEFAULTS = {
    heightExpanded: 500,
    heightCollapsed: 252,
    scrollRange: 180,
  };

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/session-detail/')) return `../${path}`;
    return path;
  }

  function getLayout() {
    const layout = spec?.layout ?? {};
    return {
      heightExpanded: layout.introHeightExpanded ?? layout.heroHeight ?? DEFAULTS.heightExpanded,
      heightCollapsed: layout.introHeightCollapsed ?? DEFAULTS.heightCollapsed,
      scrollRange: layout.introScrollRange ?? DEFAULTS.scrollRange,
    };
  }

  function renderStatus(session) {
    if (session.status === 'rescheduled') {
      return '<p class="IntroDetalleSesion__status">Reprogramada</p>';
    }
    if (session.status === 'skipped') {
      return '<p class="IntroDetalleSesion__status IntroDetalleSesion__status--skipped">Sesión saltada</p>';
    }
    return '';
  }

  function renderStats(session) {
    return `
      <div class="IntroDetalleSesion__meta">
        <div class="IntroDetalleSesion__stat">
          <div class="IntroDetalleSesion__stat-inner">
            <p class="IntroDetalleSesion__stat-value">${session.targetDistance}</p>
            <p class="IntroDetalleSesion__stat-label">
              ${session.targetDistanceLabel[0]}<br />${session.targetDistanceLabel[1]}
            </p>
          </div>
        </div>
        <div class="IntroDetalleSesion__stat">
          <div class="IntroDetalleSesion__stat-inner">
            <p class="IntroDetalleSesion__stat-value">${session.targetTime}</p>
            <p class="IntroDetalleSesion__stat-label IntroDetalleSesion__stat-label--muted">
              ${session.targetTimeLabel[0]}<br />${session.targetTimeLabel[1]}
            </p>
          </div>
        </div>
        <div class="IntroDetalleSesion__stat">
          <div class="IntroDetalleSesion__stat-inner">
            <p class="IntroDetalleSesion__stat-value">${session.weeklySession}</p>
            <p class="IntroDetalleSesion__stat-label IntroDetalleSesion__stat-label--muted">${session.weeklySessionLabel}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @param {object} session — view model de PlanSessions
   */
  function render(session) {
    if (!session || !spec) return '';

    const assets = spec.assets;
    const layout = getLayout();
    const heroPhoto = session.heroPhoto || assets.heroPhoto;

    return `
      <div
        class="IntroDetalleSesion__anchor"
        style="
          --intro-height-expanded: ${layout.heightExpanded}px;
          --intro-height-collapsed: ${layout.heightCollapsed}px;
          --intro-height-delta: ${layout.heightExpanded - layout.heightCollapsed}px;
        "
      >
      <header
        class="IntroDetalleSesion is-expanded"
        id="intro-detalle-sesion"
        aria-label="Cabecera de sesión"
        style="--intro-progress: 0;"
      >
        <div class="IntroDetalleSesion__media" aria-hidden="true">
          <img class="IntroDetalleSesion__photo" src="${resolveAsset(heroPhoto)}" alt="" />
          <div class="IntroDetalleSesion__gradient"></div>
          <div class="IntroDetalleSesion__brand-overlay"></div>
        </div>
        <div class="IntroDetalleSesion__topbar">
          <button type="button" class="IntroDetalleSesion__icon-btn IntroDetalleSesion__icon-btn--back" id="session-detail-back" aria-label="Volver">
            <img src="${resolveAsset(assets.arrowLeft)}" alt="" width="24" height="24" />
          </button>
          <button type="button" class="IntroDetalleSesion__icon-btn IntroDetalleSesion__icon-btn--reschedule" id="session-detail-reschedule" aria-label="Reprogramar sesión">
            <img src="${resolveAsset(assets.calendarSync)}" alt="" width="16" height="16" />
          </button>
        </div>
        <div class="IntroDetalleSesion__content">
          <div class="IntroDetalleSesion__text">
            ${renderStatus(session)}
            <p class="IntroDetalleSesion__date">${session.dateLabel}</p>
            <h1 class="IntroDetalleSesion__title">${session.sesionNombre}</h1>
          </div>
          <img class="IntroDetalleSesion__divider" src="${resolveAsset(assets.heroDivider)}" alt="" width="282" height="1" />
          ${renderStats(session)}
        </div>
      </header>
      </div>
    `;
  }

  function applyScrollProgress(scrollEl, introEl) {
    if (!scrollEl || !introEl) return;

    const range = getLayout().scrollRange;
    const progress = Math.min(1, Math.max(0, scrollEl.scrollTop / range));

    introEl.style.setProperty('--intro-progress', String(progress));
    introEl.classList.toggle('is-collapsed', progress >= 1);
    introEl.classList.toggle('is-expanded', progress <= 0);
  }

  function bindScroll() {
    const scrollEl = document.getElementById('session-detail-scroll');
    const introEl = document.getElementById('intro-detalle-sesion');
    if (!scrollEl || !introEl) return null;

    const onScroll = () => applyScrollProgress(scrollEl, introEl);

    onScroll();
    scrollEl.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
    };
  }

  window.IntroDetalleSesion = {
    render,
    bindScroll,
    applyScrollProgress,
    getLayout,
    DEFAULTS,
  };
})();
