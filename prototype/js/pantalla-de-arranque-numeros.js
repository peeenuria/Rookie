/**
 * PantallaDeArranqueNumeros — Figma 13516:47558
 * Secuencia automática 3 → 2 → 1.
 */
(function () {
  const spec = window.FIGMA_COUNTDOWN;

  let timerId = null;

  function render() {
    const initial = spec?.sequence?.[0] ?? 3;

    return `
      <section
        class="screen screen--countdown is-active PantallaDeArranqueNumeros"
        id="pantalla-de-arranque-numeros"
        data-node-id="${spec?.screenNodeId ?? '13516:47558'}"
        aria-label="Cuenta atrás"
      >
        <div class="PantallaDeArranqueNumeros__stage" id="countdown-stage">
          ${window.Countdown.render({ value: initial, animate: true })}
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

    const sequence = spec?.sequence ?? [3, 2, 1];
    const stepMs = spec?.stepDurationMs ?? 1000;
    const completeDelayMs = spec?.completeDelayMs ?? 250;
    const stage = document.getElementById('countdown-stage');
    const countdown = stage?.querySelector('.Countdown');

    window.Countdown.applyTimingVars();

    let stepIndex = 1;

    function scheduleNext() {
      if (stepIndex >= sequence.length) {
        timerId = window.setTimeout(() => {
          timerId = null;
          onComplete?.();
        }, completeDelayMs);
        return;
      }

      if (countdown) {
        window.Countdown.setValue(countdown, sequence[stepIndex]);
      }

      stepIndex += 1;
      timerId = window.setTimeout(scheduleNext, stepMs);
    }

    timerId = window.setTimeout(scheduleNext, stepMs);
  }

  function mount(target) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root || !window.Countdown) return;

    clearTimer();
    root.innerHTML = render();

    start(() => {
      if (window.PantallaDeArranqueNumerosApp?.onComplete) {
        window.PantallaDeArranqueNumerosApp.onComplete();
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

  window.PantallaDeArranqueNumeros = {
    render,
    mount,
    start,
    destroy,
  };
})();
