/**
 * SecciónMentor — "Mi Mentor" (Figma 13707:13164)
 * Perfil del mentor ya asignado, accesible desde el tab "Mentor" del bottom nav.
 */
(function () {
  window.FIGMA_MI_MENTOR = {
    screenNodeId: '13707:13164',

    assets: {
      groupOutingPhoto: 'assets/mi-mentor/photo-block-salida-grupal.png',
      iconCalendarDays: 'assets/mi-mentor/icon-calendar-days.svg',
      iconMapPinned: 'assets/mi-mentor/icon-map-pinned.svg',
    },

    copy: {
      assignedLabel: 'Tu mentor asignado',
      groupOutingPrefix: 'Salida grupal con',
      outingDaysPrefix: 'Salidas los',
    },

    /* Nombre completo, bio y salida grupal — Figma solo da copy para
       Maximiliano (el único mentor que este mock asigna como "tu mentor";
       el resto del catálogo usa figma-4-1-spec.js sin estos campos). */
    mentorDetails: {
      maximiliano: {
        fullName: 'MAXIMILIANO ETXEBARRIA-GOIKOETXEA',
        bio: 'Llevo más de una década ayudando a corredores principiantes a construir una base de resistencia sólida sin lesionarse en el intento. Combinamos trabajo técnico con prevención activa, sesión a sesión.',
        groupOuting: {
          scheduleLines: ['Lunes, martes, miércoles', 'jueves y viernes · 18:00'],
          location: 'Parc Central · Valencia',
        },
      },
    },

    defaultMentorId: 'maximiliano',
  };
})();
