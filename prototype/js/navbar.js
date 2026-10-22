/**
 * Navbar global — Figma 12954:9360 (5 variantes: Inicio/Progreso/Sesión/Mentor/Ajustes)
 * Uso: <div data-navbar data-navbar-active="mentor" data-navbar-assets="../assets/icons/navbar"></div>
 */
(function () {
  const STAIN_HOLD_MS = 420;

  const TABS = [
    {
      id: 'inicio',
      label: 'Inicio',
      lucide: 'lucide/house',
      icon: '9717746d69d6d0c1a87e1b648a342ffab6db2373.svg',
      iconActive: 'b18d29445316a35eef0466d0f6b1c75fe772717d.svg',
    },
    {
      id: 'progreso',
      label: 'Progreso',
      lucide: 'lucide/chart-line',
      icon: 'ebeca6f01e85d2f8462d54fc3755d4fb67cdd2e6.svg',
      iconActive: '0b3a8e8fab9de240913697bd83e05d607ff52f2a.svg',
    },
    {
      id: 'sesion',
      label: 'Sesión',
      lucide: 'lucide/plus',
      icon: '9bd037cf62a32dd675e44cb0b445458509152d6b.svg',
      iconActive: 'dd225d9df80c0484e6a22ea04f16aabee952fd7b.svg',
    },
    {
      id: 'mentor',
      label: 'Mentor',
      lucide: 'lucide/id-card-lanyard',
      icon: '588274f542fbca55bbff50b0c35da089c42f1167.svg',
      iconActive: 'a77bd06cc1e840c73b42406a3d23bf0251a555d8.svg',
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      lucide: 'lucide/settings',
      icon: 'bb936efa94d654b57649c1d089592a0e2b39eea5.svg',
      iconActive: 'e897fa222d2075928981a0d606c817b946720fd0.svg',
    },
  ];

  function renderNavbar(activeId, assetsBase) {
    const tabs = TABS.map((tab) => {
      const isActive = tab.id === activeId;
      const iconFile = isActive ? tab.iconActive : tab.icon;
      return `
        <button
          type="button"
          class="navbar__tab${isActive ? ' is-active' : ''}"
          data-nav-id="${tab.id}"
          aria-label="${tab.label}"${isActive ? ' aria-current="page"' : ''}
        >
          <span class="navbar__tab-icon-wrap">
            <img
              class="navbar__tab-icon"
              src="${assetsBase}/${iconFile}"
              alt=""
              width="22"
              height="22"
              data-icon-inactive="${assetsBase}/${tab.icon}"
              data-icon-active="${assetsBase}/${tab.iconActive}"
            />
          </span>
          <span class="navbar__tab-label">${tab.label}</span>
        </button>
      `;
    }).join('');

    const noIndicator = !activeId || !TABS.some((tab) => tab.id === activeId);

    return `
      <nav class="navbar${noIndicator ? ' navbar--no-indicator' : ''}" aria-label="Navegación principal">
        <span class="navbar__indicator" aria-hidden="true"></span>
        <div class="navbar__tabs">${tabs}</div>
      </nav>
    `;
  }

  function hideStainElement(stain) {
    if (!stain || stain.classList.contains('is-hiding')) return;

    clearTimeout(stain._hideTimer);
    stain.classList.remove('is-visible');
    stain.classList.add('is-hiding');

    const remove = () => stain.remove();
    stain.addEventListener('transitionend', remove, { once: true });
    stain._hideTimer = setTimeout(remove, 320);
  }

  function clearStains(navbarRoot) {
    if (!navbarRoot) return;
    navbarRoot.querySelectorAll('.navbar__stain').forEach(hideStainElement);
  }

  function showStain(tab) {
    if (!tab) return null;

    let stain = tab.querySelector('.navbar__stain');
    if (!stain) {
      stain = document.createElement('span');
      stain.className = 'navbar__stain';
      stain.setAttribute('aria-hidden', 'true');
      tab.insertBefore(stain, tab.firstChild);
    }

    clearTimeout(stain._hideTimer);
    stain.classList.remove('is-hiding');
    requestAnimationFrame(() => stain.classList.add('is-visible'));
    return stain;
  }

  function scheduleHideStain(tab, delay) {
    const stain = tab?.querySelector('.navbar__stain');
    if (!stain) return;
    clearTimeout(stain._hideTimer);
    stain._hideTimer = setTimeout(() => hideStainElement(stain), delay);
  }

  function updateIndicator(navbarRoot, tabId) {
    const index = TABS.findIndex((tab) => tab.id === tabId);
    if (index < 0) {
      navbarRoot.classList.add('navbar--no-indicator');
      return;
    }

    navbarRoot.classList.remove('navbar--no-indicator');
    navbarRoot.style.setProperty('--navbar-active-index', String(index));
  }

  function setActive(navbarRoot, tabId) {
    navbarRoot.querySelectorAll('.navbar__tab').forEach((tab) => {
      const isActive = tab.dataset.navId === tabId;
      tab.classList.toggle('is-active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }

      const img = tab.querySelector('.navbar__tab-icon');
      if (img) {
        img.src = isActive ? img.dataset.iconActive : img.dataset.iconInactive;
      }
    });

    updateIndicator(navbarRoot, tabId);
  }

  function bindEvents(navbarRoot) {
    navbarRoot.querySelectorAll('.navbar__tab').forEach((tab) => {
      tab.addEventListener('pointerdown', (e) => {
        if (e.button > 0) return;

        navbarRoot.querySelectorAll('.navbar__stain').forEach((stain) => {
          if (!tab.contains(stain)) hideStainElement(stain);
        });

        showStain(tab);
      });

      tab.addEventListener('pointerup', () => {
        scheduleHideStain(tab, STAIN_HOLD_MS);
      });

      tab.addEventListener('pointercancel', () => {
        scheduleHideStain(tab, STAIN_HOLD_MS);
      });

      tab.addEventListener('pointerleave', (e) => {
        if (e.buttons) scheduleHideStain(tab, 0);
      });

      tab.addEventListener('click', () => {
        setActive(navbarRoot, tab.dataset.navId);
      });
    });
  }

  function mount(mountEl, options = {}) {
    if (!mountEl) return null;

    const activeId = options.activeId ?? mountEl.dataset.navbarActive ?? '';
    const assetsBase = options.assetsPath ?? mountEl.dataset.navbarAssets ?? '../assets/icons/navbar';

    mountEl.innerHTML = renderNavbar(activeId, assetsBase);

    const navbar = mountEl.querySelector('.navbar');
    if (navbar) {
      updateIndicator(navbar, activeId);
      bindEvents(navbar);
    }

    return navbar;
  }

  /** Rutas hermanas bajo /prototype/ (desde home, progreso, ajustes, mentor…)
   * Mentor va a "Mi Mentor" (13707:13164) una vez asignado (1ª cita ya
   * reservada, no solo tentativamente seleccionado en el catálogo) —
   * antes de eso, al catálogo de elección de mentor. */
  function getSiblingTabRoutes() {
    const hasMentorAssigned = Boolean(sessionStorage.getItem('appointmentBooking'));
    return {
      inicio: '../home/index.html',
      progreso: '../progreso/index.html',
      ajustes: '../ajustes/index.html',
      mentor: hasMentorAssigned ? '../mi-mentor/index.html' : '../mentor/index.html',
    };
  }

  /**
   * Navegación entre tabs. No navega si el tab ya está activo o no tiene ruta.
   * @param {Element} navbarRoot
   * @param {Record<string, string>} routes
   * @param {string} [currentTabId]
   */
  function bindTabNavigation(navbarRoot, routes = {}, currentTabId) {
    if (!navbarRoot) return;

    navbarRoot.querySelectorAll('.navbar__tab').forEach((tab) => {
      if (tab.dataset.navBound === 'true') return;
      tab.dataset.navBound = 'true';

      tab.addEventListener('click', () => {
        const tabId = tab.dataset.navId;
        if (!tabId || tabId === currentTabId) return;

        const href = routes[tabId];
        if (href) {
          window.location.href = href;
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('[data-navbar]').forEach((el) => mount(el));
  }

  window.Navbar = {
    mount,
    init,
    setActive,
    clearStains,
    bindTabNavigation,
    getSiblingTabRoutes,
    TABS,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

