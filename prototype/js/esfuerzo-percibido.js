/**
 * EsfuerzoPercibido — Figma 13556:2010
 */
(function () {
  const spec = window.FIGMA_ESFUERZO_PERCIBIDO;

  function getMoodIcon(moodId, selected) {
    const assets = spec?.assets ?? {};
    const suffix = selected ? 'Selected' : 'Default';
    const map = {
      'muy-mal': assets[`moodMuyMal${suffix}`],
      mal: assets[`moodMal${suffix}`],
      regular: assets[`moodRegular${suffix}`],
      bien: assets[`moodBien${suffix}`],
      'muy-bien': assets[`moodMuyBien${suffix}`],
    };
    return map[moodId] || '';
  }

  function renderMoodOptions(selectedMood) {
    const options = spec?.moodOptions ?? [];
    return options
      .map((option) => {
        const selected = option.id === selectedMood;
        return `
          <button
            type="button"
            class="MoodTracker__option${selected ? ' is-selected' : ''}"
            data-mood-id="${option.id}"
            aria-pressed="${selected}"
            aria-label="${option.label}"
          >
            <img class="MoodTracker__icon" src="../${getMoodIcon(option.id, selected)}" alt="" aria-hidden="true" />
          </button>
        `;
      })
      .join('');
  }

  function renderTalkOptions(selectedTalkOption) {
    const copy = spec?.copy ?? {};
    const options = copy.conversationalOptions ?? [];

    return options
      .map((label, index) => {
        const selected = selectedTalkOption === index;
        return `
          <button
            type="button"
            class="OptionSelectRow TalkTest__option${selected ? ' is-selected' : ''}"
            data-talk-index="${index}"
            role="radio"
            aria-checked="${selected}"
          >
            <span class="OptionSelectRow__label TalkTest__label">${label}</span>
            <span class="OptionSelectRow__radio TalkTest__radio" aria-hidden="true"></span>
          </button>
        `;
      })
      .join('');
  }

  function renderBackSlot() {
    if (!window.BarraSuperiorBack) {
      return '<div id="esfuerzo-percibido-back-slot"></div>';
    }
    return `
      <div id="esfuerzo-percibido-back-slot">
        ${window.BarraSuperiorBack.render({
          id: 'esfuerzo-percibido-back-btn',
          variant: 'predeterminada',
          ariaLabel: 'Volver',
        })}
      </div>
    `;
  }

  function render(state) {
    const s = { ...(spec?.defaultState ?? {}), ...(state ?? {}) };
    const copy = spec?.copy ?? {};

    return `
      <section
        class="screen screen--esfuerzo-percibido is-active EsfuerzoPercibido"
        id="esfuerzo-percibido"
        data-node-id="${spec?.screenNodeId ?? '13556:2010'}"
        aria-label="Esfuerzo percibido"
      >
        ${renderBackSlot()}
        <div class="EsfuerzoPercibido__content">
          <div class="EsfuerzoPercibido__meta">
            <span class="EsfuerzoPercibido__meta-date">${s.sessionMeta ?? copy.sessionMeta ?? ''}</span>
            <span class="EsfuerzoPercibido__meta-separator">•</span>
            <span class="EsfuerzoPercibido__meta-type">${s.sessionType ?? copy.sessionType ?? ''}</span>
          </div>

          <section class="EsfuerzoPercibido__section MoodTracker">
            <h1 class="EsfuerzoPercibido__title">${copy.moodTitle ?? ''}</h1>
            <div class="MoodTracker__list" role="group" aria-label="${copy.moodTitle ?? ''}">
              ${renderMoodOptions(s.selectedMood)}
            </div>
          </section>

          <section class="EsfuerzoPercibido__section TalkTest">
            <h2 class="EsfuerzoPercibido__title">${copy.conversationalTitle ?? ''}</h2>
            <div class="TalkTest__list" role="group" aria-label="${copy.conversationalTitle ?? ''}">
              ${renderTalkOptions(s.selectedTalkOption)}
            </div>
          </section>

          <section class="EsfuerzoPercibido__section MentorNote">
            <h2 class="EsfuerzoPercibido__title">${copy.noteTitle ?? ''}</h2>
            <div class="MentorNote__field-wrap">
              <textarea
                class="MentorNote__field"
                id="mentor-note"
                placeholder="${copy.notePlaceholder ?? ''}"
              >${s.note ?? ''}</textarea>
              <p class="MentorNote__helper">${copy.noteHelper ?? ''}</p>
            </div>
          </section>

          <div class="EsfuerzoPercibido__actions">
            <button type="button" class="btn btn--primary EsfuerzoPercibido__submit" id="esfuerzo-submit">
              ${copy.submitCta ?? 'Enviar'}
            </button>
            <button type="button" class="EsfuerzoPercibido__skip" id="esfuerzo-skip">
              ${copy.skipCta ?? 'Ahora no'}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function mount(target, state) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return;
    root.innerHTML = render(state);
  }

  window.EsfuerzoPercibido = { render, mount };
})();

