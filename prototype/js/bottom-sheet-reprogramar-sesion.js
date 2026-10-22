/**
 * BottomSheetReprogramarSesion — Figma 13354:90634
 * Reprogramar o saltar sesión con selector de días (semana actual / siguiente).
 */
(function () {
  const spec = window.FIGMA_SESSION_DETAIL;
  if (!spec) return;

  const sheetCopy = spec.bottomSheetReprogramarSesion;
  const referenceDateIso = spec.mockTodayIso;

  let sheetEl = null;
  let isOpen = false;
  let isExpanded = false;
  let weekOffset = 0;
  let selectedDateIso = null;
  let onConfirmCallback = null;
  let onSkipCallback = null;
  let onCloseCallback = null;

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/session-detail/')) return `../${path}`;
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

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getReferenceDate() {
    return startOfDay(parseIso(referenceDateIso));
  }

  function getMinSelectableDate() {
    return addDays(getReferenceDate(), 1);
  }

  function getMaxSelectableDate() {
    return startOfDay(addDays(getWeekStart(1), 6));
  }

  const VALIDATION_TOAST = {
    past: 'No puedes reprogramar a un día que ya pasó',
    limit: 'Solo puedes reprogramar dentro de las próximas dos semanas',
    occupied: 'Ya tienes una sesión ese día',
  };

  function isPastDay(date) {
    return startOfDay(date) < getReferenceDate();
  }

  function isBeyondMaxRange(date) {
    return startOfDay(date) > getMaxSelectableDate();
  }

  function isDayOccupied(date) {
    if (!window.PlanSessions) return false;
    const iso = toIso(startOfDay(date));
    return PlanSessions.isDateOccupied(iso);
  }

  function isDaySelectable(date) {
    const day = startOfDay(date);
    if (day < startOfDay(getMinSelectableDate()) || day > getMaxSelectableDate()) {
      return false;
    }
    if (isDayOccupied(date)) return false;
    return true;
  }

  function isDayDisabled(date) {
    return !isDaySelectable(date);
  }

  function getDayBlockReason(date) {
    if (isPastDay(date)) return 'past';
    if (isBeyondMaxRange(date)) return 'limit';
    if (isDayOccupied(date)) return 'occupied';
    return 'unavailable';
  }

  function showValidationToast(reason) {
    const message = VALIDATION_TOAST[reason];
    if (!message) return;

    window.AppToast?.show({
      message,
      durationMs: 2500,
    });
  }

  function getWeekStart(offset) {
    return addDays(startOfWeekMonday(getReferenceDate()), offset * 7);
  }

  function getWeekDays(offset) {
    const start = getWeekStart(offset);
    return Array.from({ length: 7 }, (_, i) => startOfDay(addDays(start, i)));
  }

  function hasSelectableDaysInWeek(offset) {
    return getWeekDays(offset).some((day) => !isDayDisabled(day));
  }

  function getInitialWeekOffset() {
    if (hasSelectableDaysInWeek(0)) {
      return 0;
    }

    return 1;
  }

  function getFirstSelectableDateInWeek(offset) {
    const days = getWeekDays(offset);
    return days.find((day) => isDaySelectable(day)) || null;
  }

  function formatWeekLabel(offset) {
    const ref = getReferenceDate();
    const weekStart = getWeekStart(offset);
    const weekEnd = addDays(weekStart, 6);

    if (offset === 0 && ref >= weekStart && ref <= weekEnd) {
      return window.DateFormat
        ? window.DateFormat.formatTodayLabel(ref)
        : `Hoy, ${ref.getDate()} de ${spec.monthNames[ref.getMonth()]}`;
    }

    if (window.DateFormat) {
      return window.DateFormat.formatWeekRangeLabel(weekStart, weekEnd);
    }

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()}–${weekEnd.getDate()} ${spec.monthNames[weekStart.getMonth()]}`;
    }

    return `${weekStart.getDate()} ${spec.monthNames[weekStart.getMonth()]} – ${weekEnd.getDate()} ${spec.monthNames[weekEnd.getMonth()]}`;
  }

  function chevronDownSvg(stroke) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function chevronUpSvg(stroke) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 15l-6-6-6 6" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function renderDayPill(date, index) {
    const iso = toIso(date);
    const disabled = isDayDisabled(date);
    const isSelected = !disabled && iso === selectedDateIso;
    const assets = spec.assets;

    let circleHtml;
    if (disabled) {
      circleHtml = `<span class="DayPill__circle"><img src="${resolveAsset(assets.circleDisabled)}" alt="" width="40" height="40" /></span>`;
    } else if (isSelected) {
      circleHtml = `<span class="DayPill__circle"><img src="${resolveAsset(assets.circleSelected)}" alt="" width="40" height="40" /></span>`;
    } else {
      circleHtml = `<span class="DayPill__circle"><img src="${resolveAsset(assets.circleDefault)}" alt="" width="40" height="40" /></span>`;
    }

    const classes = ['DayPill'];
    if (isSelected) classes.push('is-selected');
    if (disabled) classes.push('is-disabled');

    return `
      <button
        type="button"
        class="${classes.join(' ')}"
        data-date="${iso}"
        aria-label="${spec.weekDayLetters[index]} ${date.getDate()}"
        aria-pressed="${isSelected}"
        ${disabled ? 'aria-disabled="true"' : ''}
      >
        <span class="DayPill__letter">${spec.weekDayLetters[index]}</span>
        <span class="DayPill__circle-wrap">
          ${circleHtml}
          <span class="DayPill__number">${date.getDate()}</span>
        </span>
        <span class="DayPill__dot DayPill__dot--empty" aria-hidden="true"></span>
      </button>
    `;
  }

  function renderWeekSelector() {
    const assets = spec.assets;
    const atMinWeek = weekOffset <= 0;
    const atMaxWeek = weekOffset >= 1;

    return `
      <div class="BottomSheetReprogramarSesion__week" aria-label="Selector de semana">
        <div class="BottomSheetReprogramarSesion__week-toolbar">
          <button
            type="button"
            class="BottomSheetReprogramarSesion__week-nav${atMinWeek ? ' is-disabled' : ''}"
            id="reprogramar-week-prev"
            aria-label="Semana anterior"
            ${atMinWeek ? 'aria-disabled="true"' : ''}
          >
            <img class="WeekSelector__nav-chevron-icon" src="${resolveAsset(assets.chevronLeft)}" alt="" width="16" height="16" />
          </button>
          <p class="BottomSheetReprogramarSesion__week-label" id="reprogramar-week-label">${formatWeekLabel(weekOffset)}</p>
          <button
            type="button"
            class="BottomSheetReprogramarSesion__week-nav${atMaxWeek ? ' is-disabled' : ''}"
            id="reprogramar-week-next"
            aria-label="Semana siguiente"
            ${atMaxWeek ? 'aria-disabled="true"' : ''}
          >
            <img class="WeekSelector__nav-chevron-icon" src="${resolveAsset(assets.chevronRight)}" alt="" width="16" height="16" />
          </button>
        </div>
        <div class="BottomSheetReprogramarSesion__week-days WeekSelector__days" role="group" aria-label="Días de la semana" id="reprogramar-week-days">
          ${getWeekDays(weekOffset).map(renderDayPill).join('')}
        </div>
      </div>
    `;
  }

  function renderReprogramarRow() {
    const chevron = isExpanded ? chevronUpSvg('#ffffff') : chevronDownSvg('#ffffff');

    return `
      <div class="BottomSheetReprogramarSesion__reprogramar${isExpanded ? ' is-expanded' : ''}" id="reprogramar-row">
        <button
          type="button"
          class="BottomSheetReprogramarSesion__action BottomSheetReprogramarSesion__action--primary"
          id="reprogramar-toggle"
          aria-expanded="${isExpanded}"
          aria-controls="reprogramar-expand-panel"
        >
          <span class="BottomSheetReprogramarSesion__action-icon" aria-hidden="true"></span>
          <span class="BottomSheetReprogramarSesion__action-label">${sheetCopy.reprogramarLabel}</span>
          <span class="BottomSheetReprogramarSesion__action-chevron">${chevron}</span>
        </button>
        <div
          class="BottomSheetReprogramarSesion__expand"
          id="reprogramar-expand-panel"
          ${isExpanded ? '' : 'hidden'}
        >
          ${renderWeekSelector()}
          <button type="button" class="btn btn--primary BottomSheetReprogramarSesion__confirm" id="reprogramar-confirm">
            ${sheetCopy.confirmLabel}
          </button>
        </div>
      </div>
    `;
  }

  function renderBottomSheet() {
    const assets = spec.assets;

    return `
      <div
        class="BottomSheetReprogramarSesion"
        id="bottom-sheet-reprogramar-sesion"
        hidden
        role="presentation"
      >
        <button
          type="button"
          class="BottomSheetReprogramarSesion__backdrop"
          id="bottom-sheet-reprogramar-backdrop"
          aria-label="Cerrar"
        ></button>
        <div
          class="BottomSheetReprogramarSesion__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bottom-sheet-reprogramar-title"
        >
          <button
            type="button"
            class="BottomSheetReprogramarSesion__handle"
            id="bottom-sheet-reprogramar-close"
            aria-label="Cerrar"
          ></button>
          <div class="BottomSheetReprogramarSesion__content">
            <div class="BottomSheetReprogramarSesion__intro">
              <h2 class="BottomSheetReprogramarSesion__title" id="bottom-sheet-reprogramar-title">
                ${sheetCopy.title}
              </h2>
              <p class="BottomSheetReprogramarSesion__subtitle">${sheetCopy.subtitle}</p>
            </div>
            <div class="BottomSheetReprogramarSesion__actions" id="reprogramar-actions">
              ${renderReprogramarRow()}
              <button
                type="button"
                class="BottomSheetReprogramarSesion__action BottomSheetReprogramarSesion__action--outline"
                id="reprogramar-skip"
              >
                <span class="BottomSheetReprogramarSesion__action-icon" aria-hidden="true"></span>
                <span class="BottomSheetReprogramarSesion__action-label">${sheetCopy.saltarLabel}</span>
                <span class="BottomSheetReprogramarSesion__action-chevron" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function refreshReprogramarSection() {
    const actions = document.getElementById('reprogramar-actions');
    if (!actions) return;

    const skipBtn = document.getElementById('reprogramar-skip');
    const skipHtml = skipBtn ? skipBtn.outerHTML : '';

    actions.innerHTML = `${renderReprogramarRow()}${skipHtml}`;

    bindReprogramarSection();
  }

  function bindDayPills() {
    document.querySelectorAll('#reprogramar-week-days .DayPill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const date = parseIso(btn.dataset.date);

        if (!isDaySelectable(date)) {
          const reason = getDayBlockReason(date);
          if (reason === 'past' || reason === 'limit' || reason === 'occupied') {
            showValidationToast(reason);
          }
          return;
        }

        selectedDateIso = btn.dataset.date;
        refreshReprogramarSection();
      });
    });
  }

  function bindReprogramarSection() {
    document.getElementById('reprogramar-toggle')?.addEventListener('click', () => {
      isExpanded = !isExpanded;
      if (isExpanded && !selectedDateIso) {
        const initial = getFirstSelectableDateInWeek(weekOffset);
        if (initial) selectedDateIso = toIso(initial);
      }
      refreshReprogramarSection();
    });

    document.getElementById('reprogramar-week-prev')?.addEventListener('click', () => {
      if (weekOffset <= 0) {
        showValidationToast('past');
        return;
      }

      weekOffset -= 1;
      const first = getFirstSelectableDateInWeek(weekOffset);
      selectedDateIso = first ? toIso(first) : null;
      refreshReprogramarSection();
    });

    document.getElementById('reprogramar-week-next')?.addEventListener('click', () => {
      if (weekOffset >= 1) {
        showValidationToast('limit');
        return;
      }

      weekOffset += 1;
      const first = getFirstSelectableDateInWeek(weekOffset);
      selectedDateIso = first ? toIso(first) : null;
      refreshReprogramarSection();
    });

    bindDayPills();

    document.getElementById('reprogramar-confirm')?.addEventListener('click', () => {
      if (!selectedDateIso) return;

      const selectedDate = parseIso(selectedDateIso);
      if (!isDaySelectable(selectedDate)) {
        const reason = getDayBlockReason(selectedDate);
        if (reason === 'past' || reason === 'limit' || reason === 'occupied') {
          showValidationToast(reason);
        }
        return;
      }

      if (onConfirmCallback) onConfirmCallback(selectedDateIso);
      closeSheet();
    });

    document.getElementById('reprogramar-skip')?.addEventListener('click', () => {
      if (onSkipCallback) onSkipCallback();
      closeSheet();
    });
  }

  function resetState() {
    isExpanded = false;
    weekOffset = getInitialWeekOffset();
    const first = getFirstSelectableDateInWeek(weekOffset);
    selectedDateIso = first ? toIso(first) : null;
  }

  function closeSheet() {
    if (!sheetEl || !isOpen) return;

    isOpen = false;
    sheetEl.classList.remove('is-visible');

    window.setTimeout(() => {
      if (!isOpen && sheetEl) {
        sheetEl.hidden = true;
        resetState();
        refreshReprogramarSection();
      }
    }, 280);

    if (onCloseCallback) onCloseCallback();
  }

  function openSheet(options = {}) {
    if (!sheetEl) return;

    resetState();
    onConfirmCallback = typeof options.onConfirm === 'function' ? options.onConfirm : null;
    onSkipCallback = typeof options.onSkip === 'function' ? options.onSkip : null;
    onCloseCallback = typeof options.onClose === 'function' ? options.onClose : null;

    refreshReprogramarSection();
    sheetEl.hidden = false;

    requestAnimationFrame(() => {
      sheetEl.classList.add('is-visible');
    });

    isOpen = true;
  }

  function bindSheetEvents() {
    document.getElementById('bottom-sheet-reprogramar-backdrop')?.addEventListener('click', closeSheet);
    document.getElementById('bottom-sheet-reprogramar-close')?.addEventListener('click', closeSheet);
    bindReprogramarSection();
  }

  function mount(container) {
    if (!container) return;
    container.innerHTML = renderBottomSheet();
    sheetEl = document.getElementById('bottom-sheet-reprogramar-sesion');
    bindSheetEvents();
  }

  window.BottomSheetReprogramarSesion = {
    mount,
    open: openSheet,
    close: closeSheet,
  };
})();
