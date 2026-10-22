/**
 * EsfuerzoPercibido — entrada standalone
 * Enviar / Ahora no → pantalla de carga → Home con check azul en la card
 */
(function () {
  const spec = window.FIGMA_ESFUERZO_PERCIBIDO;
  if (!window.EsfuerzoPercibido) return;

  /* Fecha y nombre reales de la sesión que se acaba de hacer (SessionRuntime),
     no el texto fijo de Figma ("Martes, 14 de julio · Primera salida"). Si no
     hay sesión en curso, se usa la fecha de hoy y el copy por defecto. */
  function resolveSessionMeta() {
    const runtime = window.SessionRuntime?.load?.();
    let date = new Date();
    if (runtime?.dateIso) {
      const [y, m, d] = runtime.dateIso.split('-').map(Number);
      date = new Date(y, m - 1, d);
    }
    return {
      sessionMeta: window.DateFormat ? window.DateFormat.formatDateLabel(date) : undefined,
      sessionType: runtime?.sessionName || undefined,
    };
  }

  const state = {
    ...(spec?.defaultState ?? {}),
    ...resolveSessionMeta(),
  };

  let saving = false;

  function rerender() {
    EsfuerzoPercibido.mount(null, state);
    bind();
    if (saving) showSavingOverlay();
  }

  function showSavingOverlay() {
    const shell = document.querySelector('.phone-shell--esfuerzo-percibido') || document.body;
    let overlay = document.getElementById('esfuerzo-saving');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'esfuerzo-saving';
      overlay.className = 'EsfuerzoPercibido__saving';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.setAttribute('aria-busy', 'true');
      overlay.innerHTML = `
        <div class="EsfuerzoPercibido__saving-inner">
          <span class="EsfuerzoPercibido__saving-spinner" aria-hidden="true"></span>
          <p class="EsfuerzoPercibido__saving-text">${spec?.saving?.message || 'Estamos guardando tu sesión'}</p>
        </div>
      `;
      shell.appendChild(overlay);
    }
    overlay.hidden = false;
  }

  function markSessionRegistered() {
    const runtime = window.SessionRuntime?.load?.() || window.SessionRuntime?.ensure?.();
    const sessionId = runtime?.sessionId;
    const dateIso = runtime?.dateIso || sessionId;

    if (window.PlanSessions && sessionId) {
      PlanSessions.markSessionCompleted(sessionId, {
        dateIso,
        distanceKm: runtime?.gpsDistanceKm || 0,
      });
    }

    try {
      if (dateIso) {
        sessionStorage.setItem('rookie.focusSessionDate', dateIso);
      }
    } catch (_) {
      /* ignore */
    }
  }

  function finishAndGoHome() {
    if (saving) return;
    saving = true;

    markSessionRegistered();
    showSavingOverlay();

    const delayMs = spec?.saving?.delayMs ?? 1400;
    window.setTimeout(() => {
      window.SessionRuntime?.clear?.();
      window.SessionRuntime?.clearSuccess?.();
      window.location.href = spec?.routes?.onSubmit || '../home/index.html';
    }, delayMs);
  }

  function bindMood() {
    document.querySelectorAll('.MoodTracker__option').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (saving) return;
        state.selectedMood = btn.dataset.moodId || null;
        rerender();
      });
    });
  }

  function bindTalkOptions() {
    document.querySelectorAll('.TalkTest__option').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (saving) return;
        const idx = Number(btn.dataset.talkIndex);
        state.selectedTalkOption = Number.isNaN(idx) ? null : idx;
        rerender();
      });
    });
  }

  function bindNote() {
    const textarea = document.getElementById('mentor-note');
    textarea?.addEventListener('input', (event) => {
      if (saving) return;
      state.note = event.target.value;
    });
  }

  function bindActions() {
    document.getElementById('esfuerzo-submit')?.addEventListener('click', () => {
      finishAndGoHome();
    });
    document.getElementById('esfuerzo-skip')?.addEventListener('click', () => {
      finishAndGoHome();
    });
  }

  function goBack() {
    if (saving) return;
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = `../pantalla-exito/index.html${window.location.search || ''}`;
  }

  function bindBack() {
    window.BarraSuperiorBack?.bind('esfuerzo-percibido-back-btn', goBack);
  }

  function bind() {
    bindMood();
    bindTalkOptions();
    bindNote();
    bindActions();
    bindBack();
  }

  function mount() {
    rerender();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
