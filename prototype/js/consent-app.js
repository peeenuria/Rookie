/**
 * Historia 1.2 — Consentimiento de datos
 */
(function () {
  const spec = window.FIGMA_1_2;
  if (!spec) return;

  let sheetMounted = false;
  let sheetOpen = false;

  function resolveAssetBase() {
    const path = window.location.pathname;
    if (path.includes('/consent/active/')) return '../../';
    if (path.includes('/consent/')) return '../';
    if (path.includes('/activation/')) return '../';
    return '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatParagraph(text, email) {
    const safeText = escapeHtml(text);
    if (!email || !text.includes('{{email}}')) {
      return safeText;
    }

    const safeEmail = escapeHtml(email);
    return safeText.replace(
      '{{email}}',
      `<a class="consent-more-info-sheet__link" href="mailto:${safeEmail}">${safeEmail}</a>`
    );
  }

  function renderListItem(item) {
    if (typeof item === 'string') {
      return `<li class="consent-more-info-sheet__list-item">${escapeHtml(item)}</li>`;
    }

    const className = item.emphasis
      ? 'consent-more-info-sheet__list-item consent-more-info-sheet__list-item--emphasis'
      : 'consent-more-info-sheet__list-item';

    return `<li class="${className}">${escapeHtml(item.text)}</li>`;
  }

  function renderMoreInfoSections(sheetData) {
    if (!sheetData?.sections) return '';

    return sheetData.sections
      .map((section) => {
        const heading = `${section.number}. ${section.heading}`;
        const paragraphs = (section.paragraphs || [])
          .map(
            (paragraph) =>
              `<p class="consent-more-info-sheet__section-body">${formatParagraph(paragraph, section.email)}</p>`
          )
          .join('');
        const list = section.list
          ? `<ul class="consent-more-info-sheet__list">${section.list.map(renderListItem).join('')}</ul>`
          : '';

        return `
          <section class="consent-more-info-sheet__section">
            <h3 class="consent-more-info-sheet__section-heading">${escapeHtml(heading)}</h3>
            ${paragraphs}
            ${list}
          </section>
        `;
      })
      .join('');
  }

  function createMoreInfoSheetMarkup() {
    return `
      <div
        class="consent-more-info-sheet"
        id="consent-more-info-sheet"
        hidden
        role="presentation"
      >
        <button
          type="button"
          class="consent-more-info-sheet__backdrop"
          id="consent-more-info-sheet-backdrop"
          aria-label="Cerrar información"
        ></button>
        <div
          class="consent-more-info-sheet__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-more-info-sheet-title"
        >
          <div class="consent-more-info-sheet__handle" aria-hidden="true"></div>
          <header class="consent-more-info-sheet__header">
            <h2 class="consent-more-info-sheet__title" id="consent-more-info-sheet-title"></h2>
          </header>
          <div class="consent-more-info-sheet__scroll" id="consent-more-info-sheet-scroll">
            <div class="consent-more-info-sheet__sections" id="consent-more-info-sheet-sections"></div>
          </div>
        </div>
      </div>
    `;
  }

  function ensureMoreInfoSheetMounted() {
    if (sheetMounted) return;

    const shell = document.querySelector('.phone-shell');
    if (!shell) return;

    shell.insertAdjacentHTML('beforeend', createMoreInfoSheetMarkup());

    const sheetData = spec.privacyMoreInfoSheet;
    const title = document.getElementById('consent-more-info-sheet-title');
    const sections = document.getElementById('consent-more-info-sheet-sections');
    const backdrop = document.getElementById('consent-more-info-sheet-backdrop');
    const closeBtn = document.getElementById('consent-more-info-sheet-close');

    if (title && sheetData) title.textContent = sheetData.title;
    if (sections && sheetData) sections.innerHTML = renderMoreInfoSections(sheetData);

    backdrop?.addEventListener('click', closeConsentMoreInfoSheet);
    closeBtn?.addEventListener('click', closeConsentMoreInfoSheet);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sheetOpen) {
        closeConsentMoreInfoSheet();
      }
    });

    sheetMounted = true;
  }

  function openConsentMoreInfoSheet() {
    ensureMoreInfoSheetMounted();

    const sheet = document.getElementById('consent-more-info-sheet');
    const scroll = document.getElementById('consent-more-info-sheet-scroll');
    if (!sheet) return;

    sheet.hidden = false;
    sheetOpen = true;
    if (scroll) scroll.scrollTop = 0;

    document.getElementById('consent-more-info-sheet-title')?.focus();
  }

  function closeConsentMoreInfoSheet() {
    const sheet = document.getElementById('consent-more-info-sheet');
    if (!sheet) return;

    sheet.hidden = true;
    sheetOpen = false;
  }

  function createConsentMarkup({ screenId, idPrefix, acceptDisabled = true }) {
    const acceptClass = acceptDisabled ? ' btn--disabled' : '';
    const acceptDisabledAttr = acceptDisabled ? ' disabled' : '';
    const backBar =
      window.BarraSuperiorBack?.render({
        id: `${idPrefix}-back`,
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--consent"
        id="${screenId}"
        aria-label="Consentimiento de datos"
      >
        ${backBar}
        <div class="consent-screen">
          <div class="consent-screen__body">
            <div class="consent-screen__top">
              <header class="screen-intro consent-screen__header">
                <h1 class="screen-intro__title" id="${idPrefix}-title">Tu privacidad nos importa</h1>
                <p class="screen-intro__subtitle" id="${idPrefix}-intro"></p>
              </header>

              <div class="consent-screen__form">
                <label class="consent-checkbox" for="${idPrefix}-terms">
                  <input
                    class="consent-checkbox__input"
                    type="checkbox"
                    id="${idPrefix}-terms"
                    name="${idPrefix}-terms"
                  />
                  <span class="consent-checkbox__box" aria-hidden="true"></span>
                  <span class="consent-checkbox__label" id="${idPrefix}-terms-label"></span>
                </label>

                <label class="consent-checkbox" for="${idPrefix}-newsletter">
                  <input
                    class="consent-checkbox__input"
                    type="checkbox"
                    id="${idPrefix}-newsletter"
                    name="${idPrefix}-newsletter"
                  />
                  <span class="consent-checkbox__box" aria-hidden="true"></span>
                  <span class="consent-checkbox__label" id="${idPrefix}-newsletter-label"></span>
                </label>

                <p class="consent-screen__required" id="${idPrefix}-required-hint"></p>
              </div>
            </div>

            <div class="consent-screen__illustration">
              <img id="${idPrefix}-illustration" src="" alt="" width="200" height="200" />
            </div>

            <div class="consent-screen__actions">
              <button type="button" class="btn consent-screen__info" id="${idPrefix}-more-info">
                Más información
              </button>
              <button
                type="button"
                class="btn btn--primary consent-screen__accept${acceptClass}"
                id="${idPrefix}-accept"${acceptDisabledAttr}
              >
                Aceptar y continuar
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function initConsentScreen(idPrefix, data) {
    if (!data) return;

    const title = document.getElementById(`${idPrefix}-title`);
    const intro = document.getElementById(`${idPrefix}-intro`);
    const termsLabel = document.getElementById(`${idPrefix}-terms-label`);
    const newsletterLabel = document.getElementById(`${idPrefix}-newsletter-label`);
    const requiredHint = document.getElementById(`${idPrefix}-required-hint`);
    const illustration = document.getElementById(`${idPrefix}-illustration`);
    const moreInfoBtn = document.getElementById(`${idPrefix}-more-info`);
    const acceptBtn = document.getElementById(`${idPrefix}-accept`);
    const termsInput = document.getElementById(`${idPrefix}-terms`);
    const newsletterInput = document.getElementById(`${idPrefix}-newsletter`);

    const copy = data.termsLabel;

    if (title) title.textContent = data.title;
    if (intro) intro.textContent = data.intro;

    if (termsLabel && copy) {
      termsLabel.innerHTML = [
        copy.beforeLink,
        `<a class="consent-checkbox__link" href="#">${copy.linkText}</a>`,
        copy.afterLink,
        `<span class="consent-checkbox__brand">${copy.brand}</span>`,
        copy.afterBrand,
      ].join('');
      termsLabel.querySelector('.consent-checkbox__link')?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    }

    if (newsletterLabel) newsletterLabel.textContent = data.newsletterLabel;
    if (requiredHint) requiredHint.textContent = data.requiredHint;

    if (illustration && data.illustrationAsset) {
      const assetPath = data.illustrationAsset.startsWith('/')
        ? data.illustrationAsset
        : `${resolveAssetBase()}${data.illustrationAsset}`;
      illustration.src = assetPath;
      illustration.alt = '';
    }

    if (moreInfoBtn) {
      moreInfoBtn.textContent = data.moreInfoCta;
      moreInfoBtn.disabled = false;
      moreInfoBtn.removeAttribute('aria-disabled');
      moreInfoBtn.classList.remove('btn--disabled');
      moreInfoBtn.addEventListener('click', openConsentMoreInfoSheet);
    }

    if (acceptBtn) acceptBtn.textContent = data.acceptCta;
    if (termsInput) termsInput.checked = data.termsChecked;
    if (newsletterInput) newsletterInput.checked = data.newsletterChecked;

    function updateAcceptButton() {
      if (!acceptBtn || !termsInput) return;
      const canAccept = termsInput.checked;
      acceptBtn.disabled = !canAccept;
      acceptBtn.classList.toggle('btn--disabled', !canAccept);

      if (moreInfoBtn) {
        moreInfoBtn.disabled = false;
        moreInfoBtn.removeAttribute('aria-disabled');
        moreInfoBtn.classList.remove('btn--disabled');
      }
    }

    termsInput?.addEventListener('change', updateAcceptButton);
    updateAcceptButton();

    acceptBtn?.addEventListener('click', () => {
      if (acceptBtn.disabled) return;
      if (document.getElementById('screen-splash')) {
        window.location.hash = 'plan-selection';
      }
    });

    window.BarraSuperiorBack?.bind(`${idPrefix}-back`, () => {
      if (document.getElementById('screen-splash')) {
        window.location.hash = 'signup-empty';
        return;
      }
      window.history.back();
    });
  }

  function mountActivationConsentScreens() {
    const container = document.querySelector('.phone-shell__body');
    const isActivationFlow = Boolean(document.getElementById('screen-splash'));
    if (!container || !isActivationFlow) return false;

    let mountedAny = false;

    const variants = [
      { screenId: 'screen-consent-default', idPrefix: 'consent-default', specKey: 'consentDefault' },
      { screenId: 'screen-consent-active', idPrefix: 'consent-active', specKey: 'consentActive' },
    ];

    variants.forEach(({ screenId, idPrefix, specKey }) => {
      if (document.getElementById(screenId)) return;
      const data = spec[specKey];
      container.insertAdjacentHTML(
        'beforeend',
        createConsentMarkup({
          screenId,
          idPrefix,
          acceptDisabled: data.acceptDisabled,
        })
      );
      initConsentScreen(idPrefix, data);
      mountedAny = true;
    });

    return mountedAny;
  }

  window.ConsentScreen = {
    createMarkup: createConsentMarkup,
    init: initConsentScreen,
    openMoreInfoSheet: openConsentMoreInfoSheet,
    closeMoreInfoSheet: closeConsentMoreInfoSheet,
  };

  window.initConsentDefaultScreen = () => initConsentScreen('consent', spec.consentDefault);
  window.initConsentActiveScreen = () => initConsentScreen('consent-active', spec.consentActive);

  ensureMoreInfoSheetMounted();

  const mountedConsentScreens = mountActivationConsentScreens();

  if (mountedConsentScreens && window.location.hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  if (document.getElementById('screen-consent-default') && !document.getElementById('consent-default-title')) {
    initConsentScreen('consent', spec.consentDefault);
  }

  if (document.getElementById('screen-consent-active') && document.getElementById('consent-active-title')) {
    initConsentScreen('consent-active', spec.consentActive);
  }

  if (window.location.hash === '#consent-more-info') {
    openConsentMoreInfoSheet();
  }

  if (
    document.querySelector('.phone-shell--consent') &&
    !document.getElementById('screen-splash') &&
    !window.location.pathname.includes('/consent/more-info/')
  ) {
    const isActivePage = Boolean(document.getElementById('screen-consent-active')?.classList.contains('is-active'));
    document.title = isActivePage
      ? 'Rookie — 1.2.3 Consentimiento de datos — activo'
      : 'Rookie — 1.2.2 Consentimiento de datos';
  }
})();
