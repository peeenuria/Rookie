/**
 * Home — Inicio (Figma node 13186:5008)
 * Fuente: DECATHLON Design Library — Explorations
 */
(function () {
  window.FIGMA_HOME = {
    nodeId: '13186:5008',

    userName: 'Pedro',

    greetingTemplate: 'Bienvenido, {name}',

    motivationalPhrases: [
      'Solo por intentarlo, ya estás mejorando',
      'Cada paso cuenta, aunque sea pequeño',
      'Hoy es un buen día para empezar',
      'Tu constancia es tu superpoder',
    ],

    sections: {
      todayPlan: 'Tu plan para hoy',
      mentorSupport: 'Estamos contigo',
      biweeklyGoals: 'Objetivos de la quincena',
    },

    /** CardSesiónDeHoy — Figma component set, Propiedad 1 */
    sessionTodayCard: {
      nodeIdRunning: '13207:90371',
      nodeIdDescanso: '13207:90606',
      figmaVariantProperty: 'Propiedad 1',
      figmaVariantRunning: 'Predeterminada',
      figmaVariantDescanso: 'Variante4',
      sessionTypeProperty: 'session-type',
      sessionTypes: {
        running: 'running',
        descanso: 'descanso',
      },
    },

    restDay: {
      title: 'Descanso',
      message: 'Enhorabuena, te lo has ganado',
    },

    /** Inicio_VersiónInicial (Figma 13186:5008) — antes de completar la 1ª cita con el mentor */
    firstAppointmentLockedMessage:
      'Todavía no tienes actividades planificadas. Completa la cita con tu mentor para continuar.',
    firstAppointmentLockedGoalsMessage:
      'Todavía no tienes objetivos acordados. Completa la cita con tu mentor para continuar.',

    joinButton: 'Unirme',

    /** Sin conexión — Figma 12903:7162 */
    sinConexion: {
      nodeId: '12903:7300',
      title: 'Sin red',
      message: 'Conéctate para acceder a esta funcionalidad.',
      icon: 'assets/figma-session-detail/c194801f9565088be78a08aa9914286ab083756d.svg',
    },

    /** Cargando — Figma 12641:2443 */
    loading: {
      delayMs: 1400,
    },

    weekDayLetters: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],

    /** Fecha real del sistema — hoy siempre se calcula dinámicamente, nunca fija. */
    referenceDate: window.DateFormat.getTodayIso(),

    /** Sesiones planificadas — derivadas en runtime desde PlanSessions.
     * Este array solo se usa si PlanSessions no llegó a cargar; se calcula
     * relativo a hoy para no quedar anclado a fechas de calendario fijas. */
    scheduledDates: [0, 2, 4].map((days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }),

    mentorAppointment: {
      titlePrefix: 'Cita con',
      mentorName: 'MAXIMILIANO',
      dateTime: 'Martes 23 · 10:00',
      /* photo-block ya compuesto (diagonal + fondo horneados desde Figma,
         igual que figma-4-1-spec.js) — no necesita capa de fondo aparte. */
      photo: 'assets/mentors/photo-block-citayseguimiento-maximiliano.png',
      /** Identifica al mentor en figma-4-1-spec.js y arma la reserva que
       * lee mentor-app.js (screen-meet-bridge) al pulsar "Unirme". */
      mentorId: 'maximiliano',
      dayIso: '2026-07-23',
      time: '10:00',
      /* Fecha sola (sin hora) para la fila "calendario" de la tarjeta de
         detalle — la hora ya tiene su propia fila. */
      dateLabel: 'Martes, 23 de julio',
      weekdayMeet: 'martes',
      /* CardSeguimientoMentor (Figma 12993:6760) — Home actualizado, tras la
         1ª cita. Botón deshabilitado: el seguimiento se agenda solo, N días
         después de la 1ª cita (mismo valor que mentor-app.js). */
      followUpTitlePrefix: 'Seguimiento con',
      followUpDaysAfter: 14,
    },

    /* checked: false siempre por defecto — solo el sistema los marca al
       detectar que se cumplió la condición real del objetivo. */
    biweeklyGoals: [
      { id: 'sessions', text: 'Completar 2 sesiones por semana', checked: false },
      { id: 'pace', text: 'Mantener un ritmo cómodo, sin forzar', checked: false },
      { id: 'distance', text: '2 km continuos en 2 semanas', checked: false },
      { id: 'rest', text: 'Descansa al menos un día entre sesiones', checked: false },
    ],

    /** BottomSheetCambiarDias — Figma 13223:90986 */
    bottomSheetCambiarDias: {
      nodeId: '13223:90986',
      title: 'Ajusta tus días disponibles',
      subtitle: 'Tu plan se actualizará según los días que elijas',
      saveButton: 'Guardar cambios',
      errorMessage: 'Selecciona al menos un día',
      /** {max} — límite = días/semana definidos en el perfilado (Motivaciones). */
      exactCountMessage: 'Selecciona exactamente {max} días',
      /** Índices 0–6 (L–D) con disponibilidad inicial del mock */
      defaultAvailableDays: [1, 3, 5],
    },

    layout: {
      weekSelectorPaddingTop: 40,
      weekSelectorPaddingBottom: 12,
      weekSelectorPaddingX: 16,
      scrollPadding: 10,
      sectionGap: 24,
      blockGap: 12,
      saludoHeight: 74,
      sessionCardHeight: 230,
      sessionCardBorderLeft: 12,
      mentorCardHeight: 200,
      mentorPhotoWidth: 160,
      mentorTextWidth: 201,
      dayPillWidth: 44,
      dayCircleSize: 40,
      activityDotSize: 8,
      checkboxSm: 20,
      checkboxLg: 40,
      cardRadius: 8,
      joinButtonWidth: 127,
      joinButtonMinHeight: 41,
    },

    assets: {
      chevronLeft: 'assets/figma/23f48e55da2881401d27cd061769dc8f5c0d1391.svg',
      chevronRight: 'assets/figma/4d79fee76d191a0e42af056644e53657336b0a72.svg',
      plus: 'assets/figma/bc07493cb7c19d28365710c82b3d6691ae210f2c.svg',
      sliders: 'assets/figma/db8f025163d924682d41c01714dca5e2e9db057f.svg',
      circleDefault: 'assets/figma/0cf7bf0b8ab693fd63574b0f02a99cc6a54493ae.svg',
      circleSelected: 'assets/figma/c1ae89dfdee6af1b6bdef3590703ee6a0be7ae18.svg',
      activityDot: 'assets/figma/07355975e1f8b4b221d3a1362c4c457e9e44ca82.svg',
      /* Inicio_VersiónInicial (13648:7832) — punto en neutral/300 mientras no se completa la 1ª cita */
      activityDotLocked: 'assets/figma/activity-dot-locked.svg',
      dividerLine: 'assets/figma/4d1d9e8157aa1efc408d33756f26be1b78699d7e.svg',
      dividerLineDescanso: 'assets/figma-home/c504fb3bfd486131bd5330a26f799c7d3cc17d7d.svg',
      checkboxCheck: 'assets/figma/f4c861f396d0042cd624c623d01e71dc98a2ebf7.svg',
      mentorPhotoBg: 'assets/figma/423a1381218dcbcbe81e1c9c05de27400112de67.svg',
      closeIcon: 'assets/figma/fa446e79768b3a0455a588659de12491eda54070.svg',
      toggleCircleDefault: 'assets/figma/0cf7bf0b8ab693fd63574b0f02a99cc6a54493ae.svg',
      toggleCircleSelected: 'assets/figma-home/b6954e4f49a84905df5ceba889ad88c2e6564b82.svg',
    },

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

    weekdayNames: [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
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
