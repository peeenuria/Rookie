/**
 * Historia 1.1 — controlador del flujo de activación
 */
(function () {
  const spec = window.FIGMA_1_1;
  if (!spec) return;

  const WALKTHROUGH_SLIDE_HASHES = Object.keys(spec.walkthroughSlides || {});

  /** Orden del flujo principal Historia 1.1 → 1.2 → 1.3 */
  const FLOW = [
    'splash',
    'walkthrough-1',
    ...WALKTHROUGH_SLIDE_HASHES,
    'signup-empty',
    'consent-default',
    'plan-selection',
    'payment-method',
    'payment-gateway',
    'payment-success',
  ];

  /** Pantallas accesibles solo por hash directo (dev/QA) */
  const SIGNUP_DEMO_HASHES = Object.keys(spec.signupDemos || {});
  const SCANNER_SHEET_DEMO_HASHES = [
    ...Object.keys(spec.codeActivation?.scannerScreenDemos || {}),
    ...Object.keys(spec.codeActivation?.scannerSheetDemos || {}),
  ];

  const SCREENS = {
    splash: 'screen-splash',
    'walkthrough-1': 'screen-walkthrough-1',
    'code-bridge': 'screen-code-bridge',
    'code-manual': 'screen-code-manual',
    'code-scanner': 'screen-code-scanner',
    'signup-empty': 'screen-signup-empty',
    'consent-default': 'screen-consent-default',
    'consent-active': 'screen-consent-active',
    'plan-selection': 'screen-plan-selection',
    'payment-method': 'screen-payment-method',
    'payment-gateway': 'screen-payment-gateway',
    'payment-success': 'screen-payment-success',
    'profiling-personal': 'screen-profiling-personal',
    'profiling-motivations': 'screen-profiling-motivations',
    'profiling-motivations-review': 'screen-profiling-motivations-review',
    'plan-generating': 'screen-plan-generating',
    'profiling-plan-ready': 'screen-profiling-plan-ready',
    'profiling-summary': 'screen-profiling-summary',
  };

  SIGNUP_DEMO_HASHES.forEach((hash) => {
    SCREENS[hash] = `screen-${hash}`;
  });

  SCANNER_SHEET_DEMO_HASHES.forEach((hash) => {
    SCREENS[hash] = 'screen-code-scanner';
  });

  WALKTHROUGH_SLIDE_HASHES.forEach((hash) => {
    SCREENS[hash] = `screen-${hash}`;
  });

  const TITLES = {
    'screen-splash': 'Rookie — 1.1.1 Splash',
    'screen-walkthrough-1': 'Rookie — 1.1.2 Walkthrough 1',
    'screen-walkthrough-2': 'Rookie — 1.1.3 Walkthrough 2',
    'screen-walkthrough-3': 'Rookie — 1.1.4 Walkthrough 3',
    'screen-walkthrough-4': 'Rookie — 1.1.5 Walkthrough 4',
    'screen-walkthrough-5': 'Rookie — 1.1.6 Walkthrough 5',
    'screen-walkthrough-6': 'Rookie — 1.1.7 Walkthrough 6',
    'screen-code-bridge': 'Rookie — Activar código',
    'screen-code-manual': 'Rookie — Código manual',
    'screen-code-scanner': 'Rookie — Escanear código',
    'screen-signup-empty': 'Rookie — 1.1.8 Crear cuenta',
    'screen-consent-default': 'Rookie — 1.2.2 Consentimiento de datos',
    'screen-consent-active': 'Rookie — 1.2.3 Consentimiento de datos — activo',
    'screen-plan-selection': 'Rookie — 1.3.1 Selección de plan',
    'screen-payment-method': 'Rookie — Método de pago',
    'screen-payment-gateway': 'Rookie — Pasarela de pago',
    'screen-payment-success': 'Rookie — Cuenta activada',
    'screen-profiling-personal': 'Rookie — 1.4.1 Perfilado',
    'screen-profiling-motivations': 'Rookie — 1.4.2 Motivaciones',
    'screen-profiling-motivations-review': 'Rookie — 3.1 Revisión motivaciones',
    'screen-plan-generating': 'Rookie — 3.1 Generando plan',
    'screen-profiling-plan-ready': 'Rookie — 3.1 Plan autogenerado',
    'screen-profiling-summary': 'Rookie — 1.4 Resumen',
    'screen-signup-demo-invalid-email': 'Rookie — 1.1.9 Error: correo inválido',
    'screen-signup-demo-email-registered': 'Rookie — 1.1.9 Error: correo registrado',
    'screen-signup-demo-password-short': 'Rookie — 1.1.9 Error: contraseña corta',
  };

  const SCANNER_SHEET_TITLES = {
    'code-scanner-screen-standard': 'Rookie — Scanner · Visor estándar',
    'code-scanner-screen-success': 'Rookie — Scanner · Éxito',
    'code-scanner-screen-read-error': 'Rookie — Scanner · Error de lectura',
    'code-scanner-screen-already-used': 'Rookie — Scanner · Código utilizado',
    'code-scanner-screen-invalid': 'Rookie — Scanner · Código no válido',
    'code-scanner-sheet-standard': 'Rookie — Scanner · Cómo escanear',
    'code-scanner-sheet-read-error': 'Rookie — Scanner · Error de lectura',
    'code-scanner-sheet-already-used': 'Rookie — Scanner · Código utilizado',
    'code-scanner-sheet-invalid': 'Rookie — Scanner · Código no válido',
  };

  function isPlanScreen(screenId) {
    return screenId === 'screen-plan-selection';
  }

  function isConsentScreen(screenId) {
    return screenId === 'screen-consent-default' || screenId === 'screen-consent-active';
  }

  function isSignupScreen(screenId) {
    return (
      screenId === 'screen-signup-empty' ||
      SIGNUP_DEMO_HASHES.some((hash) => screenId === `screen-${hash}`)
    );
  }

  function isWalkthroughSlide(screenId) {
    return WALKTHROUGH_SLIDE_HASHES.some((hash) => screenId === `screen-${hash}`);
  }

  function hashToScreenId(hashKey) {
    return SCREENS[hashKey] || null;
  }

  function getNextFlowKey(currentKey) {
    const index = FLOW.indexOf(currentKey);
    if (index === -1 || index >= FLOW.length - 1) return null;
    return FLOW[index + 1];
  }

  function navigateTo(key) {
    if (
      key === 'walkthrough-1' &&
      document.getElementById('screen-splash')?.classList.contains('is-active') &&
      !splashCrossfadeInProgress
    ) {
      crossfadeSplashToWelcome();
      return;
    }

    const screenId = hashToScreenId(key);
    if (!screenId) return;

    prepareWalkthroughPageDots(key);

    const target = `#${key}`;
    if (window.location.hash !== target) {
      window.location.hash = key;
    }

    showScreen(screenId);
    onScreenEnter(key);
  }

  let splashTimerId = null;
  let splashCrossfadeInProgress = false;
  let splashCrossfadeRafId = null;

  function clearSplashTimer() {
    if (splashTimerId !== null) {
      clearTimeout(splashTimerId);
      splashTimerId = null;
    }
    if (splashCrossfadeRafId !== null) {
      window.cancelAnimationFrame(splashCrossfadeRafId);
      splashCrossfadeRafId = null;
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function playSplashLogoEntrance() {
    const splashEl = document.getElementById('splash-tap');
    if (!splashEl) return 0;

    splashEl.classList.remove('is-entering', 'is-entered');

    if (prefersReducedMotion()) {
      splashEl.classList.add('is-entered');
      return 0;
    }

    // Force reflow so the entrance can replay when returning to splash
    void splashEl.offsetWidth;
    splashEl.classList.add('is-entering');

    const enterMs = spec.navigation?.splashLogoEnterMs ?? 650;
    splashEl.addEventListener(
      'animationend',
      () => {
        splashEl.classList.remove('is-entering');
        splashEl.classList.add('is-entered');
      },
      { once: true }
    );

    return enterMs;
  }

  function finishSplashCrossfade() {
    const splash = document.getElementById('screen-splash');
    const welcome = document.getElementById('screen-walkthrough-1');
    const shell = document.getElementById('phone-shell');
    const body = shell?.querySelector('.phone-shell__body');

    splash?.classList.remove('is-crossfade-out');
    welcome?.classList.remove('is-crossfade-in');
    body?.classList.remove('is-splash-crossfading', 'is-splash-crossfading-run');
    body?.style.removeProperty('--splash-crossfade-ms');
    shell?.classList.remove('phone-shell--splash-crossfading');

    splashCrossfadeInProgress = false;
    showScreen(SCREENS['walkthrough-1']);

    if (window.location.hash !== '#walkthrough-1') {
      window.location.hash = 'walkthrough-1';
    } else {
      onScreenEnter('walkthrough-1');
    }
  }

  function crossfadeSplashToWelcome() {
    if (splashCrossfadeInProgress) return;

    clearSplashTimer();

    if (prefersReducedMotion()) {
      const screenId = SCREENS['walkthrough-1'];
      if (window.location.hash !== '#walkthrough-1') {
        window.location.hash = 'walkthrough-1';
      }
      showScreen(screenId);
      onScreenEnter('walkthrough-1');
      return;
    }

    const splash = document.getElementById('screen-splash');
    const welcome = document.getElementById('screen-walkthrough-1');
    const shell = document.getElementById('phone-shell');
    const body = shell?.querySelector('.phone-shell__body');

    if (!splash || !welcome || !body) {
      showScreen(SCREENS['walkthrough-1']);
      if (window.location.hash !== '#walkthrough-1') {
        window.location.hash = 'walkthrough-1';
      } else {
        onScreenEnter('walkthrough-1');
      }
      return;
    }

    splashCrossfadeInProgress = true;
    const duration = spec.navigation?.splashCrossfadeMs ?? 350;

    shell?.classList.add('phone-shell--splash', 'phone-shell--splash-crossfading');
    body.classList.add('is-splash-crossfading');
    body.classList.remove('is-splash-crossfading-run');
    body.style.setProperty('--splash-crossfade-ms', `${duration}ms`);

    splash.classList.add('is-active');
    welcome.classList.add('is-active');

    // Stack both frames, then run the opacity crossfade on the next paint
    void body.offsetWidth;
    splashCrossfadeRafId = window.requestAnimationFrame(() => {
      splashCrossfadeRafId = window.requestAnimationFrame(() => {
        splashCrossfadeRafId = null;
        body.classList.add('is-splash-crossfading-run');
      });
    });

    splashTimerId = window.setTimeout(finishSplashCrossfade, duration);
  }

  function onScreenEnter(key) {
    clearSplashTimer();
    window.ProfilingFlow?.onScreenEnter?.(key);
    if (key === 'splash') {
      const enterMs = playSplashLogoEntrance();
      const holdMs = spec.navigation?.splashHoldAfterLogoMs ?? 500;
      splashTimerId = window.setTimeout(crossfadeSplashToWelcome, enterMs + holdMs);
    }
    animateWalkthroughPageDots(key);
  }

  function showScreen(screenId) {
    const shell = document.getElementById('phone-shell');
    document.querySelectorAll('.screen').forEach((section) => {
      section.classList.toggle('is-active', section.id === screenId);
    });

    if (shell) {
      shell.classList.toggle('phone-shell--splash', screenId === 'screen-splash');
      shell.classList.toggle('phone-shell--walkthrough-1', screenId === 'screen-walkthrough-1');
      shell.classList.toggle(
        'phone-shell--walkthrough-slide',
        isWalkthroughSlide(screenId)
      );
      shell.classList.toggle('phone-shell--signup', isSignupScreen(screenId));
      shell.classList.toggle('phone-shell--consent', isConsentScreen(screenId));
      shell.classList.toggle('phone-shell--plan', isPlanScreen(screenId));
      shell.classList.toggle(
        'phone-shell--payment',
        screenId === 'screen-payment-gateway' || screenId === 'screen-payment-method'
      );
      shell.classList.toggle('phone-shell--payment-success', screenId === 'screen-payment-success');
      shell.classList.toggle('phone-shell--code-bridge', screenId === 'screen-code-bridge');
      shell.classList.toggle('phone-shell--code-manual', screenId === 'screen-code-manual');
      shell.classList.toggle('phone-shell--code-scanner', screenId === 'screen-code-scanner');
      shell.classList.toggle(
        'phone-shell--profiling',
        screenId === 'screen-profiling-personal' ||
          screenId === 'screen-profiling-motivations' ||
          screenId === 'screen-profiling-motivations-review' ||
          screenId === 'screen-plan-generating' ||
          screenId === 'screen-profiling-plan-ready' ||
          screenId === 'screen-profiling-summary'
      );
    }

    if (screenId === 'screen-code-scanner') {
      const hashKey = resolveHashKeyFromHash();
      window.CodeActivationFlow?.enterScannerRoute?.(hashKey);
    } else {
      window.CodeActivationFlow?.stopCamera?.();
    }

    if (screenId === 'screen-plan-selection') {
      window.PlanSelection?.refresh?.();
    }

    if (screenId === 'screen-payment-method') {
      window.PaymentFlow?.refreshMethodScreen?.();
    }

    if (screenId === 'screen-payment-gateway') {
      window.PaymentFlow?.refreshSummary?.();
    }

    const demoTitle = SCANNER_SHEET_TITLES[resolveHashKeyFromHash()];
    if (demoTitle) {
      document.title = demoTitle;
    } else if (TITLES[screenId]) {
      document.title = TITLES[screenId];
    }
  }

  function resolveScreenFromHash() {
    const key = window.location.hash.replace(/^#/, '');
    if (!key) return SCREENS.splash;
    if (hashToScreenId(key)) return SCREENS[key];
    return SCREENS.splash;
  }

  function resolveHashKeyFromHash() {
    const key = window.location.hash.replace(/^#/, '');
    if (!key) return 'splash';
    if (hashToScreenId(key)) return key;
    return 'splash';
  }

  function initNavigation() {
    const splashTap = document.getElementById('splash-tap');
    if (splashTap) {
      splashTap.addEventListener('click', () => {
        clearSplashTimer();
        navigateTo('walkthrough-1');
      });
    }

    const walkthroughCta = document.getElementById('walkthrough-cta');
    if (walkthroughCta) {
      walkthroughCta.addEventListener('click', () => navigateTo('walkthrough-2'));
    }

    const walkthroughLogin = document.getElementById('walkthrough-login-link');
    if (walkthroughLogin) {
      walkthroughLogin.addEventListener('click', (event) => event.preventDefault());
    }

    WALKTHROUGH_SLIDE_HASHES.forEach((hash) => {
      const cta = document.getElementById(`${hash}-cta`);
      if (cta) {
        cta.addEventListener('click', () => {
          const next = getNextFlowKey(hash);
          if (next) navigateTo(next);
        });
      }

      const skip = document.getElementById(`${hash}-skip`);
      if (skip) {
        skip.addEventListener('click', () => navigateTo('signup-empty'));
      }
    });

    document.querySelectorAll('.signup-screen__login-link').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });
  }

  function handleRouteChange() {
    const key = resolveHashKeyFromHash();

    if (splashCrossfadeInProgress) {
      if (key === 'walkthrough-1') {
        // Hash sync at end of crossfade — finalize without interrupting the fade
        return;
      }
      // User navigated elsewhere mid-fade: abort and show target
      splashCrossfadeInProgress = false;
      clearSplashTimer();
      const shell = document.getElementById('phone-shell');
      const body = shell?.querySelector('.phone-shell__body');
      document.getElementById('screen-splash')?.classList.remove('is-crossfade-out');
      document.getElementById('screen-walkthrough-1')?.classList.remove('is-crossfade-in');
      body?.classList.remove('is-splash-crossfading', 'is-splash-crossfading-run');
      body?.style.removeProperty('--splash-crossfade-ms');
      shell?.classList.remove('phone-shell--splash-crossfading');
    }

    prepareWalkthroughPageDots(key);
    showScreen(SCREENS[key] || SCREENS.splash);
    onScreenEnter(key);
  }

  function initSplash() {
    const logo = document.getElementById('splash-logo');
    const title = document.getElementById('splash-title');

    if (logo && spec.splash.logoAsset) {
      logo.src = spec.splash.logoAsset;
      logo.alt = '';
    }

    if (title) {
      title.textContent = spec.splash.brandName;
    }
  }

  function initWalkthrough1() {
    const data = spec.walkthrough1;
    if (!data) return;

    const photo = document.getElementById('walkthrough-hero-photo');
    const logoMark = document.getElementById('walkthrough-logo-mark');
    const logoWordmark = document.getElementById('walkthrough-logo-wordmark');
    const title = document.getElementById('walkthrough-title');
    const cta = document.getElementById('walkthrough-cta');
    const loginPrefix = document.getElementById('walkthrough-login-prefix');
    const loginLink = document.getElementById('walkthrough-login-link');

    if (photo && data.backgroundAsset) {
      photo.src = data.backgroundAsset;
      photo.alt = '';
    }

    if (logoMark && data.logoMarkAsset) {
      logoMark.src = data.logoMarkAsset;
      logoMark.alt = '';
    }

    if (logoWordmark && data.logoWordmarkAsset) {
      logoWordmark.src = data.logoWordmarkAsset;
      logoWordmark.alt = '';
    }

    if (title && Array.isArray(data.titleLines)) {
      title.innerHTML = data.titleLines
        .map((line) => `<span class="walkthrough-hero__title-line">${line}</span>`)
        .join('');
    }

    if (cta) cta.textContent = data.primaryCta;
    if (loginPrefix) loginPrefix.textContent = `${data.loginPrefix} `;
    if (loginLink) loginLink.textContent = data.loginLink;
  }

  function renderPagination(container, total, activeIndex) {
    if (!container) return;
    container.classList.add('page-dots');
    container.innerHTML = Array.from({ length: total }, (_, index) => {
      const isActive = index === activeIndex;
      return `<span class="page-dots__dot${isActive ? ' is-active' : ''}" aria-hidden="true"></span>`;
    }).join('');
    container.setAttribute('aria-label', `Paso ${activeIndex + 1} de ${total}`);
  }

  function applyPageDotActive(container, activeIndex) {
    if (!container) return;
    const dots = container.querySelectorAll('.page-dots__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
    });
    if (dots.length) {
      container.setAttribute('aria-label', `Paso ${activeIndex + 1} de ${dots.length}`);
    }
  }

  let lastWalkthroughPageDotIndex = null;
  let pageDotAnimateRafId = null;

  function clearPageDotAnimation() {
    if (pageDotAnimateRafId !== null) {
      window.cancelAnimationFrame(pageDotAnimateRafId);
      pageDotAnimateRafId = null;
    }
  }

  function getWalkthroughPageDotIndex(key) {
    const data = spec.walkthroughSlides?.[key];
    if (!data) return null;
    return data.paginationActive ?? 0;
  }

  /** Before showing a slide: park dots at previous index so the morph can run. */
  function prepareWalkthroughPageDots(key) {
    const target = getWalkthroughPageDotIndex(key);
    if (target === null) return;

    const pagination = document.getElementById(`${key}-pagination`);
    if (!pagination) return;

    const from = lastWalkthroughPageDotIndex;
    if (
      from !== null &&
      from !== target &&
      !prefersReducedMotion()
    ) {
      applyPageDotActive(pagination, from);
    } else {
      applyPageDotActive(pagination, target);
    }
  }

  /** After show: morph previous pill → circle and new circle → pill together. */
  function animateWalkthroughPageDots(key) {
    const target = getWalkthroughPageDotIndex(key);
    if (target === null) {
      clearPageDotAnimation();
      lastWalkthroughPageDotIndex = null;
      return;
    }

    const pagination = document.getElementById(`${key}-pagination`);
    if (!pagination) {
      lastWalkthroughPageDotIndex = target;
      return;
    }

    const from = lastWalkthroughPageDotIndex;

    // Duplicate onScreenEnter (hashchange + navigateTo): keep in-flight morph
    if (from === target) {
      return;
    }

    clearPageDotAnimation();

    const shouldAnimate = from !== null && !prefersReducedMotion();

    if (shouldAnimate) {
      applyPageDotActive(pagination, from);
      pageDotAnimateRafId = window.requestAnimationFrame(() => {
        pageDotAnimateRafId = window.requestAnimationFrame(() => {
          pageDotAnimateRafId = null;
          applyPageDotActive(pagination, target);
        });
      });
    } else {
      applyPageDotActive(pagination, target);
    }

    lastWalkthroughPageDotIndex = target;
  }

  function renderTitleHtml(data) {
    if (Array.isArray(data.titleLines)) {
      return data.titleLines
        .map((line) => `<span class="walkthrough-slide__title-line">${line}</span>`)
        .join('');
    }
    return data.title || '';
  }

  function createWalkthroughSlideMarkup(hash, data) {
    const defaults = spec.walkthroughSlideDefaults || {};
    const skipHidden = data.hideSkip ? ' hidden' : '';
    const ariaLabel = Array.isArray(data.titleLines)
      ? data.titleLines.join(' ')
      : data.title;

    return `
      <section
        class="screen screen--walkthrough-slide"
        id="screen-${hash}"
        aria-label="Walkthrough — ${ariaLabel}"
      >
        <div class="walkthrough-slide">
          <button type="button" class="walkthrough-slide__skip" id="${hash}-skip"${skipHidden}>
            ${defaults.skipLabel || 'Saltar'}
          </button>
          <div class="walkthrough-slide__hero">
            <img class="walkthrough-slide__hero-photo" id="${hash}-photo" src="" alt="" />
          </div>
          <div class="walkthrough-slide__body">
            <div class="walkthrough-slide__pagination page-dots" id="${hash}-pagination" role="img"></div>
            <h1 class="walkthrough-slide__title" id="${hash}-title"></h1>
            <p class="walkthrough-slide__subtitle" id="${hash}-subtitle"></p>
            <p class="walkthrough-slide__description" id="${hash}-description"></p>
          </div>
          <div class="walkthrough-slide__actions">
            <button type="button" class="btn btn--primary walkthrough-slide__cta" id="${hash}-cta">
              ${defaults.primaryCta || 'Continuar'}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function mountWalkthroughSlides() {
    const container = document.querySelector('.phone-shell__body');
    if (!container || !spec.walkthroughSlides) return;

    Object.entries(spec.walkthroughSlides).forEach(([hash, data]) => {
      if (document.getElementById(`screen-${hash}`)) return;
      container.insertAdjacentHTML('beforeend', createWalkthroughSlideMarkup(hash, data));
    });
  }

  function initWalkthroughSlide(hash, data) {
    if (!data) return;
    const defaults = spec.walkthroughSlideDefaults || {};

    const photo = document.getElementById(`${hash}-photo`);
    const pagination = document.getElementById(`${hash}-pagination`);
    const title = document.getElementById(`${hash}-title`);
    const subtitle = document.getElementById(`${hash}-subtitle`);
    const description = document.getElementById(`${hash}-description`);
    const cta = document.getElementById(`${hash}-cta`);
    const skip = document.getElementById(`${hash}-skip`);

    if (photo && data.heroPhotoAsset) {
      photo.src = data.heroPhotoAsset;
      photo.alt = '';
    }

    renderPagination(
      pagination,
      defaults.paginationTotal || 5,
      data.paginationActive ?? 0
    );

    if (title) {
      title.innerHTML = renderTitleHtml(data);
    }

    if (subtitle) subtitle.textContent = data.subtitle || '';
    if (description) description.textContent = data.description || '';
    if (cta) cta.textContent = defaults.primaryCta || 'Continuar';
    if (skip && !data.hideSkip) {
      skip.textContent = defaults.skipLabel || 'Saltar';
    }
  }

  function createSignupMarkup(screenId) {
    const copy = spec.signup;
    return `
      <section class="screen screen--signup" id="${screenId}">
        <div class="signup-screen">
          <div class="signup-screen__scroll">
            <div class="signup-screen__content">
              <h1 class="screen-intro__title signup-screen__title">${copy.title}</h1>
              <div class="signup-form" id="${screenId}-form"></div>
            </div>
          </div>
          <footer class="signup-screen__footer">
            <p class="signup-screen__login">
              <span>${copy.loginPrefix}</span>
              <a class="signup-screen__login-link" href="#">${copy.loginLink}</a>
            </p>
          </footer>
        </div>
      </section>
    `;
  }

  const SIGNUP_EYE_OPEN = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
    </svg>`;

  const SIGNUP_EYE_CLOSED = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  function isValidEmail(value) {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  function isRegisteredEmail(value) {
    const list = spec.signupMock?.registeredEmails || [];
    return list.includes(value.trim().toLowerCase());
  }

  function renderSignupFormShell(screenId) {
    const copy = spec.signup;
    const form = document.getElementById(`${screenId}-form`);
    if (!form) return;

    const prefix = screenId.replace('screen-', '');

    form.innerHTML = `
      <div class="signup-form__fields">
        <div class="signup-field" data-signup-email-wrap>
          <label class="signup-field__label" for="${prefix}-email">${copy.emailLabel}</label>
          <div class="signup-field__control">
            <input
              class="signup-field__input"
              id="${prefix}-email"
              type="email"
              data-signup-email
              placeholder="${copy.emailPlaceholder}"
              autocomplete="email"
            />
          </div>
          <p class="signup-field__error" data-signup-email-message hidden></p>
        </div>
        <div class="signup-field" data-signup-password-wrap>
          <label class="signup-field__label" for="${prefix}-password">${copy.passwordLabel}</label>
          <div class="signup-field__control">
            <input
              class="signup-field__input signup-field__input--password"
              id="${prefix}-password"
              type="password"
              data-signup-password
              placeholder="${copy.passwordPlaceholder}"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="signup-field__toggle"
              data-signup-password-toggle
              aria-label="Mostrar contraseña"
              aria-pressed="false"
            >${SIGNUP_EYE_OPEN}</button>
          </div>
          <p class="signup-field__hint" data-signup-password-message>${copy.passwordHint}</p>
        </div>
      </div>
      <div class="signup-form__actions">
        <button
          type="button"
          class="btn btn--primary signup-form__submit btn--disabled"
          data-signup-submit
          disabled
        >${copy.primaryCta}</button>
        <p class="signup-form__privacy">
          ${copy.privacyPrefix}<a href="#">${copy.privacyLink}</a>
        </p>
      </div>
      <hr class="signup-form__divider" />
      <div class="signup-form__social">
        <button type="button" class="btn btn--secondary signup-form__social-btn" data-signup-social="google">
          <span class="signup-form__social-icon" aria-hidden="true">
            <img src="${copy.icons.google}" alt="" width="20" height="20" />
          </span>
          <span class="signup-form__social-label">${copy.googleCta}</span>
        </button>
        <button type="button" class="btn btn--secondary signup-form__social-btn" data-signup-social="apple">
          <span class="signup-form__social-icon" aria-hidden="true">
            <img src="${copy.icons.apple}" alt="" width="20" height="20" />
          </span>
          <span class="signup-form__social-label">${copy.appleCta}</span>
        </button>
      </div>
    `;
  }

  function showSocialLoginModal(provider) {
    const label = provider === 'apple' ? 'Apple' : 'Google';
    let host = document.getElementById('social-login-modal');
    if (!host) {
      host = document.createElement('div');
      host.id = 'social-login-modal';
      host.className = 'social-login-modal';
      host.hidden = true;
      host.innerHTML = `
        <div class="social-login-modal__backdrop" data-social-modal-dismiss></div>
        <div class="social-login-modal__panel" role="dialog" aria-modal="true" aria-labelledby="social-login-modal-title">
          <div class="social-login-modal__handle" aria-hidden="true"></div>
          <h2 class="social-login-modal__title" id="social-login-modal-title">Continuar con ${label}</h2>
          <p class="social-login-modal__body">
            En el prototipo, el inicio de sesión con ${label} está simulado. Confirma para continuar al consentimiento.
          </p>
          <div class="social-login-modal__actions btn-stack">
            <button type="button" class="btn btn--primary" data-social-modal-confirm>Continuar</button>
            <button type="button" class="btn btn--secondary" data-social-modal-dismiss>Cancelar</button>
          </div>
        </div>
      `;
      (document.querySelector('.phone-shell') || document.body).appendChild(host);

      host.addEventListener('click', (event) => {
        if (event.target.closest('[data-social-modal-dismiss]')) {
          host.hidden = true;
          return;
        }
        if (event.target.closest('[data-social-modal-confirm]')) {
          host.hidden = true;
          window.location.hash = 'consent-default';
        }
      });
    } else {
      const title = host.querySelector('#social-login-modal-title');
      const body = host.querySelector('.social-login-modal__body');
      if (title) title.textContent = `Continuar con ${label}`;
      if (body) {
        body.textContent = `En el prototipo, el inicio de sesión con ${label} está simulado. Confirma para continuar al consentimiento.`;
      }
    }
    host.hidden = false;
  }

  function initSignupForm(screenId, preset = {}, options = {}) {
    renderSignupFormShell(screenId);

    const form = document.getElementById(`${screenId}-form`);
    if (!form) return;

    const validation = spec.signupValidation || {};
    const emailWrap = form.querySelector('[data-signup-email-wrap]');
    const emailInput = form.querySelector('[data-signup-email]');
    const emailMessage = form.querySelector('[data-signup-email-message]');
    const passwordWrap = form.querySelector('[data-signup-password-wrap]');
    const passwordInput = form.querySelector('[data-signup-password]');
    const passwordMessage = form.querySelector('[data-signup-password-message]');
    const toggleBtn = form.querySelector('[data-signup-password-toggle]');
    const submitBtn = form.querySelector('[data-signup-submit]');

    let emailErrorType = null;
    let emailTouched = false;
    let passwordVisible = false;

    function errorMessageHtml(content, allowHtml = false) {
      const text = allowHtml
        ? content
        : content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<span>${text}</span>`;
    }

    function setEmailError(type) {
      emailErrorType = type;
      if (!type) {
        emailMessage.hidden = true;
        emailMessage.innerHTML = '';
        emailInput.removeAttribute('aria-invalid');
        emailWrap.classList.remove('signup-field--error');
        return;
      }

      emailMessage.hidden = false;
      emailInput.setAttribute('aria-invalid', 'true');
      emailWrap.classList.add('signup-field--error');

      if (type === 'invalid') {
        emailMessage.innerHTML = errorMessageHtml(validation.invalidEmail);
      } else if (type === 'registered') {
        emailMessage.innerHTML = errorMessageHtml(
          `${validation.registeredPrefix}<a href="#" class="signup-field__error-link">${validation.registeredLink}</a>`,
          true
        );
        emailMessage.querySelector('.signup-field__error-link')?.addEventListener('click', (event) => {
          event.preventDefault();
        });
      }
    }

    function validateEmailFormat(forceShow) {
      const value = emailInput.value.trim();
      if (!value) {
        setEmailError(null);
        return;
      }
      if (!isValidEmail(value)) {
        if (forceShow || emailTouched) {
          setEmailError('invalid');
        }
        return;
      }
      if (emailErrorType !== 'registered') {
        setEmailError(null);
      }
    }

    function updatePasswordFeedback() {
      const value = passwordInput.value;
      if (value.length === 0 || value.length >= 8) {
        passwordMessage.className = 'signup-field__hint';
        passwordMessage.innerHTML = spec.signup.passwordHint;
        passwordWrap.classList.remove('signup-field--error');
        passwordInput.removeAttribute('aria-invalid');
        return;
      }

      passwordMessage.className = 'signup-field__error';
      passwordMessage.innerHTML = errorMessageHtml(spec.signup.passwordHint);
      passwordWrap.classList.add('signup-field--error');
      passwordInput.setAttribute('aria-invalid', 'true');
    }

    function hasPasswordError() {
      const len = passwordInput.value.length;
      return len > 0 && len < 8;
    }

    function updateSubmitButton() {
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const canSubmit =
        email.length > 0 &&
        password.length > 0 &&
        isValidEmail(email) &&
        password.length >= 8 &&
        emailErrorType === null &&
        !hasPasswordError();

      submitBtn.disabled = !canSubmit;
      submitBtn.classList.toggle('btn--disabled', !canSubmit);
    }

    function updatePasswordToggle() {
      passwordInput.type = passwordVisible ? 'text' : 'password';
      toggleBtn.innerHTML = passwordVisible ? SIGNUP_EYE_CLOSED : SIGNUP_EYE_OPEN;
      toggleBtn.setAttribute('aria-label', passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña');
      toggleBtn.setAttribute('aria-pressed', passwordVisible ? 'true' : 'false');
    }

    emailInput.addEventListener('blur', () => {
      emailTouched = true;
      validateEmailFormat(true);
      updateSubmitButton();
    });

    emailInput.addEventListener('input', () => {
      if (emailErrorType === 'registered') {
        setEmailError(null);
      }
      validateEmailFormat(emailTouched);
      updateSubmitButton();
    });

    passwordInput.addEventListener('input', () => {
      updatePasswordFeedback();
      updateSubmitButton();
    });

    toggleBtn.addEventListener('click', () => {
      passwordVisible = !passwordVisible;
      updatePasswordToggle();
    });

    submitBtn.addEventListener('click', () => {
      if (submitBtn.disabled) return;

      emailTouched = true;
      validateEmailFormat(true);
      updatePasswordFeedback();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password || hasPasswordError() || !isValidEmail(email) || password.length < 8) {
        updateSubmitButton();
        return;
      }

      if (isRegisteredEmail(email)) {
        setEmailError('registered');
        updateSubmitButton();
        return;
      }

      if (typeof options.onSuccess === 'function') {
        options.onSuccess();
      }
    });

    if (preset.emailValue) {
      emailInput.value = preset.emailValue;
    }
    if (preset.passwordValue) {
      passwordInput.value = preset.passwordValue;
    }

    if (preset.showEmailError === 'invalid') {
      emailTouched = true;
      setEmailError('invalid');
    } else if (preset.showEmailError === 'registered') {
      setEmailError('registered');
    }

    if (preset.showPasswordError) {
      updatePasswordFeedback();
    }

    updatePasswordToggle();
    updateSubmitButton();

    form.querySelectorAll('[data-signup-social]').forEach((btn) => {
      btn.addEventListener('click', () => {
        showSocialLoginModal(btn.dataset.signupSocial || 'google');
      });
    });
  }

  function mountSignupScreens() {
    const container = document.querySelector('.phone-shell__body');
    if (!container) return;

    const signupScreens = ['screen-signup-empty', ...SIGNUP_DEMO_HASHES.map((h) => `screen-${h}`)];

    signupScreens.forEach((screenId) => {
      if (document.getElementById(screenId)) return;
      container.insertAdjacentHTML('beforeend', createSignupMarkup(screenId));
    });

    initSignupForm('screen-signup-empty', {}, {
      onSuccess: () => navigateTo('consent-default'),
    });

    SIGNUP_DEMO_HASHES.forEach((hash) => {
      initSignupForm(`screen-${hash}`, spec.signupDemos[hash] || {});
    });
  }

  mountWalkthroughSlides();
  mountSignupScreens();

  const pageDotMs = spec.navigation?.pageDotTransitionMs;
  if (pageDotMs != null) {
    document.documentElement.style.setProperty('--page-dot-transition-ms', `${pageDotMs}ms`);
  }

  initSplash();
  initWalkthrough1();
  Object.entries(spec.walkthroughSlides || {}).forEach(([hash, data]) => {
    initWalkthroughSlide(hash, data);
  });

  initNavigation();

  if (!window.location.hash) {
    history.replaceState(null, '', '#splash');
  }

  window.ActivationFlow = { navigateTo, refreshRoute: handleRouteChange };

  handleRouteChange();
  window.addEventListener('hashchange', handleRouteChange);
})();
