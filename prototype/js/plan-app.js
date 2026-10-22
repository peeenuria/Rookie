/**
 * Historia 1.3 — Selección de plan
 */
(function () {
  const spec = window.FIGMA_1_3;
  if (!spec) return;

  const data = spec.planSelection;
  const storageKeys = spec.storageKeys || {
    selectedPlan: 'rookie-selected-plan',
    paymentValidated: 'rookie-payment-validated',
  };
  let selectedPlanId = null;

  function getStoredPlanId() {
    return window.SubscriptionSummary?.getSelectedPlanId?.() || sessionStorage.getItem(storageKeys.selectedPlan);
  }

  function updateSubscriptionSummaryDisplay() {
    const summaryEl = document.getElementById('plan-selection-summary');
    if (!summaryEl || !window.SubscriptionSummary) return;
    window.SubscriptionSummary.apply(summaryEl, selectedPlanId);
  }

  function persistSelectedPlan(planId) {
    selectedPlanId = planId;
    if (window.SubscriptionSummary) {
      window.SubscriptionSummary.setSelectedPlanId(planId);
    } else if (planId) {
      sessionStorage.setItem(storageKeys.selectedPlan, planId);
    } else {
      sessionStorage.removeItem(storageKeys.selectedPlan);
    }
    updateSubscriptionSummaryDisplay();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPlanPrice(plan) {
    if (plan.priceLines) {
      return `
        <div class="plan-card__price-lines" aria-label="${escapeHtml(plan.priceLines.join(' '))}">
          ${plan.priceLines
            .map((line) => `<span class="plan-card__price-line">${escapeHtml(line)}</span>`)
            .join('')}
        </div>
      `;
    }

    return `<span class="plan-card__price">${escapeHtml(plan.price)}</span>`;
  }

  function renderPlanCard(plan) {
    const badge = plan.badge
      ? `<span class="plan-card__badge">${escapeHtml(plan.badge)}</span>`
      : '';
    const note = plan.note ? `<span class="plan-card__note">${escapeHtml(plan.note)}</span>` : '';
    const promoClass = plan.id === 'rookie-promo' ? ' plan-card--promo' : '';

    return `
      <button
        type="button"
        class="plan-card${promoClass}"
        data-plan-id="${escapeHtml(plan.id)}"
        role="radio"
        aria-checked="false"
      >
        ${badge}
        <span class="plan-card__body">
          <span class="plan-card__info">
            <span class="plan-card__name">${escapeHtml(plan.name)}</span>
            <span class="plan-card__detail">${escapeHtml(plan.detail)}</span>
          </span>
          <span class="plan-card__pricing">
            ${renderPlanPrice(plan)}
            ${note}
          </span>
        </span>
      </button>
    `;
  }

  function createPlanSelectionMarkup() {
    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'plan-selection-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--plan-selection"
        id="screen-plan-selection"
        aria-label="Selección de plan"
      >
        ${backBar}
        <div class="plan-selection">
          <header class="plan-selection__header">
            <h1 class="plan-selection__title" id="plan-selection-title"></h1>
            <p class="plan-selection__subtitle" id="plan-selection-subtitle"></p>
          </header>

          <div
            class="plan-selection__cards"
            id="plan-selection-cards"
            role="radiogroup"
            aria-label="Tipo de suscripción"
          ></div>

          <footer class="plan-selection__footer">
            <div
              class="subscription-summary"
              id="plan-selection-summary"
              aria-live="polite"
              aria-atomic="true"
            ></div>
            <button
              type="button"
              class="btn btn--primary plan-selection__submit btn--disabled"
              id="plan-selection-submit"
              disabled
            ></button>
            <p class="plan-selection__note" id="plan-selection-note"></p>
          </footer>
        </div>
      </section>
    `;
  }

  function getPlanActivationRoute(planId) {
    return spec.planActivationRoutes?.[planId] || 'payment-method';
  }

  function navigateAfterPlanActivation(planId) {
    const route = getPlanActivationRoute(planId);
    const inActivationFlow = Boolean(document.getElementById('screen-splash'));

    if (inActivationFlow) {
      window.location.hash = route;
      return;
    }

    if (route === 'code-bridge') {
      window.location.href = '../code/index.html';
      return;
    }

    window.location.href = '../payment/index.html';
  }

  function updateSubmitButton() {
    const submitBtn = document.getElementById('plan-selection-submit');
    if (!submitBtn) return;

    const canSubmit = Boolean(selectedPlanId);
    submitBtn.disabled = !canSubmit;
    submitBtn.classList.toggle('btn--disabled', !canSubmit);
  }

  function updateCardSelection(cards) {
    cards.forEach((card) => {
      const isSelected = card.dataset.planId === selectedPlanId;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  function initPlanSelection(options = {}) {
    if (!data) return;

    const title = document.getElementById('plan-selection-title');
    const subtitle = document.getElementById('plan-selection-subtitle');
    const cardsContainer = document.getElementById('plan-selection-cards');
    const submitBtn = document.getElementById('plan-selection-submit');
    const note = document.getElementById('plan-selection-note');

    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;
    if (submitBtn) submitBtn.textContent = data.submitCta;
    if (note) note.textContent = data.footerNote;

    if (cardsContainer) {
      cardsContainer.innerHTML = data.plans.map(renderPlanCard).join('');
    }

    selectedPlanId = options.initialPlanId ?? getStoredPlanId();
    const cards = Array.from(document.querySelectorAll('.plan-card'));

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        persistSelectedPlan(card.dataset.planId);
        updateCardSelection(cards);
        updateSubmitButton();
      });
    });

    updateCardSelection(cards);
    updateSubmitButton();
    updateSubscriptionSummaryDisplay();

    submitBtn?.addEventListener('click', () => {
      if (submitBtn.disabled || !selectedPlanId) return;

      persistSelectedPlan(selectedPlanId);
      sessionStorage.removeItem(storageKeys.paymentValidated);
      navigateAfterPlanActivation(selectedPlanId);
    });

    window.BarraSuperiorBack?.bind('plan-selection-back', () => {
      if (document.getElementById('screen-splash')) {
        window.location.hash = 'consent-default';
        return;
      }
      window.history.back();
    });
  }

  function mountActivationPlanScreen() {
    const container = document.querySelector('.phone-shell__body');
    const isActivationFlow = Boolean(document.getElementById('screen-splash'));
    if (!container || !isActivationFlow || document.getElementById('screen-plan-selection')) {
      return false;
    }

    container.insertAdjacentHTML('beforeend', createPlanSelectionMarkup());
    initPlanSelection();
    return true;
  }

  function refreshPlanSelection() {
    selectedPlanId = getStoredPlanId();
    const cards = Array.from(document.querySelectorAll('.plan-card'));
    updateCardSelection(cards);
    updateSubmitButton();
    updateSubscriptionSummaryDisplay();
  }

  window.PlanSelection = {
    createMarkup: createPlanSelectionMarkup,
    init: initPlanSelection,
    refresh: refreshPlanSelection,
    getSelectedPlanId: () => selectedPlanId,
  };

  const mountedPlanScreen = mountActivationPlanScreen();

  if (mountedPlanScreen && window.location.hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  if (document.getElementById('screen-plan-selection') && !document.getElementById('screen-splash')) {
    initPlanSelection();
    document.title = 'Rookie — 1.3.1 Selección de plan';
  }
})();
