/**
 * Detalle de sesión — Figma 13276:2216
 */
(function () {
  window.FIGMA_SESSION_DETAIL = {
    nodeId: '13276:2216',

    /** Fecha real del sistema — coincide con Home, siempre dinámica */
    mockTodayIso: window.DateFormat.getTodayIso(),

    sections: {
      description: 'Descripción de la sesión',
      mentorAdvice: 'Consejo de tu mentor',
    },

    buttons: {
      start: 'Empezar sesión',
      tracking: 'Conectar app de tracking',
    },

    /** Acordeón por sesión — ver plan-sessions.js */
    accordion: [],

    mentor: {
      name: '',
      role: '',
      advice: '',
      photo: 'assets/mentors/mentor-3.png',
      photoObjectPosition: '50% 6%',
    },

    /** BottomSheetReprogramarSesion — Figma 13354:90634 */
    bottomSheetReprogramarSesion: {
      nodeId: '13354:90634',
      title: '¿Te va mal hoy?',
      subtitle: 'No te preocupes, podemos ajustar el plan.',
      reprogramarLabel: 'Reprogramar',
      saltarLabel: 'Saltar esta sesión',
      confirmLabel: 'Confirmar nueva fecha',
    },

    sessionStateStorageKey: 'rookie.sessionState',

    /** Sin conexión — Figma 12903:7162 */
    sinConexion: {
      nodeId: '12903:7300',
      title: 'Sin red',
      message: 'Conéctate para acceder a esta funcionalidad.',
      icon: 'assets/figma-session-detail/c194801f9565088be78a08aa9914286ab083756d.svg',
    },

    /** Cargando — Figma 12641:2443 */
    loading: {
      nodeId: '12641:2443',
      delayMs: 1400,
      accordionCount: 3,
    },

    layout: {
      /** IntroDetalleSesion — Figma 13373:90689 */
      introHeightExpanded: 500,
      introHeightCollapsed: 252,
      introScrollRange: 180,
      heroHeight: 500,
      heroContentLeft: 21,
      heroContentBottom: 21,
      heroContentWidth: 282,
      topBarTop: 30,
      topBarHeight: 37,
      touchTargetSize: 40,
      iconBackSize: 24,
      iconRescheduleSize: 16,
      contentPadding: 10,
      sectionGap: 24,
      blockGap: 12,
      cardWidth: 353,
      cardRadius: 8,
      cardBorderLeft: 12,
      cardPadding: 16,
      cardBodyPaddingX: 24,
      cardHeaderHeight: 81,
      cardExpandedHeight: 184,
      cardContentHeight: 76,
      mentorHeaderHeight: 100,
      mentorPhotoWidth: 76,
      mentorAdviceMinHeight: 71,
      buttonHeight: 48,
      buttonRadius: 6,
    },

    assets: {
      heroPhoto: 'assets/figma-session-detail/918716ba28df3bf7a83c0b018937531ff1a05a18.png',
      arrowLeft: 'assets/figma-session-detail/4a1e8175a185a1e4bb0c83733354de6e96010061.svg',
      calendarSync: 'assets/figma-session-detail/4fe11a6a0431f9de1fea3ddc09d02d9429c4f2c6.svg',
      heroDivider: 'assets/figma-session-detail/c3c74f521c9f093e3ee44e0cc75a6d6e961d8bde.svg',
      cardDivider: 'assets/figma/4d1d9e8157aa1efc408d33756f26be1b78699d7e.svg',
      mentorPhotoBg: 'assets/figma-session-detail/0691c68b43e8a89eee8cfce33d348338519b5f01.svg',
      closeIcon: 'assets/figma-session-detail/67ffb78d869835aa63955c1a5e6591fc9b65c4fd.svg',
      circleDefault: 'assets/figma/0cf7bf0b8ab693fd63574b0f02a99cc6a54493ae.svg',
      circleSelected: 'assets/figma/c1ae89dfdee6af1b6bdef3590703ee6a0be7ae18.svg',
      circleDisabled: 'assets/figma-session-detail/28cf5a38ac024be7e0c023ac1b52236a9eaabe19.svg',
      chevronLeft: 'assets/figma/23f48e55da2881401d27cd061769dc8f5c0d1391.svg',
      chevronRight: 'assets/figma/4d79fee76d191a0e42af056644e53657336b0a72.svg',
    },

    weekDayLetters: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],

    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],

    weekdayNamesCapitalized: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
  };
})();
