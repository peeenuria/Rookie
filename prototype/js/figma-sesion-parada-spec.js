/**
 * SesiónParada — Figma 13519:69761
 */
(function () {
  window.FIGMA_SESION_PARADA = {
    screenNodeId: '13519:69761',

    nodes: {
      indicadorFaseActual: '13519:69767',
      barrasDeProgreso: '13519:69773',
      botonPlay: '13519:69854',
      botonStop: '13519:69883',
      notaDelMentor: '13519:69791',
    },

    assets: {
      playIconBrand: 'assets/figma-sesion-pausada/46d4ea17c6b4c5111161da0fe04b7a30717eb0d5.svg',
      stopIconBrand: 'assets/figma-sesion-pausada/d44f67f89fd6e2f7c9b3916eb38e00bbb516ea74.svg',
      progressTrack: 'assets/figma-sesion-pausada/c0bd271a31d5355a78e6b4b6849c32454e19ad51.svg',
      progressSegmentActive: 'assets/figma-sesion-pausada/ff1d0ee205eff70b05f8d4a6e3a38f09e6ad1d16.svg',
      progressSegmentInactive: 'assets/figma-sesion-pausada/651ff237523dcec7f4f864092abcffe4c9a9d642.svg',
    },

    copy: {
      currentPhaseMinutes: '5 MIN',
      currentPhaseName: 'Calentamiento',
      nextPhaseLabel: 'Siguiente fase',
      nextPhaseName: 'Ejercicio',
      metricTimeLabel: 'Tiempo',
      metricTimeValue: '03:26',
      metricDistanceLabel: 'Distancia',
      metricDistanceValue: '0,8 km',
      mentorNote: 'Deja que el cuerpo se despierte, sin prisa.',
    },

    routes: {
      onPlay: '../sesion-activa/index.html',
    },
  };
})();

