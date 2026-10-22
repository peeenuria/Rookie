/**
 * PantallaDePermisos — Figma 13413:5883
 * Incluye BarraSuperiorBack + diálogo iOS fake (GPS auto / trackers on-select)
 */
(function () {
  const spec = window.FIGMA_PERMISOS;

  let dialogResolve = null;
  let gpsState = 'pending';
  let gpsPromptStarted = false;

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/permisos/')) return `../${path}`;
    return path;
  }

  function renderTrackerRow(tracker) {
    return `
      <div class="PantallaDePermisos__tracker-row" data-tracker-id="${tracker.id}">
        <span class="PantallaDePermisos__tracker-label">${tracker.label}</span>
        ${window.Toggle.render({
          checked: false,
          id: `permisos-toggle-${tracker.id}`,
          name: tracker.id,
          ariaLabel: `Conectar ${tracker.label}`,
        })}
      </div>
    `;
  }

  function renderIosDialog() {
    const copy = spec.iosDialog || {};
    return `
      <div
        class="IosPermissionDialog"
        id="permisos-ios-dialog"
        hidden
        role="dialog"
        aria-modal="true"
        aria-labelledby="permisos-ios-title"
        aria-describedby="permisos-ios-message"
      >
        <button
          type="button"
          class="IosPermissionDialog__backdrop"
          id="permisos-ios-backdrop"
          aria-label="Cerrar"
        ></button>
        <div class="IosPermissionDialog__card">
          <h2 class="IosPermissionDialog__title" id="permisos-ios-title"></h2>
          <p class="IosPermissionDialog__message" id="permisos-ios-message"></p>
          <div class="IosPermissionDialog__actions">
            <button
              type="button"
              class="IosPermissionDialog__btn IosPermissionDialog__btn--deny"
              id="permisos-ios-deny"
            >${copy.deny || 'No permitir'}</button>
            <button
              type="button"
              class="IosPermissionDialog__btn IosPermissionDialog__btn--allow"
              id="permisos-ios-allow"
            >${copy.allow || 'Permitir'}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderBackSlot() {
    if (!window.BarraSuperiorBack) {
      return '<div id="permisos-back-slot"></div>';
    }
    return `
      <div id="permisos-back-slot">
        ${window.BarraSuperiorBack.render({
          id: 'permisos-back-btn',
          variant: 'predeterminada',
          ariaLabel: 'Volver',
        })}
      </div>
    `;
  }

  function render() {
    if (!spec || !window.Toggle) return '';

    const intro = spec.intro;
    const location = spec.locationCard;
    const optional = spec.optionalSection;

    return `
      <section
        class="screen screen--permisos is-active PantallaDePermisos"
        id="pantalla-de-permisos"
        data-node-id="${spec.nodeId}"
        aria-label="Permisos"
      >
        ${renderBackSlot()}
        <div class="PantallaDePermisos__scroll">
          <div class="PantallaDePermisos__content">
            <header class="screen-intro PantallaDePermisos__intro">
              <h1 class="screen-intro__title PantallaDePermisos__title">${intro.title}</h1>
              <p class="screen-intro__subtitle PantallaDePermisos__subtitle">${intro.subtitle}</p>
            </header>

            <article
              class="PantallaDePermisos__location-card"
              data-node-id="${location.nodeId}"
              data-gps-state="pending"
              aria-label="${location.title}"
            >
              <div class="PantallaDePermisos__location-text">
                <h2 class="PantallaDePermisos__location-title">${location.title}</h2>
                <p class="PantallaDePermisos__location-description" id="permisos-gps-description">
                  ${location.description}
                </p>
              </div>
              <img
                class="PantallaDePermisos__location-icon"
                src="${resolveAsset(location.icon)}"
                alt=""
                width="${spec.layout.locationIconSize}"
                height="${spec.layout.locationIconSize}"
              />
            </article>

            <div class="PantallaDePermisos__separator" aria-hidden="true">
              <img
                src="${resolveAsset(spec.assets.divider)}"
                alt=""
                width="353"
                height="1"
              />
            </div>

            <section class="PantallaDePermisos__optional" aria-labelledby="permisos-optional-label">
              <h2 class="PantallaDePermisos__optional-label" id="permisos-optional-label">
                ${optional.label}
              </h2>
              <div class="PantallaDePermisos__trackers">
                ${optional.trackers.map(renderTrackerRow).join('')}
              </div>
            </section>

            <div class="PantallaDePermisos__actions">
              <button type="button" class="btn btn--primary PantallaDePermisos__continue" id="permisos-continue">
                ${spec.continueButton}
              </button>
            </div>
          </div>
        </div>
        ${renderIosDialog()}
      </section>
    `;
  }

  function getDialogEls(scope) {
    const root = scope || document;
    return {
      root: root.querySelector
        ? root.querySelector('#permisos-ios-dialog')
        : document.getElementById('permisos-ios-dialog'),
      title: document.getElementById('permisos-ios-title'),
      message: document.getElementById('permisos-ios-message'),
      deny: document.getElementById('permisos-ios-deny'),
      allow: document.getElementById('permisos-ios-allow'),
      backdrop: document.getElementById('permisos-ios-backdrop'),
    };
  }

  function closeDialog(allowed) {
    const els = getDialogEls();
    if (els.root) {
      els.root.hidden = true;
      els.root.setAttribute('hidden', '');
      els.root.style.display = '';
    }
    const resolve = dialogResolve;
    dialogResolve = null;
    if (resolve) resolve(Boolean(allowed));
  }

  function openIosDialog(copy) {
    return new Promise((resolve) => {
      const els = getDialogEls();
      if (!els.root || !copy) {
        resolve(false);
        return;
      }

      if (dialogResolve) {
        closeDialog(false);
      }

      dialogResolve = resolve;
      if (els.title) els.title.textContent = copy.title || '';
      if (els.message) els.message.textContent = copy.message || '';
      els.root.hidden = false;
      els.root.removeAttribute('hidden');
      /* Forzar visible por si algún CSS pelea con [hidden] */
      els.root.style.display = 'flex';
      requestAnimationFrame(() => {
        els.allow?.focus();
      });
    });
  }

  function updateGpsCard(state) {
    gpsState = state;
    const card = document.querySelector('.PantallaDePermisos__location-card');
    const desc = document.getElementById('permisos-gps-description');
    if (!card || !desc || !spec?.locationCard) return;

    card.dataset.gpsState = state;
    if (state === 'granted') {
      desc.textContent = spec.locationCard.descriptionGranted;
    } else if (state === 'denied') {
      desc.textContent = spec.locationCard.descriptionDenied;
    } else {
      desc.textContent = spec.locationCard.description;
    }
  }

  async function requestGpsPermission() {
    if (!spec?.iosDialog?.gps) return false;
    if (gpsPromptStarted) return gpsState === 'granted';
    gpsPromptStarted = true;
    const allowed = await openIosDialog(spec.iosDialog.gps);
    updateGpsCard(allowed ? 'granted' : 'denied');
    return allowed;
  }

  async function handleTrackerToggle(toggleBtn, trackerId, wantsOn) {
    if (!wantsOn) {
      window.Toggle.setChecked(toggleBtn, false);
      return;
    }

    window.Toggle.setChecked(toggleBtn, false);
    const copy = spec?.iosDialog?.trackers?.[trackerId];
    if (!copy) return;

    const allowed = await openIosDialog(copy);
    if (allowed) {
      window.Toggle.setChecked(toggleBtn, true);
    }
  }

  function bindBack(onBack) {
    if (!window.BarraSuperiorBack) return;
    window.BarraSuperiorBack.bind('permisos-back-btn', () => {
      if (typeof onBack === 'function') {
        onBack();
        return;
      }
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = `../session-detail/index.html${window.location.search || ''}`;
    });
  }

  function bindIosDialog() {
    const els = getDialogEls();
    els.deny?.addEventListener('click', () => {
      if (els.root) els.root.style.display = '';
      closeDialog(false);
    });
    els.allow?.addEventListener('click', () => {
      if (els.root) els.root.style.display = '';
      closeDialog(true);
    });
    els.backdrop?.addEventListener('click', () => {
      if (els.root) els.root.style.display = '';
      closeDialog(false);
    });
  }

  function bindTrackers(scope) {
    const root = scope?.querySelector?.('#pantalla-de-permisos') || document.getElementById('pantalla-de-permisos');
    if (!root) return;

    root.addEventListener('toggle:change', (event) => {
      const toggleBtn = event.target;
      if (!(toggleBtn instanceof HTMLElement) || !toggleBtn.classList.contains('Toggle')) return;

      const row = toggleBtn.closest('.PantallaDePermisos__tracker-row');
      const trackerId = row?.dataset.trackerId;
      if (!trackerId) return;

      handleTrackerToggle(toggleBtn, trackerId, Boolean(event.detail?.checked));
    });
  }

  function bind(root, options = {}) {
    const scope = root || document;
    window.Toggle.bind(scope);
    bindBack(options.onBack);
    bindIosDialog();
    bindTrackers(scope);

    scope.querySelector?.('#permisos-continue')?.addEventListener('click', () => {
      if (window.PantallaDePermisosApp?.onContinue) {
        window.PantallaDePermisosApp.onContinue();
      }
    });

    /* GPS al entrar */
    const showGps = () => {
      if (gpsPromptStarted || gpsState !== 'pending') return;
      requestGpsPermission();
    };
    setTimeout(showGps, 0);
  }

  function mount(target, options = {}) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return null;

    root.innerHTML = render();
    bind(root, options);
    return root.querySelector('.PantallaDePermisos');
  }

  window.PantallaDePermisos = {
    render,
    bind,
    mount,
    resolveAsset,
    openIosDialog,
    getGpsState: () => gpsState,
  };
})();
