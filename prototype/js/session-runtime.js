/**
 * SessionRuntime — estado compartido del flujo de sesión en marcha/pausada/éxito.
 */
(function () {
  const STORAGE_KEY = 'rookie.sessionRuntime';
  const SUCCESS_KEY = 'rookie.sessionSuccess';
  const DEFAULT_USER_NAME = 'Pedro';
  const MOCK_PHASE_DURATIONS_MS = [5000, 8000, 5000];

  /** Distancia mínima entre dos fijas de GPS para contarla como movimiento
   * real y no ruido/deriva del sensor (metros). */
  const GPS_MIN_MOVEMENT_M = 4;
  /** Ignora fijas con precisión peor que esto (metros) — evita saltos falsos. */
  const GPS_MAX_ACCURACY_M = 40;

  let gpsWatchId = null;
  let gpsLastFix = null;

  function haversineMeters(a, b) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function onGpsPosition(position) {
    const { latitude: lat, longitude: lng, accuracy } = position.coords;
    if (typeof accuracy === 'number' && accuracy > GPS_MAX_ACCURACY_M) return;

    const fix = { lat, lng };
    if (gpsLastFix) {
      const meters = haversineMeters(gpsLastFix, fix);
      if (meters >= GPS_MIN_MOVEMENT_M) {
        const state = ensure();
        state.gpsDistanceKm = (state.gpsDistanceKm || 0) + meters / 1000;
        save(state);
        gpsLastFix = fix;
      }
    } else {
      gpsLastFix = fix;
    }
  }

  function startGpsTracking() {
    if (gpsWatchId != null) return;
    if (!('geolocation' in navigator)) return;
    gpsWatchId = navigator.geolocation.watchPosition(onGpsPosition, () => {}, {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 15000,
    });
  }

  function stopGpsTracking() {
    if (gpsWatchId != null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(gpsWatchId);
    }
    gpsWatchId = null;
    gpsLastFix = null;
  }

  function parseKm(text) {
    const normalized = String(text || '')
      .replace(',', '.')
      .match(/(\d+(?:\.\d+)?)/);
    return normalized ? Number(normalized[1]) : 0;
  }

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function formatClock(ms) {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function formatMinutesText(ms) {
    const totalMinutes = Math.max(1, Math.round(ms / 60000));
    return `${totalMinutes} min`;
  }

  function formatDistance(km) {
    return `${km.toFixed(1).replace('.', ',')} km`;
  }

  function getQuerySessionId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('sessionId') || params.get('fecha') || null;
  }

  function getSessionViewModel(sessionId) {
    if (!window.PlanSessions) return null;
    if (sessionId) {
      return PlanSessions.getViewModelById(sessionId) || PlanSessions.getViewModel(sessionId);
    }
    return PlanSessions.getViewModel(PlanSessions.getDefaultDateIso());
  }

  function subtitleToMinutesLabel(subtitle) {
    const match = String(subtitle || '').match(/(\d+)\s*min/i);
    return match ? `${match[1]} MIN` : '5 MIN';
  }

  function buildPhasesFromSession(session) {
    const accordion = session?.accordion || [];
    return accordion.slice(0, 3).map((item, index) => ({
      id: item.id,
      name: item.title,
      minutesLabel: subtitleToMinutesLabel(item.subtitle),
      mockDurationMs: MOCK_PHASE_DURATIONS_MS[index] || 5000,
    }));
  }

  function load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function save(state) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function loadSuccess() {
    try {
      const raw = sessionStorage.getItem(SUCCESS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveSuccess(payload) {
    sessionStorage.setItem(SUCCESS_KEY, JSON.stringify(payload));
  }

  function clearSuccess() {
    sessionStorage.removeItem(SUCCESS_KEY);
  }

  function init(options) {
    const existing = load();
    if (existing) return existing;

    const sessionId = options?.sessionId || getQuerySessionId() || window.PlanSessions?.getDefaultDateIso?.() || null;
    const session = getSessionViewModel(sessionId);
    const phases = buildPhasesFromSession(session);

    const state = {
      sessionId: session?.initialDateIso || session?.id || sessionId,
      dateIso: session?.dateIso || sessionId,
      sessionName: session?.sesionNombre || 'Primera salida',
      userName: options?.userName || DEFAULT_USER_NAME,
      mode: options?.mode || 'running',
      outcome: null,
      phases,
      phaseIndex: 0,
      phaseElapsedMs: 0,
      totalElapsedMs: 0,
      totalDistanceKm: parseKm(session?.targetDistance),
      /** Distancia real recorrida, acumulada desde fijas de GPS reales
       * (ver startGpsTracking) — nunca se simula. */
      gpsDistanceKm: 0,
      mentorNote: 'Deja que el cuerpo se despierte, sin prisa.',
    };

    clearSuccess();
    return save(state);
  }

  function ensure() {
    return load() || init();
  }

  function getCurrentPhase(state) {
    return state?.phases?.[state.phaseIndex] || state?.phases?.[0] || null;
  }

  function getNextPhase(state) {
    return state?.phases?.[state.phaseIndex + 1] || null;
  }

  function setMode(mode) {
    const state = ensure();
    state.mode = mode;
    return save(state);
  }

  function tick(deltaMs) {
    const state = ensure();
    if (state.mode !== 'running') return { state, completed: false };

    state.totalElapsedMs += deltaMs;
    state.phaseElapsedMs += deltaMs;

    // Un delta real puede abarcar más de una fase (p. ej. si el tab estuvo
    // en segundo plano) — avanza fase a fase consumiendo el sobrante en
    // vez de perder tiempo o quedarse atascado en la fase actual.
    while (
      state.phaseIndex < state.phases.length &&
      state.phaseElapsedMs >= state.phases[state.phaseIndex].mockDurationMs
    ) {
      state.phaseElapsedMs -= state.phases[state.phaseIndex].mockDurationMs;
      state.phaseIndex += 1;
    }

    if (state.phaseIndex >= state.phases.length) {
      state.phaseElapsedMs = 0;
    }

    const completed = state.phaseIndex >= state.phases.length;
    save(state);
    return { state, completed };
  }

  function buildSuccessPayload(outcome) {
    const state = ensure();
    const achievedDistance = formatDistance(state.gpsDistanceKm || 0);
    const elapsed = formatMinutesText(state.totalElapsedMs);
    const lastPhase = state.phases[Math.min(state.phaseIndex, state.phases.length - 1)]?.name || state.sessionName;

    let achievements;
    if (outcome === 'completed') {
      achievements = [state.sessionName, `${elapsed} de actividad`, `${achievedDistance} recorridos`];
    } else {
      achievements = [`${state.sessionName} guardada`, `${elapsed} registrados`, `${lastPhase} alcanzado`];
    }

    return {
      userName: state.userName || DEFAULT_USER_NAME,
      achievements,
      outcome,
    };
  }

  function finish(outcome) {
    const state = ensure();
    state.outcome = outcome;
    save(state);
    const payload = buildSuccessPayload(outcome);
    saveSuccess(payload);
    return payload;
  }

  function deleteSessionAndRecalculate() {
    const state = ensure();
    if (window.PlanSessions && state.sessionId) {
      PlanSessions.saveSessionState(state.sessionId, {
        status: 'skipped',
        originalDateIso: state.sessionId,
        currentDateIso: state.dateIso,
      });
      sessionStorage.setItem(
        PlanSessions.pendingToastStorageKey,
        JSON.stringify({
          type: 'skipped',
          sessionId: state.sessionId,
        })
      );
    }
    clear();
    clearSuccess();
  }

  function getViewModel() {
    const state = ensure();
    const currentPhase = getCurrentPhase(state);
    const nextPhase = getNextPhase(state);
    const phaseDuration = currentPhase?.mockDurationMs || 0;
    const phaseProgress = phaseDuration
      ? Math.min(1, state.phaseElapsedMs / phaseDuration)
      : 0;

    return {
      mode: state.mode,
      sessionName: state.sessionName,
      currentPhaseMinutes: currentPhase?.minutesLabel || '5 MIN',
      currentPhaseName: currentPhase?.name || 'Calentamiento',
      nextPhaseLabel: nextPhase ? 'Siguiente fase' : '',
      nextPhaseName: nextPhase?.name || '',
      mentorNote: state.mentorNote,
      totalElapsedMs: state.totalElapsedMs,
      elapsedText: formatClock(state.totalElapsedMs),
      distanceText: formatDistance(state.gpsDistanceKm || 0),
      phaseIndex: state.phaseIndex,
      phaseProgress,
      totalPhases: state.phases.length,
      showPausedControls: state.mode === 'paused',
      showPauseButton: state.mode === 'running',
    };
  }

  window.SessionRuntime = {
    STORAGE_KEY,
    SUCCESS_KEY,
    ensure,
    init,
    load,
    save,
    clear,
    loadSuccess,
    clearSuccess,
    setMode,
    tick,
    finish,
    deleteSessionAndRecalculate,
    getViewModel,
    startGpsTracking,
    stopGpsTracking,
  };
})();

