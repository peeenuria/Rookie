/**
 * PantallaDePermisos — Figma 13413:5883
 */
(function () {
  window.FIGMA_PERMISOS = {
    nodeId: '13413:5883',

    intro: {
      title: 'Antes de comenzar',
      subtitle: 'Necesitamos un par de permisos para poder acompañarte durante la sesión.',
    },

    locationCard: {
      nodeId: '13515:47354',
      title: 'Localización',
      description: 'Activa el GPS para que el registro del tiempo y distancia sea más preciso',
      descriptionGranted: 'GPS activo. Registraremos tiempo y distancia con más precisión.',
      descriptionDenied: 'Sin GPS usaremos registro manual. Puedes activarlo más tarde en Ajustes.',
      icon: 'assets/figma-permisos/27ff92db9227375654902d143e9b8e4ebe43467a.svg',
    },

    optionalSection: {
      label: 'OPCIONAL',
      trackers: [
        { id: 'strava', label: 'Strava', checked: false },
        { id: 'garmin', label: 'Garmin Connect', checked: false },
        { id: 'apple-health', label: 'Apple Health', checked: false },
      ],
    },

    continueButton: 'Continuar',

    iosDialog: {
      deny: 'No permitir',
      allow: 'Permitir',
      gps: {
        title: '“Rookie” quiere acceder a tu ubicación',
        message:
          'Así podemos registrar el tiempo y la distancia de tu sesión con más precisión.',
      },
      trackers: {
        strava: {
          title: '“Rookie” quiere conectarse a Strava',
          message: 'Esto permite sincronizar tus actividades de Strava con tu plan.',
        },
        garmin: {
          title: '“Rookie” quiere conectarse a Garmin Connect',
          message: 'Esto permite sincronizar tus actividades de Garmin con tu plan.',
        },
        'apple-health': {
          title: '“Rookie” quiere acceder a Apple Health',
          message: 'Esto permite leer y guardar datos de actividad para mejorar tu seguimiento.',
        },
      },
    },

    assets: {
      divider: 'assets/figma-permisos/d77551e77486880c5e81efd4c366f954f2080a0c.svg',
    },

    layout: {
      scrollPadding: 10,
      sectionGap: 24,
      introPaddingY: 12,
      cardRadius: 8,
      cardPadding: 16,
      cardMinHeight: 96,
      locationIconSize: 40,
      optionalGap: 12,
      trackerRowGap: 12,
      buttonHeight: 48,
      buttonRadius: 6,
      contentWidth: 353,
    },
  };
})();
