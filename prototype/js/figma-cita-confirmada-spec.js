/**
 * CitaConfirmada — Pantalla de éxito, confirmación de 1ª cita (Figma 13694:16006)
 */
(function () {
  window.FIGMA_CITA_CONFIRMADA = {
    screenNodeId: '13694:16006',

    assets: {
      iconUser: 'assets/cita-confirmada/lucide-user-round.svg',
      iconCalendarCheck: 'assets/cita-confirmada/lucide-calendar-check-2.svg',
      iconClock: 'assets/cita-confirmada/lucide-clock.svg',
      iconLaptop: 'assets/cita-confirmada/lucide-laptop-minimal.svg',
    },

    copy: {
      title: '¡Cita confirmada!',
      /** {firstName}, {weekday} */
      subtitleTemplate: '{firstName} ya lo sabe. ¡Nos vemos el {weekday}!',
      meetingType: 'Google Meet',
      continueCta: 'Ir a tu plan',
    },

    routes: {
      onContinue: '../home/index.html',
    },
  };
})();
