/**
 * Flujo 4.2 — selector semana / día / slot (calendario gregoriano real)
 * Semana lunes–domingo; offset 0 = semana actual del sistema.
 */
(function () {
  const spec = window.FIGMA_4_2;
  if (!spec) return;

  const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MONTH_NAMES = window.DateFormat?.monthNames ?? [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];

  const avail = spec.availability || {};
  const MAX_WEEKS_FORWARD = avail.maxWeeksForward || 8;
  const DEFAULT_PROFILE = avail.defaultWeekProfile || 'full';

  let state = {
    weekOffset: 0,
    selectedDayIso: null,
    selectedSlot: null,
  };

  let onChange = null;
  let renderContext = { root: null, mentor: null, options: null };

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function parseIso(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return startOfDay(new Date(y, m - 1, d));
  }

  function toIso(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getMondayOfWeek(date) {
    const d = startOfDay(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return startOfDay(d);
  }

  function isPastDay(date) {
    return date.getTime() < startOfDay(new Date()).getTime();
  }

  function formatMonthBanner(days) {
    const anchor = days[3]?.date || days[0].date;

    if (window.DateFormat) {
      const label = window.DateFormat.formatMonthYear(anchor);
      return label.charAt(0).toUpperCase() + label.slice(1);
    }

    const name = MONTH_NAMES[anchor.getMonth()];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return `${capitalized} ${anchor.getFullYear()}`;
  }

  function buildWeek(weekOffset) {
    const monday = addDays(getMondayOfWeek(new Date()), weekOffset * 7);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(monday, i);
      days.push({
        iso: toIso(date),
        num: date.getDate(),
        weekday: WEEKDAY_LETTERS[i],
        weekdayIndex: i,
        date,
      });
    }

    return {
      weekOffset,
      monthLabel: formatMonthBanner(days),
      days,
    };
  }

  function isoToWeekOffset(iso) {
    const mondayCurrent = getMondayOfWeek(new Date());
    const mondayTarget = getMondayOfWeek(parseIso(iso));
    const diffMs = mondayTarget.getTime() - mondayCurrent.getTime();
    return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  }

  function getWeekProfileName(weekOffset) {
    const profiles = avail.weekProfiles || {};
    if (profiles[weekOffset] !== undefined) return profiles[weekOffset];
    return DEFAULT_PROFILE;
  }

  function getWeekProfileConfig(weekOffset) {
    const name = getWeekProfileName(weekOffset);
    const types = avail.weekProfileTypes || {};
    return types[name] || types.full || { mode: 'all' };
  }

  function getAllSlotTimes() {
    return (avail.slotTimes || []).slice();
  }

  function getAvailableSlots(weekOffset, weekdayIndex) {
    const profileName = getWeekProfileName(weekOffset);
    const config = getWeekProfileConfig(weekOffset);
    const allTimes = getAllSlotTimes();

    if (config.mode === 'none' || profileName === 'sinHuecos') {
      return [];
    }

    if ((config.disabledWeekdayIndices || []).includes(weekdayIndex)) {
      return [];
    }

    if (config.mode === 'all' || profileName === 'full') {
      return allTimes;
    }

    if (config.mode === 'partialDays') {
      return allTimes;
    }

    if (config.mode === 'pattern') {
      const key = config.patternKey || profileName;
      const pattern = (avail.daySlotAvailability || {})[key] || {};
      return (pattern[weekdayIndex] || []).slice();
    }

    return allTimes;
  }

  function getWeek() {
    return buildWeek(state.weekOffset);
  }

  function isDayInPastForSelection(day) {
    return state.weekOffset === 0 && isPastDay(day.date);
  }

  function weekHasAnySlots() {
    const week = getWeek();
    return week.days.some((day) => {
      if (isDayInPastForSelection(day)) return false;
      return getAvailableSlots(state.weekOffset, day.weekdayIndex).length > 0;
    });
  }

  function isDayDisabled(day) {
    if (isDayInPastForSelection(day)) return true;
    return getAvailableSlots(state.weekOffset, day.weekdayIndex).length === 0;
  }

  function resetSelection() {
    state.selectedDayIso = null;
    state.selectedSlot = null;
  }

  function clampWeekOffset(offset) {
    return Math.max(0, Math.min(offset, MAX_WEEKS_FORWARD));
  }

  function setWeekOffset(offset) {
    state.weekOffset = clampWeekOffset(offset);
    resetSelection();
    notifyChange();
  }

  function selectDay(iso) {
    const week = getWeek();
    const day = week.days.find((d) => d.iso === iso);
    if (!day || isDayDisabled(day)) return;
    state.selectedDayIso = iso;
    state.selectedSlot = null;
    notifyChange();
  }

  function selectSlot(time) {
    if (!state.selectedDayIso) return;

    const week = getWeek();
    const day = week.days.find((d) => d.iso === state.selectedDayIso);
    if (!day) return;

    const available = getAvailableSlots(state.weekOffset, day.weekdayIndex);
    if (!available.includes(time)) return;

    state.selectedSlot = time;
    notifyChange();
  }

  function getPickerState() {
    if (!state.selectedDayIso) return 'pickDay';
    if (!state.selectedSlot) return 'dayWithSlots';
    return 'confirmSlot';
  }

  function formatDateLabel(iso) {
    const date = parseIso(iso);
    if (window.DateFormat) return window.DateFormat.formatDateLabel(date);

    const weekday = WEEKDAY_NAMES[date.getDay()];
    const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `${capitalized}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
  }

  function formatWeekdayMeet(iso) {
    return WEEKDAY_NAMES[parseIso(iso).getDay()];
  }

  function getBooking() {
    if (!state.selectedDayIso || !state.selectedSlot) return null;
    return {
      dayIso: state.selectedDayIso,
      time: state.selectedSlot,
      dateLabel: formatDateLabel(state.selectedDayIso),
      weekdayMeet: formatWeekdayMeet(state.selectedDayIso),
    };
  }

  function notifyChange() {
    if (renderContext.root) {
      render(renderContext.root, renderContext.mentor, renderContext.options);
    }
    if (onChange) onChange();
  }

  function renderDayCell(day) {
    const disabled = isDayDisabled(day);
    const selected = state.selectedDayIso === day.iso;
    const classes = ['pills-dias'];
    if (selected) classes.push('is-selected');
    if (disabled) classes.push('is-disabled');

    return `
      <button
        type="button"
        class="${classes.join(' ')}"
        data-day-iso="${day.iso}"
        ${disabled ? 'disabled' : ''}
        aria-pressed="${selected}"
        aria-label="${day.num} ${day.weekday}"
      >
        <span class="pills-dias__num">${day.num}</span>
        <span class="pills-dias__weekday">${day.weekday}</span>
      </button>
    `;
  }

  function renderSlotCell(time, isAvailable) {
    const selected = state.selectedSlot === time;
    const classes = ['pill-horas'];
    if (selected) classes.push('is-selected');
    if (!isAvailable) classes.push('is-occupied');

    return `
      <button
        type="button"
        class="${classes.join(' ')}"
        data-slot-time="${time}"
        ${!isAvailable ? 'disabled' : ''}
        aria-pressed="${selected}"
        aria-disabled="${!isAvailable}"
      >${time}</button>
    `;
  }

  function render(root, mentor, options) {
    if (!root) return;

    const opts = options || {};
    const week = getWeek();
    const showSinHuecos = !weekHasAnySlots();
    const selectedDay = state.selectedDayIso
      ? week.days.find((d) => d.iso === state.selectedDayIso)
      : null;

    const allTimes = getAllSlotTimes();
    const availableSlots = selectedDay
      ? getAvailableSlots(state.weekOffset, selectedDay.weekdayIndex)
      : [];
    const showSlots =
      !showSinHuecos && selectedDay && !isDayDisabled(selectedDay);

    const chevron = spec.selector.chevron;
    const chevronSize = chevron.size || 16;
    const slotsLabel = spec.copy.slotsLabel || 'Horarios disponibles';
    const atForwardLimit = state.weekOffset >= MAX_WEEKS_FORWARD;
    const atPastLimit = state.weekOffset <= 0;

    root.innerHTML = `
      <div class="week-picker" data-picker-state="${getPickerState()}">
        <p class="week-picker__question">${spec.copy.pickDayQuestion}</p>

        <div class="week-picker__calendar">
          <div class="week-picker__month" role="group" aria-label="Mes">
            <button
              type="button"
              class="week-picker__chevron week-picker__chevron--prev"
              data-week-nav="prev"
              aria-label="Semana anterior"
              ${atPastLimit ? 'disabled' : ''}
            >
              <img src="../${chevron.left}" alt="" width="${chevronSize}" height="${chevronSize}" />
            </button>
            <span class="week-picker__month-label">${week.monthLabel}</span>
            <button
              type="button"
              class="week-picker__chevron week-picker__chevron--next"
              data-week-nav="next"
              aria-label="Semana siguiente"
              ${atForwardLimit ? 'disabled' : ''}
            >
              <img src="../${chevron.right}" alt="" width="${chevronSize}" height="${chevronSize}" />
            </button>
          </div>

          <div class="week-picker__days" role="group" aria-label="Días de la semana">
            ${week.days.map((day) => renderDayCell(day)).join('')}
          </div>
        </div>

        ${
          showSinHuecos
            ? `
        <div class="week-picker__empty-state">
          <hr class="week-picker__divider" aria-hidden="true" />
          <div class="week-picker__sin-huecos">${opts.fillSinHuecos(mentor)}</div>
        </div>`
            : `
        <div class="week-picker__slots-section" ${showSlots ? '' : 'hidden'}>
          <hr class="week-picker__divider" aria-hidden="true" />
          <p class="week-picker__slots-label">${slotsLabel}</p>
          <div class="week-picker__slots" role="group" aria-label="Horarios disponibles">
            ${allTimes.map((time) => renderSlotCell(time, availableSlots.includes(time))).join('')}
          </div>
        </div>`
        }
      </div>
    `;
  }

  function bindEvents(root) {
    if (!root || root.dataset.pickerBound) return;
    root.dataset.pickerBound = 'true';

    root.addEventListener('click', (event) => {
      const weekNav = event.target.closest('[data-week-nav]');
      if (weekNav && !weekNav.disabled) {
        const dir = weekNav.dataset.weekNav;
        setWeekOffset(state.weekOffset + (dir === 'next' ? 1 : -1));
        return;
      }

      const dayBtn = event.target.closest('[data-day-iso]');
      if (dayBtn && !dayBtn.disabled) {
        selectDay(dayBtn.dataset.dayIso);
        return;
      }

      const slotBtn = event.target.closest('[data-slot-time]');
      if (slotBtn && !slotBtn.disabled) {
        selectSlot(slotBtn.dataset.slotTime);
      }
    });
  }

  function init(root, mentor, options) {
    const opts = options || {};
    renderContext = { root, mentor, options: opts };
    state.weekOffset = clampWeekOffset(opts.weekOffset !== undefined ? opts.weekOffset : 0);
    onChange = opts.onChange;
    bindEvents(root);
    render(root, mentor, opts);
  }

  function refresh(root, mentor, options) {
    const opts = options || {};
    renderContext = { root, mentor, options: opts };
    render(root, mentor, opts);
  }

  function restoreFromBooking(booking) {
    if (!booking || !booking.dayIso) return;
    state.weekOffset = clampWeekOffset(isoToWeekOffset(booking.dayIso));
    state.selectedDayIso = booking.dayIso;
    state.selectedSlot = booking.time || null;
  }

  function reset(options) {
    const opts = options || {};
    state.weekOffset = clampWeekOffset(opts.weekOffset !== undefined ? opts.weekOffset : 0);
    resetSelection();
  }

  window.AppointmentPicker = {
    init,
    refresh,
    reset,
    restoreFromBooking,
    getPickerState,
    getBooking,
    selectSlot,
    getState: () => ({ ...state }),
    buildWeek,
    getMondayOfWeek,
    toIso,
    getWeekProfileName,
    getAvailableSlots,
    getAllSlotTimes,
  };
})();
