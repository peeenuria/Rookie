/**
 * Historia 1.3 — Método de pago, pasarela y pantalla de éxito
 */
(function () {
  const spec = window.FIGMA_1_3;
  if (!spec) return;

  const methodSpec = spec.paymentMethod;
  const gatewaySpec = spec.paymentGateway;
  const successSpec = spec.paymentSuccess;
  const storageKeys = spec.storageKeys || {
    selectedPlan: 'rookie-selected-plan',
    paymentValidated: 'rookie-payment-validated',
  };
  const codeStorageKey =
    window.FIGMA_1_1?.codeActivation?.storageKeys?.codeValidated || 'rookie-code-validated';

  let selectedPaymentMethodId = null;
  let nativeSheetTimerId = null;

  function resolveAssetBase() {
    const path = window.location.pathname;
    if (path.includes('/payment/success/')) return '../../';
    if (path.includes('/payment/')) return '../';
    if (path.includes('/activation/')) return '../';
    return '';
  }

  function isActivationFlow() {
    return Boolean(document.getElementById('screen-splash'));
  }

  function getSelectedPlanId() {
    return sessionStorage.getItem(storageKeys.selectedPlan);
  }

  function getPaymentGatewayUrl() {
    return '#payment-gateway';
  }

  function getPaymentSuccessUrl() {
    const path = window.location.pathname;
    if (path.includes('/payment/') && !path.includes('/payment/success/')) {
      return 'success/index.html';
    }
    return '#payment-success';
  }

  function isPaymentValidated() {
    return sessionStorage.getItem(storageKeys.paymentValidated) === 'true';
  }

  function isCodeValidated() {
    return sessionStorage.getItem(codeStorageKey) === 'true';
  }

  function isAccountActivated() {
    return isPaymentValidated() || isCodeValidated();
  }

  function markPaymentValidated() {
    sessionStorage.setItem(storageKeys.paymentValidated, 'true');
  }

  function clearPaymentValidated() {
    sessionStorage.removeItem(storageKeys.paymentValidated);
  }

  function navigateHashOrUrl(target) {
    if (!target) return;
    if (target.startsWith('#')) {
      window.location.hash = target.slice(1);
      return;
    }
    window.location.href = target;
  }

  function guardPaymentRoutes() {
    if (!isActivationFlow()) return;

    const hash = window.location.hash.replace(/^#/, '');
    const selectedPlan = getSelectedPlanId();

    if (hash === 'payment-method' || hash === 'payment-gateway') {
      if (!selectedPlan) {
        window.location.hash = 'plan-selection';
        return;
      }
      if (selectedPlan === 'rookie-promo') {
        window.location.hash = 'code-bridge';
      }
      return;
    }

    if (hash === 'payment-success' && !isAccountActivated()) {
      window.location.hash = 'code-bridge';
    }
  }

  function onlyDigits(value) {
    return value.replace(/\D/g, '');
  }

  function luhnCheck(value) {
    if (!value) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i -= 1) {
      let digit = parseInt(value[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  function isValidCardNumber(value) {
    const digits = onlyDigits(value);
    if (digits.length < 13 || digits.length > 19) return false;
    return luhnCheck(digits);
  }

  function formatCardNumber(value) {
    const digits = onlyDigits(value).slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  function formatExpiry(value) {
    const digits = onlyDigits(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function isValidExpiry(value) {
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  }

  function isValidCvv(value) {
    return /^\d{3,4}$/.test(value);
  }

  function isValidName(value) {
    return value.trim().length > 0;
  }

  function renderPlanSummary(planId) {
    if (!window.SubscriptionSummary) return '';
    const lines = window.SubscriptionSummary.getSummaryLines(planId);
    const variant = window.SubscriptionSummary.resolveVariant(planId);
    const annualClass = variant === 'annual' ? ' subscription-summary--annual' : '';
    const linesHtml = lines
      .map((line) => `<p class="subscription-summary__line">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('');
    return `<div class="subscription-summary${annualClass}" data-variant="${variant}">${linesHtml}</div>`;
  }

  function refreshPaymentGatewaySummary() {
    const summary = document.getElementById('payment-gateway-summary');
    if (!summary || !window.SubscriptionSummary) return;
    window.SubscriptionSummary.apply(summary, getSelectedPlanId());
  }

  function getPlanCardContent(planId) {
    const cards = methodSpec?.planCard || {};
    if (planId === 'annual' && cards.annual) return cards.annual;
    return cards.monthly || {
      name: 'Plan mensual',
      detail: 'Mentor real + plan adaptado',
      price: '9,99 €',
    };
  }

  function getMethodIconSvg(icon) {
    if (icon === 'apple') {
      return `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1 2.6-2 .8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.6zM14.5 6.4c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.1z"/>
        </svg>`;
    }
    if (icon === 'google') {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.4a4.62 4.62 0 0 1-2 3.03v2.51h3.23c1.89-1.74 2.97-4.3 2.97-7.44z"/>
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.23-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A9.99 9.99 0 0 0 12 22z"/>
          <path fill="#FBBC05" d="M6.41 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.31.31-1.91V7.5H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.5l3.33-2.59z"/>
          <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A9.99 9.99 0 0 0 3.08 7.5l3.33 2.59C7.2 7.74 9.4 5.98 12 5.98z"/>
        </svg>`;
    }
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" stroke-width="1.75"/>
        <path d="M2.5 9.5h19" stroke="currentColor" stroke-width="1.75"/>
        <path d="M6 15h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>`;
  }

  function createPaymentMethodMarkup() {
    const methods = methodSpec?.methods || [];
    const methodsHtml = methods
      .map(
        (method) => `
          <li>
            <button
              type="button"
              class="OptionSelectRow payment-method__option"
              data-payment-method="${method.id}"
              role="radio"
              aria-checked="false"
            >
              <span class="OptionSelectRow__main">
                <span class="OptionSelectRow__icon${method.icon === 'google' ? ' OptionSelectRow__icon--google' : ''}">${getMethodIconSvg(method.icon)}</span>
                <span class="OptionSelectRow__label">${method.label}</span>
              </span>
              <span class="OptionSelectRow__radio" aria-hidden="true"></span>
            </button>
          </li>`
      )
      .join('');

    return `
      <section
        class="screen screen--payment-method"
        id="screen-payment-method"
        aria-label="Elige tu método de pago"
      >
        <div class="payment-method">
          <div class="payment-method__topbar">
            <button type="button" class="payment-method__back" id="payment-method-back" aria-label="Volver">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="payment-method__scroll">
            <header class="payment-method__header">
              <h1 class="payment-method__title" id="payment-method-title"></h1>
              <p class="payment-method__secure">
                <svg class="payment-method__secure-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span id="payment-method-secure-text"></span>
              </p>
            </header>

            <div class="payment-method__plan" id="payment-method-plan" aria-live="polite">
              <div class="payment-method__plan-copy">
                <p class="payment-method__plan-name" id="payment-method-plan-name"></p>
                <p class="payment-method__plan-detail" id="payment-method-plan-detail"></p>
              </div>
              <p class="payment-method__plan-price" id="payment-method-plan-price"></p>
            </div>

            <ul
              class="payment-method__list"
              id="payment-method-list"
              role="radiogroup"
              aria-label="Método de pago"
            >${methodsHtml}</ul>

            <footer class="payment-method__footer">
              <div
                class="subscription-summary"
                id="payment-method-summary"
                aria-live="polite"
                aria-atomic="true"
              ></div>
              <button
                type="button"
                class="btn btn--primary payment-method__submit btn--disabled"
                id="payment-method-submit"
                disabled
              ></button>
            </footer>
          </div>
        </div>

        <div
          class="payment-native-sheet payment-native-sheet--apple"
          id="payment-native-sheet-apple"
          hidden
          aria-hidden="true"
        >
          <div class="payment-native-sheet__backdrop" data-native-dismiss></div>
          <div class="payment-native-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="payment-native-apple-title">
            <div class="payment-native-sheet__handle" aria-hidden="true"></div>
            <div class="payment-native-sheet__brand">
              <span class="payment-native-sheet__brand-icon">${getMethodIconSvg('apple')}</span>
              <div class="payment-native-sheet__brand-copy">
                <p class="payment-native-sheet__title" id="payment-native-apple-title"></p>
                <p class="payment-native-sheet__subtitle" id="payment-native-apple-subtitle"></p>
              </div>
            </div>
            <div class="payment-native-sheet__row">
              <p class="payment-native-sheet__amount-label" id="payment-native-apple-amount-label"></p>
              <p class="payment-native-sheet__amount" id="payment-native-apple-amount"></p>
            </div>
            <div class="payment-native-sheet__status">
              <span class="payment-native-sheet__spinner" aria-hidden="true"></span>
              <span id="payment-native-apple-status"></span>
            </div>
          </div>
        </div>

        <div
          class="payment-native-sheet payment-native-sheet--google"
          id="payment-native-sheet-google"
          hidden
          aria-hidden="true"
        >
          <div class="payment-native-sheet__backdrop" data-native-dismiss></div>
          <div class="payment-native-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="payment-native-google-title">
            <div class="payment-native-sheet__handle" aria-hidden="true"></div>
            <div class="payment-native-sheet__brand">
              <span class="payment-native-sheet__brand-icon">${getMethodIconSvg('google')}</span>
              <div class="payment-native-sheet__brand-copy">
                <p class="payment-native-sheet__title" id="payment-native-google-title"></p>
                <p class="payment-native-sheet__subtitle" id="payment-native-google-subtitle"></p>
              </div>
            </div>
            <div class="payment-native-sheet__row">
              <p class="payment-native-sheet__amount-label" id="payment-native-google-amount-label"></p>
              <p class="payment-native-sheet__amount" id="payment-native-google-amount"></p>
            </div>
            <div class="payment-native-sheet__status">
              <span class="payment-native-sheet__spinner" aria-hidden="true"></span>
              <span id="payment-native-google-status"></span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function createPaymentGatewayMarkup() {
    const fields = gatewaySpec.fields;
    return `
      <section
        class="screen screen--payment-gateway"
        id="screen-payment-gateway"
        aria-label="Pasarela de pago"
      >
        <div class="payment-gateway">
          <div class="payment-gateway__topbar">
            <button type="button" class="payment-gateway__back" id="payment-gateway-back" aria-label="Volver">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="payment-gateway__scroll">
            <header class="payment-gateway__header">
              <h1 class="payment-gateway__title" id="payment-gateway-title"></h1>
              <p class="payment-gateway__secure">
                <svg class="payment-gateway__secure-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span id="payment-gateway-secure-text"></span>
              </p>
            </header>

            <form class="payment-gateway__form" id="payment-gateway-form" novalidate>
              <div class="payment-field" data-payment-card-wrap>
                <label class="payment-field__label" for="payment-card-number">${fields.cardNumber.label}</label>
                <div class="payment-field__control">
                  <input
                    class="payment-field__input"
                    id="payment-card-number"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    placeholder="${fields.cardNumber.placeholder}"
                    data-payment-card
                  />
                </div>
                <p class="payment-field__error" data-payment-card-message hidden></p>
              </div>

              <div class="payment-gateway__row">
                <div class="payment-field payment-field--expiry" data-payment-expiry-wrap>
                  <label class="payment-field__label" for="payment-expiry">${fields.expiry.label}</label>
                  <div class="payment-field__control">
                    <input
                      class="payment-field__input"
                      id="payment-expiry"
                      type="text"
                      inputmode="numeric"
                      autocomplete="cc-exp"
                      placeholder="${fields.expiry.placeholder}"
                      data-payment-expiry
                      maxlength="5"
                    />
                  </div>
                  <p class="payment-field__error" data-payment-expiry-message hidden></p>
                </div>

                <div class="payment-field payment-field--cvv" data-payment-cvv-wrap>
                  <label class="payment-field__label" for="payment-cvv">${fields.cvv.label}</label>
                  <div class="payment-field__control">
                    <input
                      class="payment-field__input"
                      id="payment-cvv"
                      type="text"
                      inputmode="numeric"
                      autocomplete="cc-csc"
                      placeholder="${fields.cvv.placeholder}"
                      data-payment-cvv
                      maxlength="4"
                    />
                  </div>
                  <p class="payment-field__hint">${fields.cvv.hint}</p>
                  <p class="payment-field__error" data-payment-cvv-message hidden></p>
                </div>
              </div>

              <div class="payment-field" data-payment-name-wrap>
                <label class="payment-field__label" for="payment-name">${fields.name.label}</label>
                <div class="payment-field__control">
                  <input
                    class="payment-field__input"
                    id="payment-name"
                    type="text"
                    autocomplete="cc-name"
                    placeholder="${fields.name.placeholder}"
                    data-payment-name
                  />
                </div>
                <p class="payment-field__error" data-payment-name-message hidden></p>
              </div>
            </form>

            <footer class="payment-gateway__footer">
              <div
                class="subscription-summary"
                id="payment-gateway-summary"
                aria-live="polite"
                aria-atomic="true"
              ></div>
              <button
                type="button"
                class="btn btn--primary payment-gateway__submit btn--disabled"
                id="payment-gateway-submit"
                disabled
              ></button>
            </footer>
          </div>
        </div>
      </section>
    `;
  }

  function createPaymentSuccessMarkup() {
    return `
      <section
        class="screen screen--payment-success"
        id="screen-payment-success"
        aria-label="Cuenta activada"
      >
        <div class="payment-success">
          <div class="payment-success__media" aria-hidden="true">
            <img class="payment-success__photo" id="payment-success-photo" src="" alt="" />
            <div class="payment-success__overlay"></div>
          </div>

          <div class="payment-success__content">
            <div class="payment-success__top">
              <div class="payment-success__brand">
                <div class="payment-success__logo" aria-label="Decathlon">
                  <img class="payment-success__logo-mark" id="payment-success-logo-mark" src="" alt="" width="33" height="28" />
                  <img class="payment-success__logo-wordmark" id="payment-success-logo-wordmark" src="" alt="" width="147" height="20" />
                </div>
              </div>
              <h1 class="payment-success__title" id="payment-success-title"></h1>
            </div>

            <div class="payment-success__bottom">
              <p class="payment-success__subtitle" id="payment-success-subtitle"></p>
              <button type="button" class="btn btn--primary payment-success__continue" id="payment-success-continue"></button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function refreshPaymentMethodScreen() {
    if (!methodSpec) return;

    const planId = getSelectedPlanId();
    const planCard = getPlanCardContent(planId);
    const nameEl = document.getElementById('payment-method-plan-name');
    const detailEl = document.getElementById('payment-method-plan-detail');
    const priceEl = document.getElementById('payment-method-plan-price');
    const summary = document.getElementById('payment-method-summary');

    if (nameEl) nameEl.textContent = planCard.name;
    if (detailEl) detailEl.textContent = planCard.detail;
    if (priceEl) priceEl.textContent = planCard.price;

    if (summary && window.SubscriptionSummary) {
      window.SubscriptionSummary.apply(summary, planId);
    } else if (summary) {
      summary.innerHTML = renderPlanSummary(planId);
    }
  }

  function closeNativeSheets() {
    if (nativeSheetTimerId) {
      window.clearTimeout(nativeSheetTimerId);
      nativeSheetTimerId = null;
    }

    ['payment-native-sheet-apple', 'payment-native-sheet-google'].forEach((id) => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.classList.remove('is-open');
      sheet.hidden = true;
      sheet.setAttribute('aria-hidden', 'true');
    });
  }

  function openNativeSheet(provider) {
    closeNativeSheets();

    const sheetId = provider === 'apple' ? 'payment-native-sheet-apple' : 'payment-native-sheet-google';
    const sheet = document.getElementById(sheetId);
    if (!sheet) return;

    const planCard = getPlanCardContent(getSelectedPlanId());
    const native = methodSpec?.nativeSheet?.[provider === 'apple' ? 'apple' : 'google'];
    const delayMs = methodSpec?.nativeSheet?.delayMs ?? 900;

    if (provider === 'apple') {
      const title = document.getElementById('payment-native-apple-title');
      const subtitle = document.getElementById('payment-native-apple-subtitle');
      const amountLabel = document.getElementById('payment-native-apple-amount-label');
      const amount = document.getElementById('payment-native-apple-amount');
      const status = document.getElementById('payment-native-apple-status');
      if (title) title.textContent = native?.title || 'Apple Pay';
      if (subtitle) subtitle.textContent = native?.subtitle || 'Confirma con Face ID';
      if (amountLabel) amountLabel.textContent = native?.amountLabel || 'Total';
      if (amount) amount.textContent = planCard.price;
      if (status) status.textContent = native?.confirmCta || 'Pagar con Apple Pay';
    } else {
      const title = document.getElementById('payment-native-google-title');
      const subtitle = document.getElementById('payment-native-google-subtitle');
      const amountLabel = document.getElementById('payment-native-google-amount-label');
      const amount = document.getElementById('payment-native-google-amount');
      const status = document.getElementById('payment-native-google-status');
      if (title) title.textContent = native?.title || 'Google Pay';
      if (subtitle) subtitle.textContent = native?.subtitle || 'Confirma el pago';
      if (amountLabel) amountLabel.textContent = native?.amountLabel || 'Total';
      if (amount) amount.textContent = planCard.price;
      if (status) status.textContent = native?.confirmCta || 'Pagar con GPay';
    }

    sheet.hidden = false;
    sheet.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      sheet.classList.add('is-open');
    });

    nativeSheetTimerId = window.setTimeout(() => {
      nativeSheetTimerId = null;
      closeNativeSheets();
      markPaymentValidated();
      navigateHashOrUrl(getPaymentSuccessUrl());
    }, delayMs);
  }

  function initPaymentMethod() {
    if (!methodSpec) return;
    if (document.getElementById('payment-method-submit')?.dataset.bound === 'true') {
      refreshPaymentMethodScreen();
      return;
    }

    const title = document.getElementById('payment-method-title');
    const secureText = document.getElementById('payment-method-secure-text');
    const submitBtn = document.getElementById('payment-method-submit');
    const backBtn = document.getElementById('payment-method-back');
    const list = document.getElementById('payment-method-list');
    const options = Array.from(list?.querySelectorAll('[data-payment-method]') || []);

    if (title) title.textContent = methodSpec.title;
    if (secureText) secureText.textContent = methodSpec.secureBadge;
    if (submitBtn) {
      submitBtn.textContent = methodSpec.continueCta;
      submitBtn.dataset.bound = 'true';
    }

    refreshPaymentMethodScreen();
    selectedPaymentMethodId = null;

    function updateSelection() {
      options.forEach((option) => {
        const isSelected = option.dataset.paymentMethod === selectedPaymentMethodId;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });

      const canContinue = Boolean(selectedPaymentMethodId);
      if (submitBtn) {
        submitBtn.disabled = !canContinue;
        submitBtn.classList.toggle('btn--disabled', !canContinue);
      }
    }

    options.forEach((option) => {
      option.addEventListener('click', () => {
        selectedPaymentMethodId = option.dataset.paymentMethod;
        updateSelection();
      });
    });

    submitBtn?.addEventListener('click', () => {
      if (!selectedPaymentMethodId || submitBtn.disabled) return;

      if (selectedPaymentMethodId === 'card') {
        navigateHashOrUrl(getPaymentGatewayUrl());
        return;
      }

      if (selectedPaymentMethodId === 'apple-pay') {
        openNativeSheet('apple');
        return;
      }

      if (selectedPaymentMethodId === 'google-pay') {
        openNativeSheet('google');
      }
    });

    backBtn?.addEventListener('click', () => {
      closeNativeSheets();
      if (isActivationFlow()) {
        window.location.hash = 'plan-selection';
      } else {
        window.history.back();
      }
    });

    document.querySelectorAll('[data-native-dismiss]').forEach((el) => {
      el.addEventListener('click', () => closeNativeSheets());
    });

    updateSelection();
  }

  function initPaymentGateway() {
    if (!gatewaySpec) return;

    const title = document.getElementById('payment-gateway-title');
    const secureText = document.getElementById('payment-gateway-secure-text');
    const summary = document.getElementById('payment-gateway-summary');
    const submitBtn = document.getElementById('payment-gateway-submit');
    const backBtn = document.getElementById('payment-gateway-back');
    const form = document.getElementById('payment-gateway-form');

    const cardWrap = form?.querySelector('[data-payment-card-wrap]');
    const cardInput = form?.querySelector('[data-payment-card]');
    const cardMessage = form?.querySelector('[data-payment-card-message]');

    const expiryWrap = form?.querySelector('[data-payment-expiry-wrap]');
    const expiryInput = form?.querySelector('[data-payment-expiry]');
    const expiryMessage = form?.querySelector('[data-payment-expiry-message]');

    const cvvWrap = form?.querySelector('[data-payment-cvv-wrap]');
    const cvvInput = form?.querySelector('[data-payment-cvv]');
    const cvvMessage = form?.querySelector('[data-payment-cvv-message]');

    const nameWrap = form?.querySelector('[data-payment-name-wrap]');
    const nameInput = form?.querySelector('[data-payment-name]');
    const nameMessage = form?.querySelector('[data-payment-name-message]');

    const planId = getSelectedPlanId();

    if (title) title.textContent = gatewaySpec.title;
    if (secureText) secureText.textContent = gatewaySpec.secureBadge;
    if (summary && window.SubscriptionSummary) {
      window.SubscriptionSummary.apply(summary, planId);
    } else if (summary) {
      summary.innerHTML = renderPlanSummary(planId);
    }
    if (submitBtn) submitBtn.textContent = gatewaySpec.submitCta;

    if (submitBtn?.dataset.bound === 'true') {
      refreshPaymentGatewaySummary();
      return;
    }
    if (submitBtn) submitBtn.dataset.bound = 'true';

    let cardTouched = false;
    let expiryTouched = false;
    let cvvTouched = false;
    let nameTouched = false;

    function setFieldError(wrap, messageEl, message) {
      if (!wrap || !messageEl) return;
      if (!message) {
        messageEl.hidden = true;
        messageEl.textContent = '';
        wrap.classList.remove('payment-field--error');
        wrap.querySelector('input')?.removeAttribute('aria-invalid');
        return;
      }
      messageEl.hidden = false;
      messageEl.textContent = message;
      wrap.classList.add('payment-field--error');
      wrap.querySelector('input')?.setAttribute('aria-invalid', 'true');
    }

    function validateCard(force) {
      const value = cardInput?.value || '';
      if (!value.trim()) {
        if (force && cardTouched) setFieldError(cardWrap, cardMessage, gatewaySpec.validation.invalidCard);
        else setFieldError(cardWrap, cardMessage, null);
        return false;
      }
      if (!isValidCardNumber(value)) {
        if (force || cardTouched) setFieldError(cardWrap, cardMessage, gatewaySpec.validation.invalidCard);
        return false;
      }
      setFieldError(cardWrap, cardMessage, null);
      return true;
    }

    function validateExpiry(force) {
      const value = expiryInput?.value || '';
      if (!value.trim()) {
        if (force && expiryTouched) setFieldError(expiryWrap, expiryMessage, gatewaySpec.validation.invalidExpiry);
        else setFieldError(expiryWrap, expiryMessage, null);
        return false;
      }
      if (!isValidExpiry(value)) {
        if (force || expiryTouched) setFieldError(expiryWrap, expiryMessage, gatewaySpec.validation.invalidExpiry);
        return false;
      }
      setFieldError(expiryWrap, expiryMessage, null);
      return true;
    }

    function validateCvv(force) {
      const value = cvvInput?.value || '';
      if (!value.trim()) {
        if (force && cvvTouched) setFieldError(cvvWrap, cvvMessage, gatewaySpec.validation.invalidCvv);
        else setFieldError(cvvWrap, cvvMessage, null);
        return false;
      }
      if (!isValidCvv(value)) {
        if (force || cvvTouched) setFieldError(cvvWrap, cvvMessage, gatewaySpec.validation.invalidCvv);
        return false;
      }
      setFieldError(cvvWrap, cvvMessage, null);
      return true;
    }

    function validateName(force) {
      const value = nameInput?.value || '';
      if (!isValidName(value)) {
        if (force || nameTouched) setFieldError(nameWrap, nameMessage, gatewaySpec.validation.emptyName);
        return false;
      }
      setFieldError(nameWrap, nameMessage, null);
      return true;
    }

    function updateSubmitButton() {
      const canSubmit =
        validateCard(false) &&
        validateExpiry(false) &&
        validateCvv(false) &&
        validateName(false) &&
        (cardInput?.value.trim() || '') &&
        (expiryInput?.value.trim() || '') &&
        (cvvInput?.value.trim() || '') &&
        (nameInput?.value.trim() || '');

      if (!submitBtn) return;
      submitBtn.disabled = !canSubmit;
      submitBtn.classList.toggle('btn--disabled', !canSubmit);
    }

    cardInput?.addEventListener('input', () => {
      const formatted = formatCardNumber(cardInput.value);
      cardInput.value = formatted;
      validateCard(cardTouched);
      updateSubmitButton();
    });

    cardInput?.addEventListener('blur', () => {
      cardTouched = true;
      validateCard(true);
      updateSubmitButton();
    });

    expiryInput?.addEventListener('input', () => {
      expiryInput.value = formatExpiry(expiryInput.value);
      validateExpiry(expiryTouched);
      updateSubmitButton();
    });

    expiryInput?.addEventListener('blur', () => {
      expiryTouched = true;
      validateExpiry(true);
      updateSubmitButton();
    });

    cvvInput?.addEventListener('input', () => {
      cvvInput.value = onlyDigits(cvvInput.value).slice(0, 4);
      validateCvv(cvvTouched);
      updateSubmitButton();
    });

    cvvInput?.addEventListener('blur', () => {
      cvvTouched = true;
      validateCvv(true);
      updateSubmitButton();
    });

    nameInput?.addEventListener('input', () => {
      validateName(nameTouched);
      updateSubmitButton();
    });

    nameInput?.addEventListener('blur', () => {
      nameTouched = true;
      validateName(true);
      updateSubmitButton();
    });

    submitBtn?.addEventListener('click', () => {
      cardTouched = true;
      expiryTouched = true;
      cvvTouched = true;
      nameTouched = true;

      const isValid =
        validateCard(true) && validateExpiry(true) && validateCvv(true) && validateName(true);

      updateSubmitButton();
      if (!isValid || submitBtn.disabled) return;

      markPaymentValidated();
      navigateHashOrUrl(getPaymentSuccessUrl());
    });

    backBtn?.addEventListener('click', () => {
      window.location.hash = 'payment-method';
    });

    form?.addEventListener('submit', (event) => event.preventDefault());

    updateSubmitButton();
  }

  function initPaymentSuccess() {
    if (!successSpec) return;

    const continueBtn = document.getElementById('payment-success-continue');
    if (continueBtn?.dataset.bound === 'true') return;

    const base = resolveAssetBase();
    const photo = document.getElementById('payment-success-photo');
    const logoMark = document.getElementById('payment-success-logo-mark');
    const logoWordmark = document.getElementById('payment-success-logo-wordmark');
    const title = document.getElementById('payment-success-title');
    const subtitle = document.getElementById('payment-success-subtitle');

    if (photo && successSpec.backgroundAsset) {
      photo.src = `${base}${successSpec.backgroundAsset}`;
      photo.alt = '';
    }

    if (logoMark && successSpec.logoMarkAsset) {
      logoMark.src = `${base}${successSpec.logoMarkAsset}`;
      logoMark.alt = '';
    }

    if (logoWordmark && successSpec.logoWordmarkAsset) {
      logoWordmark.src = `${base}${successSpec.logoWordmarkAsset}`;
      logoWordmark.alt = '';
    }

    if (title && Array.isArray(successSpec.titleLines)) {
      title.innerHTML = successSpec.titleLines
        .map((line) => `<span class="payment-success__title-line">${line}</span>`)
        .join('');
    }

    if (subtitle && Array.isArray(successSpec.subtitleLines)) {
      subtitle.innerHTML = successSpec.subtitleLines.join('<br />');
    }

    if (continueBtn) {
      continueBtn.textContent = successSpec.continueCta;
      continueBtn.dataset.bound = 'true';
      continueBtn.addEventListener('click', () => {
        if (window.ActivationFlow?.navigateTo) {
          window.ActivationFlow.navigateTo('profiling-personal');
          return;
        }
        window.location.hash = 'profiling-personal';
      });
    }
  }

  function mountActivationPaymentScreens() {
    const container = document.querySelector('.phone-shell__body');
    if (!container || !isActivationFlow()) return false;

    let mountedAny = false;

    if (!document.getElementById('screen-payment-method')) {
      container.insertAdjacentHTML('beforeend', createPaymentMethodMarkup());
      initPaymentMethod();
      mountedAny = true;
    }

    if (!document.getElementById('screen-payment-gateway')) {
      container.insertAdjacentHTML('beforeend', createPaymentGatewayMarkup());
      initPaymentGateway();
      mountedAny = true;
    }

    if (!document.getElementById('screen-payment-success')) {
      container.insertAdjacentHTML('beforeend', createPaymentSuccessMarkup());
      initPaymentSuccess();
      mountedAny = true;
    }

    return mountedAny;
  }

  window.PaymentFlow = {
    createMethodMarkup: createPaymentMethodMarkup,
    createGatewayMarkup: createPaymentGatewayMarkup,
    createSuccessMarkup: createPaymentSuccessMarkup,
    initMethod: initPaymentMethod,
    initGateway: initPaymentGateway,
    initSuccess: initPaymentSuccess,
    refreshSummary: refreshPaymentGatewaySummary,
    refreshMethodScreen: refreshPaymentMethodScreen,
    guardRoutes: guardPaymentRoutes,
    clearPaymentValidated,
  };

  const mountedPaymentScreens = mountActivationPaymentScreens();

  guardPaymentRoutes();

  if (mountedPaymentScreens && window.location.hash) {
    guardPaymentRoutes();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  window.addEventListener('hashchange', () => {
    guardPaymentRoutes();
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'payment-gateway') {
      refreshPaymentGatewaySummary();
    }
    if (hash === 'payment-method') {
      refreshPaymentMethodScreen();
    }
  });

  if (document.getElementById('screen-payment-method') && !document.getElementById('screen-splash')) {
    initPaymentMethod();
    document.title = 'Rookie — Método de pago';
  }

  if (document.getElementById('screen-payment-gateway') && !document.getElementById('screen-splash')) {
    if (!isAccountActivated() && document.getElementById('screen-payment-success')?.classList.contains('is-active')) {
      window.location.replace('index.html');
    } else {
      initPaymentGateway();
      document.title = 'Rookie — Pasarela de pago';
    }
  }

  if (document.getElementById('screen-payment-success') && !document.getElementById('screen-splash')) {
    if (!isAccountActivated()) {
      const gatewayUrl = getPaymentGatewayUrl();
      if (gatewayUrl.startsWith('#')) {
        window.location.hash = gatewayUrl.slice(1);
      } else {
        window.location.replace(gatewayUrl);
      }
    } else {
      initPaymentSuccess();
      document.title = 'Rookie — Cuenta activada';
    }
  }
})();
