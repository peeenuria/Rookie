/**
 * Home — Inicio (Figma 13186:5008)
 */
(function () {
  const spec = window.FIGMA_HOME;
  if (!spec) return;

  /* ============================================================
   * DEMO_MODE — SOLO para la demo en clase. TEMPORAL, revertir después.
   * Con esto en true, el botón "Unirme" sale siempre habilitado en la
   * card de mentor (tanto "Cita con…" como "Seguimiento con…"), aunque
   * la cita real sea en el futuro — así se puede enseñar el flujo
   * completo sin esperar. La lógica real (deshabilitado hasta el día de
   * la cita) sigue intacta debajo, solo queda enmascarada.
   * Para volver a la lógica real: DEMO_MODE = false.
   * ============================================================ */
  const DEMO_MODE = true;

  let weekOffset = 0;
  let selectedDate = spec.referenceDate;
  let sessionChecked = false;
  let goalsState = spec.biweeklyGoals.map((g) => ({ ...g }));
  let unsubscribePlan = null;

  function syncPlanFromStore() {
    if (!window.PlanSessions) return;
    PlanSessions.ensureAvailabilityReconciled();
    spec.scheduledDates = PlanSessions.getScheduledDateIsos();
    syncGoalsFromPlan();

    try {
      const focusIso = sessionStorage.getItem('rookie.focusSessionDate');
      if (focusIso) {
        selectedDate = focusIso;
        weekOffset = getWeekOffsetForDate(focusIso);
        sessionStorage.removeItem('rookie.focusSessionDate');
      }
    } catch (_) {
      /* ignore */
    }
  }

  /* checked SIEMPRE lo decide el sistema a partir de sesiones realmente
     completadas (PlanSessions.getBiweeklyGoalsProgress) — nunca a mano. */
  function syncGoalsFromPlan() {
    if (!window.PlanSessions?.getWeeklySessionCount) return;

    const count = PlanSessions.getWeeklySessionCount();
    const sessionsText = PlanSessions.formatSessionsPerWeekGoal(count);
    const progress = PlanSessions.getBiweeklyGoalsProgress?.() ?? {};

    goalsState = goalsState.map((goal) => {
      if (goal.id === 'sessions') {
        return { ...goal, text: sessionsText, checked: Boolean(progress.sessionsGoalMet) };
      }
      if (goal.id === 'rest') {
        return { ...goal, checked: Boolean(progress.restGoalMet) };
      }
      if (goal.id === 'distance') {
        return { ...goal, checked: Boolean(progress.distanceGoalMet) };
      }
      return goal;
    });
  }

  function getWeekOffsetForDate(iso) {
    const refWeekStart = startOfWeekMonday(getReferenceDate());
    const targetWeekStart = startOfWeekMonday(parseIso(iso));
    const diffMs = targetWeekStart.getTime() - refWeekStart.getTime();
    return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  }

  /**
   * Lee el toast pendiente y, si es reprogramación, enfoca la nueva fecha
   * antes del primer render (sin consumir aún el payload del toast).
   */
  function applyPendingRescheduleFocus() {
    if (!window.PlanSessions) return;

    try {
      const raw = sessionStorage.getItem(PlanSessions.pendingToastStorageKey);
      if (!raw) return;

      const payload = JSON.parse(raw);
      if (payload.type === 'rescheduled' && payload.newDateIso) {
        selectedDate = payload.newDateIso;
        weekOffset = getWeekOffsetForDate(payload.newDateIso);
        sessionChecked = false;
      }
    } catch (_) {
      /* ignore invalid toast payload */
    }
  }

  function getSessionForDate(dateIso) {
    return window.PlanSessions?.getViewModel(dateIso) ?? null;
  }

  /* Inicio_VersiónInicial (Figma 13648:7763) — sesión de hoy y objetivos
     bloqueados hasta que se complete la 1ª cita con el mentor (mismo flag
     que ya usa mentor-app.js tras la videollamada). */
  function isFirstAppointmentPending() {
    return sessionStorage.getItem('goalsCallCompleted') !== 'true';
  }

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/home/')) return `../${path}`;
    return path;
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

  function isPastDay(date) {
    const today = getReferenceDate();
    return (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() < today.getDate())
    );
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function getReferenceDate() {
    return parseIso(spec.referenceDate);
  }

  function getVisibleWeekStart() {
    return addDays(startOfWeekMonday(getReferenceDate()), weekOffset * 7);
  }

  function getWeekDays() {
    const start = getVisibleWeekStart();
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  function hasScheduledSession(iso) {
    if (window.PlanSessions) {
      return PlanSessions.hasScheduledSession(iso);
    }
    const refStart = startOfWeekMonday(getReferenceDate());
    const refEnd = addDays(refStart, 6);
    const date = parseIso(iso);
    if (date < refStart || date > refEnd) return false;
    return spec.scheduledDates.includes(iso);
  }

  function formatWeekSelectorLabel() {
    const today = getReferenceDate();
    const selected = parseIso(selectedDate);
    const weekStart = getVisibleWeekStart();
    const weekEnd = addDays(weekStart, 6);

    if (isSameDay(selected, today) && today >= weekStart && today <= weekEnd && weekOffset === 0) {
      return window.DateFormat
        ? window.DateFormat.formatTodayLabel(selected)
        : `Hoy, ${selected.getDate()} de ${spec.monthNames[selected.getMonth()]}`;
    }

    if (window.DateFormat) {
      return window.DateFormat.formatWeekRangeLabel(weekStart, weekEnd);
    }

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()}–${weekEnd.getDate()} ${spec.monthNames[weekStart.getMonth()]}`;
    }

    return `${weekStart.getDate()} ${spec.monthNames[weekStart.getMonth()]} – ${weekEnd.getDate()} ${spec.monthNames[weekEnd.getMonth()]}`;
  }

  function formatSessionDateLabel(date) {
    if (window.DateFormat) return window.DateFormat.formatDateLabel(date);

    const weekday = spec.weekdayNamesCapitalized[date.getDay()];
    return `${weekday}, ${date.getDate()} de ${spec.monthNames[date.getMonth()]}`;
  }

  function getMotivationalPhrase() {
    const ref = parseIso(spec.referenceDate);
    const selected = parseIso(selectedDate);
    const diffDays = Math.round((selected.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000));
    const len = spec.motivationalPhrases.length;
    const index = ((diffDays % len) + len) % len;
    return spec.motivationalPhrases[index];
  }

  function renderDayPill(date, index) {
    const iso = toIso(date);
    const isSelected = iso === selectedDate;
    const hasSession = hasScheduledSession(iso);
    const isPast = isPastDay(date);
    const assets = spec.assets;

    let circleHtml;
    if (isSelected) {
      circleHtml = `<span class="DayPill__circle"><img src="${resolveAsset(assets.circleSelected)}" alt="" width="40" height="40" /></span>`;
    } else {
      circleHtml = `<span class="DayPill__circle"><img src="${resolveAsset(assets.circleDefault)}" alt="" width="40" height="40" /></span>`;
    }

    const dotClass = hasSession ? 'DayPill__dot' : 'DayPill__dot DayPill__dot--empty';
    const dotAsset = isFirstAppointmentPending() ? assets.activityDotLocked : assets.activityDot;
    const dotHtml = hasSession
      ? `<span class="${dotClass}"><img src="${resolveAsset(dotAsset)}" alt="" width="8" height="8" /></span>`
      : `<span class="${dotClass}" aria-hidden="true"></span>`;

    return `
      <button
        type="button"
        class="DayPill${isSelected ? ' is-selected' : ''}${isPast ? ' is-disabled' : ''}"
        data-date="${iso}"
        aria-label="${spec.weekDayLetters[index]} ${date.getDate()}"
        aria-pressed="${isSelected}"
        ${isPast ? 'disabled aria-disabled="true"' : ''}
      >
        <span class="DayPill__letter">${spec.weekDayLetters[index]}</span>
        <span class="DayPill__circle-wrap">
          ${circleHtml}
          <span class="DayPill__number">${date.getDate()}</span>
        </span>
        ${dotHtml}
      </button>
    `;
  }

  function renderWeekSelector() {
    const days = getWeekDays();
    const assets = spec.assets;

    return `
      <header class="WeekSelector" aria-label="Selector semanal">
        <div class="WeekSelector__toolbar">
          <button type="button" class="WeekSelector__icon-btn WeekSelector__icon-btn--plus" aria-label="Añadir">
            <img src="${resolveAsset(assets.plus)}" alt="" width="24" height="24" />
          </button>
          <div class="WeekSelector__nav-group">
            <button type="button" class="WeekSelector__nav-btn" id="home-week-prev" aria-label="Semana anterior">
              <img
                class="WeekSelector__nav-chevron-icon"
                src="${resolveAsset(assets.chevronLeft)}"
                alt=""
                width="16"
                height="16"
              />
            </button>
            <p class="WeekSelector__label" id="home-week-label">${formatWeekSelectorLabel()}</p>
            <button type="button" class="WeekSelector__nav-btn" id="home-week-next" aria-label="Semana siguiente">
              <img
                class="WeekSelector__nav-chevron-icon"
                src="${resolveAsset(assets.chevronRight)}"
                alt=""
                width="16"
                height="16"
              />
            </button>
          </div>
          <button type="button" class="WeekSelector__icon-btn WeekSelector__icon-btn--filters" id="home-open-dias-sheet" aria-label="Filtros">
            <img src="${resolveAsset(assets.sliders)}" alt="" width="24" height="24" />
          </button>
        </div>
        <div class="WeekSelector__days" role="group" aria-label="Días de la semana">
          ${days.map(renderDayPill).join('')}
        </div>
      </header>
    `;
  }

  function renderSessionTodayCardSkeleton() {
    return `
      <article class="SessionTodayCard SessionTodayCard--skeleton" aria-busy="true" aria-label="Cargando sesión">
        <div class="SessionTodayCard__body SessionTodayCard__body--skeleton">
          <div class="SessionTodayCard__header SessionTodayCard__header--skeleton">
            <div class="SessionTodayCard__text SessionTodayCard__text--skeleton">
              ${window.ShimmerBlock.render({ width: '60%', height: 20, radius: 4 })}
              ${window.ShimmerBlock.render({ width: '75%', height: 34, radius: 4 })}
            </div>
            ${window.ShimmerBlock.render({ width: 40, height: 40, radius: 4 })}
          </div>
          ${window.ShimmerBlock.render({ width: '100%', height: 1, radius: 0, className: 'SessionTodayCard__skeleton-divider' })}
          <div class="SessionTodayCard__meta SessionTodayCard__meta--skeleton">
            ${window.ShimmerBlock.render({ width: 80, height: 47, radius: 4 })}
            ${window.ShimmerBlock.render({ width: 80, height: 47, radius: 4 })}
            ${window.ShimmerBlock.render({ width: 56, height: 47, radius: 4 })}
          </div>
        </div>
      </article>
    `;
  }

  function renderSessionTodayCard() {
    if (window.AppConnectivity?.isOffline()) {
      return window.EstadoSinConexion.render(spec.sinConexion);
    }

    if (window.AppConnectivity?.isLoadingScenario()) {
      return renderSessionTodayCardSkeleton();
    }

    if (isFirstAppointmentPending()) {
      return window.SessionTodayCard.render({
        sessionType: window.SessionTodayCard.SESSION_TYPES.locked,
        lockedMessage: spec.firstAppointmentLockedMessage,
      });
    }

    const hasSession = hasScheduledSession(selectedDate);
    const session = getSessionForDate(selectedDate);

    if (!hasSession || !session) {
      return window.SessionTodayCard.render({
        sessionType: window.SessionTodayCard.SESSION_TYPES.descanso,
        dateLabel: formatSessionDateLabel(parseIso(selectedDate)),
      });
    }

    return window.SessionTodayCard.render({
      sessionType: window.SessionTodayCard.SESSION_TYPES.running,
      session,
      sessionChecked: Boolean(session.completed || sessionChecked),
    });
  }

  /**
   * Mentor + cita reales, leídos de sessionStorage (fuente de verdad que
   * escribe mentor-app.js al elegir mentor y agendar la cita) — con el
   * mock de figma-home-spec.js como fallback solo si Home se abre sin
   * haber pasado nunca por ese flujo (p. ej. pruebas aisladas).
   */
  function resolveActiveMentorContext() {
    const appt = spec.mentorAppointment;
    let booking = null;
    try {
      const raw = sessionStorage.getItem('appointmentBooking');
      booking = raw ? JSON.parse(raw) : null;
    } catch (_) {
      booking = null;
    }

    const mentorId = booking?.mentorId || sessionStorage.getItem('selectedMentorId') || appt.mentorId;
    const mentor = window.FIGMA_4_1?.mentors?.find((m) => m.id === mentorId) || null;

    return {
      mentorName: mentor ? (mentor.firstName || mentor.name || '').toUpperCase() : appt.mentorName,
      photo: mentor?.citaSeguimientoPhoto || appt.photo,
      dayIso: booking?.dayIso || appt.dayIso,
      time: booking?.time || appt.time,
      followUpDaysAfter: appt.followUpDaysAfter,
      titlePrefix: appt.titlePrefix,
      followUpTitlePrefix: appt.followUpTitlePrefix,
    };
  }

  function formatApptDateTime(dayIso, time) {
    const date = parseIso(dayIso);
    const weekday = spec.weekdayNamesCapitalized[date.getDay()];
    return `${weekday} ${date.getDate()} · ${time}`;
  }

  /* Seguimiento = 1ª cita + N días (mismo cálculo/valor que mentor-app.js). */
  function getFollowUpDateTime(ctx) {
    const followUpDate = addDays(parseIso(ctx.dayIso), ctx.followUpDaysAfter);
    const weekday = spec.weekdayNamesCapitalized[followUpDate.getDay()];
    return `${weekday} ${followUpDate.getDate()} · ${ctx.time}`;
  }

  function renderMentorAppointmentCard() {
    const ctx = resolveActiveMentorContext();
    /* CardSeguimientoMentor (Figma 12993:6760) — tras la 1ª cita, esta misma
       card pasa a mostrar el seguimiento, deshabilitado (se agenda solo). */
    const isFollowUp = !isFirstAppointmentPending();
    const prefix = isFollowUp ? ctx.followUpTitlePrefix : ctx.titlePrefix;
    const dateTime = isFollowUp ? getFollowUpDateTime(ctx) : formatApptDateTime(ctx.dayIso, ctx.time);
    /* CardCitaMentor_AntesDeTiempo (Figma 12970:11878/13223:91218) — "Unirme"
       va deshabilitado hasta el día de la cita en ambos casos (cita y
       seguimiento); el mock de fecha de referencia siempre es anterior.
       DEMO_MODE (temporal, ver arriba) fuerza habilitado en ambas cards,
       para poder enseñar el flujo completo mañana sin esperar la fecha. */
    const joinDisabled = !DEMO_MODE;
    const joinBtnClass = `btn btn--primary MentorAppointmentCard__join${joinDisabled ? ' btn--disabled' : ''}`;

    return `
      <article class="MentorAppointmentCard" aria-label="${isFollowUp ? 'Próximo seguimiento con mentor' : 'Próxima cita con mentor'}">
        <div class="MentorAppointmentCard__content">
          <div class="MentorAppointmentCard__heading">
            <p class="MentorAppointmentCard__prefix">${prefix}</p>
            <p class="MentorAppointmentCard__name">${ctx.mentorName}</p>
          </div>
          <p class="MentorAppointmentCard__datetime">${dateTime}</p>
          <div class="MentorAppointmentCard__actions">
            <button type="button" class="${joinBtnClass}" ${joinDisabled ? 'disabled' : ''}>${spec.joinButton}</button>
          </div>
        </div>
        <div class="MentorAppointmentCard__photo-wrap" aria-hidden="true">
          <img
            class="MentorAppointmentCard__photo"
            src="${resolveAsset(ctx.photo)}"
            alt=""
            width="160"
            height="200"
          />
        </div>
      </article>
    `;
  }

  function renderBiweeklyGoalsCardLocked() {
    return `
      <article class="BiweeklyGoalsCard BiweeklyGoalsCard--locked" aria-label="Objetivos bloqueados">
        <p class="BiweeklyGoalsCard__locked-text">${spec.firstAppointmentLockedGoalsMessage}</p>
      </article>
    `;
  }

  function renderBiweeklyGoalsCard() {
    if (isFirstAppointmentPending()) {
      return renderBiweeklyGoalsCardLocked();
    }

    const items = goalsState
      .map(
        (goal) => `
        <li class="BiweeklyGoalsCard__item">
          <span
            class="BiweeklyGoalsCard__checkbox${goal.checked ? ' is-checked' : ''}"
            role="img"
            aria-label="${goal.checked ? 'Objetivo completado' : 'Objetivo pendiente'}"
          ></span>
          <p class="BiweeklyGoalsCard__text${goal.checked ? ' is-checked' : ''}">${goal.text}</p>
        </li>
      `
      )
      .join('');

    return `
      <article class="BiweeklyGoalsCard" aria-label="Objetivos de la quincena">
        <ul class="BiweeklyGoalsCard__list">${items}</ul>
      </article>
    `;
  }

  function renderScreen() {
    const greeting = spec.greetingTemplate.replace('{name}', spec.userName);

    const todaySection = `
      <section class="home-inicio__block" aria-labelledby="home-today-title">
        <h2 class="home-inicio__block-title" id="home-today-title">${spec.sections.todayPlan}</h2>
        <div id="home-session-slot">${renderSessionTodayCard()}</div>
      </section>
    `;

    const mentorSection = `
      <section class="home-inicio__block" aria-labelledby="home-mentor-title">
        <h2 class="home-inicio__block-title" id="home-mentor-title">${spec.sections.mentorSupport}</h2>
        ${renderMentorAppointmentCard()}
      </section>
    `;

    /* Inicio_VersiónInicial (Figma 13648:7763) antepone la cita con el
       mentor al plan del día mientras la 1ª cita no se ha completado. */
    const topSections = isFirstAppointmentPending()
      ? mentorSection + todaySection
      : todaySection + mentorSection;

    return `
      <section class="screen screen--home-inicio is-active" id="screen-home-inicio" aria-label="Inicio">
        <div class="home-inicio">
          ${renderWeekSelector()}
          <div class="home-inicio__scroll">
            <div class="home-inicio__scroll-inner">
              <div class="home-inicio__saludo">
                <h1 class="home-inicio__saludo-title">${greeting}</h1>
                <p class="home-inicio__saludo-phrase" id="home-motivational-phrase">${getMotivationalPhrase()}</p>
              </div>

              ${topSections}

              <section class="home-inicio__block" aria-labelledby="home-goals-title">
                <h2 class="home-inicio__block-title" id="home-goals-title">${spec.sections.biweeklyGoals}</h2>
                <div id="home-goals-slot">${renderBiweeklyGoalsCard()}</div>
              </section>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function refreshPartial() {
    const label = document.getElementById('home-week-label');
    if (label) label.textContent = formatWeekSelectorLabel();

    const phrase = document.getElementById('home-motivational-phrase');
    if (phrase) phrase.textContent = getMotivationalPhrase();

    const daysWrap = document.querySelector('.WeekSelector__days');
    if (daysWrap) {
      daysWrap.innerHTML = getWeekDays().map(renderDayPill).join('');
      bindDayPills();
    }

    const sessionSlot = document.getElementById('home-session-slot');
    if (sessionSlot) {
      sessionSlot.innerHTML = renderSessionTodayCard();
      if (!window.AppConnectivity?.isOffline() && !window.AppConnectivity?.isLoadingScenario()) {
        bindSessionCardNavigation();
      }
    }

    const goalsSlot = document.getElementById('home-goals-slot');
    if (goalsSlot) {
      goalsSlot.innerHTML = renderBiweeklyGoalsCard();
    }

    applyConnectivityState();
  }

  function bindDayPills() {
    document.querySelectorAll('.DayPill').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDate = btn.dataset.date;
        sessionChecked = false;
        refreshPartial();
      });
    });
  }

  function bindSessionCardNavigation() {
    document.querySelector('.SessionTodayCard[data-session-type="running"]')?.addEventListener('click', (event) => {
      if (event.target.closest('.SessionTodayCard__checkbox')) return;
      window.location.href = `../session-detail/index.html?fecha=${encodeURIComponent(selectedDate)}`;
    });
  }

  /* mentor-app.js (screen-meet-bridge) lee el mentor/cita de sessionStorage.
     Si YA hay una reserva real (del flujo de selección de mentor), no la
     pisamos — solo sembramos el mock de figma-home-spec.js como fallback
     cuando Home se abre sin haber pasado nunca por ese flujo. */
  function saveMentorAppointmentBooking() {
    if (sessionStorage.getItem('appointmentBooking')) return;

    const appt = spec.mentorAppointment;
    sessionStorage.setItem('selectedMentorId', appt.mentorId);
    sessionStorage.setItem(
      'appointmentBooking',
      JSON.stringify({
        dayIso: appt.dayIso,
        time: appt.time,
        dateLabel: appt.dateLabel,
        weekdayMeet: appt.weekdayMeet,
        mentorId: appt.mentorId,
      })
    );
  }

  /* "Unirme" → Historia 4.3.1.2 (PantallaPuenteAppMeets, ya construida en
     mentor-app.js). */
  function bindMentorAppointmentJoin() {
    document.querySelector('.MentorAppointmentCard__join')?.addEventListener('click', () => {
      saveMentorAppointmentBooking();
      window.location.href = '../mentor/index.html#meet-bridge';
    });
  }

  function applyConnectivityState() {
    const offline = window.AppConnectivity?.isOffline() ?? false;

    /* CardCitaMentor_AntesDeTiempo / CardSeguimientoMentor van siempre
       deshabilitadas (Figma 12970:11878, 12993:6760) — no depende de la
       conexión, así que no se reactiva nunca desde aquí. */
    document.getElementById('home-open-dias-sheet')?.toggleAttribute('disabled', offline);
    document.querySelector('.screen--home-inicio')?.classList.toggle('home-inicio--offline', offline);
  }

  function scheduleLoadingResolve() {
    if (!window.AppConnectivity?.isLoadingScenario()) return;
    if (window.AppConnectivity.shouldPersistLoading()) return;

    const delayMs = spec.loading?.delayMs ?? 1400;
    window.AppConnectivity.resolveAfterLoading(() => {
      window.AppConnectivity.clearScenario();
      refreshPartial();
      applyConnectivityState();
    }, delayMs);
  }

  function bindWeekNav() {
    document.getElementById('home-week-prev')?.addEventListener('click', () => {
      weekOffset -= 1;
      const start = getVisibleWeekStart();
      selectedDate = toIso(start);
      sessionChecked = false;
      refreshPartial();
    });

    document.getElementById('home-week-next')?.addEventListener('click', () => {
      weekOffset += 1;
      const start = getVisibleWeekStart();
      selectedDate = toIso(start);
      sessionChecked = false;
      refreshPartial();
    });
  }

  function bindBottomSheetCambiarDias() {
    document.getElementById('home-open-dias-sheet')?.addEventListener('click', () => {
      const initialDays = window.PlanSessions
        ? PlanSessions.getAvailableWeekdayIndices()
        : spec.bottomSheetCambiarDias.defaultAvailableDays;

      window.BottomSheetCambiarDias?.open({
        selectedDays: initialDays,
        onSave() {
          syncPlanFromStore();
          sessionChecked = false;
          refreshPartial();
        },
      });
    });
  }

  function mountBottomSheetCambiarDias() {
    const mountRoot =
      document.getElementById('bottom-sheet-cambiar-dias-root') ||
      document.getElementById('phone-shell');

    window.BottomSheetCambiarDias?.mount(mountRoot);
  }

  /** Rutas — BarraDeNavegacion (Figma 12954:9360) */
  function bindNavbarNavigation() {
    const navbarRoot = document.querySelector('#home-navbar .navbar');
    if (!navbarRoot || !window.Navbar) return;

    window.Navbar.bindTabNavigation(
      navbarRoot,
      window.Navbar.getSiblingTabRoutes(),
      'inicio'
    );
  }

  function handlePendingToast() {
    if (!window.AppToast || !window.PlanSessions) return;

    try {
      const raw = sessionStorage.getItem(PlanSessions.pendingToastStorageKey);
      if (!raw) return;

      sessionStorage.removeItem(PlanSessions.pendingToastStorageKey);
      const payload = JSON.parse(raw);

      if (payload.type === 'rescheduled' && payload.newDateIso) {
        const date = PlanSessions.parseIso(payload.newDateIso);
        const label = PlanSessions.formatToastDateLabel(date);
        AppToast.show({
          message: `Sesión movida a ${label}`,
          durationMs: AppToast.DEFAULT_DURATION_MS,
        });
        return;
      }

      if (payload.type === 'skipped' && payload.sessionId) {
        AppToast.show({
          message: 'Sesión saltada ·',
          actionLabel: 'Deshacer',
          durationMs: AppToast.DEFAULT_DURATION_MS,
          onAction: () => {
            PlanSessions.clearSessionState(payload.sessionId);
            syncPlanFromStore();
            refreshPartial();
          },
        });
      }
    } catch (_) {
      /* ignore invalid toast payload */
    }
  }

  function bindEvents() {
    bindWeekNav();
    bindDayPills();
    bindSessionCardNavigation();
    bindMentorAppointmentJoin();
    bindBottomSheetCambiarDias();
    bindNavbarNavigation();
  }

  function mount() {
    syncPlanFromStore();
    applyPendingRescheduleFocus();

    const root =
      document.getElementById('home-root') ||
      document.querySelector('.phone-shell__body') ||
      document.querySelector('.phone-shell__scroll');

    if (!root) return;

    mountBottomSheetCambiarDias();
    root.innerHTML = renderScreen();
    bindEvents();
    applyConnectivityState();
    scheduleLoadingResolve();

    if (window.PlanSessions) {
      unsubscribePlan = PlanSessions.subscribe(() => {
        syncPlanFromStore();
        refreshPartial();
      });
    }

    handlePendingToast();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.HomeApp = {
    mount,
    refreshPartial,
    syncPlanFromStore,
    getWeekDays,
    formatWeekSelectorLabel,
    getAvailableDays: () =>
      window.PlanSessions
        ? PlanSessions.getAvailableWeekdayIndices()
        : [...spec.bottomSheetCambiarDias.defaultAvailableDays],
  };
})();
