/**
 * Flujos 4.1 + 4.2 + 4.3 — router y pantallas
 */
(function () {
  const spec = window.FIGMA_4_1;
  const spec42 = window.FIGMA_4_2;
  const spec43 = window.FIGMA_4_3;
  if (!spec) return;

  /* ============================================================
   * DEMO_MODE — SOLO para la demo en clase. TEMPORAL, revertir después.
   * Con esto en true, se oculta el botón "El mentor no ha aparecido" en
   * la pantalla "¡Hoy es tu cita con…!", para no distraer durante la
   * demo. La lógica real (botón visible) sigue intacta debajo, solo
   * queda enmascarada.
   * Para volver a la lógica real: DEMO_MODE = false.
   * ============================================================ */
  const DEMO_MODE = true;

  const SCREENS = {
    catalog: { id: 'screen-catalog' },
    confirmation: { id: 'pantalla-confirmacion-mentor' },
    continueStub: { id: 'screen-mentor-continue-stub' },
    appointment: { id: 'screen-appointment' },
    appointmentConfirmed: { id: 'screen-appointment-confirmed' },
    homeInitial: { id: 'screen-home-initial' },
    meetBridge: { id: 'screen-meet-bridge' },
    meetExternal: { id: 'screen-meet-external' },
    callSummary: { id: 'screen-call-summary' },
    homeUpdated: { id: 'screen-home-updated' },
  };

  const scroller = document.querySelector('.phone-shell__scroll');
  let lastRoute = { screen: 'catalog', selectedId: null };
  let pickerReady = false;
  let appointmentConfirmTimer = null;
  let isConfirmingAppointment = false;
  let bridgeLoadingActive = false;
  let bridgeLoadingTimer = null;
  let callSummaryLoadingActive = false;
  let callSummaryLoadingTimer = null;
  const BOOKING_KEY = 'appointmentBooking';
  const GOALS_COMPLETED_KEY = 'goalsCallCompleted';
  const GOALS_MOCK_KEY = 'goalsMock';
  const GOALS_PENDING_KEY = 'goalsSummaryPending';
  const SCENARIO_KEY = 'mentorPrototypeScenario';

  const WEEKDAY_SHORT = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  const MONTH_NAMES = window.DateFormat?.monthNames ?? [
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

  const STEPPER_ICONS = {
    'notepad-text': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/>
        <rect width="16" height="18" x="4" y="4" rx="2"/>
        <path d="M8 10h6"/><path d="M8 14h8"/><path d="M8 18h5"/>
      </svg>`,
    'land-plot': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 8 6-3-6-3v10"/>
        <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/>
        <path d="m6.49 12.85 11.02 6.3"/><path d="M17.51 12.85 6.5 19.15"/>
      </svg>`,
    'id-card-lanyard': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13.5 8h-3"/>
        <path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/>
        <path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/>
      </svg>`,
  };

  function renderMentorStepper() {
    const steps = spec.stepper?.steps || [];
    const stepsHtml = steps
      .map((step, index) => {
        const stateClass = index < 2 ? 'is-done' : 'is-active';
        return `
        <div class="profiling-stepper__step ${stateClass}" data-step="${step.id}">
          <span class="profiling-stepper__icon">${STEPPER_ICONS[step.icon] || ''}</span>
          <p class="profiling-stepper__label">${step.label}</p>
        </div>
      `;
      })
      .join('');

    return `
      <nav class="profiling-stepper profiling-stepper--mentores" aria-label="Progreso del perfilado">
        ${stepsHtml}
        <span class="profiling-stepper__connector profiling-stepper__connector--left is-active" aria-hidden="true">
          <span class="profiling-stepper__connector-fill"></span>
        </span>
        <span class="profiling-stepper__connector profiling-stepper__connector--right is-active" aria-hidden="true">
          <span class="profiling-stepper__connector-fill"></span>
        </span>
      </nav>
    `;
  }

  function mountMentorStepper(wrapId, options = {}) {
    const { animate = false } = options;
    const wrap = document.getElementById(wrapId);
    if (!wrap || !spec.stepper) return;
    wrap.innerHTML = renderMentorStepper();
    if (animate) {
      window.ProfilingStepperAnim?.runEnter(wrap, 'mentors');
    }
  }

  function mountCatalogStepper() {
    mountMentorStepper('catalog-stepper-wrap', { animate: true });
  }

  function mountAppointmentStepper() {
    mountMentorStepper('appointment-stepper-wrap');
  }

  function getMockParam() {
    const fromSearch = new URLSearchParams(window.location.search).get('mock');
    if (fromSearch) {
      sessionStorage.setItem(GOALS_MOCK_KEY, fromSearch);
      return fromSearch;
    }

    const href = window.location.href;
    const hashStart = href.indexOf('#');
    if (hashStart !== -1) {
      const hashPart = href.slice(hashStart + 1);
      const queryInHash = hashPart.indexOf('?');
      if (queryInHash !== -1) {
        const fromHash = new URLSearchParams(hashPart.slice(queryInHash + 1)).get('mock');
        if (fromHash) {
          sessionStorage.setItem(GOALS_MOCK_KEY, fromHash);
          return fromHash;
        }
      }
    }

    return sessionStorage.getItem(GOALS_MOCK_KEY);
  }

  function setGoalsMock(value) {
    if (value) {
      sessionStorage.setItem(GOALS_MOCK_KEY, value);
    } else {
      sessionStorage.removeItem(GOALS_MOCK_KEY);
    }
  }

  function isBookingToday(booking) {
    if (!booking || !booking.dayIso) return false;
    return booking.dayIso === toIso(new Date());
  }

  function parseIso(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function toIso(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatShortMeta(dayIso, time) {
    const date = parseIso(dayIso);
    const weekday = WEEKDAY_SHORT[date.getDay()];
    const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `${capitalized} ${date.getDate()} · ${time}`;
  }

  function formatDateLabel(iso) {
    const date = parseIso(iso);
    if (window.DateFormat) return window.DateFormat.formatDateLabel(date);

    const weekday = WEEKDAY_SHORT[date.getDay()];
    const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const month = window.DateFormat?.monthNames?.[date.getMonth()] ?? 'mes';
    return `${capitalized}, ${date.getDate()} de ${month}`;
  }

  function parseBookingDateTime(booking) {
    const date = parseIso(booking.dayIso);
    const [hh, mm] = booking.time.split(':').map(Number);
    date.setHours(hh, mm, 0, 0);
    return date;
  }

  function formatActivationTime(booking) {
    const appt = parseBookingDateTime(booking);
    const activation = new Date(appt.getTime() - (spec43?.joinWindowMinutes || 30) * 60 * 1000);
    const hh = String(activation.getHours()).padStart(2, '0');
    const mm = String(activation.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function getFollowUpBooking(booking) {
    const date = parseIso(booking.dayIso);
    date.setDate(date.getDate() + (spec43?.followUpDaysAfter || 14));
    return {
      dayIso: toIso(date),
      time: booking.time,
      dateLabel: formatDateLabel(toIso(date)),
    };
  }

  /** active | early-same-day | disabled — ventana de unión = joinWindowMinutes antes de la cita */
  function getJoinWindowMs() {
    return (spec43?.joinWindowMinutes || 30) * 60 * 1000;
  }

  /** Demo ?mock=appointment-day — cita ficticia a +15 min para mostrar botón activo */
  function getDemoJoinBooking(booking) {
    const appt = new Date(Date.now() + 15 * 60 * 1000);
    const hh = String(appt.getHours()).padStart(2, '0');
    const mm = String(appt.getMinutes()).padStart(2, '0');
    return {
      ...booking,
      dayIso: toIso(appt),
      time: `${hh}:${mm}`,
    };
  }

  function getJoinState(booking) {
    if (!booking) return 'disabled';

    let effective = booking;
    if (
      getMockParam() === spec43?.mockParams?.appointmentDay &&
      !isEntraAntesScenario()
    ) {
      effective = getDemoJoinBooking(booking);
    }

    const now = new Date();
    const appt = parseBookingDateTime(effective);
    const msUntil = appt.getTime() - now.getTime();
    const windowMs = getJoinWindowMs();

    if (msUntil <= 0) return 'disabled';
    if (msUntil <= windowMs) return 'active';

    if (isEntraAntesScenario() && isBookingToday(effective)) {
      return 'early-same-day';
    }

    return 'disabled';
  }

  function isGoalsScreen(screen) {
    return (
      screen === 'homeInitial' ||
      screen === 'meetBridge' ||
      screen === 'meetExternal' ||
      screen === 'callSummary' ||
      screen === 'homeUpdated'
    );
  }

  function resolveGoalsMentor(route) {
    const booking = getSavedBooking();
    const mentorId = booking?.mentorId || route.selectedId || getSelectedMentorId();
    return getMentor(mentorId);
  }

  function requireGoalsContext(route) {
    const booking = getSavedBooking();
    const mentor = resolveGoalsMentor(route);
    if (!mentor || !booking) {
      window.location.replace('#appointment-confirmed');
      return null;
    }
    return { mentor, booking };
  }

  function readScenarioFromUrl() {
    const fromSearch = new URLSearchParams(window.location.search).get('scenario');
    if (fromSearch) return fromSearch;

    const href = window.location.href;
    const queryStart = href.indexOf('?');
    if (queryStart === -1) return null;

    const hashStart = href.indexOf('#');
    const queryEnd = hashStart !== -1 && hashStart > queryStart ? hashStart : href.length;
    return new URLSearchParams(href.slice(queryStart + 1, queryEnd)).get('scenario');
  }

  function getScenario() {
    const fromUrl = readScenarioFromUrl();
    if (fromUrl) {
      sessionStorage.setItem(SCENARIO_KEY, fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem(SCENARIO_KEY);
  }

  function isErrorCargaScenario() {
    return getScenario() === 'error-carga';
  }

  function isSinConexionScenario() {
    return getScenario() === 'sin-conexion';
  }

  function isSinHuecosScenario() {
    return spec42 && getScenario() === spec42.scenarios.sinHuecos;
  }

  function isSlotOcupadoScenario() {
    return spec42 && getScenario() === spec42.scenarios.slotOcupado;
  }

  function isEntraAntesScenario() {
    return spec43 && getScenario() === spec43.scenarios.entraAntes;
  }

  function isSinResumenScenario() {
    return spec43 && getScenario() === spec43.scenarios.sinResumen;
  }

  function isMentorNoApareceScenario() {
    return spec43 && getScenario() === spec43.scenarios.mentorNoAparece;
  }

  function isSummaryPending() {
    return (
      isSinResumenScenario() ||
      sessionStorage.getItem(GOALS_PENDING_KEY) === 'true'
    );
  }

  function formatWeekdayMeetFromIso(iso) {
    return WEEKDAY_SHORT[parseIso(iso).getDay()];
  }

  /** Demo Fase 2 — cita hoy pero fuera de ventana de unión */
  function ensureEntraAntesBooking(booking) {
    if (!booking) return booking;
    const now = new Date();
    const today = toIso(now);
    let hour = Math.min(22, now.getHours() + 2);
    const time = `${String(hour).padStart(2, '0')}:00`;
    return {
      ...booking,
      dayIso: today,
      time,
      dateLabel: formatDateLabel(today),
      weekdayMeet: formatWeekdayMeetFromIso(today),
    };
  }

  /** Hash actual — sin query (?mock=…) embebida en el fragmento */
  function readHash() {
    const fromHash = window.location.hash.replace(/^#/, '');
    if (fromHash) return fromHash.split('?')[0];

    const href = window.location.href;
    const hashIndex = href.lastIndexOf('#');
    if (hashIndex === -1) return '';
    return href.slice(hashIndex + 1).split('?')[0];
  }

  function isGoalsCallCompleted() {
    return sessionStorage.getItem(GOALS_COMPLETED_KEY) === 'true';
  }

  function resolvePostBookingHomeHash() {
    if (isGoalsCallCompleted()) return 'home-updated';
    return 'home-initial';
  }

  function parseRoute() {
    const hash = readHash();
    if (hash === 'plan') return { screen: 'catalog', selectedId: null };
    if (hash === 'catalog') return { screen: 'catalog', selectedId: null };
    if (hash === 'confirmation') {
      return { screen: 'confirmation', selectedId: sessionStorage.getItem('selectedMentorId') };
    }
    if (hash === 'mentor-continue-stub') {
      return { screen: 'continueStub', selectedId: sessionStorage.getItem('selectedMentorId') };
    }
    if (hash === 'appointment') {
      return { screen: 'appointment', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'appointment-confirmed') {
      return { screen: 'appointmentConfirmed', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'home-stub' || hash === 'home-initial') {
      return { screen: 'homeInitial', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'meet-bridge') {
      return { screen: 'meetBridge', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'meet-external') {
      return { screen: 'meetExternal', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'call-summary') {
      return { screen: 'callSummary', selectedId: resolveActiveMentorId() };
    }
    if (hash === 'home-updated') {
      return { screen: 'homeUpdated', selectedId: resolveActiveMentorId() };
    }
    const selectedMatch = hash.match(/^selected-(.+)$/);
    if (selectedMatch) {
      sessionStorage.setItem('selectedMentorId', selectedMatch[1]);
      return { screen: 'confirmation', selectedId: selectedMatch[1] };
    }
    if (isSinConexionScenario()) {
      if (hash === 'appointment') {
        return { screen: 'appointment', selectedId: getSelectedMentorId() };
      }
      return { screen: 'catalog', selectedId: null };
    }
    if (isErrorCargaScenario()) return { screen: 'catalog', selectedId: null };
    return { screen: 'catalog', selectedId: null };
  }

  function getMentor(id) {
    return spec.mentors.find((m) => m.id === id);
  }

  function genderTerms(mentor) {
    const key = mentor && mentor.gender === 'f' ? 'f' : 'm';
    return {
      role: spec.genderCopy.role[key],
      possessive: spec.genderCopy.possessive[key],
      miRole: spec.genderCopy.miRole[key],
    };
  }

  function defaultGenderTerms() {
    return {
      role: spec.genderCopy.role.m,
      possessive: spec.genderCopy.possessive.m,
      miRole: spec.genderCopy.miRole.m,
    };
  }

  /** Sustituye {firstName}, {role}, {possessive}, {miRole} — primera letra siempre mayúscula */
  function fillTemplate(template, mentor) {
    const terms = mentor ? genderTerms(mentor) : defaultGenderTerms();
    const result = template
      .replace(/\{firstName\}/g, mentor ? mentor.firstName : '')
      .replace(/\{role\}/g, terms.role)
      .replace(/\{possessive\}/g, terms.possessive)
      .replace(/\{miRole\}/g, terms.miRole);
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  function fillTemplate42(template, mentor, extras) {
    const extra = extras || {};
    let result = fillTemplate(template, mentor);
    if (extra.count !== undefined) {
      result = result.replace(/\{count\}/g, String(extra.count));
    }
    if (extra.weekday) {
      result = result.replace(/\{weekday\}/g, extra.weekday);
    }
    return result;
  }

  /** Nombre + primer apellido en formato normal (alias de formatMentorConfirmationName). */
  function formatMentorShortName(mentor) {
    return formatMentorConfirmationName(mentor);
  }

  /** Nombre en card de catálogo: nombre + primer apellido (sin segundo). */
  function formatMentorCardName(mentor) {
    const parts = String(mentor?.name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return mentor?.firstName || '';
    if (parts.length === 1) return parts[0];
    /* Primer apellido completo (incluye compuestos con guion, p. ej. Etxebarria-Goikoetxea) */
    return `${parts[0]} ${parts[1]}`;
  }

  /** Title Case para ficha de confirmación (Host Grotesk, sin segundo apellido). */
  function formatMentorConfirmationName(mentor) {
    return formatMentorCardName(mentor)
      .toLowerCase()
      .split(/\s+/)
      .map((word) =>
        word
          .split('-')
          .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
          .join('-')
      )
      .join(' ');
  }

  /** Nombre legible para tarjeta-recordatorio (Figma 12641:917) */
  function formatMentorDisplayName(mentor) {
    if (!mentor?.name) return mentor?.firstName || '';
    return mentor.name
      .toLowerCase()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function formatConfirmedDateLabel(dateLabel) {
    if (!dateLabel) return '';
    return dateLabel.replace(
      / de ([\p{L}]+)$/u,
      (_, month) => ` de ${month.charAt(0).toUpperCase()}${month.slice(1)}`
    );
  }

  function getSelectedMentorId() {
    return sessionStorage.getItem('selectedMentorId');
  }

  /** Mentor activo — sesión o booking guardado (p. ej. reagendar desde bottom sheet) */
  function resolveActiveMentorId() {
    return getSelectedMentorId() || getSavedBooking()?.mentorId || null;
  }

  function getSavedBooking() {
    try {
      const raw = sessionStorage.getItem(BOOKING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveBooking(booking) {
    sessionStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
  }

  function clearBooking() {
    sessionStorage.removeItem(BOOKING_KEY);
  }

  function getInitialWeekOffset() {
    if (!spec42) return 0;
    if (isSinHuecosScenario()) {
      const offsets = spec42.availability.scenarioWeekOffsets || {};
      return offsets.sinHuecos !== undefined ? offsets.sinHuecos : 3;
    }
    return 0;
  }

  function getPickerOptions(mentor) {
    return {
      weekOffset: getInitialWeekOffset(),
      sinHuecosScenario: isSinHuecosScenario(),
      onChange: onAppointmentPickerChange,
      fillSinHuecos: (m) => formatSinHuecosHtml(m),
    };
  }

  function formatSinHuecosHtml(mentor) {
    const text = fillTemplate42(spec42.copy.sinHuecosTemplate, mentor);
    return text
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('');
  }

  function clearAppointmentConfirmTimer() {
    if (appointmentConfirmTimer) {
      window.clearTimeout(appointmentConfirmTimer);
      appointmentConfirmTimer = null;
    }
  }

  function resetAppointmentConfirmFlow() {
    clearAppointmentConfirmTimer();
    isConfirmingAppointment = false;
    if (window.AppToast) window.AppToast.hide();
  }

  function onAppointmentPickerChange() {
    const picker = window.AppointmentPicker;
    if (!picker) return;

    if (picker.getPickerState() !== 'confirmSlot') {
      resetAppointmentConfirmFlow();
      return;
    }

    handleAppointmentSlotConfirmed();
  }

  function handleAppointmentSlotConfirmed() {
    if (isConfirmingAppointment || isSinConexionScenario()) return;

    const picker = window.AppointmentPicker;
    if (!picker) return;

    const booking = picker.getBooking();
    if (!booking) return;

    if (
      isSlotOcupadoScenario() &&
      booking.time === spec42.slotOcupado.occupiedSlot
    ) {
      showAppointmentToast(spec42.slotOcupado.message);
      return;
    }

    isConfirmingAppointment = true;

    saveBooking({
      ...booking,
      mentorId: getSelectedMentorId(),
    });

    const durationMs = window.AppToast?.DEFAULT_DURATION_MS ?? 2500;
    const message = spec42.copy.slotConfirmToast || '¡Cita confirmada!';

    if (window.AppToast) {
      window.AppToast.show({ message, durationMs });
    }

    /* Navega antes de que el toast termine de mostrarse por completo — solo
       necesita asomar brevemente, no bloquear el paso a "Cita confirmada". */
    const navigateDelayMs = 900;

    clearAppointmentConfirmTimer();
    appointmentConfirmTimer = window.setTimeout(() => {
      appointmentConfirmTimer = null;
      /* Pantalla de éxito dedicada (Figma 13694:16006) — 1ª cita confirmada. */
      window.location.href = `../cita-confirmada/index.html${window.location.search || ''}`;
    }, navigateDelayMs);
  }

  function showAppointmentToast(message) {
    const toast = document.getElementById('appointment-toast');
    const messageEl = document.getElementById('appointment-toast-message');
    if (messageEl) messageEl.textContent = message;
    if (toast) {
      toast.hidden = false;
      requestAnimationFrame(() => {
        toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  function hideAppointmentToast() {
    const toast = document.getElementById('appointment-toast');
    if (toast) toast.hidden = true;
  }


  function renderReminderCard(mentor, booking) {
    const icons = spec42.assets.reminderIcons;
    const mentorLabel = formatMentorConfirmationName(mentor);
    const dateLabel = formatConfirmedDateLabel(booking.dateLabel);
    const time = booking.time;
    const format = spec42.confirmed.card.format;

    return `
      <div class="reminder-card">
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.user}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${mentorLabel}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.calendar}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${dateLabel}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.clock}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${time}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.video}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${format}</p>
        </div>
      </div>
    `;
  }

  function getHeroPhotoSrc(mentor) {
    return `../${mentor.heroPhoto || mentor.photo}`;
  }

  /** Foto de la card de cita/seguimiento — asset ya compuesto
   * (photo-block-citayseguimiento-[nombre].png), igual que el patrón de
   * photo-block-hero-detalle-[nombre].png para el hero de detalle. */
  function getCitaSeguimientoPhotoSrc(mentor) {
    return `../${mentor.citaSeguimientoPhoto || mentor.photo}`;
  }

  function getRecordatorioPhotoSrc(mentor) {
    return `../${mentor.recordatorioPhoto || mentor.photo}`;
  }

  function renderRecordatorioMentor(mentor) {
    return `
      <article class="recordatorio-mentor">
        <div class="recordatorio-mentor__text">
          <p class="recordatorio-mentor__name">${formatMentorConfirmationName(mentor)}</p>
          <p class="recordatorio-mentor__specialty">${mentor.specialty}</p>
        </div>
        <div class="recordatorio-mentor__photo-wrap" aria-hidden="true">
          <img
            class="recordatorio-mentor__photo"
            src="${getRecordatorioPhotoSrc(mentor)}"
            alt=""
            width="76"
            height="100"
          />
        </div>
      </article>
    `;
  }

  function renderCatalogHeader() {
    const titleEl = document.getElementById('catalog-title');
    const subtitleEl = document.getElementById('catalog-subtitle');

    if (titleEl && spec.catalog.title) {
      titleEl.textContent = spec.catalog.title;
    }

    if (subtitleEl && spec.catalog.subtitle) {
      subtitleEl.innerHTML = spec.catalog.subtitle.replace('\n', '<br />');
    }
  }

  function setTitle(route) {
    const titles = {
      catalog: isErrorCargaScenario()
        ? 'Running Mentors — 4.1.2 Catálogo (cargando)'
        : 'Running Mentors — 4.1.2 Catálogo de mentores',
      confirmation: 'Running Mentors — 4.1.3 Ficha del mentor',
      continueStub: 'Running Mentors — Próximo paso',
      appointment: isSinConexionScenario()
        ? 'Running Mentors — 4.2 Sin conexión'
        : isSinHuecosScenario()
          ? 'Running Mentors — 4.2 Sin huecos'
          : 'Running Mentors — 4.2.1.4 Selecciona día y hora',
      appointmentConfirmed: 'Running Mentors — 4.2.5 ¡Cita confirmada!',
      homeInitial: 'Running Mentors — 4.3.1 Home inicial',
      meetBridge: 'Running Mentors — 4.3.1.2 Puente Meets',
      meetExternal: 'Running Mentors — 4.3.1.3 Google Meet',
      callSummary: 'Running Mentors — 4.3.1.4 Resumen post-llamada',
      homeUpdated: 'Running Mentors — 4.3.1.5 Home actualizado',
    };
    document.title = titles[route.screen] || 'Running Mentors — Flujos 4.1 / 4.2 / 4.3';
  }

  function showScreen(route) {
    if (route.screen === 'confirmation') {
      const mentor = getMentor(route.selectedId);
      if (!mentor) {
        window.location.replace('#catalog');
        return;
      }
    }

    if (route.screen === 'appointment' || route.screen === 'appointmentConfirmed') {
      const mentorId = route.selectedId || resolveActiveMentorId();
      const mentor = getMentor(mentorId);
      if (!mentor) {
        window.location.replace('#catalog');
        return;
      }
      if (mentorId && mentorId !== getSelectedMentorId()) {
        sessionStorage.setItem('selectedMentorId', mentorId);
      }
      route = { ...route, selectedId: mentorId };
    }

    if (isGoalsScreen(route.screen)) {
      const ctx = requireGoalsContext(route);
      if (!ctx) return;
    }

    Object.entries(SCREENS).forEach(([, s]) => {
      const el = document.getElementById(s.id);
      if (el) el.classList.toggle('is-active', s.id === SCREENS[route.screen].id);
    });

    const shell = document.getElementById('phone-shell');
    if (shell) {
      shell.classList.toggle('phone-shell--mentor-catalog', route.screen === 'catalog');
    }

    setTitle(route);

    if (route.screen === 'catalog') {
      mountCatalogStepper();
      renderCatalogHeader();
      applyCatalogOfflineState();
      if (isErrorCargaScenario()) {
        renderSkeletonList();
      } else if (!isSinConexionScenario()) {
        renderMentorList();
      }
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'confirmation') {
      renderConfirmation(getMentor(route.selectedId));
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'continueStub') {
      const stubMessage = document.getElementById('mentor-stub-message');
      if (stubMessage) {
        stubMessage.textContent = spec.confirmation.continuePlaceholderMessage;
      }
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'appointment') {
      mountAppointmentStepper();
      renderAppointmentShell(getMentor(route.selectedId));
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'appointmentConfirmed') {
      renderAppointmentConfirmedShell(getMentor(route.selectedId));
      if (scroller) scroller.scrollTop = 0;
      resetAppointmentConfirmFlow();
      if (window.AppointmentConfirmedCelebration) {
        requestAnimationFrame(() =>
          window.AppointmentConfirmedCelebration.play('#appointment-confirmed-check'),
        );
      }
    } else if (route.screen === 'homeInitial') {
      renderHomeInitialShell(requireGoalsContext(route));
      hideHomeGoalsToast();
      hideGoalsBottomSheet();
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'meetBridge') {
      hideMeetBridgeLoading();
      renderMeetBridgeShell(requireGoalsContext(route));
      hideGoalsBottomSheet();
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'meetExternal') {
      hideCallSummaryLoading();
      renderMeetExternalShell();
      hideGoalsBottomSheet();
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'callSummary') {
      renderCallSummaryShell(requireGoalsContext(route));
      if (scroller) scroller.scrollTop = 0;
    } else if (route.screen === 'homeUpdated') {
      renderHomeUpdatedShell(requireGoalsContext(route));
      if (scroller) scroller.scrollTop = 0;
    }

    lastRoute = { screen: route.screen, selectedId: route.selectedId };
  }

  function renderMentorCard(mentor) {
    const tags = mentor.tags.map((t) => `<span class="pill">${t}</span>`).join('');
    const outingText = mentor.outingDays || mentor.outingDay || '';
    const photoSize = spec.assets?.photo || {};
    const photoW = photoSize.cardWidth || 160;
    const photoH = photoSize.cardHeight || 320;
    const objectPosition = mentor.cardObjectPosition || mentor.heroObjectPosition || 'center top';
    const cardName = formatMentorCardName(mentor);
    /* Fotos "prerenderizadas" ya incluyen el recorte diagonal + fondo horneados
       (export directo del photo-block de Figma) — sin máscara CSS adicional. */
    const photoLayer = mentor.photoPrerendered
      ? `
          <img
            class="mentor-card__photo mentor-card__photo--prerendered"
            src="../${mentor.photo}"
            alt=""
            width="${photoW}"
            height="${photoH}"
            loading="lazy"
          />
        `
      : `
          <div class="mentor-card__photo-bg" aria-hidden="true"></div>
          <div class="mentor-card__foto-mentor">
            <img
              class="mentor-card__photo"
              src="../${mentor.photo}"
              alt=""
              width="${photoW}"
              height="${photoH}"
              loading="lazy"
              style="object-position: ${objectPosition}"
            />
          </div>
        `;
    return `
      <button type="button" class="mentor-card" data-mentor-id="${mentor.id}" aria-label="Ver ficha de ${mentor.firstName}">
        <div class="mentor-card__info">
          <div class="mentor-card__identity">
            <h2 class="mentor-card__name">${cardName}</h2>
            <p class="mentor-card__specialty">${mentor.specialty}</p>
          </div>
          <div class="pill-list">${tags}</div>
          <p class="mentor-card__meta">Salidas los ${outingText}</p>
        </div>
        <div class="mentor-card__photo-wrap">
          ${photoLayer}
        </div>
      </button>
    `;
  }

  function renderMentorItem(mentor) {
    return `
      <div class="mentor-item" data-mentor-item="${mentor.id}" role="listitem">
        ${renderMentorCard(mentor)}
      </div>
    `;
  }

  function renderSkeletonCard() {
    return `
      <div class="mentor-item mentor-item--skeleton">
        <div class="mentor-card mentor-card--skeleton" aria-hidden="true">
          <div class="mentor-card__info">
            <div class="skeleton-bar skeleton-bar--name"></div>
            <div class="skeleton-bar skeleton-bar--line skeleton-bar--line-wide"></div>
            <div class="skeleton-bar skeleton-bar--line skeleton-bar--line-narrow"></div>
            <div class="skeleton-pills">
              <div class="skeleton-bar skeleton-bar--pill"></div>
              <div class="skeleton-bar skeleton-bar--pill skeleton-bar--pill-md"></div>
              <div class="skeleton-bar skeleton-bar--pill skeleton-bar--pill-sm"></div>
            </div>
            <div class="skeleton-bar skeleton-bar--meta"></div>
          </div>
          <div class="mentor-card__photo-wrap">
            <div class="mentor-card__photo-bg" aria-hidden="true"></div>
            <div class="mentor-card__foto-mentor">
              <div class="mentor-card__photo-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function mountMentorCarousel() {
    const listRoot = document.getElementById('mentor-list');
    const listWrap = document.getElementById('catalog-list-wrap');
    if (!listRoot || !listWrap || !window.MentorCarousel) return;
    window.MentorCarousel.mount(listRoot, listWrap);
  }

  function renderSkeletonList() {
    const listRoot = document.getElementById('mentor-list');
    if (!listRoot) return;
    const count = (spec.errorCarga && spec.errorCarga.skeletonCount) || 4;
    listRoot.classList.add('mentor-list--loading');
    listRoot.setAttribute('aria-busy', 'true');
    listRoot.setAttribute('aria-label', 'Cargando mentores');
    listRoot.innerHTML = Array.from({ length: count }, () => renderSkeletonCard()).join('');
    mountMentorCarousel();
  }

  function renderMentorList() {
    const listRoot = document.getElementById('mentor-list');
    if (!listRoot) return;
    listRoot.classList.remove('mentor-list--loading');
    listRoot.removeAttribute('aria-busy');
    listRoot.setAttribute('aria-label', 'Lista de mentores');
    listRoot.innerHTML = spec.mentors.map((m) => renderMentorItem(m)).join('');
    mountMentorCarousel();
  }

  function renderConfirmation(mentor) {
    const contextEl = document.getElementById('confirmation-context');
    const nameEl = document.getElementById('confirmation-name');
    const specialtyEl = document.getElementById('confirmation-specialty');
    const bioEl = document.getElementById('confirmation-bio');
    const pillsEl = document.getElementById('confirmation-pills');
    const availabilityEl = document.getElementById('confirmation-availability');
    const heroEl = document.getElementById('confirmation-hero');
    const primaryBtn = document.getElementById('confirmation-primary-btn');
    const gender = mentor.gender || 'm';

    if (contextEl) {
      contextEl.textContent =
        gender === 'f' ? spec.confirmation.contextLabelFemale : spec.confirmation.contextLabel;
    }
    if (nameEl) nameEl.textContent = formatMentorConfirmationName(mentor);
    if (specialtyEl) specialtyEl.textContent = mentor.specialty;
    if (bioEl) bioEl.textContent = mentor.bio || mentor.tagline || '';

    if (pillsEl) {
      pillsEl.innerHTML = mentor.tags
        .slice(0, 3)
        .map((tag) => `<span class="pill">${tag}</span>`)
        .join('');
    }

    if (availabilityEl) {
      const days = mentor.outingDays || mentor.outingDay || '';
      availabilityEl.textContent = `${spec.confirmation.outingPrefix} ${days}`;
    }

    if (heroEl) {
      heroEl.src = getHeroPhotoSrc(mentor);
      heroEl.alt = mentor.firstName;
      heroEl.removeAttribute('style');
    }

    if (primaryBtn) {
      primaryBtn.textContent =
        gender === 'f' ? spec.buttons.confirmation.primaryFemale : spec.buttons.confirmation.primary;
    }
  }

  function openMentorConfirmation(mentorId) {
    if (!getMentor(mentorId)) return;
    sessionStorage.setItem('selectedMentorId', mentorId);
    window.location.hash = 'confirmation';
  }

  function applyAppointmentOfflineState() {
    const offline = isSinConexionScenario();
    const offlinePanel = document.getElementById('appointment-offline-panel');
    const offlineIcon = document.getElementById('appointment-offline-icon');
    const offlineTitle = document.getElementById('appointment-offline-title');
    const offlineMessage = document.getElementById('appointment-offline-message');
    const picker = document.getElementById('appointment-picker');
    const toast = document.getElementById('appointment-toast');

    if (picker) picker.hidden = offline;
    if (toast) toast.hidden = true;

    if (offlinePanel) {
      offlinePanel.hidden = !offline;
      if (offline && spec.sinConexion) {
        if (offlineIcon) offlineIcon.src = `../${spec.sinConexion.icon}`;
        if (offlineTitle) offlineTitle.textContent = spec.sinConexion.title;
        if (offlineMessage) offlineMessage.textContent = spec.sinConexion.message;
      }
    }
  }

  function seedSlotOcupadoPicker(root, mentor, opts) {
    const picker = window.AppointmentPicker;
    if (!picker || !spec42) return;

    const targetTime = spec42.slotOcupado.occupiedSlot;
    const week = picker.buildWeek(0);

    for (const day of week.days) {
      const slots = picker.getAvailableSlots(0, day.weekdayIndex);
      if (!slots.includes(targetTime)) continue;

      const [y, m, d] = day.iso.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date.getTime() < today.getTime()) continue;

      picker.restoreFromBooking({ dayIso: day.iso, time: targetTime });
      picker.refresh(root, mentor, opts);
      return;
    }
  }

  function renderAppointmentShell(mentor) {
    if (!spec42) return;

    const mentorCardEl = document.getElementById('appointment-mentor-card');
    const titleEl = document.getElementById('appointment-title');
    const subtitleEl = document.getElementById('appointment-subtitle');
    const metaEl = document.getElementById('appointment-meta');
    const pickerRoot = document.getElementById('appointment-picker');

    if (mentorCardEl) {
      mentorCardEl.innerHTML = renderRecordatorioMentor(mentor);
      mentorCardEl.removeAttribute('aria-hidden');
    }

    if (titleEl) titleEl.textContent = spec42.copy.title;
    if (subtitleEl) subtitleEl.textContent = spec42.copy.subtitle;
    if (metaEl) metaEl.textContent = spec42.copy.meta;

    resetAppointmentConfirmFlow();
    hideAppointmentToast();
    applyAppointmentOfflineState();

    if (!isSinConexionScenario() && pickerRoot && window.AppointmentPicker) {
      const pickerOpts = getPickerOptions(mentor);
      window.AppointmentPicker.reset({ weekOffset: getInitialWeekOffset() });
      if (!pickerReady) {
        window.AppointmentPicker.init(pickerRoot, mentor, pickerOpts);
        pickerReady = true;
      } else {
        window.AppointmentPicker.refresh(pickerRoot, mentor, pickerOpts);
      }
      if (isSlotOcupadoScenario()) {
        seedSlotOcupadoPicker(pickerRoot, mentor, pickerOpts);
      }
    }
  }

  function renderAppointmentConfirmedShell(mentor) {
    if (!spec42) return;

    const booking = getSavedBooking();
    if (!booking) {
      window.location.replace('#appointment');
      return;
    }

    const titleEl = document.getElementById('appointment-confirmed-title');
    const subtitleEl = document.getElementById('appointment-confirmed-subtitle');
    const cardSlot = document.getElementById('appointment-reminder-slot');
    const goPlanBtn = document.getElementById('appointment-go-plan-btn');
    const calendarBtn = document.getElementById('appointment-calendar-btn');

    if (titleEl) titleEl.textContent = spec42.confirmed.title;
    if (subtitleEl) {
      const line1 = fillTemplate42(spec42.confirmed.subtitleTemplate, mentor);
      const line2 = fillTemplate42(spec42.confirmed.meetLineTemplate, mentor, {
        weekday: booking.weekdayMeet,
      });
      subtitleEl.innerHTML = `<p>${line1}</p><p>${line2}</p>`;
    }
    if (cardSlot) cardSlot.innerHTML = renderReminderCard(mentor, booking);
    if (goPlanBtn) goPlanBtn.textContent = spec42.buttons.goToPlan;
    if (calendarBtn) calendarBtn.textContent = spec42.buttons.addToCalendar;
  }

  function renderGoalsCard(title, goals) {
    const items = goals
      .map(
        (text, index) => `
      <li class="goals-card__item">
        <span class="goals-card__badge">${index + 1}</span>
        <p class="goals-card__text">${text}</p>
      </li>
    `
      )
      .join('');

    return `
      <div class="goals-card">
        <h2 class="goals-card__title">${title}</h2>
        <ol class="goals-card__list">${items}</ol>
      </div>
    `;
  }

  function renderGoalsCardSkeleton(title) {
    const lines = [1, 2, 3]
      .map(() => '<div class="goals-card__skeleton-line" aria-hidden="true"></div>')
      .join('');

    return `
      <div class="goals-card goals-card--pending">
        <h2 class="goals-card__title">${title}</h2>
        <div class="goals-card__skeleton-lines">${lines}</div>
      </div>
    `;
  }

  function renderSummaryPendingBanner() {
    if (!spec43) return '';
    return `
      <div class="call-summary-pending-banner" role="status" aria-live="polite">
        <img
          class="call-summary-pending-banner__icon"
          src="../${spec43.assets.bell}"
          alt=""
          width="24"
          height="24"
        />
        <p class="call-summary-pending-banner__message">${spec43.copy.summaryPendingToast}</p>
      </div>
    `;
  }

  function renderRecordatorioTitle(mentor, isFollowUp) {
    if (!spec43) return '';
    const prefix = isFollowUp ? 'Seguimiento con ' : 'Cita con ';
    return `
      <h2 class="recordatorio-cita__title">
        <span class="recordatorio-cita__title-prefix">${prefix}</span><span class="recordatorio-cita__title-accent">${mentor.firstName}.</span>
      </h2>
    `;
  }

  function renderRecordatorioCita(mentor, booking, options) {
    if (!spec43) return '';
    const opts = options || {};
    const isFollowUp = Boolean(opts.followUp);
    const meta = formatShortMeta(booking.dayIso, booking.time);
    const joinState = opts.joinState || getJoinState(booking);
    const joinLooksDisabled = joinState !== 'active';
    const joinTrulyDisabled = joinState === 'disabled';
    const joinEarly = joinState === 'early-same-day';
    const joinBtnId = opts.joinBtnId || '';
    const joinBtnClasses = [
      'btn',
      'btn--primary',
      'recordatorio-cita__join-btn',
      joinLooksDisabled ? 'btn--disabled' : '',
      joinEarly ? 'recordatorio-cita__join-btn--early' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <article class="recordatorio-cita">
        <div class="recordatorio-cita__content">
          ${renderRecordatorioTitle(mentor, isFollowUp)}
          <p class="recordatorio-cita__meta">${meta}</p>
          <div class="recordatorio-cita__join">
            <button
              type="button"
              class="${joinBtnClasses}"
              ${joinBtnId ? `id="${joinBtnId}"` : ''}
              ${joinTrulyDisabled ? 'disabled aria-disabled="true"' : ''}
            >${spec43.copy.joinButton}</button>
          </div>
        </div>
        <div class="recordatorio-cita__illustration-wrap" aria-hidden="true">
          <img
            class="recordatorio-cita__illustration"
            src="${getCitaSeguimientoPhotoSrc(mentor)}"
            alt=""
            width="${spec43.layout.illustrationWidth}"
            height="${spec43.layout.illustrationHeight}"
          />
        </div>
      </article>
    `;
  }

  function renderBridgeReminderCard(mentor, booking) {
    if (!spec43) return '';
    const icons = spec43.assets.reminderIcons;
    const mentorLabel = formatMentorShortName(mentor);

    return `
      <div class="reminder-card">
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.user}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${mentorLabel}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.calendar}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${formatDateLabel(booking.dayIso)}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.clock}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${booking.time}</p>
        </div>
        <div class="reminder-card__row">
          <img class="reminder-card__icon" src="../${icons.video}" alt="" width="24" height="24" />
          <p class="reminder-card__text">${spec43.videoFormat}</p>
        </div>
      </div>
    `;
  }

  function renderHomeWelcomeTitle(targetId) {
    if (!spec43) return;
    const titleEl = document.getElementById(targetId);
    const userName = spec.userName || 'Pedro';
    if (titleEl) {
      titleEl.innerHTML = spec43.copy.homeTitleTemplate.replace(
        '{userName}',
        `<span class="accent">${userName}</span>`
      );
    }
  }

  function renderHomeInitialShell(ctx) {
    if (!spec43 || !ctx) return;
    let { mentor, booking } = ctx;

    if (isEntraAntesScenario()) {
      setGoalsMock(null);
      booking = ensureEntraAntesBooking(booking);
      saveBooking(booking);
    }

    const joinState = getJoinState(booking);

    renderHomeWelcomeTitle('home-initial-title');

    const goalsSlot = document.getElementById('home-initial-goals-slot');
    if (goalsSlot) {
      goalsSlot.innerHTML = '';
      goalsSlot.hidden = true;
    }

    const recordatorioSlot = document.getElementById('home-initial-recordatorio-slot');
    if (recordatorioSlot) {
      recordatorioSlot.innerHTML = renderRecordatorioCita(mentor, booking, {
        joinState,
        joinBtnId: 'home-initial-join-btn',
      });
    }
  }

  function renderMeetBridgeShell(ctx) {
    if (!spec43 || !ctx) return;
    const { mentor, booking } = ctx;

    const titleEl = document.getElementById('meet-bridge-title');
    const mentorSlot = document.getElementById('meet-bridge-mentor-slot');
    const reminderSlot = document.getElementById('meet-bridge-reminder-slot');
    const joinBtn = document.getElementById('meet-bridge-join-btn');
    const backSlot = document.getElementById('meet-bridge-back-slot');

    if (backSlot && window.BarraSuperiorBack) {
      backSlot.innerHTML = window.BarraSuperiorBack.render({
        id: 'meet-bridge-back-btn',
        variant: 'predeterminada',
        ariaLabel: 'Volver',
      });
      window.BarraSuperiorBack.bind('meet-bridge-back-btn', () => {
        window.history.back();
      });
    }

    if (titleEl) {
      titleEl.textContent = fillTemplate(spec43.copy.bridgeTitleTemplate, mentor);
    }
    /* recordatorio-mentor (Figma 12962:31247) — mismo componente que ya usa
       la pantalla de agenda de cita (4.2). */
    if (mentorSlot) mentorSlot.innerHTML = renderRecordatorioMentor(mentor);
    if (reminderSlot) reminderSlot.innerHTML = renderBridgeReminderCard(mentor, booking);
    if (joinBtn) joinBtn.textContent = spec43.copy.joinNowButton;

    const noshowBtn = document.getElementById('meet-bridge-noshow-btn');
    if (noshowBtn) {
      noshowBtn.textContent = spec43.copy.mentorNoShowButton;
      /* DEMO_MODE (temporal, ver arriba) oculta este botón en la demo. */
      noshowBtn.hidden = DEMO_MODE;
    }

    hideMeetBridgeLoading();
  }

  function renderMeetExternalShell() {
    if (!spec43) return;
    const titleEl = document.getElementById('meet-external-title');
    const hintEl = document.getElementById('meet-external-hint');
    const finishBtn = document.getElementById('meet-external-finish-btn');
    const noshowBtn = document.getElementById('meet-external-noshow-btn');

    if (titleEl) titleEl.textContent = spec43.copy.meetStubTitle;
    if (hintEl) hintEl.textContent = spec43.copy.meetStubHint;
    if (finishBtn) finishBtn.textContent = spec43.copy.meetStubSimulate;
    if (noshowBtn) {
      noshowBtn.textContent = spec43.copy.mentorNoShowButton;
      noshowBtn.hidden = false;
    }
  }

  function renderCallSummaryShell(ctx) {
    if (!spec43 || !ctx) return;
    const { mentor, booking } = ctx;
    const followUp = getFollowUpBooking(booking);
    const pending = isSummaryPending();

    const titleEl = document.getElementById('call-summary-title');
    const subtitleEl = document.getElementById('call-summary-subtitle');
    const pendingSlot = document.getElementById('call-summary-pending-slot');
    const goalsSlot = document.getElementById('call-summary-goals-slot');
    const followUpSlot = document.getElementById('call-summary-followup-slot');
    const planBtn = document.getElementById('call-summary-plan-btn');
    const backSlot = document.getElementById('call-summary-back-slot');

    if (backSlot && window.BarraSuperiorBack) {
      backSlot.innerHTML = window.BarraSuperiorBack.render({
        id: 'call-summary-back-btn',
        variant: 'predeterminada',
        ariaLabel: 'Volver',
      });
      window.BarraSuperiorBack.bind('call-summary-back-btn', () => {
        window.history.back();
      });
    }

    if (titleEl) titleEl.textContent = spec43.copy.summaryTitle;
    if (subtitleEl) {
      subtitleEl.textContent = pending
        ? fillTemplate(spec43.copy.summaryPendingSubtitleTemplate, mentor)
        : fillTemplate(spec43.copy.summarySubtitleTemplate, mentor);
    }
    if (pendingSlot) {
      pendingSlot.innerHTML = pending ? renderSummaryPendingBanner() : '';
      pendingSlot.hidden = !pending;
    }
    if (goalsSlot) {
      goalsSlot.innerHTML = pending
        ? renderGoalsCardSkeleton(spec43.copy.goalsCardTitle)
        : renderGoalsCard(spec43.copy.goalsCardTitle, spec43.goals);
    }
    if (followUpSlot) {
      followUpSlot.innerHTML = renderRecordatorioCita(mentor, followUp, {
        followUp: true,
        joinState: 'disabled',
      });
    }
    if (planBtn) {
      planBtn.textContent = pending ? spec43.copy.goToHome : spec43.copy.goToUpdatedPlan;
    }
  }

  function renderHomeUpdatedShell(ctx) {
    if (!spec43 || !ctx) return;
    const { mentor, booking } = ctx;
    const followUp = getFollowUpBooking(booking);

    renderHomeWelcomeTitle('home-updated-title');

    const goalsSlot = document.getElementById('home-updated-goals-slot');
    if (goalsSlot) {
      goalsSlot.innerHTML = renderGoalsCard(spec43.copy.goalsHomeTitle, spec43.goals);
      goalsSlot.hidden = false;
    }

    const recordatorioSlot = document.getElementById('home-updated-recordatorio-slot');
    if (recordatorioSlot) {
      recordatorioSlot.innerHTML = renderRecordatorioCita(mentor, followUp, {
        followUp: true,
        joinState: 'disabled',
      });
    }
  }

  function showHomeGoalsToast(message) {
    const toast = document.getElementById('home-goals-toast');
    const messageEl = document.getElementById('home-goals-toast-message');
    if (messageEl) messageEl.textContent = message;
    if (toast) toast.hidden = false;
  }

  function hideHomeGoalsToast() {
    const toast = document.getElementById('home-goals-toast');
    if (toast) toast.hidden = true;
  }

  function showGoalsBottomSheet(mentor) {
    if (!spec43 || !mentor) return;
    const sheet = document.getElementById('goals-bottom-sheet');
    const titleEl = document.getElementById('goals-bottom-sheet-title');
    const bodyEl = document.getElementById('goals-bottom-sheet-body');
    const rescheduleBtn = document.getElementById('goals-bottom-sheet-reschedule');
    const changeMentorBtn = document.getElementById('goals-bottom-sheet-change-mentor');

    if (titleEl) titleEl.textContent = spec43.copy.bottomSheetTitle;
    if (bodyEl) {
      bodyEl.textContent = fillTemplate(spec43.copy.bottomSheetBodyTemplate, mentor);
    }
    if (rescheduleBtn) rescheduleBtn.textContent = spec43.copy.rescheduleButton;
    if (changeMentorBtn) changeMentorBtn.textContent = spec43.copy.changeMentorButton;
    if (sheet) sheet.hidden = false;
  }

  function hideGoalsBottomSheet() {
    const sheet = document.getElementById('goals-bottom-sheet');
    if (sheet) sheet.hidden = true;
  }

  function showMeetBridgeLoading() {
    const overlay = document.getElementById('meet-bridge-loading');
    const labelEl = document.getElementById('meet-bridge-loading-text');
    if (labelEl && spec43) labelEl.textContent = spec43.copy.bridgeLoadingLabel;
    if (overlay) overlay.hidden = false;
  }

  function hideMeetBridgeLoading() {
    if (bridgeLoadingTimer) {
      clearTimeout(bridgeLoadingTimer);
      bridgeLoadingTimer = null;
    }
    bridgeLoadingActive = false;
    const overlay = document.getElementById('meet-bridge-loading');
    if (overlay) overlay.hidden = true;
  }

  function startMeetBridgeTransition() {
    if (!spec43 || bridgeLoadingActive) return;
    bridgeLoadingActive = true;
    showMeetBridgeLoading();

    const duration = spec43.bridgeLoading?.durationMs || 1400;
    bridgeLoadingTimer = setTimeout(() => {
      hideMeetBridgeLoading();
      /* Figma 12637:591 (HappyPath): puente → carga → 4.3.1.3 Llamada de
         Meets (screen-meet-external) → resumen. */
      window.location.hash = 'meet-external';
    }, duration);
  }

  /* Carga breve tras "Simular fin de llamada" — reutiliza el spinner/copy
     ya construidos en 3.1 (Estamos creando tu plan...) antes del resumen. */
  function showCallSummaryLoading() {
    const overlay = document.getElementById('meet-external-loading');
    const labelEl = document.getElementById('meet-external-loading-text');
    if (labelEl) labelEl.textContent = window.FIGMA_3_1?.planGenerating?.message || 'Estamos creando tu plan...';
    if (overlay) overlay.hidden = false;
  }

  function hideCallSummaryLoading() {
    if (callSummaryLoadingTimer) {
      clearTimeout(callSummaryLoadingTimer);
      callSummaryLoadingTimer = null;
    }
    callSummaryLoadingActive = false;
    const overlay = document.getElementById('meet-external-loading');
    if (overlay) overlay.hidden = true;
  }

  function startCallSummaryTransition() {
    if (callSummaryLoadingActive) return;
    callSummaryLoadingActive = true;
    showCallSummaryLoading();

    const duration = window.FIGMA_3_1?.planGenerating?.durationMs || 1750;
    callSummaryLoadingTimer = setTimeout(() => {
      hideCallSummaryLoading();
      window.location.hash = 'call-summary';
    }, duration);
  }

  function handleHomeJoinAttempt() {
    if (!spec43) return;
    const booking = getSavedBooking();
    if (!booking) return;

    const joinState = getJoinState(booking);
    if (joinState === 'active') {
      window.location.hash = 'meet-bridge';
      return;
    }

    if (joinState === 'early-same-day') {
      const activationTime = formatActivationTime(booking);
      const message = spec43.copy.earlyAccessToastTemplate.replace(
        '{activationTime}',
        activationTime
      );
      showHomeGoalsToast(message);
      return;
    }

    const activationTime = formatActivationTime(booking);
    const message = spec43.copy.earlyAccessToastTemplate.replace(
      '{activationTime}',
      activationTime
    );
    showHomeGoalsToast(message);
  }

  function applyCatalogOfflineState() {
    const listWrap = document.getElementById('catalog-list-wrap');
    const offlinePanel = document.getElementById('offline-panel');
    const offlineIcon = document.getElementById('offline-icon');
    const offlineTitle = document.getElementById('offline-title');
    const offlineMessage = document.getElementById('offline-message');
    const offline = isSinConexionScenario();

    if (listWrap) listWrap.hidden = offline;

    if (offlinePanel) {
      offlinePanel.hidden = !offline;
      if (offline && spec.sinConexion) {
        if (offlineIcon) offlineIcon.src = `../${spec.sinConexion.icon}`;
        if (offlineTitle) offlineTitle.textContent = spec.sinConexion.title;
        if (offlineMessage) offlineMessage.textContent = spec.sinConexion.message;
      }
    }
  }

  function initMentorList() {
    const listRoot = document.getElementById('mentor-list');
    if (!listRoot) return;

    listRoot.addEventListener('click', (event) => {
      const card = event.target.closest('.mentor-card');
      if (card && !card.classList.contains('mentor-card--skeleton')) {
        openMentorConfirmation(card.dataset.mentorId);
      }
    });
  }

  function initCatalogBack() {
    const backSlot = document.getElementById('catalog-back-slot');
    if (!backSlot || !window.BarraSuperiorBack) return;

    backSlot.innerHTML = window.BarraSuperiorBack.render({
      id: 'catalog-back-btn',
      variant: 'predeterminada',
      ariaLabel: 'Volver',
    });
    /* "Elige tu mentor" es siempre una página aparte (mentor/index.html) —
       history.back() vuelve a Motivaciones tanto si se llegó desde el flujo
       real (activation/index.html) como desde la página suelta de perfilado. */
    window.BarraSuperiorBack.bind('catalog-back-btn', () => {
      window.history.back();
    });
  }

  function initConfirmation() {
    const primaryBtn = document.getElementById('confirmation-primary-btn');
    const backSlot = document.getElementById('confirmation-back-slot');
    const stubBackBtn = document.getElementById('mentor-stub-back');

    if (backSlot && window.BarraSuperiorBack) {
      backSlot.innerHTML = window.BarraSuperiorBack.render({
        id: 'confirmation-back-btn',
        variant: 'predeterminada',
        ariaLabel: 'Volver',
      });
      window.BarraSuperiorBack.bind('confirmation-back-btn', () => {
        window.location.hash = 'catalog';
      });
    }

    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        const mentorId = getSelectedMentorId();
        if (mentorId) sessionStorage.setItem('selectedMentorId', mentorId);
        window.location.hash = 'appointment';
      });
    }

    if (stubBackBtn) {
      stubBackBtn.addEventListener('click', () => {
        window.location.hash = 'catalog';
      });
    }
  }

  function initAppointment() {
    const toastClose = document.getElementById('appointment-toast-close');
    const goPlanBtn = document.getElementById('appointment-go-plan-btn');
    const backSlot = document.getElementById('appointment-back-slot');

    if (backSlot && window.BarraSuperiorBack) {
      backSlot.innerHTML = window.BarraSuperiorBack.render({
        id: 'appointment-back-btn',
        variant: 'predeterminada',
        ariaLabel: 'Volver',
      });
      window.BarraSuperiorBack.bind('appointment-back-btn', () => {
        window.location.hash = 'confirmation';
      });
    }

    if (toastClose) {
      toastClose.addEventListener('click', hideAppointmentToast);
    }

    if (goPlanBtn) {
      goPlanBtn.addEventListener('click', () => {
        let booking = getSavedBooking();
        const mentorId = getSelectedMentorId();
        if (mentorId) sessionStorage.setItem('selectedMentorId', mentorId);
        saveBooking({
          ...booking,
          mentorId,
        });

        const mock = getMockParam();
        if (mock) setGoalsMock(mock);
        /* Home real (Historia 3.4) en vez de la pantalla-stub interna —
           isFirstAppointmentPending() en home-app.js ya la muestra bloqueada
           hasta que se complete esta primera cita. */
        window.location.href = '../home/index.html';
      });
    }
  }

  function initGoalsFlow() {
    const bridgeJoinBtn = document.getElementById('meet-bridge-join-btn');
    const meetFinishBtn = document.getElementById('meet-external-finish-btn');
    const summaryPlanBtn = document.getElementById('call-summary-plan-btn');
    const toastClose = document.getElementById('home-goals-toast-close');
    const noshowBridgeBtn = document.getElementById('meet-bridge-noshow-btn');
    const noshowExternalBtn = document.getElementById('meet-external-noshow-btn');
    const sheetBackdrop = document.getElementById('goals-bottom-sheet-backdrop');
    const sheetClose = document.getElementById('goals-bottom-sheet-close');
    const sheetReschedule = document.getElementById('goals-bottom-sheet-reschedule');
    const sheetChangeMentor = document.getElementById('goals-bottom-sheet-change-mentor');

    document.addEventListener('click', (event) => {
      const joinBtn = event.target.closest('#home-initial-join-btn');
      if (joinBtn) {
        event.preventDefault();
        handleHomeJoinAttempt();
      }
    });

    if (bridgeJoinBtn) {
      bridgeJoinBtn.addEventListener('click', () => {
        startMeetBridgeTransition();
      });
    }

    const openNoShowSheet = () => {
      const mentor = resolveGoalsMentor(parseRoute());
      if (mentor) showGoalsBottomSheet(mentor);
    };

    if (noshowBridgeBtn) noshowBridgeBtn.addEventListener('click', openNoShowSheet);
    if (noshowExternalBtn) noshowExternalBtn.addEventListener('click', openNoShowSheet);

    if (sheetBackdrop) sheetBackdrop.addEventListener('click', hideGoalsBottomSheet);
    if (sheetClose) sheetClose.addEventListener('click', hideGoalsBottomSheet);

    if (sheetReschedule) {
      sheetReschedule.addEventListener('click', () => {
        hideGoalsBottomSheet();
        const mentorId = resolveActiveMentorId();
        if (mentorId) sessionStorage.setItem('selectedMentorId', mentorId);
        window.location.hash = 'appointment';
      });
    }

    if (sheetChangeMentor) {
      sheetChangeMentor.addEventListener('click', () => {
        hideGoalsBottomSheet();
        sessionStorage.removeItem('selectedMentorId');
        window.location.hash = 'catalog';
      });
    }

    if (meetFinishBtn) {
      meetFinishBtn.addEventListener('click', () => {
        if (isSinResumenScenario()) {
          sessionStorage.setItem(GOALS_PENDING_KEY, 'true');
          sessionStorage.removeItem(GOALS_COMPLETED_KEY);
        } else {
          sessionStorage.setItem(GOALS_COMPLETED_KEY, 'true');
          sessionStorage.removeItem(GOALS_PENDING_KEY);
        }
        startCallSummaryTransition();
      });
    }

    if (summaryPlanBtn) {
      summaryPlanBtn.addEventListener('click', () => {
        /* Home real (Historia 3.4) en vez de las pantallas-stub internas
           #home-initial/#home-updated — home-app.js ya decide bloqueada vs.
           desbloqueada según goalsCallCompleted, que este flujo ya fija. */
        window.location.href = '../home/index.html';
      });
    }

    if (toastClose) {
      toastClose.addEventListener('click', hideHomeGoalsToast);
    }
  }

  function initDebugPanel() {
    const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true';
    if (!isDebug) return;

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '../css/dev-panel.css';
    document.head.appendChild(css);

    const viewport = document.querySelector('.app-viewport');
    const debugPanel = document.createElement('aside');
    debugPanel.className = 'dev-panel';
    debugPanel.id = 'dev-panel';
    debugPanel.setAttribute('aria-label', 'Especificación Fase 0');
    if (viewport) viewport.appendChild(debugPanel);

    const script41 = document.createElement('script');
    script41.src = '../js/dev-spec.js';
    document.body.appendChild(script41);
    if (spec42) {
      const script42 = document.createElement('script');
      script42.src = '../js/dev-spec-4-2.js';
      document.body.appendChild(script42);
    }
    if (spec43) {
      const script43 = document.createElement('script');
      script43.src = '../js/dev-spec-4-3.js';
      document.body.appendChild(script43);
    }
  }

  function initRouter() {
    const navigate = () => showScreen(parseRoute());

    window.addEventListener('hashchange', navigate);

    function boot() {
      if (!readScenarioFromUrl() && !readHash()) {
        sessionStorage.removeItem(SCENARIO_KEY);
      }
      if (isErrorCargaScenario() && !readHash()) {
        window.location.hash = 'catalog';
      }
      if (isSinConexionScenario() && readHash() && readHash() !== 'appointment') {
        window.location.hash = 'catalog';
      }
      navigate();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  mountCatalogStepper();
  mountAppointmentStepper();
  initMentorList();
  initCatalogBack();
  initConfirmation();
  initAppointment();
  initGoalsFlow();
  initDebugPanel();
  initRouter();

  window.MentorApp = {
    showScreen,
    parseRoute,
    openMentorConfirmation,
    renderMentorList,
    renderSkeletonList,
    renderConfirmation,
    renderAppointmentShell,
    renderAppointmentConfirmedShell,
    getHeroSrc,
    fillTemplate,
    fillTemplate42,
    formatMentorShortName,
    genderTerms,
    getScenario,
    isErrorCargaScenario,
    isSinConexionScenario,
    isSinHuecosScenario,
    isSlotOcupadoScenario,
  };
})();
