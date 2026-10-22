/**
 * Countdown / PantallaDeArranqueNumeros — Figma 13516:47558
 */
(function () {
  window.FIGMA_COUNTDOWN = {
    screenNodeId: '13516:47558',
    componentNodeId: '13518:47738',

    sequence: [3, 2, 1],
    stepDurationMs: 1000,
    /** Espera tras completar el arco del último número (1) antes de navegar
     * a ¡Vamos! — deliberadamente corta: solo un respiro visual, no un paso
     * completo más de cuenta atrás. */
    completeDelayMs: 250,

    assets: {
      arcTrack: 'assets/figma-countdown/916239d845a0b70f74622984a6d220f496e13078.svg',
    },

    layout: {
      width: 160,
      height: 196,
      arcSize: 160,
      arcStroke: 10,
      arcRadius: 85,
      numberSize: 96,
      numberLineHeight: 18,
    },

    onCompleteRedirect: '../vamos/index.html',
  };
})();
