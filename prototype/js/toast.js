/**
 * AppToast — snackbar reutilizable para confirmaciones breves.
 */
(function () {
  const DEFAULT_DURATION_MS = 2500;

  let hostEl = null;
  let hideTimer = null;

  function getHost() {
    if (hostEl) return hostEl;
    hostEl =
      document.getElementById('app-toast-root') ||
      document.querySelector('.phone-shell') ||
      document.body;
    return hostEl;
  }

  function clearTimer() {
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function hide() {
    clearTimer();
    const toast = document.querySelector('.AppToast');
    if (!toast) return;

    toast.classList.remove('is-visible');
    window.setTimeout(() => {
      const container = document.getElementById('app-toast-root');
      if (container) container.innerHTML = '';
    }, 280);
  }

  /**
   * @param {object} options
   * @param {string} options.message
   * @param {string} [options.actionLabel]
   * @param {() => void} [options.onAction]
   * @param {number} [options.durationMs]
   */
  function show(options = {}) {
    if (!options.message) return;

    hide();

    let container = document.getElementById('app-toast-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-root';
      container.className = 'AppToastHost';
      getHost().appendChild(container);
    }

    const hasAction = options.actionLabel && typeof options.onAction === 'function';
    const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;

    container.innerHTML = `
      <div class="AppToast" role="status" aria-live="polite">
        <p class="AppToast__message">${options.message}</p>
        ${
          hasAction
            ? `<button type="button" class="AppToast__action">${options.actionLabel}</button>`
            : ''
        }
      </div>
    `;

    const toast = container.querySelector('.AppToast');
    requestAnimationFrame(() => {
      toast?.classList.add('is-visible');
    });

    if (hasAction) {
      container.querySelector('.AppToast__action')?.addEventListener('click', () => {
        options.onAction();
        hide();
      });
    }

    hideTimer = window.setTimeout(hide, durationMs);
  }

  window.AppToast = {
    show,
    hide,
    DEFAULT_DURATION_MS,
  };
})();
