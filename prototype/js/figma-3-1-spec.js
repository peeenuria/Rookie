/**
 * Historia 3.1 — Plan adaptado a motivaciones
 * Fuente: DECATHLON Design Library — Explorations
 */
(function () {
  window.FIGMA_3_1 = {
    motivationsReview: {
      nodeId: '13131:130816',
      title: 'Antes de continuar',
      subtitle:
        'Revisa que todo esté correcto. Podrás cambiarlo más adelante desde tu perfil.',
      generateCta: 'Aceptar y generar mi plan',
    },
    planGenerating: {
      nodeId: '13131:130886',
      message: 'Estamos creando tu plan...',
      durationMs: 1750,
    },
    /** Rediseño simplificado — una sola card, sin foto/trofeo/checklist (Figma 13131:130876) */
    planReady: {
      nodeId: '13131:130876',
      titlePrefix: 'Tu plan está listo,',
      goalTagline: 'Tu objetivo',
      sessionsLabel: ['Sesiones', 'por semana'],
      minutesLabel: ['Minutos', 'por sesión'],
      distanceLabel: ['Distancia', 'inicial'],
      objectivesHint: 'Podrás ver estos objetivos en cualquier momento desde tu perfil',
      continueCta: 'Elegir a mi mentor',
    },
    distanceReviewLabels: {
      '2K': '2 kilómetros',
      '2,5K': '2,5 kilómetros',
      '3K': '3 kilómetros',
      '3,5K': '3,5 kilómetros',
      '4K': '4 kilómetros',
    },
    storageKeys: {
      generatedPlan: 'rookie-generated-plan',
    },
  };
})();
