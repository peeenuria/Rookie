/**
 * Historia 1.3 — Selección de plan y pago
 * Fuente: DECATHLON Design Library — Explorations
 */
(function () {
  window.FIGMA_1_3 = {
    ...(window.FIGMA_1_3 || {}),
    planSelection: window.FIGMA_1_3?.planSelection || {
      nodeId: '13131:122287',
      title: 'Activa tu cuenta Rookie',
      subtitle: 'Elige tu tipo de suscripción para empezar a crear hábitos desde hoy mismo',
      hint: 'Selecciona una opción para continuar',
      submitCta: 'Activar suscripción',
      footerNote: 'No se te cobrará hasta que acabe tu periodo de prueba.',
      plans: [
        {
          id: 'annual',
          name: 'Anual',
          detail: '59,99€ al año',
          price: '5€/mes',
          note: 'Ahorras un 40%',
          badge: 'MÁS POPULAR',
        },
        {
          id: 'monthly',
          name: 'Mensual',
          detail: '9,99€ al mes',
          price: '9,99€/mes',
        },
        {
          id: 'rookie-promo',
          name: 'Promoción Rookie',
          detail: 'Después, 3,99€/mes',
          priceLines: ['3 meses', 'GRATIS'],
          badge: 'GRATIS CON TUS ZAPATILLAS',
        },
      ],
    },
    subscriptionSummary: {
      nodeId: '13105:7394',
      variants: {
        none: {
          propiedad1: 'Ninguno',
          lines: ['Selecciona una opción para continuar'],
        },
        monthly: {
          propiedad1: 'Mensual',
          lines: ['9,99€ al mes · Cancela cuando quieras'],
        },
        annual: {
          propiedad1: 'Anual',
          lines: [
            '59,99€ al año (5€/mes) · Ahorras un 40%',
            'Puedes cancelar la renovación automática en cualquier momento, pero no se realizan reembolsos parciales del periodo ya pagado.',
          ],
        },
        'rookie-promo': {
          propiedad1: 'Promoción Rookie',
          lines: ['Gratis 3 meses, después 3,99€/mes'],
        },
      },
      planToVariant: {
        monthly: 'monthly',
        annual: 'annual',
        'rookie-promo': 'rookie-promo',
      },
    },
    /** Destino al pulsar «Activar suscripción» según plan */
    planActivationRoutes: {
      monthly: 'payment-method',
      annual: 'payment-method',
      'rookie-promo': 'code-bridge',
    },
    paymentMethod: {
      title: 'Elige tu método de pago',
      secureBadge: 'Pago seguro',
      continueCta: 'Continuar',
      planCard: {
        monthly: {
          name: 'Plan mensual',
          detail: 'Mentor real + plan adaptado',
          price: '9,99 €',
        },
        annual: {
          name: 'Plan anual',
          detail: 'Mentor real + plan adaptado',
          price: '59,99 €',
        },
      },
      methods: [
        {
          id: 'card',
          label: 'Tarjeta de crédito o débito',
          icon: 'credit-card',
        },
        {
          id: 'apple-pay',
          label: 'Apple Pay',
          icon: 'apple',
        },
        {
          id: 'google-pay',
          label: 'Google Pay',
          icon: 'google',
        },
      ],
      nativeSheet: {
        apple: {
          title: 'Apple Pay',
          subtitle: 'Confirma con Face ID',
          amountLabel: 'Total',
          confirmCta: 'Pagar con Apple Pay',
        },
        google: {
          title: 'Google Pay',
          subtitle: 'Confirma el pago',
          amountLabel: 'Total',
          confirmCta: 'Pagar con GPay',
        },
        delayMs: 900,
      },
    },
    paymentGateway: {
      nodeId: '13131:119766',
      title: 'Introduce tu tarjeta',
      secureBadge: 'Pago seguro',
      fields: {
        cardNumber: {
          label: 'Número de tarjeta',
          placeholder: 'Introduce tu número de tarjeta',
        },
        expiry: {
          label: 'Caducidad',
          placeholder: 'MM/AA',
        },
        cvv: {
          label: 'CVV',
          placeholder: 'CVV',
          hint: 'Los 3 dígitos del reverso de tu tarjeta',
        },
        name: {
          label: 'Nombre en la tarjeta',
          placeholder: 'Introduce el nombre en la tarjeta',
        },
      },
      submitCta: 'Confirmar pago',
      validation: {
        invalidCard: 'Número de tarjeta no válido',
        invalidExpiry: 'Fecha de caducidad no válida',
        invalidCvv: 'CVV no válido',
        emptyName: 'Introduce el nombre en la tarjeta',
      },
    },
    paymentSuccess: {
      nodeId: '13131:120417',
      backgroundAsset: 'assets/figma/00894639df2a6c80042567ef9f2be07fa3cb4e99.png',
      logoMarkAsset: 'assets/figma/a753978066777fae7f29ea51c479ea0291159145.svg',
      logoWordmarkAsset: 'assets/figma/282d48214648aa57922761a19baec4b882fcacb6.svg',
      titleLines: ['Tu cambio empieza', 'ahora'],
      subtitleLines: ['Ya tienes cuenta.', 'Solo necesitamos conocerte un poco mejor.'],
      continueCta: 'Continuar',
    },
    storageKeys: {
      selectedPlan: 'rookie-selected-plan',
      paymentValidated: 'rookie-payment-validated',
    },
  };
})();
