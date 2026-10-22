/**
 * PantallaDeArranqueVamos — Figma 13518:47757
 * Pantalla breve con «¡VAMOS!» centrado; navega automáticamente a SesiónActiva.
 */
(function () {
  const spec = window.FIGMA_VAMOS;

  let timerId = null;

  function render() {
    const text = spec?.text ?? '¡VAMOS!';

    return `
      <section
        class="screen screen--vamos is-active PantallaDeArranqueVamos"
        id="pantalla-de-arranque-vamos"
        data-node-id="${spec?.screenNodeId ?? '13518:47757'}"
        aria-label="¡Vamos!"
      >
        <div
          class="PantallaDeArranqueVamos__stage"
          data-node-id="${spec?.containerNodeId ?? '13518:47761'}"
        >
          <p
            class="PantallaDeArranqueVamos__text"
            data-node-id="${spec?.textNodeId ?? '13518:47763'}"
          >${text}</p>
        </div>
      </section>
    `;
  }

  function clearTimer() {
    if (timerId != null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function start(onComplete) {
    clearTimer();

    const durationMs = spec?.durationMs ?? 650;

    timerId = window.setTimeout(() => {
      timerId = null;
      onComplete?.();
    }, durationMs);
  }

  function mount(target) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return;

    clearTimer();
    root.innerHTML = render();

    start(() => {
      if (window.PantallaDeArranqueVamosApp?.onComplete) {
        window.PantallaDeArranqueVamosApp.onComplete();
        return;
      }
      if (spec?.onCompleteRedirect) {
        window.location.href = spec.onCompleteRedirect;
      }
    });
  }

  function destroy() {
    clearTimer();
  }

  window.PantallaDeArranqueVamos = {
    render,
    mount,
    start,
    destroy,
  };
})();
