/**
 * Historia 4.1 — Elección de mentor
 * Fuente: DECATHLON Design Library — Explorations
 */
window.FIGMA_4_1 = {
  frameNodeId: '12641:2921',
  screens: {
    catalog: '12528:42310',
    confirmation: '12529:42925',
    errorCarga: '12641:2394',
    sinConexion: '12641:2829',
  },

  errorCarga: {
    skeletonCount: 4,
  },

  sinConexion: {
    title: 'Sin red',
    message: 'Conéctate para acceder a esta funcionalidad.',
    icon: 'assets/figma/c194801f9565088be78a08aa9914286ab083756d.svg',
  },

  userName: 'Pedro',

  genderCopy: {
    role: { m: 'mentor', f: 'mentora' },
    possessive: { m: 'tu mentor', f: 'tu mentora' },
    miRole: { m: 'mi mentor', f: 'mi mentora' },
  },

  buttons: {
    confirmation: {
      primary: 'Continuar con mi mentor',
      primaryFemale: 'Continuar con mi mentora',
    },
  },

  catalog: {
    nodeId: '12528:42310',
    title: 'Tu mentor te está esperando',
    subtitle: 'Sin presión.\nPuedes cambiarlo más adelante.',
  },

  confirmation: {
    nodeId: '12529:42925',
    contextLabel: 'Tu mentor asignado',
    contextLabelFemale: 'Tu mentora asignada',
    outingPrefix: 'Salidas los',
    backIcon: 'assets/figma/898a97214549b77325405129a6cb73f7592c00ab.svg',
    ratingDivider: 'assets/figma/c00fccd42e2267e93c776a9a4ba2acf96186bca9.svg',
    continuePlaceholderMessage:
      'Próximamente: agenda de tu primera cita con tu mentor.',
  },

  stepper: {
    steps: [
      { id: 'personal', label: 'Info personal', icon: 'notepad-text' },
      { id: 'motivations', label: 'Motivaciones', icon: 'land-plot' },
      { id: 'mentors', label: 'Mentores', icon: 'id-card-lanyard' },
    ],
  },

  assets: {
    photo: {
      cardWidth: 160,
      cardHeight: 320,
      heroHeight: 326,
    },
  },

  mentors: [
    {
      id: 'laura',
      name: 'LAURA CASTELLAR',
      firstName: 'Laura',
      gender: 'f',
      specialty: 'Especialista en planes progresivos y medibles',
      tags: ['Estructura', 'Resultados', 'Técnica'],
      rating: 4.6,
      outingDays: 'lunes, miércoles, viernes y domingo',
      /* RookieMentor7 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-laura-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-laura.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-laura.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-laura.png',
      heroObjectPosition: '50% 12%',
      cardObjectPosition: 'center',
    },
    {
      id: 'marcos',
      name: 'MARCOS SILVA',
      firstName: 'Marcos',
      gender: 'm',
      specialty: 'Especialista en superar límites mentales',
      tags: ['Retos', 'Intensidad', 'Gamificación'],
      rating: 4.8,
      outingDays: 'martes, jueves y sábados',
      /* RookieMentor1 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-marcos-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-marcos.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-marcos.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-marcos.png',
      heroObjectPosition: '50% 8%',
      cardObjectPosition: 'center',
    },
    {
      id: 'sofia',
      name: 'SOFÍA EXPÓSITO',
      firstName: 'Sofía',
      gender: 'f',
      specialty: 'Especialista en dinámicas de grupo',
      tags: ['Estructura', 'Resultados', 'Técnica'],
      rating: 4.5,
      outingDays: 'lunes, martes, jueves, viernes y sábados',
      /* RookieMentor8 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-sofia-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-sofia.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-sofia.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-sofia.png',
      heroObjectPosition: '52% 10%',
      cardObjectPosition: 'center',
    },
    {
      id: 'david',
      name: 'DAVID FERNÁNDEZ',
      firstName: 'David',
      gender: 'm',
      specialty: 'Especialista en running consciente',
      tags: ['Mindfulness', 'Bienestar', 'Desconexión'],
      rating: 4.7,
      outingDays: 'miércoles, sábado y domingo',
      /* RookieMentor10 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-david-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-david.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-david.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-david.png',
      heroObjectPosition: '50% 8%',
      cardObjectPosition: 'center',
    },
    {
      id: 'maximiliano',
      name: 'MAXIMILIANO ETXEBARRIA',
      firstName: 'Maximiliano',
      gender: 'm',
      specialty: 'Especialista en resistencia y prevención de lesiones a largo plazo',
      tags: ['Prevención de lesiones', 'Acompañamiento cercano', 'Resistencia'],
      rating: 4.9,
      outingDays: 'lunes, martes, miércoles, jueves, viernes y sábado',
      /* RookieMentor3 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-maximiliano-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-maximiliano.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-maximiliano.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-maximiliano.png',
      heroObjectPosition: '50% 6%',
      cardObjectPosition: 'center',
    },
    {
      id: 'ana',
      name: 'ANA RUIZ',
      firstName: 'Ana',
      gender: 'f',
      specialty: 'Coach de running',
      tags: ['Flexibilidad', 'Constancia', 'Motivación'],
      rating: 4.2,
      outingDays: 'sábados',
      /* RookieMentor5 — card ya recortada 160x320 desde Figma (photo-block, con diagonal y fondo horneados) */
      photo: 'assets/mentors/mentor-ana-card.png',
      photoPrerendered: true,
      recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-ana.png',
      citaSeguimientoPhoto: 'assets/mentors/photo-block-citayseguimiento-ana.png',
      heroPhoto: 'assets/mentors/photo-block-hero-detalle-ana.png',
      heroObjectPosition: '50% 10%',
      cardObjectPosition: 'center',
    },
  ],
};

(function applyMentorBios() {
  const bios = {
    laura:
      'Llevo años diseñando planes que avanzan paso a paso, con metas claras y medibles. Cada sesión tiene un objetivo concreto para que veas tu progreso real semana a semana.',
    marcos:
      'Creo que el mayor límite está en la cabeza, no en las piernas. Te acompaño con retos progresivos para que descubras de lo que eres capaz, sin abrumarte.',
    sofia:
      'El running es más fuerte en grupo. Organizo dinámicas donde el equipo te empuja cuando flaqueas y celebra contigo cada pequeño logro.',
    david:
      'No se trata de ir más rápido, sino de estar presente. Trabajamos respiración, ritmo consciente y disfrute del proceso para que correr sea tu espacio de calma.',
    maximiliano:
      'Llevo más de una década ayudando a corredores principiantes a construir una base de resistencia sólida sin lesionarse en el intento. Combinamos trabajo técnico con prevención activa, sesión a sesión.',
    ana:
      'Mi enfoque es flexible y cercano: adaptamos el plan a tu vida real, no al revés. Te ayudo a mantener la constancia con motivación constante y sin culpas.',
  };

  window.FIGMA_4_1.mentors.forEach((mentor) => {
    mentor.bio = bios[mentor.id] || '';
  });
})();
