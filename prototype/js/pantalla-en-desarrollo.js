/**
 * PantallaEnDesarrollo — placeholder reutilizable para destinos aún no construidos
 */
(function () {
  const COPY = {
    title: 'Esto está en construcción',
    subtitle: 'Todavía estamos preparando esta parte. Vuelve pronto.',
    backCta: 'Volver',
  };

  const ICONS = {
    construction: `
      <svg class="PantallaEnDesarrollo__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
        <path d="M17 14v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 14v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M17 3v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 3v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 14L2.3 6.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="m14 6 7.7 7.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 6l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    'chart-line': `
      <svg class="PantallaEnDesarrollo__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m19 9-5 5-4-4-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    settings: `
      <svg class="PantallaEnDesarrollo__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
  };

  const PRESETS = {
    progreso: {
      id: 'screen-progreso',
      title: 'Tu progreso, casi listo',
      subtitle: 'Aquí verás tus métricas, racha y objetivos en cuanto empieces a correr.',
      icon: 'chart-line',
      showBack: false,
    },
    ajustes: {
      id: 'screen-ajustes',
      title: 'Ajustes en camino',
      subtitle: 'Muy pronto podrás editar tu perfil, mentor y notificaciones desde aquí.',
      icon: 'settings',
      showBack: false,
    },
  };

  function resolveFallbackHref() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/en-desarrollo/')) return '../home/index.html';
    if (path.includes('/prototype/')) return 'home/index.html';
    return '../home/index.html';
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = resolveFallbackHref();
  }

  /**
   * @param {object} [options]
   * @param {string} [options.id]
   * @param {string} [options.title]
   * @param {string} [options.subtitle]
   * @param {string} [options.backCta]
   * @param {boolean} [options.active]
   * @param {boolean} [options.showBack]
   * @param {'construction'|'chart-line'|'settings'|string} [options.icon]
   * @param {string} [options.iconHtml]
   */
  function render(options = {}) {
    const id = options.id || 'screen-en-desarrollo';
    const title = options.title || COPY.title;
    const subtitle = options.subtitle || COPY.subtitle;
    const backCta = options.backCta || COPY.backCta;
    const showBack = options.showBack !== false;
    const activeClass = options.active === false ? '' : ' is-active';
    const iconKey = options.icon || 'construction';
    const iconHtml = options.iconHtml || ICONS[iconKey] || ICONS.construction;

    const actions = showBack
      ? `
          <div class="PantallaEnDesarrollo__actions">
            <button
              type="button"
              class="btn btn--primary PantallaEnDesarrollo__back"
              data-en-desarrollo-back
            >
              ${backCta}
            </button>
          </div>
        `
      : '';

    return `
      <section
        class="screen screen--en-desarrollo PantallaEnDesarrollo${activeClass}"
        id="${id}"
        aria-label="${title}"
      >
        <div class="PantallaEnDesarrollo__body">
          <div class="PantallaEnDesarrollo__icon" aria-hidden="true">
            ${iconHtml}
          </div>
          <div class="PantallaEnDesarrollo__copy">
            <h1 class="PantallaEnDesarrollo__title">${title}</h1>
            <p class="PantallaEnDesarrollo__subtitle">${subtitle}</p>
          </div>
          ${actions}
        </div>
      </section>
    `;
  }

  /**
   * @param {ParentNode|string|null} [target]
   * @param {object} [options]
   */
  function mount(target, options = {}) {
    const root =
      typeof target === 'string'
        ? document.querySelector(target)
        : target ||
          document.querySelector('.phone-shell__body') ||
          document.body;

    if (!root) return null;

    root.innerHTML = render(options);
    bind(root);
    return root.querySelector('.PantallaEnDesarrollo');
  }

  function mountPreset(target, presetKey, extra = {}) {
    const preset = PRESETS[presetKey];
    if (!preset) return mount(target, extra);
    return mount(target, { ...preset, ...extra });
  }

  function bind(scope) {
    const root = scope || document;
    root.querySelectorAll('[data-en-desarrollo-back]').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', goBack);
    });
  }

  /** Ruta relativa típica desde pantallas hermanas de /prototype/ */
  function getHref(fromDepth) {
    if (fromDepth === 0) return 'en-desarrollo/index.html';
    if (fromDepth === 2) return '../../en-desarrollo/index.html';
    return '../en-desarrollo/index.html';
  }

  function navigateTo() {
    window.location.href = getHref(1);
  }

  window.PantallaEnDesarrollo = {
    render,
    mount,
    mountPreset,
    bind,
    goBack,
    getHref,
    navigateTo,
    copy: COPY,
    presets: PRESETS,
    icons: ICONS,
  };
})();
