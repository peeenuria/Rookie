/**
 * PantallaExito — Figma 13556:47835
 */
(function () {
  window.FIGMA_PANTALLA_EXITO = {
    screenNodeId: '13556:47835',
    containerNodeId: '13556:47881',

    assets: {
      iconCheck: 'assets/figma-pantalla-exito/bd591e33b14ce0a94a2908b4e9848eacbe564e76.svg',
      iconAchievementCheck: 'assets/figma-pantalla-exito/8d20dfb22fd42843320e9f911cbc9995ce9300bc.svg',
    },

    copy: {
      titleTemplate: '¡Gran trabajo, {name}!',
      continueCta: 'Continuar',
    },

    /** Estado por defecto (se puede sobreescribir desde `PantallaExito.mount({...})`) */
    defaultState: {
      userName: 'Pedro',
      achievements: ['2 sesiones esta semana', '+45 minutos de actividad', 'Actividad completada'],
    },

    routes: {
      onContinue: '../esfuerzo-percibido/index.html',
    },
  };
})();

