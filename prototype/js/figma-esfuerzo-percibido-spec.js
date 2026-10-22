/**
 * EsfuerzoPercibido — Figma 13556:2010
 */
(function () {
  window.FIGMA_ESFUERZO_PERCIBIDO = {
    screenNodeId: '13556:2010',

    assets: {
      radioOuterDefault: 'assets/figma-esfuerzo-percibido/5a488aca893f71eb7c8a7bb8ba8c063e8ad02f93.svg',
      radioInnerDefault: 'assets/figma-esfuerzo-percibido/909e6a2422b80a808c7727c1d7530c834c2ffb81.svg',
      radioOuterSelected: 'assets/figma-esfuerzo-percibido/6dfa157f8da31327904867b8d373eba674ceed1b.svg',
      radioInnerSelected: 'assets/figma-esfuerzo-percibido/eaac59e7d7bc0aa4bb5936f1e952e71e9ee951dc.svg',
      moodMuyMalDefault: 'assets/figma-esfuerzo-percibido/ff06a4be6c080eb08c27c456ce587f87bdd9f6ec.svg',
      moodMuyMalSelected: 'assets/figma-esfuerzo-percibido/906170ac86759f115165a36247f62ca4385265fa.svg',
      moodMalDefault: 'assets/figma-esfuerzo-percibido/e5bcf119a686865458ed510bc793c624046eee4b.svg',
      moodMalSelected: 'assets/figma-esfuerzo-percibido/6d04f54fc27bf96b8efbe715443e4ee7c04a93a1.svg',
      moodRegularDefault: 'assets/figma-esfuerzo-percibido/82d426ee6b55253098980ebc206a9f508bdb72c8.svg',
      moodRegularSelected: 'assets/figma-esfuerzo-percibido/afafec84ab52f2c2c4a4ae2bc9b8cd4aba4363a3.svg',
      moodBienDefault: 'assets/figma-esfuerzo-percibido/9a3cb707cda032d14f64f923103cbb727aefa441.svg',
      moodBienSelected: 'assets/figma-esfuerzo-percibido/40c466823a01b5d7fba94918b56c77887530db99.svg',
      moodMuyBienDefault: 'assets/figma-esfuerzo-percibido/82e7261f03f21397005d84ead91cbbe668054b2b.svg',
      moodMuyBienSelected: 'assets/figma-esfuerzo-percibido/24133b0235ff71827b5669c43d0b033e59be00f4.svg',
    },

    copy: {
      sessionMeta: 'Martes, 14 de julio',
      sessionType: 'Primera salida',
      moodTitle: '¿Cómo te has sentido?',
      conversationalTitle: '¿Podías hablar mientras corrías?',
      conversationalOptions: ['Sí, sin problema', 'Me costaba', 'No, era muy forzado'],
      noteTitle: '¿Quieres contarle algo a tu mentor?',
      notePlaceholder:
        'Escribe una nota, por ejemplo cómo notaste el ritmo, si te costó algún tramo, o cómo te sientes ahora (opcional)',
      noteHelper: 'Sólo podrá verlo tu mentor',
      submitCta: 'Enviar',
      skipCta: 'Ahora no',
    },

    moodOptions: [
      { id: 'muy-mal', label: 'Muy mal' },
      { id: 'mal', label: 'Mal' },
      { id: 'regular', label: 'Regular' },
      { id: 'bien', label: 'Bien' },
      { id: 'muy-bien', label: 'Muy bien' },
    ],

    defaultState: {
      selectedMood: 'muy-bien',
      selectedTalkOption: null,
      note: '',
    },

    routes: {
      onSubmit: '../home/index.html',
      onSkip: '../home/index.html',
    },

    saving: {
      message: 'Estamos guardando tu sesión',
      delayMs: 1400,
    },
  };
})();

