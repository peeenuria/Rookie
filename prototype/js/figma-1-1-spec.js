/**
 * Historia 1.1 — Activación / Registro
 * Fuente: DECATHLON Design Library — Explorations (canvas 12462:30)
 */
window.FIGMA_1_1 = {
  canvasNodeId: '12462:30',
  screens: {
    splash: '13057:955',
    walkthrough1: '13060:2053',
    walkthrough2: '13062:1010',
    walkthrough3: '13063:7825',
    walkthrough4: '13063:7855',
    walkthrough5: '13063:7885',
    walkthrough6: '13063:7915',
    signupEmpty: '13065:8234',
    signupError: '13131:129024',
    codeBridge: '13131:120001',
    codeManual: '13131:119924',
    codeManualError: '13131:119972',
    codeScanner: '13131:120060',
  },

  splash: {
    brandName: 'Rookie',
    logoAsset: '../assets/figma/7c9571ea0b13966b9119ca3f361fe1d0fbdb207e.svg',
  },

  walkthrough1: {
    backgroundAsset: '../assets/figma/70ca598b9333bef592577c78f03945417c1517bd.png',
    logoMarkAsset: '../assets/figma/a753978066777fae7f29ea51c479ea0291159145.svg',
    logoWordmarkAsset: '../assets/figma/282d48214648aa57922761a19baec4b882fcacb6.svg',
    titleLines: ['Empezar es lo difícil', 'Por eso no lo haces solo'],
    primaryCta: 'Comenzar',
    loginPrefix: '¿Ya tienes cuenta?',
    loginLink: 'Iniciar sesión',
  },

  walkthroughSlides: {
    'walkthrough-2': {
      nodeId: '13062:1010',
      heroPhotoAsset: '../assets/figma/b0d74ea71ea2e2ce5e455ef16e4c7e8495adb6bf.png',
      paginationActive: 0,
      title: '¿Qué es Rookie?',
      subtitle: 'Una app de running, un mentor real, y cero presión por rendir.',
      description:
        'Correr una vez es fácil. Seguir corriendo, no. Por eso hay alguien contigo en cada paso del camino',
    },
    'walkthrough-3': {
      nodeId: '13063:7825',
      heroPhotoAsset: '../assets/figma/08f4094c188995469203417bb4d3e4a8d1bc83cd.png',
      paginationActive: 1,
      titleLines: ['Plan de entrenamiento', 'personalizado'],
      subtitle:
        'Un plan que empieza desde donde estás ahora mismo, no donde “deberías estar”.',
      description:
        'Nada de tablas genéricas de internet. Tu plan se ajusta a tu ritmo real, semana a semana.',
    },
    'walkthrough-4': {
      nodeId: '13063:7855',
      heroPhotoAsset: '../assets/figma/e9aea86477876cf6650d2142a10a7b46d4657d20.png',
      paginationActive: 2,
      title: 'Siempre acompañado',
      subtitle: 'Un mentor real te acompaña desde el primer día',
      description: 'Tu mentor sigue tu progreso de verdad, y nota si dejas de aparecer',
    },
    'walkthrough-5': {
      nodeId: '13063:7885',
      heroPhotoAsset: '../assets/figma/61857ba7a8d183e9fe1c92b43e17459e479a79b4.png',
      paginationActive: 3,
      title: 'Crea hábitos duraderos',
      subtitle:
        'El running no se abandona un día. Se abandona en silencio, semana a semana.',
      description:
        '8 de cada 10 abandonan antes de los 6 meses. Nosotros vamos a ser la razón por la que sigas.',
    },
    'walkthrough-6': {
      nodeId: '13063:7915',
      heroPhotoAsset: '../assets/figma/a96a9dd48da134472114d1c1f3fd28bbda089873.png',
      paginationActive: 4,
      title: 'Nadie nace enseñado',
      subtitle: 'No hace falta ser deportista para empezar',
      description:
        'No importa de dónde partas. Lo único que importa es que has decidido dar el primer paso',
      hideSkip: true,
    },
  },

  walkthroughSlideDefaults: {
    paginationTotal: 5,
    primaryCta: 'Continuar',
    skipLabel: 'Saltar',
  },

  navigation: {
    splashLogoEnterMs: 650,
    splashHoldAfterLogoMs: 500,
    splashCrossfadeMs: 350,
    pageDotTransitionMs: 220,
  },

  signup: {
    title: 'Crear cuenta',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Escribe aquí tu correo',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Escribe aquí tu contraseña',
    passwordHint: 'La contraseña debe tener por lo menos 8 caracteres.',
    primaryCta: 'Crear cuenta',
    privacyPrefix: 'Al crear tu cuenta, aceptas nuestros procesos de registro y ',
    privacyLink: 'Política de Privacidad',
    googleCta: 'Continuar con Google',
    appleCta: 'Continuar con Apple',
    loginPrefix: '¿Ya tienes cuenta? ',
    loginLink: 'Iniciar sesión',
    icons: {
      google: '../assets/social/google.svg',
      apple: '../assets/social/apple.svg',
    },
  },

  signupValidation: {
    invalidEmail: 'Introduce un correo electrónico válido',
    registeredPrefix: 'Ya existe una cuenta con este correo. ',
    registeredLink: 'Inicia sesión',
  },

  signupMock: {
    registeredEmails: ['pemanu@barreira.edu.com'],
  },

  codeActivation: {
    bridge: {
      nodeId: '13131:120001',
      title: 'Escanea el código de barras de tus zapatillas',
      instructions: 'Puedes encontrar tu código de tu ticket de compra de Decathlon',
      illustrationAsset: '../assets/figma/3a6cac7e7b10898d920f9a8e8e1b40bbd190e817.png',
      scanCta: 'Escanear código de barras',
      manualHelperLines: [],
      manualCta: 'Introducir código manualmente',
    },
    manual: {
      nodeId: '13131:119924',
      titleLines: ['Introduce tu código de', 'barras manualmente'],
      instructions:
        'Encontrarás el código numérico justo debajo del código de barras impreso en tu ticket',
      fieldLabel: 'Código de compra',
      fieldPlaceholder: 'Introduce tu código',
      fieldHint: 'El código debe tener 13 dígitos',
      submitCta: 'Validar código de barras',
      backLabel: 'Volver',
    },
    scanner: {
      nodeId: '13131:120060',
      /* FotoTicket — Figma 13586:2007 (mock de cámara) */
      previewMockAsset: '../assets/figma/3f90320c3659979e00c51180390473f3c20c092a.png',
      backLabel: 'Volver',
      permissionTitle: '“Rookie” quiere acceder a la cámara',
      permissionMessage:
        'Esto permite escanear el código de barras de tu ticket de compra de Decathlon.',
      permissionDeny: 'No permitir',
      permissionAllow: 'Permitir',
      mockScanDelayMs: 3200,
      successCheckMs: 450,
      successHoldMs: 700,
      sheetFixedHeightPx: 438,
      frameTopPx: 152,
      frameWidthPx: 269,
      frameHeightPx: 148,
      success: {
        nodeId: '13131:120291',
        frameVariant: 'success',
      },
      sheetStates: {
        standard: {
          nodeId: '13131:120025',
          title: 'Cómo escanear',
          text: 'Busca el código de barras en tu ticket y enfócalo con la cámara',
          illustrationAsset: '../assets/figma/d3fd7de9767f3c0cc0b434d8558dea64e9ee64c7.png',
          frameVariant: 'neutral',
          bodyGap: 18,
          footer: {
            type: 'manual',
            helperLines: [
              '¿Problemas para escanear?',
              'No pasa nada, introdúcelo a mano.',
            ],
            cta: 'Introducir código manualmente',
          },
          allowRetryOnClose: false,
          sheetPinned: true,
        },
        readError: {
          nodeId: '13131:120312',
          titleLines: ['No hemos podido', 'leer el código'],
          text: 'Asegúrate de que el código se vea completo, enfocado y con buena luz, e inténtalo de nuevo',
          illustrationAsset: '../assets/figma/09c9b822ae3451c165e2070293926b6cd67cd749.png',
          frameVariant: 'error',
          frameErrorIcon: 'x',
          viewportBlur: true,
          bodyGap: 12,
          footer: {
            type: 'manual',
            helperLines: [
              '¿Problemas para escanear?',
              'No pasa nada, introdúcelo a mano.',
            ],
            cta: 'Introducir código manualmente',
          },
          allowRetryOnClose: false,
          sheetPinned: true,
        },
        alreadyUsed: {
          nodeId: '13131:120355',
          titleLines: ['Este código ya', 'ha sido utilizado'],
          text: 'Parece que esta compra ya activó una cuenta. Si crees que es un error, contacta con soporte.',
          illustrationAsset: '../assets/figma/42fa5688f9323c58431bb4c398d69605ffcac581.png',
          frameVariant: 'error',
          frameErrorIcon: 'x',
          viewportBlur: true,
          viewportOverlayAsset: '../assets/figma/3f90320c3659979e00c51180390473f3c20c092a.png',
          viewportOverlayStyle: {
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
          },
          bodyGap: 12,
          footer: {
            type: 'support',
            supportPrefix: 'Contactar con ',
            supportEmail: 'soporte@decathlon.com',
          },
          allowRetryOnClose: false,
          sheetPinned: true,
        },
        invalid: {
          nodeId: '13131:120333',
          title: 'Este código no es válido',
          text: 'No corresponde a una compra de Decathlon. Revisa que sea el ticket correcto e inténtalo de nuevo.',
          illustrationAsset: '../assets/figma/09c9b822ae3451c165e2070293926b6cd67cd749.png',
          frameVariant: 'error',
          frameErrorIcon: 'x',
          viewportBlur: true,
          viewportOverlayAsset: '../assets/figma/3f90320c3659979e00c51180390473f3c20c092a.png',
          viewportOverlayStyle: {
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
          },
          bodyGap: 12,
          footer: {
            type: 'manual',
            helperLines: [
              '¿Problemas para escanear?',
              'No pasa nada, introdúcelo a mano.',
            ],
            cta: 'Introducir código manualmente',
          },
          allowRetryOnClose: false,
          sheetPinned: true,
        },
      },
    },
    scannerScreenDemos: {
      'code-scanner-screen-standard': 'standard',
      'code-scanner-screen-success': 'success',
      'code-scanner-screen-read-error': 'readError',
      'code-scanner-screen-already-used': 'alreadyUsed',
      'code-scanner-screen-invalid': 'invalid',
    },
    scannerSheetDemos: {
      'code-scanner-sheet-standard': 'standard',
      'code-scanner-sheet-read-error': 'readError',
      'code-scanner-sheet-already-used': 'alreadyUsed',
      'code-scanner-sheet-invalid': 'invalid',
    },
    validation: {
      codeLength: 13,
      invalidCode: 'Este código no es válido, revisa que esté bien escrito',
      invalidFormat: 'El código debe tener 13 dígitos',
    },
    mock: {
      validCodes: ['1234567890123'],
      invalidCodes: ['0000000000000'],
      usedCodes: ['8888888888888'],
    },
    storageKeys: {
      codeValidated: 'rookie-code-validated',
    },
  },

  signupDemos: {
    'signup-demo-invalid-email': {
      emailValue: 'correo-sin-formato',
      passwordValue: '12345678',
      showEmailError: 'invalid',
    },
    'signup-demo-email-registered': {
      emailValue: 'pemanu@barreira.edu.com',
      passwordValue: '12345678',
      showEmailError: 'registered',
    },
    'signup-demo-password-short': {
      emailValue: 'nuevo@decathlon.com',
      passwordValue: 'abc',
      showPasswordError: true,
    },
  },
};
