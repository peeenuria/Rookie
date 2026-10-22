/**
 * Catálogo de sesiones del plan — fuente única de datos para Home y Detalle.
 */
(function () {
  const monthNames = window.DateFormat?.monthNames ?? [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const weekdayNamesCapitalized = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const weekdayNamesLowercase = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  const statLabels = {
    targetDistanceLabel: ['Distancia', 'objetivo'],
    targetTimeLabel: ['Tiempo', 'objetivo'],
    weeklySessionLabel: 'Sesión semanal',
  };

  const defaultHeroPhoto = 'assets/figma-session-detail/918716ba28df3bf7a83c0b018937531ff1a05a18.png';

  const defaultMentor = {
    name: 'MAXIMILIANO ETXEBARRIA-GOIKOETXEA',
    role: 'Especialista en resistencia y prevención de lesiones a largo plazo',
    photo: 'assets/mentors/mentor-3.png',
    recordatorioPhoto: 'assets/mentors/photo-block-cardespecialidad-maximiliano.png',
    photoObjectPosition: '50% 6%',
  };

  /** Fecha real del sistema — el catálogo mock se ancla a partir de aquí
   * (hoy = primera salida) en vez de fechas de calendario fijas, para que
   * "primera salida" siga siendo genuinamente la sesión de hoy conforme
   * pasan los días, no una fecha concreta que quede en el pasado. */
  const referenceDateIso = window.DateFormat?.getTodayIso
    ? window.DateFormat.getTodayIso()
    : (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      })();

  function offsetIso(baseIso, days) {
    const [y, m, d] = baseIso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }

  const CATALOG_DATE_DAY0 = offsetIso(referenceDateIso, 0);
  const CATALOG_DATE_DAY2 = offsetIso(referenceDateIso, 2);
  const CATALOG_DATE_DAY4 = offsetIso(referenceDateIso, 4);

  /** @type {Record<string, object>} */
  const catalog = {
    [CATALOG_DATE_DAY0]: {
      id: CATALOG_DATE_DAY0,
      dateIso: CATALOG_DATE_DAY0,
      sesionNombre: 'Primera salida',
      targetDistance: '2 km',
      targetTime: '45 min',
      weeklyIndex: 1,
      weeklyTotal: 2,
      heroPhoto: defaultHeroPhoto,
      mentor: {
        ...defaultMentor,
        advice:
          'Es normal sentir algo de nervios. Para esta primera salida no busques nada, solo familiarizarte con el ritmo. Camina si lo necesitas, no hay prisa. Si puedes hablar mientras corres, vas al ritmo correcto.',
      },
      accordion: [
        {
          id: 'warmup',
          title: 'Calentamiento',
          subtitle: '5 minutos',
          step: '1',
          items: ['Marcha a paso ligero', 'Deja que tu cuerpo entre en calor poco a poco'],
          defaultExpanded: false,
        },
        {
          id: 'exercise',
          title: 'Ejercicio',
          subtitle: '7 repeticiones - 35 minutos',
          step: '2',
          items: ['Corre a ritmo cómodo — 2 min', 'Camina y recupera — 3 min'],
          defaultExpanded: true,
        },
        {
          id: 'cooldown',
          title: 'Enfriamiento',
          subtitle: '5 minutos',
          step: '3',
          items: ['Marcha suave', 'Estiramientos ligeros'],
          defaultExpanded: false,
        },
      ],
    },
    [CATALOG_DATE_DAY2]: {
      id: CATALOG_DATE_DAY2,
      dateIso: CATALOG_DATE_DAY2,
      sesionNombre: 'Segunda salida',
      targetDistance: '2,5 km',
      targetTime: '40 min',
      weeklyIndex: 2,
      weeklyTotal: 2,
      heroPhoto: defaultHeroPhoto,
      mentor: {
        ...defaultMentor,
        advice:
          'En esta segunda salida puedes alargar un poco los tramos de carrera. Mantén la respiración tranquila y escucha a tu cuerpo: si necesitas caminar, hazlo sin culpa.',
      },
      accordion: [
        {
          id: 'warmup',
          title: 'Calentamiento',
          subtitle: '5 minutos',
          step: '1',
          items: ['Trote suave', 'Movilidad de tobillos y caderas'],
          defaultExpanded: false,
        },
        {
          id: 'exercise',
          title: 'Ejercicio',
          subtitle: '6 repeticiones - 30 minutos',
          step: '2',
          items: ['Corre a ritmo cómodo — 3 min', 'Camina y recupera — 2 min'],
          defaultExpanded: true,
        },
        {
          id: 'cooldown',
          title: 'Enfriamiento',
          subtitle: '5 minutos',
          step: '3',
          items: ['Caminata suave', 'Estiramientos de gemelos e isquios'],
          defaultExpanded: false,
        },
      ],
    },
    [CATALOG_DATE_DAY4]: {
      id: CATALOG_DATE_DAY4,
      dateIso: CATALOG_DATE_DAY4,
      sesionNombre: 'Sesión de fuerza',
      targetDistance: '—',
      targetTime: '30 min',
      weeklyIndex: 1,
      weeklyTotal: 1,
      heroPhoto: defaultHeroPhoto,
      mentor: {
        ...defaultMentor,
        advice:
          'Prioriza la técnica sobre la carga. Cada repetición debe ser controlada. Si notas fatiga en la zona lumbar, reduce el rango o descansa antes de la siguiente serie.',
      },
      accordion: [
        {
          id: 'warmup',
          title: 'Calentamiento',
          subtitle: '8 minutos',
          step: '1',
          items: ['Activación articular', 'Sentadillas sin peso x 10'],
          defaultExpanded: false,
        },
        {
          id: 'exercise',
          title: 'Ejercicio',
          subtitle: '3 series - 20 minutos',
          step: '2',
          items: ['Sentadillas — 12 rep', 'Zancadas alternas — 10 rep/pierna', 'Plancha — 30 s'],
          defaultExpanded: true,
        },
        {
          id: 'cooldown',
          title: 'Enfriamiento',
          subtitle: '5 minutos',
          step: '3',
          items: ['Estiramientos de tren inferior', 'Respiración diafragmática'],
          defaultExpanded: false,
        },
      ],
    },
  };

  const sessionStateStoragePrefix = 'rookie.sessionState';
  const pendingToastStorageKey = 'rookie.pendingToast';
  const planStateStorageKey = 'rookie.planState';
  const defaultAvailableWeekdayIndices = [1, 3, 5];

  /** Identidad real del mentor elegido (nombre/foto), leída de sessionStorage
   * + FIGMA_4_1.mentors — el `advice` por sesión sigue viniendo del catálogo,
   * solo se sustituye la identidad para que ConsejoMentor no muestre siempre
   * al mentor mock por defecto. */
  function resolveActiveMentorIdentity() {
    let mentorId = null;
    try {
      const raw = sessionStorage.getItem('appointmentBooking');
      const booking = raw ? JSON.parse(raw) : null;
      mentorId = booking?.mentorId || sessionStorage.getItem('selectedMentorId');
    } catch (_) {
      mentorId = sessionStorage.getItem('selectedMentorId');
    }
    if (!mentorId) return null;

    const mentor = window.FIGMA_4_1?.mentors?.find((m) => m.id === mentorId);
    if (!mentor) return null;

    return {
      name: mentor.name,
      role: mentor.specialty,
      photo: mentor.photo,
      recordatorioPhoto: mentor.recordatorioPhoto,
    };
  }

  /** @type {Set<(event: { type: string }) => void>} */
  const listeners = new Set();

  function notifyListeners(type) {
    listeners.forEach((fn) => {
      try {
        fn({ type });
      } catch (_) {
        /* ignore listener errors */
      }
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function toIso(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function startOfWeekMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function getWeekdayIndex(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  /** Lunes=0 … Domingo=6, igual que getWeekdayIndex(). */
  const weekdayNameToIndex = {
    Lunes: 0,
    Martes: 1,
    Miércoles: 2,
    Jueves: 3,
    Viernes: 4,
    Sábado: 5,
    Domingo: 6,
  };

  /** Días reales elegidos en el perfilado (pregunta `trainingDays`,
   * rookie-profiling-motivations) — se usan como base antes de caer al
   * patrón fijo mock, para que el WeekSelector refleje lo que el usuario
   * indicó de verdad en vez de un lunes/miércoles/viernes hardcodeado. */
  function getProfilingTrainingDayIndices() {
    try {
      const raw = sessionStorage.getItem('rookie-profiling-motivations');
      if (!raw) return null;
      const days = JSON.parse(raw)?.trainingDays;
      if (!Array.isArray(days) || days.length === 0) return null;
      const indices = days
        .map((name) => weekdayNameToIndex[name])
        .filter((idx) => idx !== undefined);
      return indices.length > 0 ? indices : null;
    } catch (_) {
      return null;
    }
  }

  function loadPlanState() {
    try {
      const raw = sessionStorage.getItem(planStateStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.availableWeekdayIndices) && parsed.availableWeekdayIndices.length > 0) {
          return parsed;
        }
      }
    } catch (_) {
      /* ignore invalid storage */
    }
    const profilingIndices = getProfilingTrainingDayIndices();
    return { availableWeekdayIndices: profilingIndices || [...defaultAvailableWeekdayIndices] };
  }

  function savePlanState(state) {
    sessionStorage.setItem(planStateStorageKey, JSON.stringify(state));
  }

  function getAvailableWeekdayIndices() {
    return loadPlanState().availableWeekdayIndices.slice().sort((a, b) => a - b);
  }

  function setAvailableWeekdayIndices(indices) {
    const sorted = [...indices].sort((a, b) => a - b);
    savePlanState({ availableWeekdayIndices: sorted });
    reconcileSessionsToAvailability();
    notifyListeners('availability-changed');
  }

  function getReferenceWeekDates() {
    const ref = parseIso(referenceDateIso);
    const weekStart = startOfWeekMonday(ref);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }

  function getAvailableDatesInReferenceWeek() {
    const indices = new Set(getAvailableWeekdayIndices());
    const today = parseIso(referenceDateIso);
    /* Nunca asigna sesiones a días ya pasados de esta semana — para un
       usuario nuevo, "hoy" es siempre el primer slot disponible, así que
       la sesión de hoy es genuinamente "Primera salida". */
    return getReferenceWeekDates().filter((date) => indices.has(getWeekdayIndex(date)) && date >= today);
  }

  function getCatalogSessionIds() {
    return Object.keys(catalog).sort();
  }

  function isAvailabilitySkip(state) {
    return state?.status === 'skipped' && state.source === 'availability';
  }

  function isManualSkip(state) {
    return state?.status === 'skipped' && !isAvailabilitySkip(state);
  }

  function writeSessionStateSilent(sessionId, state) {
    sessionStorage.setItem(getStateStorageKey(sessionId), JSON.stringify(state));
  }

  function clearSessionStateSilent(sessionId) {
    sessionStorage.removeItem(getStateStorageKey(sessionId));
  }

  /** Fechas de la semana de referencia ocupadas por sesiones reprogramadas. */
  function getRescheduledOccupiedDateIsos() {
    const occupied = new Set();
    getCatalogSessionIds().forEach((sessionId) => {
      const state = loadSessionState(sessionId);
      if (state?.status === 'rescheduled' && state.currentDateIso) {
        occupied.add(state.currentDateIso);
      }
    });
    return occupied;
  }

  /**
   * Sesiones que compiten por slots de la semana (no reprogramadas ni saltadas a mano).
   * Incluye skips por disponibilidad previos, que se reevalúan al cambiar días.
   */
  function getRemappableSessionIds() {
    return getCatalogSessionIds().filter((sessionId) => {
      const state = loadSessionState(sessionId);
      if (state?.status === 'rescheduled') return false;
      if (isManualSkip(state)) return false;
      return true;
    });
  }

  /**
   * Ajusta el número de sesiones activas al nº de días disponibles:
   * nunca 2 sesiones el mismo día; el excedente se marca skipped (source: availability).
   */
  function reconcileSessionsToAvailability() {
    getCatalogSessionIds().forEach((sessionId) => {
      const state = loadSessionState(sessionId);
      if (isAvailabilitySkip(state)) {
        clearSessionStateSilent(sessionId);
      }
    });

    const availableDateIsos = getAvailableDatesInReferenceWeek().map(toIso);
    const occupiedByReschedule = getRescheduledOccupiedDateIsos();
    const freeSlots = availableDateIsos.filter((iso) => !occupiedByReschedule.has(iso));
    const remappable = getRemappableSessionIds();

    remappable.forEach((sessionId, index) => {
      if (index < freeSlots.length) return;

      writeSessionStateSilent(sessionId, {
        status: 'skipped',
        source: 'availability',
        originalDateIso: sessionId,
        currentDateIso: null,
      });
    });
  }

  /**
   * Mapa base sesión → fecha: 1 slot libre por sesión remapeable.
   * No deja huérfanas en null: el excedente debe haberse marcado en reconcile.
   */
  function getBaseSessionDateMap() {
    const availableDateIsos = getAvailableDatesInReferenceWeek().map(toIso);
    const occupiedByReschedule = getRescheduledOccupiedDateIsos();
    const freeSlots = availableDateIsos.filter((iso) => !occupiedByReschedule.has(iso));
    const map = {};
    let slotIndex = 0;

    getCatalogSessionIds().forEach((sessionId) => {
      const state = loadSessionState(sessionId);
      if (state?.status === 'skipped' || state?.status === 'rescheduled') return;

      if (slotIndex < freeSlots.length) {
        map[sessionId] = freeSlots[slotIndex];
        slotIndex += 1;
      }
    });

    return map;
  }

  function getEffectiveDateForSession(sessionId) {
    const state = loadSessionState(sessionId);

    if (state?.status === 'skipped') {
      return null;
    }

    if (state?.status === 'rescheduled' && state.currentDateIso) {
      return state.currentDateIso;
    }

    return getBaseSessionDateMap()[sessionId] ?? null;
  }

  function findSessionIdByEffectiveDate(dateIso) {
    for (const sessionId of getCatalogSessionIds()) {
      if (getEffectiveDateForSession(sessionId) === dateIso) {
        return sessionId;
      }
    }
    return null;
  }

  /** Nº de sesiones con fecha efectiva (tras reconcile / skips / reprogramaciones). */
  function getWeeklySessionCount() {
    return getCatalogSessionIds().filter((id) => getEffectiveDateForSession(id) !== null).length;
  }

  function formatSessionsPerWeekGoal(count) {
    if (count <= 1) return 'Completar 1 sesión por semana';
    return `Completar ${count} sesiones por semana`;
  }

  function getWeeklyProgressForSession(sessionId) {
    const effectiveIso = getEffectiveDateForSession(sessionId);
    if (!effectiveIso) return { weeklyIndex: 0, weeklyTotal: 0 };

    const weekStart = startOfWeekMonday(parseIso(effectiveIso));
    const weekEnd = addDays(weekStart, 6);

    const inWeek = getCatalogSessionIds()
      .map((id) => ({ id, iso: getEffectiveDateForSession(id) }))
      .filter((item) => {
        if (!item.iso) return false;
        const date = parseIso(item.iso);
        return date >= weekStart && date <= weekEnd;
      })
      .sort((a, b) => a.iso.localeCompare(b.iso));

    const weeklyIndex = inWeek.findIndex((item) => item.id === sessionId) + 1;
    return {
      weeklyIndex: weeklyIndex > 0 ? weeklyIndex : 0,
      weeklyTotal: inWeek.length,
    };
  }

  function parseIso(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDateLabel(date) {
    if (window.DateFormat) return window.DateFormat.formatDateLabel(date);

    const weekday = weekdayNamesCapitalized[date.getDay()];
    return `${weekday}, ${date.getDate()} de ${monthNames[date.getMonth()]}`;
  }

  function formatToastDateLabel(date) {
    if (window.DateFormat) return window.DateFormat.formatToastDateLabel(date);

    const weekday = weekdayNamesLowercase[date.getDay()];
    return `${weekday} ${date.getDate()} de ${monthNames[date.getMonth()]}`;
  }

  function formatWeeklySession(entry) {
    return `${entry.weeklyIndex}/${entry.weeklyTotal}`;
  }

  function getStateStorageKey(sessionId) {
    return `${sessionStateStoragePrefix}.${sessionId}`;
  }

  function loadSessionState(sessionId) {
    try {
      const raw = sessionStorage.getItem(getStateStorageKey(sessionId));
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveSessionState(sessionId, state) {
    sessionStorage.setItem(getStateStorageKey(sessionId), JSON.stringify(state));
    notifyListeners('session-state-changed');
  }

  function clearSessionState(sessionId) {
    sessionStorage.removeItem(getStateStorageKey(sessionId));
    notifyListeners('session-state-changed');
  }

  /** Marca la salida como registrada (check azul en Home) tras el test post-sesión */
  function markSessionCompleted(sessionId, options = {}) {
    if (!sessionId) return null;
    const entry = catalog[sessionId] || catalog[options.dateIso];
    const id = entry?.id || sessionId;
    const dateIso = options.dateIso || getEffectiveDateForSession(id) || id;
    const state = {
      status: 'completed',
      completedAt: Date.now(),
      originalDateIso: entry?.dateIso || id,
      currentDateIso: dateIso,
      /** Distancia real recorrida (GPS), no simulada — ver SessionRuntime. */
      distanceKm: typeof options.distanceKm === 'number' ? options.distanceKm : 0,
    };
    saveSessionState(id, state);
    return state;
  }

  /** Sesiones completadas con su fecha efectiva y distancia real, ordenadas. */
  function getCompletedSessionsSorted() {
    return getCatalogSessionIds()
      .map((id) => ({ id, state: loadSessionState(id) }))
      .filter((entry) => entry.state?.status === 'completed')
      .map((entry) => ({
        id: entry.id,
        dateIso: entry.state.currentDateIso || entry.state.originalDateIso,
        distanceKm: entry.state.distanceKm || 0,
      }))
      .filter((entry) => Boolean(entry.dateIso))
      .sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  }

  /**
   * Progreso real de los objetivos de la quincena (Figma 13186:5008,
   * BiweeklyGoalsCard) — cada campo lo detecta el sistema a partir de
   * sesiones realmente completadas, nunca marcado a mano.
   */
  function getBiweeklyGoalsProgress() {
    const completed = getCompletedSessionsSorted();
    const target = getWeeklySessionCount();

    const sessionsGoalMet = target > 0 && completed.length >= target;

    let restGoalMet = completed.length >= 2;
    for (let i = 1; i < completed.length && restGoalMet; i += 1) {
      const prev = parseIso(completed[i - 1].dateIso);
      const curr = parseIso(completed[i].dateIso);
      const gapDays = Math.round((curr - prev) / (24 * 60 * 60 * 1000));
      if (gapDays < 1) restGoalMet = false;
    }

    const distanceGoalMet = completed.some((entry) => entry.distanceKm >= 2);

    return { sessionsGoalMet, restGoalMet, distanceGoalMet, completedCount: completed.length, target };
  }

  function isSessionCompleted(sessionId) {
    return loadSessionState(sessionId)?.status === 'completed';
  }

  function findRescheduledSourceForDate(dateIso) {
    for (const sessionId of getCatalogSessionIds()) {
      const state = loadSessionState(sessionId);
      if (state?.status === 'rescheduled' && state.currentDateIso === dateIso) {
        return { sessionId, state };
      }
    }
    return null;
  }

  function resolveCatalogEntry(dateIso) {
    const sessionId = findSessionIdByEffectiveDate(dateIso);
    if (!sessionId) return null;
    return { sessionId, entry: catalog[sessionId] };
  }

  function buildViewModel(entry, options = {}) {
    const dateIso = options.dateIso ?? entry.dateIso;
    const date = parseIso(dateIso);
    const status = options.status ?? 'scheduled';
    const progress = getWeeklyProgressForSession(entry.id);
    const weeklyIndex = progress.weeklyTotal > 0 ? progress.weeklyIndex : entry.weeklyIndex;
    const weeklyTotal = progress.weeklyTotal > 0 ? progress.weeklyTotal : entry.weeklyTotal;

    return {
      id: entry.id,
      sesionNombre: entry.sesionNombre,
      dateIso,
      initialDateIso: entry.dateIso,
      dateLabel: formatDateLabel(date),
      status,
      completed: status === 'completed',
      targetDistance: entry.targetDistance,
      targetDistanceLabel: statLabels.targetDistanceLabel,
      targetTime: entry.targetTime,
      targetTimeLabel: statLabels.targetTimeLabel,
      weeklySession: `${weeklyIndex}/${weeklyTotal}`,
      weeklySessionLabel: statLabels.weeklySessionLabel,
      weeklyIndex,
      weeklyTotal,
      accordion: entry.accordion,
      mentor: { ...entry.mentor, ...(resolveActiveMentorIdentity() || {}) },
      heroPhoto: entry.heroPhoto,
    };
  }

  /**
   * Vista por fecha para Home. Skipped / sin sesión efectiva → null
   * (misma representación que descanso en SessionTodayCard).
   */
  function getViewModel(dateIso) {
    const resolved = resolveCatalogEntry(dateIso);
    if (!resolved) return null;

    const { sessionId, entry } = resolved;
    const state = loadSessionState(sessionId);
    const effectiveDateIso = getEffectiveDateForSession(sessionId);

    if (!effectiveDateIso || effectiveDateIso !== dateIso) return null;
    if (state?.status === 'skipped') return null;

    if (state?.status === 'rescheduled') {
      return buildViewModel(entry, {
        dateIso: effectiveDateIso,
        status: 'rescheduled',
      });
    }

    if (state?.status === 'completed') {
      return buildViewModel(entry, {
        dateIso: effectiveDateIso,
        status: 'completed',
      });
    }

    return buildViewModel(entry, { dateIso: effectiveDateIso });
  }

  function getViewModelById(sessionId) {
    const entry = catalog[sessionId];
    if (!entry) return null;

    const effectiveDateIso = getEffectiveDateForSession(sessionId);
    const state = loadSessionState(sessionId);

    if (state?.status === 'skipped') {
      return buildViewModel(entry, { status: 'skipped' });
    }

    if (state?.status === 'completed') {
      const effective = getEffectiveDateForSession(sessionId);
      if (!effective) return buildViewModel(entry, { status: 'completed' });
      return buildViewModel(entry, { dateIso: effective, status: 'completed' });
    }

    if (!effectiveDateIso) return null;
    return getViewModel(effectiveDateIso);
  }

  function getScheduledDateIsos() {
    return getCatalogSessionIds()
      .map(getEffectiveDateForSession)
      .filter(Boolean)
      .sort();
  }

  function hasScheduledSession(dateIso) {
    return getScheduledDateIsos().includes(dateIso);
  }

  function ensureAvailabilityReconciled() {
    reconcileSessionsToAvailability();
  }

  function isDateOccupied(dateIso) {
    if (findSessionIdByEffectiveDate(dateIso)) return true;
    return Boolean(findRescheduledSourceForDate(dateIso));
  }

  window.PlanSessions = {
    catalog,
    monthNames,
    weekdayNamesCapitalized,
    weekdayNamesLowercase,
    statLabels,
    sessionStateStoragePrefix,
    pendingToastStorageKey,
    planStateStorageKey,
    referenceDateIso,
    defaultAvailableWeekdayIndices,
    parseIso,
    toIso,
    formatDateLabel,
    formatToastDateLabel,
    formatWeeklySession,
    getStateStorageKey,
    loadSessionState,
    saveSessionState,
    clearSessionState,
    markSessionCompleted,
    isSessionCompleted,
    getAvailableWeekdayIndices,
    setAvailableWeekdayIndices,
    getScheduledDateIsos,
    getEffectiveDateForSession,
    getBaseSessionDateMap,
    findSessionIdByEffectiveDate,
    findRescheduledSourceForDate,
    isDateOccupied,
    ensureAvailabilityReconciled,
    reconcileSessionsToAvailability,
    getWeeklySessionCount,
    formatSessionsPerWeekGoal,
    getBiweeklyGoalsProgress,
    subscribe,
    getViewModel,
    getViewModelById,
    hasScheduledSession,
    getDefaultDateIso: () => referenceDateIso,
  };
})();
