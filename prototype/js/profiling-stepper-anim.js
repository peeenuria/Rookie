/**
 * Animaciones del stepper de perfilado (borde→fill → línea → bounce).
 */
(function () {
  const STORAGE_KEY = 'rookie-stepper-anim';
  const COMPLETE_MS = 225;
  const FILL_MS = 350;
  const BOUNCE_MS = 300;
  const GAP_MS = 90;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function queue(plan) {
    if (!plan || typeof plan !== 'object') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      /* ignore quota */
    }
  }

  /** Atajo: avanzar desde un paso activo hacia el siguiente del flujo. */
  function queueAdvance(fromStepId, options = {}) {
    const { completeOnly = false, toStepId = null, connector = null } = options;

    if (completeOnly) {
      queue({ fromStepId, toStepId: null, connector: null });
      return;
    }

    if (toStepId) {
      queue({ fromStepId, toStepId, connector });
      return;
    }

    if (fromStepId === 'personal') {
      queue({ fromStepId: 'personal', toStepId: 'motivations', connector: 'left' });
      return;
    }

    if (fromStepId === 'motivations') {
      queue({ fromStepId: 'motivations', toStepId: 'summary', connector: 'right' });
      return;
    }

    queue({ fromStepId: null, toStepId: fromStepId, connector });
  }

  function peek() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function consume() {
    const plan = peek();
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return plan;
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function findStep(stepper, stepId) {
    if (!stepper || !stepId) return null;
    return stepper.querySelector(`.profiling-stepper__step[data-step="${stepId}"]`);
  }

  function findConnector(stepper, which) {
    if (!stepper || !which) return null;
    return stepper.querySelector(`.profiling-stepper__connector--${which}`);
  }

  function setStepState(stepEl, state) {
    if (!stepEl) return;
    stepEl.classList.remove('is-active', 'is-done', 'is-completing', 'is-activating');
    if (state) stepEl.classList.add(state);
  }

  function applyFinalState(stepper, plan) {
    if (!stepper || !plan) return;

    if (plan.fromStepId) {
      setStepState(findStep(stepper, plan.fromStepId), 'is-done');
    }

    const connector = findConnector(stepper, plan.connector);
    if (connector) {
      connector.classList.remove('is-animating-fill');
      connector.classList.add('is-active');
    }

    if (plan.toStepId) {
      const toAliases = plan.toStepId === 'summary' ? ['summary', 'mentors'] : [plan.toStepId];
      toAliases.forEach((id) => {
        const el = findStep(stepper, id);
        if (el) setStepState(el, 'is-active');
      });
    }
  }

  function rewindToStart(stepper, plan) {
    if (!stepper || !plan) return;

    if (plan.fromStepId) {
      setStepState(findStep(stepper, plan.fromStepId), 'is-active');
    }

    const toAliases =
      plan.toStepId === 'summary' || plan.toStepId === 'mentors'
        ? ['summary', 'mentors']
        : plan.toStepId
          ? [plan.toStepId]
          : [];

    toAliases.forEach((id) => {
      const el = findStep(stepper, id);
      if (el) setStepState(el, null);
    });

    const connector = findConnector(stepper, plan.connector);
    if (connector) {
      connector.classList.remove('is-active', 'is-animating-fill');
      const fill = connector.querySelector('.profiling-stepper__connector-fill');
      if (fill) fill.style.transform = '';
    }
  }

  function resolveToStep(stepper, toStepId) {
    if (!toStepId) return null;
    return (
      findStep(stepper, toStepId) ||
      (toStepId === 'summary' ? findStep(stepper, 'mentors') : null) ||
      (toStepId === 'mentors' ? findStep(stepper, 'summary') : null)
    );
  }

  async function play(stepper, plan) {
    if (!stepper || !plan) return;

    if (prefersReducedMotion()) {
      applyFinalState(stepper, plan);
      return;
    }

    const fromEl = findStep(stepper, plan.fromStepId);
    const toEl = resolveToStep(stepper, plan.toStepId);
    const connector = findConnector(stepper, plan.connector);

    if (fromEl) {
      fromEl.classList.remove('is-done', 'is-activating');
      fromEl.classList.add('is-active');
      void fromEl.offsetWidth;
      fromEl.classList.add('is-completing');
      await wait(COMPLETE_MS);
      setStepState(fromEl, 'is-done');
      await wait(GAP_MS);
    }

    if (connector) {
      connector.classList.remove('is-active', 'is-animating-fill');
      void connector.offsetWidth;
      connector.classList.add('is-animating-fill');
      await wait(FILL_MS);
      connector.classList.remove('is-animating-fill');
      connector.classList.add('is-active');
      await wait(GAP_MS);
    }

    if (toEl) {
      setStepState(toEl, 'is-active');
      toEl.classList.add('is-activating');
      await wait(BOUNCE_MS);
      toEl.classList.remove('is-activating');
    }
  }

  /**
   * Si hay una animación en cola hacia este destino, rebobina el stepper y la reproduce.
   * @returns {Promise<boolean>} true si animó
   */
  async function runEnter(rootEl, expectedToStepId) {
    const plan = peek();
    if (!plan) return false;

    const matchesTo =
      !expectedToStepId ||
      plan.toStepId === expectedToStepId ||
      (expectedToStepId === 'summary' && (plan.toStepId === 'summary' || plan.toStepId === 'mentors')) ||
      (expectedToStepId === 'mentors' && (plan.toStepId === 'summary' || plan.toStepId === 'mentors')) ||
      (expectedToStepId === 'motivations' && plan.toStepId === 'motivations') ||
      /* completar motivaciones al ir a review (to null) */
      (expectedToStepId === 'review' && plan.fromStepId === 'motivations' && !plan.toStepId);

    if (!matchesTo) return false;

    const stepper =
      rootEl?.querySelector?.('.profiling-stepper') ||
      document.querySelector('.profiling-stepper');
    if (!stepper) return false;

    consume();
    rewindToStart(stepper, plan);

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    await play(stepper, plan);
    return true;
  }

  window.ProfilingStepperAnim = {
    STORAGE_KEY,
    queue,
    queueAdvance,
    peek,
    consume,
    runEnter,
    play,
    rewindToStart,
  };
})();
