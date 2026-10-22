/**
 * Fase 0 — Especificación extraída del frame Figma 4.2 (node 12641:2222)
 * Fuente: DECATHLON Design Library — Explorations
 */
window.FIGMA_4_2 = {
  frameNodeId: '12641:2222',
  screens: {
    agenda: '12641:460',
    pickDay: '12964:1119',
    dayWithSlots: '12641:570',
    slotSelected: '12641:685',
    confirmSlot: '12641:800',
    confirmed: '12641:917',
    slotConfirmToast: '12964:3745',
    sinHuecosEmpty: '12964:1872',
    sinHuecos: '12641:1079',
    slotOcupadoToast: '12641:2221',
  },

  /** Estados 4.2.1 → 4.2.4 en una sola vista (máquina de estados) */
  pickerStates: ['pickDay', 'dayWithSlots', 'slotSelected', 'confirmSlot'],

  copy: {
    title: 'Primera sesión',
    subtitle: 'Cuéntale quién eres y marcad objetivos juntos',
    meta: '30 minutos - Videollamada',
    pickDayQuestion: 'Selecciona día y hora',
    slotsLabel: 'Horarios disponibles',
    slotConfirmToast: '¡Cita confirmada!',
    sinHuecosTemplate:
      '{firstName} no tiene huecos disponibles esta semana.\n¡Prueba con la siguiente!',
  },

  buttons: {
    confirm: 'Confirmar cita',
    goToPlan: 'Ir a tu plan',
    addToCalendar: 'Añadir al calendario',
  },

  confirmed: {
    title: '¡Cita confirmada!',
    subtitleTemplate: '{firstName} ya lo sabe.',
    /** Figma 4.2.5 — segunda línea (referencia happy path) */
    meetLineTemplate: '¡Nos vemos el {weekday}!',
    card: {
      mentorNameFromMentor: true,
      dateLabel: 'Martes, 23 de Junio',
      time: '19:00',
      format: 'Google Meet',
    },
  },

  /** Edge case — sin huecos esta semana (Figma 12641:1079) */
  sinHuecos: {
    /** Días deshabilitados: borde neutral-300, texto neutral-300 */
    dayState: 'disabled',
  },

  /** Edge case — slot ocupado al confirmar (Figma 12641:2221) */
  slotOcupado: {
    message: '¡Vaya! Parece que este horario ya no está disponible. Elige otro.',
    /** Slot que falla al confirmar en ?scenario=slot-ocupado */
    occupiedSlot: '11:00',
  },

  /**
   * Sin conexión en 4.2 — reutiliza patrón 4.1.1 (FIGMA_4_1.sinConexion)
   * Query: ?scenario=sin-conexion#appointment
   */

  scenarios: {
    sinHuecos: 'sin-huecos',
    slotOcupado: 'slot-ocupado',
    sinConexion: 'sin-conexion',
  },

  selector: {
    monthBanner: {
      background: 'var(--background-default)',
      color: 'var(--color-neutral-500)',
      height: 48,
      borderRadius: 8,
    },
    dayCell: {
      width: 49,
      height: 64,
      borderRadius: 8,
      default: {
        background: 'var(--background-default)',
        border: 'var(--color-neutral-500)',
        color: 'var(--color-neutral-500)',
      },
      selected: {
        background: 'var(--color-brand-600)',
        border: 'var(--color-brand-600)',
        color: 'var(--content-on-brand)',
      },
      disabled: {
        background: 'var(--background-default)',
        border: 'var(--color-neutral-300)',
        color: 'var(--color-neutral-300)',
      },
    },
    slot: {
      columns: 4,
      gapX: 6,
      gapY: 8,
      minHeight: 46,
      borderRadius: 8,
      default: {
        background: 'var(--background-default)',
        border: 'var(--color-neutral-500)',
        color: 'var(--color-neutral-500)',
      },
      selected: {
        background: 'var(--color-brand-600)',
        border: 'var(--color-brand-600)',
        color: 'var(--content-on-brand)',
      },
    },
    chevron: {
      /** Figma 12964:1130–1132 — lucide/chevron-left|right, 16×16 */
      size: 16,
      left: 'assets/figma/23f48e55da2881401d27cd061769dc8f5c0d1391.svg',
      right: 'assets/figma/4d79fee76d191a0e42af056644e53657336b0a72.svg',
    },
  },

  layout: {
    headerOffsetX: 20,
    bodyOffsetX: 14,
    headerGap: 12,
    bodyGap: 14,
    avatarSize: 150,
    avatarBg: 'var(--color-brand-100)',
    confirmedGap: 13,
    reminderCardPadding: 16,
    reminderRowGap: 24,
    reminderIconGap: 20,
  },

  assets: {
    /** Avatar 4.2 — reutiliza foto card del mentor (150×150, object-contain) */
    avatarUsesMentorCardPhoto: true,
    checkmark: 'assets/figma/bd591e33b14ce0a94a2908b4e9848eacbe564e76.svg',
    reminderIcons: {
      user: 'assets/figma/e8716fe554a13e1076c4944ab4fd3236a96895da.svg',
      calendar: 'assets/figma/b6b9e30dc9891a7b4ba89139b747fe610c441db2.svg',
      clock: 'assets/figma/cc2b33d436433d51dff81e2650bf22078a51630d.svg',
      video: 'assets/figma/d6544607d7a833d3a4c9ff475b77232c7ca36c42.svg',
    },
    toast: {
      alert: 'assets/figma/e356d82336ba4970a9fc761b91c2622f3236230c.svg',
      close: 'assets/figma/25a00030cac82c12541e9ef916ccb6207f460d4a.svg',
    },
  },

  /**
   * Mock de disponibilidad — calendario gregoriano real (appointment-picker.js)
   *
   * Grid: 8 slotTimes por día (4 columnas × 2 filas).
   * Cada día define qué horarios están LIBRES; el resto se muestran ocupados (disabled).
   *
   * Perfiles por weekOffset (semana actual = 0):
   *
   * | Offset | Perfil       | Comportamiento                                        |
   * |--------|--------------|-------------------------------------------------------|
   * | 0      | variable     | Disponibilidad mixta fija por día (daySlotAvailability)|
   * | +1     | variableAlt  | Mismo patrón variable que +4                            |
   * | +2     | partialDays  | L y J inhabilitados; resto con 8 slots                  |
   * | +3     | sinHuecos    | Ningún slot → mensaje edge case                       |
   * | +4     | variableAlt  | Patrón variable distinto (daySlotAvailability.variableAlt) |
   * | +5…+8  | full         | Todos los días con 8 slots                            |
   *
   * ?scenario=sin-huecos → abre en scenarioWeekOffsets.sinHuecos (+3)
   */
  availability: {
    maxWeeksForward: 8,
    defaultWeekProfile: 'full',

    /** Los 8 horarios del grid (4×2) — siempre se renderizan; libres vs ocupados por día */
    slotTimes: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'],

    weekProfiles: {
      0: 'full',
      1: 'full',
      2: 'full',
      3: 'sinHuecos',
      4: 'full',
    },

    weekProfileTypes: {
      full: {
        description: 'Todos los días con los 8 slots libres (mock sin restricciones)',
        mode: 'all',
      },
      sinHuecos: {
        description: 'Semana vacía — activa mensaje sin huecos',
        mode: 'none',
      },
    },

    /**
     * Mock: todos los slots seleccionables.
     * Perfiles de patrón conservados solo como referencia histórica.
     */
    daySlotAvailability: {},

    scenarioWeekOffsets: {
      sinHuecos: 3,
    },
  },
};
