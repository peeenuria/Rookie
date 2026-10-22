/**
 * Historia 1.2 — Consentimiento de datos
 * Fuente: DECATHLON Design Library — Explorations
 */
(function () {
  const consentCopy = {
    title: 'Tu privacidad nos importa',
    intro:
      'Usamos tus datos para conectarte con Decathlon y con tu mentor. Puedes retirar tu consentimiento cuando quieras desde ajustes.',
    termsLabel: {
      beforeLink: 'Acepto los ',
      linkText: 'Términos y Condiciones*',
      afterLink: ' y que ',
      brand: 'Decathlon',
      afterBrand: ' use mis datos para que el servicio funcione correctamente',
    },
    newsletterLabel:
      'Me gustaría recibir newsletters con consejos y productos relacionados con mi actividad',
    requiredHint: '*Campos obligatorios',
    illustrationAsset: 'assets/figma/consent-privacy-mascot.png',
    moreInfoCta: 'Más información',
    acceptCta: 'Aceptar y continuar',
  };

  window.FIGMA_1_2 = {
    consentDefault: {
      nodeId: '13131:112989',
      ...consentCopy,
      termsChecked: false,
      newsletterChecked: false,
      acceptDisabled: true,
    },
    consentActive: {
      nodeId: '13131:113005',
      ...consentCopy,
      termsChecked: true,
      newsletterChecked: true,
      acceptDisabled: false,
    },
    privacyMoreInfoSheet: {
      nodeId: '13131:122185',
      title: 'Cómo usamos tus datos',
      sections: [
        {
          number: 1,
          heading: 'Responsable del tratamiento',
          paragraphs: [
            'El responsable del tratamiento de los datos personales recogidos a través de la aplicación Rookie es [Razón social de la entidad], en adelante "Rookie" o "nosotros", en colaboración con Decathlon España, S.A.U. como socio estratégico de distribución y activación del servicio.',
          ],
        },
        {
          number: 2,
          heading: 'Datos que recabamos',
          paragraphs: [
            'De conformidad con el principio de minimización de datos, recabamos exclusivamente la siguiente información:',
          ],
          list: [
            'a) Datos identificativos: nombre, apellidos, fecha de nacimiento y género.',
            'b) Datos de contacto: dirección de correo electrónico.',
            'c) Datos de salud y condición física, cuando el usuario opte por facilitarlos voluntariamente, con la finalidad exclusiva de personalizar el plan de entrenamiento.',
            'd) Datos de actividad deportiva: sesiones de carrera, distancia, duración y progreso registrado.',
            'e) Datos derivados de la compra en establecimientos Decathlon, a efectos de verificación de la activación del servicio.',
          ],
        },
        {
          number: 3,
          heading: 'Finalidad del tratamiento',
          paragraphs: ['Los datos serán tratados con las siguientes finalidades:'],
          list: [
            'a) Gestionar el alta y funcionamiento de la cuenta de usuario.',
            'b) Elaborar y actualizar un plan de entrenamiento personalizado.',
            { text: 'c) Facilitar la asignación y comunicación con un mentor.', emphasis: true },
            'd) Verificar la vinculación del usuario con una compra realizada en Decathlon.',
            'e) Enviar comunicaciones informativas, únicamente cuando el usuario haya prestado su consentimiento expreso para ello.',
          ],
        },
        {
          number: 4,
          heading: 'Base jurídica del tratamiento',
          paragraphs: [
            'El tratamiento de los datos se fundamenta en el consentimiento expreso del usuario (art. 6.1.a del Reglamento (UE) 2016/679, RGPD), así como en la ejecución del contrato de prestación de servicios suscrito al aceptar las presentes condiciones.',
          ],
        },
        {
          number: 5,
          heading: 'Comunicación de datos a terceros',
          paragraphs: [
            'Los datos estrictamente necesarios para la verificación de la compra serán comunicados a Decathlon España, S.A.U. Rookie no cede, vende ni comunica datos personales a terceros con fines publicitarios.',
          ],
        },
        {
          number: 6,
          heading: 'Plazo de conservación',
          paragraphs: [
            'Los datos se conservarán mientras la cuenta permanezca activa y, tras su baja, durante el plazo legalmente exigible para atender eventuales responsabilidades derivadas del tratamiento, no superior a 30 días salvo obligación legal en contrario.',
          ],
        },
        {
          number: 7,
          heading: 'Derechos del usuario',
          paragraphs: [
            'El usuario podrá ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar su consentimiento sin que ello afecte a la licitud del tratamiento previo, a través del apartado Ajustes → Privacidad, o dirigiéndose a {{email}}',
          ],
          email: 'privacidad@rookie.app',
        },
        {
          number: 8,
          heading: 'Modificaciones',
          paragraphs: [
            'Rookie se reserva el derecho a modificar la presente política para adaptarla a novedades legislativas. Cualquier modificación relevante será comunicada al usuario con carácter previo a su entrada en vigor.',
          ],
        },
      ],
    },
  };
})();
