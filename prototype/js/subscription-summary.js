/**
 * ResumenSuscripción — componente compartido (Figma 13105:7394)
 */
(function () {
  const spec = window.FIGMA_1_3;
  if (!spec?.subscriptionSummary) return;

  const summarySpec = spec.subscriptionSummary;
  const storageKeys = spec.storageKeys || {
    selectedPlan: 'rookie-selected-plan',
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getSelectedPlanId() {
    return sessionStorage.getItem(storageKeys.selectedPlan);
  }

  function setSelectedPlanId(planId) {
    if (planId) {
      sessionStorage.setItem(storageKeys.selectedPlan, planId);
      return;
    }
    sessionStorage.removeItem(storageKeys.selectedPlan);
  }

  function resolveVariant(planId) {
    if (!planId) return 'none';
    return summarySpec.planToVariant?.[planId] || 'none';
  }

  function getSummaryLines(planId) {
    const variant = resolveVariant(planId);
    const state = summarySpec.variants?.[variant] || summarySpec.variants?.none;
    return state?.lines || [];
  }

  function apply(element, planId) {
    if (!element) return;

    const variant = resolveVariant(planId);
    const lines = getSummaryLines(planId);

    element.classList.add('subscription-summary');
    element.classList.toggle('subscription-summary--annual', variant === 'annual');
    element.dataset.variant = variant;
    element.innerHTML = lines
      .map((line) => `<p class="subscription-summary__line">${escapeHtml(line)}</p>`)
      .join('');
  }

  function applyToSelector(selector, planId) {
    document.querySelectorAll(selector).forEach((element) => apply(element, planId));
  }

  window.SubscriptionSummary = {
    getSelectedPlanId,
    setSelectedPlanId,
    resolveVariant,
    getSummaryLines,
    apply,
    applyToSelector,
  };
})();
