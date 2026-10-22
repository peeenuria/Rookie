/**
 * BottomSheetCambiarDias — Figma 13223:90986
 * Selección múltiple de días disponibles con validación mínima 1 día.
 */
(function () {
  const spec = window.FIGMA_HOME;
  if (!spec) return;

  const sheetCopy = spec.bottomSheetCambiarDias;
  let rootEl = null;
  let sheetEl = null;
  let selectedDays = new Set();
  let maxSelectable = Infinity;
  let onSaveCallback = null;
  let onCloseCallback = null;
  let isOpen = false;

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/home/')) return `../${path}`;
    return path;
  }

  function hasSelectedDays() {
    return selectedDays.size > 0;
  }

  /* Límite = días/semana que el usuario definió en Motivaciones (perfilado),
     pregunta "weeklyFrequency" ("3 veces por semana" → 3). Sin ese dato
     (perfilado no hecho en esta sesión), se usa el nº de días ya disponibles
     para no dejar el selector sin límite. */
  function readWeeklyFrequencyCount() {
    try {
      const raw = sessionStorage.getItem('rookie-profiling-motivations');
      if (!raw) return null;
      const data = JSON.parse(raw);
      const match = /^(\d+)/.exec(String(data.weeklyFrequency || ''));
      return match ? Number(match[1]) : null;
    } catch (_) {
      return null;
    }
  }

  function resolveMaxSelectable(initialDays) {
    const fromProfiling = readWeeklyFrequencyCount();
    if (fromProfiling && fromProfiling > 0) return fromProfiling;
    return Math.max(1, initialDays.length);
  }

  function isCountValid() {
    return selectedDays.size === maxSelectable;
  }

  function footerMessage() {
    if (!hasSelectedDays()) return sheetCopy.errorMessage;
    return sheetCopy.exactCountMessage.replace('{max}', String(maxSelectable));
  }

  function renderDiaSemanaEntrenoToggle(letter, index) {
    const isSelected = selectedDays.has(index);
    const isDisabled = !isSelected && selectedDays.size >= maxSelectable;
    const assets = spec.assets;
    const circleSrc = resolveAsset(isSelected ? assets.toggleCircleSelected : assets.toggleCircleDefault);

    return `
      <button
        type="button"
        class="DiaSemanaEntrenoToggle${isSelected ? ' is-selected' : ''}"
        data-day-index="${index}"
        aria-label="${letter}"
        aria-pressed="${isSelected}"
        ${isDisabled ? 'disabled aria-disabled="true"' : ''}
      >
        <span class="DiaSemanaEntrenoToggle__circle" aria-hidden="true">
          <img src="${circleSrc}" alt="" width="40" height="40" />
        </span>
        <span class="DiaSemanaEntrenoToggle__letter">${letter}</span>
      </button>
    `;
  }

  function renderBottomSheetCambiarDias() {
    const assets = spec.assets;

    return `
      <div
        class="BottomSheetCambiarDias"
        id="bottom-sheet-cambiar-dias"
        hidden
        role="presentation"
      >
        <button
          type="button"
          class="BottomSheetCambiarDias__backdrop"
          id="bottom-sheet-cambiar-dias-backdrop"
          aria-label="Cerrar"
        ></button>
        <div
          class="BottomSheetCambiarDias__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bottom-sheet-cambiar-dias-title"
        >
          <button
            type="button"
            class="BottomSheetCambiarDias__handle"
            id="bottom-sheet-cambiar-dias-close"
            aria-label="Cerrar"
          ></button>
          <div class="BottomSheetCambiarDias__content">
            <div class="BottomSheetCambiarDias__intro">
              <h2 class="BottomSheetCambiarDias__title" id="bottom-sheet-cambiar-dias-title">
                ${sheetCopy.title}
              </h2>
              <p class="BottomSheetCambiarDias__subtitle">${sheetCopy.subtitle}</p>
            </div>
            <div
              class="BottomSheetCambiarDias__days"
              role="group"
              aria-label="Días de la semana"
              id="bottom-sheet-cambiar-dias-toggles"
            >
              ${spec.weekDayLetters.map(renderDiaSemanaEntrenoToggle).join('')}
            </div>
            <div class="BottomSheetCambiarDias__footer">
              <p
                class="BottomSheetCambiarDias__error"
                id="bottom-sheet-cambiar-dias-error"
                ${isCountValid() ? 'hidden' : ''}
              >
                ${footerMessage()}
              </p>
              <button
                type="button"
                class="btn btn--primary BottomSheetCambiarDias__save"
                id="bottom-sheet-cambiar-dias-save"
                ${isCountValid() ? '' : 'disabled'}
              >
                ${sheetCopy.saveButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function refreshToggles() {
    const togglesWrap = document.getElementById('bottom-sheet-cambiar-dias-toggles');
    if (togglesWrap) {
      togglesWrap.innerHTML = spec.weekDayLetters.map(renderDiaSemanaEntrenoToggle).join('');
      bindToggles();
    }

    const errorEl = document.getElementById('bottom-sheet-cambiar-dias-error');
    if (errorEl) {
      errorEl.hidden = isCountValid();
      errorEl.textContent = footerMessage();
    }

    const saveBtn = document.getElementById('bottom-sheet-cambiar-dias-save');
    if (saveBtn) saveBtn.disabled = !isCountValid();
  }

  function bindToggles() {
    document.querySelectorAll('.DiaSemanaEntrenoToggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.dayIndex);
        if (selectedDays.has(index)) {
          selectedDays.delete(index);
        } else if (selectedDays.size < maxSelectable) {
          selectedDays.add(index);
        }
        refreshToggles();
      });
    });
  }

  function closeSheet() {
    if (!sheetEl || !isOpen) return;

    isOpen = false;
    sheetEl.classList.remove('is-visible');

    window.setTimeout(() => {
      if (!isOpen && sheetEl) {
        sheetEl.hidden = true;
      }
    }, 280);

    if (onCloseCallback) onCloseCallback();
  }

  function openSheet(options = {}) {
    if (!sheetEl) return;

    const initialDays =
      options.selectedDays ??
      (window.PlanSessions
        ? PlanSessions.getAvailableWeekdayIndices()
        : sheetCopy.defaultAvailableDays);
    selectedDays = new Set(initialDays);
    maxSelectable = resolveMaxSelectable(initialDays);
    onSaveCallback = typeof options.onSave === 'function' ? options.onSave : null;
    onCloseCallback = typeof options.onClose === 'function' ? options.onClose : null;

    sheetEl.hidden = false;
    refreshToggles();

    requestAnimationFrame(() => {
      sheetEl.classList.add('is-visible');
    });

    isOpen = true;
  }

  function handleSave() {
    if (!isCountValid()) {
      const errorEl = document.getElementById('bottom-sheet-cambiar-dias-error');
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = footerMessage();
      }
      return;
    }

    const diasSeleccionados = [...selectedDays].sort((a, b) => a - b);

    if (window.PlanSessions) {
      PlanSessions.setAvailableWeekdayIndices(diasSeleccionados);
    }

    if (onSaveCallback) onSaveCallback(diasSeleccionados);
    closeSheet();
  }

  function bindSheetEvents() {
    document.getElementById('bottom-sheet-cambiar-dias-backdrop')?.addEventListener('click', closeSheet);
    document.getElementById('bottom-sheet-cambiar-dias-close')?.addEventListener('click', closeSheet);
    document.getElementById('bottom-sheet-cambiar-dias-save')?.addEventListener('click', handleSave);
    bindToggles();
  }

  function mount(container) {
    if (!container) return;
    rootEl = container;
    container.innerHTML = renderBottomSheetCambiarDias();
    sheetEl = document.getElementById('bottom-sheet-cambiar-dias');
    bindSheetEvents();
  }

  window.BottomSheetCambiarDias = {
    mount,
    open: openSheet,
    close: closeSheet,
    hasSelectedDays,
    getSelectedDays: () => [...selectedDays].sort((a, b) => a - b),
  };
})();
