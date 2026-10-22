/**
 * Historia 1.4 — Perfilado
 * Fuente: DECATHLON Design Library — Explorations
 */
(function () {
  window.FIGMA_1_4 = {
    stepper: {
      steps: [
        { id: 'personal', label: 'Info personal', icon: 'notepad-text' },
        { id: 'motivations', label: 'Motivaciones', icon: 'land-plot' },
        { id: 'summary', label: 'Mentores', icon: 'id-card-lanyard' },
      ],
    },
    personalInfo: {
      nodeId: '13131:122334',
      continueCta: 'Aceptar y continuar',
      fields: {
        firstName: {
          label: 'Nombre',
          requiredLabel: '(obligatorio)',
          placeholder: '¿Cómo te llamas?',
        },
        lastName: {
          label: 'Apellidos',
          requiredLabel: '(obligatorio)',
          placeholder: 'Índicanos tus apellidos',
          helper: 'Podrás cambiar tu información personal más adelante desde tu perfil',
        },
        birthDate: {
          label: 'Fecha de nacimiento',
          requiredLabel: '(obligatorio)',
          placeholder: 'DD/MM/AAAA',
          helper: 'Nos ayuda a ajustar el plan según tu edad',
        },
        gender: {
          label: 'Género',
          requiredLabel: '(obligatorio)',
          options: ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'],
        },
        height: {
          label: 'Estatura en centímetros',
          requiredLabel: '(obligatorio)',
          placeholder: '¿Cuánto mides?',
        },
        weight: {
          label: 'Peso en kilogramos',
          requiredLabel: '(obligatorio)',
          placeholder: '¿Cuál es tu peso?',
          helper: 'Estos datos nos ayudan a ajustar tu plan de entrenamiento',
        },
      },
    },
    motivations: {
      nodeId: '13131:122345',
      title: 'Define tu camino',
      subtitle:
        'Cada corredor es diferente. Cuéntanos qué buscas y crearemos un plan que se adapte a ti y a tu objetivo.',
      continueCta: 'Continuar',
      questions: [
        {
          id: 'mainGoal',
          label: '¿Cuál es tu principal objetivo?',
          type: 'single',
          options: [
            'Perder peso',
            'Mejorar mi salud',
            'Tonificarme',
            'Mantenerme en forma',
            'Relajarme',
            'Crear hábito',
            'Mejorar capacidades físicas',
            'Progresar en mi deporte',
            'Otro',
          ],
        },
        {
          id: 'alsoAchieve',
          label: '¿Qué más te gustaría lograr con nosotros?',
          type: 'multi',
          minSelections: 1,
          options: [
            'Rendimiento',
            'Constancia',
            'Disfrute',
            'Resistencia física',
            'Quemar calorías',
            'Técnica',
            'Correr una carrera',
            'Otro',
          ],
        },
        {
          id: 'ranBefore',
          label: '¿Has corrido antes?',
          type: 'single',
          options: ['Nunca', 'Hace tiempo', 'Recientemente'],
        },
        {
          id: 'fitnessLevel',
          label: '¿Cómo describirías tu forma física?',
          type: 'single',
          options: ['Sedentario', 'Activo ocasional', 'Activo regular'],
        },
        {
          id: 'motivation',
          label: '¿Qué te motiva más?',
          type: 'single',
          options: ['Estructura', 'Retos', 'Diversión', 'Compañía', 'Resultados', 'Desconectar'],
        },
        {
          id: 'sessionTime',
          label: '¿Cuánto tiempo puedes dedicar por sesión?',
          type: 'single',
          options: ['30 min', '45 min', '1h'],
        },
        {
          id: 'weeklyFrequency',
          label: '¿Con qué frecuencia quieres empezar?',
          type: 'single',
          options: ['1 vez por semana', '2 veces por semana', '3 veces por semana'],
        },
        {
          id: 'trainingDays',
          label: '¿Qué días te vienen mejor para entrenar?',
          type: 'multi',
          minSelections: 1,
          options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        },
        {
          id: 'startDistance',
          label: '¿Con qué distancia empezamos?',
          type: 'single',
          options: ['2K', '2,5K', '3K', '3,5K', '4K'],
        },
        {
          id: 'preferredTime',
          label: '¿Cuándo prefieres entrenar?',
          type: 'single',
          options: ['Mañana', 'Mediodía', 'Tarde', 'Noche', 'Indiferente'],
        },
        {
          id: 'health',
          label:
            '¿Hay algo que debamos saber sobre tu salud? (lesiones, problemas cardíacos, respiratorios, articulares, etc.)',
          hint: 'Esta información es opcional y únicamente la verá tu mentor para adaptar tu plan de forma segura',
          type: 'health',
          options: ['Sí', 'No', 'Prefiero no decirlo'],
          textWhen: 'Sí',
          textPlaceholder: 'Cuéntanos brevemente qué debemos tener en cuenta',
        },
      ],
    },
    summary: {
      title: 'Resumen',
      message: 'Has completado tu perfilado. El siguiente paso será revisar tu resumen.',
    },
    storageKeys: {
      personalInfo: 'rookie-profiling-personal',
      motivations: 'rookie-profiling-motivations',
      completed: 'rookie-profiling-completed',
    },
  };
})();
