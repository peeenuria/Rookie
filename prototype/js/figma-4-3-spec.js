/**
 * Fase 0 — Especificación extraída del frame Figma 4.3 (node 12639:26768)
 * Fuente: DECATHLON Design Library — 4.3. HdU - FijarObjetivosMentor
 */
window.FIGMA_4_3 = {
  frameNodeId: '12639:26768',
  pageNodeId: '12490:135',

  screens: {
    /** Cita del día — home con recordatorio */
    homeInitial: '12635:1874',
    /** Escenario A — Entra antes de tiempo */
    homeEarlyDisabled: '12635:1619',
    homeEarlyToast: '12635:1805',
    /** Puente pre-llamada + estado de carga */
    meetBridge: '12635:1742',
    meetBridgeLoading: '12637:591',
    meetExternal: '12637:82',
    callSummary: '12638:26237',
    homeUpdated: '12637:26028',
    /** Escenario C — Mentor no completa resumen */
    homeInitialPending: '12639:26531',
    meetBridgePending: '12639:26570',
    meetExternalPending: '12639:26622',
    callSummaryPending: '12639:26625',
    /** Escenario D — Mentor no aparece */
    homeInitialNoShow: '12638:26133',
    meetBridgeNoShow: '12638:26177',
    meetExternalNoShow: '12639:26243',
    meetBridgeNoShowAlt: '12639:26248',
    meetBridgeBottomSheet: '12639:26321',
    bottomSheetNoShow: '12639:26394',
  },

  /** Rutas hash del prototipo */
  routes: {
    homeInitial: 'home-initial',
    meetBridge: 'meet-bridge',
    meetExternal: 'meet-external',
    callSummary: 'call-summary',
    homeUpdated: 'home-updated',
  },

  /** Query ?mock=appointment-day simula cita a +15 min (botón Unirme activo en demos) */
  mockParams: {
    appointmentDay: 'appointment-day',
  },

  /** Minutos antes de la cita en que se activa «Unirme» (User Flow Figma) */
  joinWindowMinutes: 30,

  /** Tras pulsar «Unirme ahora» — overlay de carga antes del resumen (sin UI de videollamada) */
  bridgeLoading: {
    durationMs: 1400,
    node: '12637:591',
  },

  copy: {
    homeTitleTemplate: 'Bienvenido, {userName}.',
    appointmentTitleTemplate: 'Cita con {firstName}.',
    followUpTitleTemplate: 'Seguimiento con {firstName}.',
    appointmentMetaTemplate: '{shortDate} · {time}',
    joinButton: 'Unirme',
    joinNowButton: 'Unirme ahora',
    earlyAccessToastTemplate:
      'La videollamada se activa el día de la cita a las {activationTime}.',
    bridgeTitleTemplate: '¡Hoy es tu cita\ncon {firstName}!',
    /** Mensaje carga (Figma 12988:881) */
    bridgeLoadingLabel: 'Te estamos redirigiendo a Google Meet',
    meetStubTitle: 'Google Meet',
    meetStubHint: 'Videollamada externa con tu mentor.',
    meetStubSimulate: 'Simular fin de llamada',
    summaryTitle: '¡Primera cita completada!',
    summarySubtitleTemplate: '{firstName} ha preparado tu resumen',
    summaryPendingSubtitleTemplate: '{firstName} está preparando tu resumen.',
    summaryPendingToast: 'Te avisaremos cuando esté listo.',
    goalsCardTitle: 'Lo que acordasteis:',
    goalsHomeTitle: 'Objetivos de la quincena:',
    followUpCardTitleTemplate: 'Próximo seguimiento con {firstName}',
    goToUpdatedPlan: 'Ver mi plan actualizado',
    goToHome: 'Ir a inicio',
    /** Escenario D — Figma 4.4.2.x → spec 4.3.3.x */
    mentorNoShowButton: 'El mentor no ha aparecido',
    bottomSheetTitle: 'Vaya, lo sentimos.',
    bottomSheetBodyTemplate: 'Hemos avisado a {firstName}. ¿Qué prefieres hacer?',
    rescheduleButton: 'Buscar otro horario',
    changeMentorButton: 'Cambiar de mentor',
  },

  /** Objetivos mock acordados en la primera cita (Happy Path) */
  goals: [
    'Completar 3 sesiones por semana',
    'Mantener un ritmo cómodo, sin forzar',
    '2 km continuos en 2 semanas',
  ],

  /** Próximo seguimiento = primera cita + N días (Figma: 23 Jun → 7 Jul = 14 d) */
  followUpDaysAfter: 14,

  videoFormat: 'Google Meet',

  scenarios: {
    entraAntes: 'entra-antes',
    sinResumen: 'sin-resumen',
    mentorNoAparece: 'mentor-no-aparece',
  },

  layout: {
    homeContentGap: 24,
    recordatorioHeight: 203,
    placeholder1Height: 144,
    placeholder2Height: 259,
    goalsCardHeight: 206,
    goalsBadgeSize: 24,
    goalsBadgeRadius: 12,
    bridgeAvatarSize: 150,
    illustrationWidth: 190,
    illustrationHeight: 204,
  },

  assets: {
    /** Ilustración dinámica — foto card del mentor + fondo lila con clip-path diagonal */
    recordatorioUsesMentorPhoto: true,
    recordatorioClipPath: 'polygon(55% 0, 100% 0, 100% 100%, 0% 100%)',
    reminderIcons: {
      user: 'assets/figma/e8716fe554a13e1076c4944ab4fd3236a96895da.svg',
      calendar: 'assets/figma/b6b9e30dc9891a7b4ba89139b747fe610c441db2.svg',
      clock: 'assets/figma/cc2b33d436433d51dff81e2650bf22078a51630d.svg',
      video: 'assets/figma/d6544607d7a833d3a4c9ff475b77232c7ca36c42.svg',
    },
    toastAlert: 'assets/figma/e356d82336ba4970a9fc761b91c2622f3236230c.svg',
    toastClose: 'assets/figma/25a00030cac82c12541e9ef916ccb6207f460d4a.svg',
    bell: 'assets/figma/lucide-bell.svg',
  },
};
