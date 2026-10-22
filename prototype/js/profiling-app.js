/**
 * Historia 1.4 — Perfilado (info personal + motivaciones)
 * Historia 3.1 — Resumen, generación y plan autogenerado
 */
(function () {
  const spec = window.FIGMA_1_4;
  const spec31 = window.FIGMA_3_1;
  if (!spec) return;

  const personalSpec = spec.personalInfo;
  const motivationsSpec = spec.motivations;
  const storageKeys = spec.storageKeys;
  const reviewSpec = spec31?.motivationsReview;
  const generatingSpec = spec31?.planGenerating;
  const planReadySpec = spec31?.planReady;

  /* Lucide (lucide-react): NotepadText, LandPlot, IdCardLanyard — paths oficiales */
  const STEPPER_ICONS = {
    'notepad-text': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v4"/>
        <path d="M12 2v4"/>
        <path d="M16 2v4"/>
        <rect width="16" height="18" x="4" y="4" rx="2"/>
        <path d="M8 10h6"/>
        <path d="M8 14h8"/>
        <path d="M8 18h5"/>
      </svg>
    `,
    'land-plot': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 8 6-3-6-3v10"/>
        <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/>
        <path d="m6.49 12.85 11.02 6.3"/>
        <path d="M17.51 12.85 6.5 19.15"/>
      </svg>
    `,
    'id-card-lanyard': `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13.5 8h-3"/>
        <path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/>
        <path d="M16.899 22A5 5 0 0 0 7.1 22"/>
        <path d="m9 2 3 6"/>
        <circle cx="12" cy="15" r="3"/>
      </svg>
    `,
  };

  function renderStepperIcon(iconKey) {
    return STEPPER_ICONS[iconKey] || STEPPER_ICONS['notepad-text'];
  }

  function isActivationFlow() {
    return Boolean(document.getElementById('screen-splash'));
  }

  function isReviewFlowStandalone() {
    return Boolean(document.getElementById('profiling-review-flow-root'));
  }

  function showStandaloneProfilingScreen(key) {
    const screenId = {
      'profiling-motivations-review': 'screen-profiling-motivations-review',
      'plan-generating': 'screen-plan-generating',
      'profiling-plan-ready': 'screen-profiling-plan-ready',
    }[key];

    if (!screenId) return;

    document.querySelectorAll('#profiling-review-flow-root .screen').forEach((section) => {
      section.classList.toggle('is-active', section.id === screenId);
    });

    onProfilingScreenEnter(key);
  }

  function initReviewFlowStandalone() {
    const handleHash = () => {
      const key = window.location.hash.replace(/^#/, '') || 'profiling-motivations-review';
      showStandaloneProfilingScreen(key);
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  function isAccountActivated() {
    return (
      sessionStorage.getItem('rookie-payment-validated') === 'true' ||
      sessionStorage.getItem('rookie-code-validated') === 'true'
    );
  }

  function navigateTo(key) {
    if (window.ActivationFlow?.navigateTo) {
      window.ActivationFlow.navigateTo(key);
      return;
    }

    if (document.getElementById('profiling-personal-root') && key === 'profiling-motivations') {
      window.location.href = 'motivations/index.html';
      return;
    }

    if (document.getElementById('profiling-personal-root') && key === 'code-bridge') {
      window.location.href = '../activation/index.html#code-bridge';
      return;
    }

    if (document.getElementById('profiling-motivations-root') && key === 'profiling-personal') {
      window.location.href = '../index.html';
      return;
    }

    if (document.getElementById('profiling-motivations-root') && key === 'profiling-motivations-review') {
      window.location.href = '../review/index.html';
      return;
    }

    if (isReviewFlowStandalone()) {
      if (key === 'profiling-motivations') {
        window.location.href = '../motivations/index.html';
        return;
      }
      if (
        key === 'profiling-motivations-review' ||
        key === 'plan-generating' ||
        key === 'profiling-plan-ready'
      ) {
        const target = `#${key}`;
        if (window.location.hash !== target) {
          window.location.hash = key;
        } else {
          showStandaloneProfilingScreen(key);
        }
        return;
      }
    }

    window.location.hash = key;
  }

  function readStoredJson(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key) || '{}');
    } catch {
      return {};
    }
  }

  function getStoredMotivations() {
    return readStoredJson(storageKeys.motivations);
  }

  function getStoredPersonal() {
    return readStoredJson(storageKeys.personalInfo);
  }

  function formatListWithY(items) {
    const list = (items || []).filter(Boolean).map((item) => {
      const text = String(item);
      return text.charAt(0).toUpperCase() + text.slice(1);
    });
    if (list.length === 0) return '—';
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} y ${list[1]}`;
    return `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}`;
  }

  function formatMotivationAnswer(questionId, data) {
    const value = data[questionId];

    if (questionId === 'alsoAchieve' || questionId === 'trainingDays') {
      if (Array.isArray(value)) return formatListWithY(value);
      if (typeof value === 'string' && value.trim()) {
        return formatListWithY(value.split(/[,\s]+/).filter(Boolean));
      }
      return value || '—';
    }

    if (questionId === 'health') {
      if (value === 'Sí' && data.healthDetails) {
        return `Sí — ${data.healthDetails}`;
      }
      return value || '—';
    }

    if (questionId === 'startDistance') {
      return spec31?.distanceReviewLabels?.[value] || value || '—';
    }

    return value || '—';
  }

  function buildReviewRowsHtml() {
    const data = getStoredMotivations();
    const questionOrder = motivationsSpec.questions.map((question) => question.id);

    return questionOrder
      .map((questionId) => {
        const question = motivationsSpec.questions.find((item) => item.id === questionId);
        if (!question) return '';

        return `
          <li class="motivations-review__item">
            <p class="motivations-review__question">${question.label}</p>
            <p class="motivations-review__answer">${formatMotivationAnswer(questionId, data)}</p>
          </li>
        `;
      })
      .join('');
  }

  function extractSessionsPerWeek(weeklyFrequency) {
    const match = /^(\d+)/.exec(String(weeklyFrequency || ''));
    return match ? match[1] : '—';
  }

  function extractSessionMinutes(sessionTime) {
    if (!sessionTime) return '—';
    if (sessionTime === '1h') return '60';
    const match = /^(\d+)/.exec(sessionTime);
    return match ? match[1] : sessionTime;
  }

  function buildGeneratedPlanSnapshot() {
    const motivations = getStoredMotivations();
    const personal = getStoredPersonal();

    return {
      firstName: personal.firstName || 'Pedro',
      mainGoal: motivations.mainGoal || '—',
      sessionsPerWeek: extractSessionsPerWeek(motivations.weeklyFrequency),
      minutesPerSession: extractSessionMinutes(motivations.sessionTime),
      startDistance: motivations.startDistance || '—',
    };
  }

  function persistGeneratedPlan() {
    if (!spec31?.storageKeys?.generatedPlan) return;
    sessionStorage.setItem(
      spec31.storageKeys.generatedPlan,
      JSON.stringify(buildGeneratedPlanSnapshot())
    );
  }

  function getGeneratedPlan() {
    if (!spec31?.storageKeys?.generatedPlan) {
      return buildGeneratedPlanSnapshot();
    }
    const stored = readStoredJson(spec31.storageKeys.generatedPlan);
    if (stored.firstName) return stored;
    return buildGeneratedPlanSnapshot();
  }

  function renderStepper(activeStepId, options = {}) {
    const { postMotivations = false } = options;
    const steps = spec.stepper.steps;
    const activeIndex = steps.findIndex((step) => step.id === activeStepId);

    const stepsHtml = steps
      .map((step, index) => {
        let stateClass = '';
        if (postMotivations) {
          if (index <= 1) stateClass = 'is-done';
        } else if (index < activeIndex) {
          stateClass = 'is-done';
        } else if (index === activeIndex) {
          stateClass = 'is-active';
        }

        return `
          <div class="profiling-stepper__step ${stateClass}" data-step="${step.id}">
            <span class="profiling-stepper__icon">${renderStepperIcon(step.icon)}</span>
            <p class="profiling-stepper__label">${step.label}</p>
          </div>
        `;
      })
      .join('');

    const leftConnector =
      postMotivations || activeIndex >= 1
        ? 'profiling-stepper__connector profiling-stepper__connector--left is-active'
        : 'profiling-stepper__connector profiling-stepper__connector--left';
    const rightConnector =
      activeIndex >= 2
        ? 'profiling-stepper__connector profiling-stepper__connector--right is-active'
        : 'profiling-stepper__connector profiling-stepper__connector--right';

    return `
      <nav class="profiling-stepper" aria-label="Progreso del perfilado">
        ${stepsHtml}
        <span class="${leftConnector}" aria-hidden="true">
          <span class="profiling-stepper__connector-fill"></span>
        </span>
        <span class="${rightConnector}" aria-hidden="true">
          <span class="profiling-stepper__connector-fill"></span>
        </span>
      </nav>
    `;
  }

  function renderFieldLabel(label, requiredLabel) {
    return `
      <div class="profiling-field__label-row">
        <span class="profiling-field__label">${label}</span>
        <span class="profiling-field__required">${requiredLabel}</span>
        <span class="profiling-field__asterisk" aria-hidden="true">*</span>
      </div>
    `;
  }

  function createPersonalMarkup() {
    const fields = personalSpec.fields;

    const genderOptions = fields.gender.options
      .map(
        (option) => `
          <li>
            <button
              type="button"
              class="OptionSelectRow profiling-gender__option"
              data-gender-option
              data-value="${option}"
              role="radio"
              aria-checked="false"
            >
              <span class="OptionSelectRow__label profiling-gender__label">${option}</span>
              <span class="OptionSelectRow__radio profiling-gender__radio" aria-hidden="true"></span>
            </button>
          </li>
        `
      )
      .join('');

    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'profiling-personal-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--profiling-personal"
        id="screen-profiling-personal"
        aria-label="Perfilado — información personal"
      >
        ${backBar}
        <div class="profiling-screen">
          <div class="profiling-screen__stepper-wrap">
            ${renderStepper('personal')}
          </div>
          <div class="profiling-screen__scroll">
            <form class="profiling-form" id="profiling-personal-form" novalidate>
              <div class="profiling-field">
                ${renderFieldLabel(fields.firstName.label, fields.firstName.requiredLabel)}
                <input
                  class="profiling-field__input"
                  id="profiling-first-name"
                  name="firstName"
                  type="text"
                  autocomplete="given-name"
                  placeholder="${fields.firstName.placeholder}"
                  required
                />
              </div>

              <div class="profiling-field">
                ${renderFieldLabel(fields.lastName.label, fields.lastName.requiredLabel)}
                <input
                  class="profiling-field__input"
                  id="profiling-last-name"
                  name="lastName"
                  type="text"
                  autocomplete="family-name"
                  placeholder="${fields.lastName.placeholder}"
                  required
                />
                <p class="profiling-field__helper">${fields.lastName.helper}</p>
              </div>

              <div class="profiling-field">
                ${renderFieldLabel(fields.birthDate.label, fields.birthDate.requiredLabel)}
                <input
                  class="profiling-field__input"
                  id="profiling-birth-date"
                  name="birthDate"
                  type="text"
                  inputmode="numeric"
                  placeholder="${fields.birthDate.placeholder}"
                  maxlength="10"
                  required
                />
                <p class="profiling-field__helper">${fields.birthDate.helper}</p>
              </div>

              <div class="profiling-field profiling-gender">
                ${renderFieldLabel(fields.gender.label, fields.gender.requiredLabel)}
                <ul
                  class="profiling-gender__list"
                  id="profiling-gender-list"
                  role="radiogroup"
                  aria-label="${fields.gender.label}"
                >${genderOptions}</ul>
              </div>

              <div class="profiling-field">
                ${renderFieldLabel(fields.height.label, fields.height.requiredLabel)}
                <input
                  class="profiling-field__input"
                  id="profiling-height"
                  name="height"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  max="250"
                  placeholder="${fields.height.placeholder}"
                  required
                />
              </div>

              <div class="profiling-field">
                ${renderFieldLabel(fields.weight.label, fields.weight.requiredLabel)}
                <input
                  class="profiling-field__input"
                  id="profiling-weight"
                  name="weight"
                  type="number"
                  inputmode="decimal"
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="${fields.weight.placeholder}"
                  required
                />
                <p class="profiling-field__helper">${fields.weight.helper}</p>
              </div>

              <button
                type="submit"
                class="btn btn--primary profiling-form__submit btn--disabled"
                id="profiling-personal-submit"
                disabled
              >
                ${personalSpec.continueCta}
              </button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  function renderQuestionBlock(question) {
    const pills = question.options
      .map(
        (option) => `
          <button
            type="button"
            class="profiling-pill"
            data-question-id="${question.id}"
            data-value="${option}"
            aria-pressed="false"
          >
            ${option}
          </button>
        `
      )
      .join('');

    const hint = question.hint
      ? `<p class="profiling-question__hint">${question.hint}</p>`
      : '';

    const textarea =
      question.type === 'health'
        ? `
          <div class="profiling-question__textarea-wrap" id="profiling-health-details-wrap" hidden>
            <textarea
              class="profiling-question__textarea"
              id="profiling-health-details"
              placeholder="${question.textPlaceholder}"
              rows="3"
            ></textarea>
          </div>
        `
        : '';

    return `
      <section
        class="profiling-question"
        data-profiling-question
        data-question-id="${question.id}"
        data-question-type="${question.type}"
        ${question.minSelections ? `data-min-selections="${question.minSelections}"` : ''}
        ${question.textWhen ? `data-text-when="${question.textWhen}"` : ''}
      >
        <h2 class="profiling-question__label">${question.label}</h2>
        ${hint}
        <div class="profiling-pills" role="group" aria-label="${question.label}">
          ${pills}
        </div>
        ${textarea}
      </section>
    `;
  }

  function createMotivationsMarkup() {
    const questionsHtml = motivationsSpec.questions.map(renderQuestionBlock).join('');
    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'profiling-motivations-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--profiling-motivations"
        id="screen-profiling-motivations"
        aria-label="Perfilado — motivaciones"
      >
        ${backBar}
        <div class="profiling-screen">
          <div class="profiling-screen__stepper-wrap">
            ${renderStepper('motivations')}
          </div>
          <div class="profiling-screen__scroll">
            <header class="screen-intro profiling-intro">
              <h1 class="screen-intro__title">${motivationsSpec.title}</h1>
              <p class="screen-intro__subtitle">${motivationsSpec.subtitle}</p>
            </header>

            <div class="profiling-questions" id="profiling-questions">
              ${questionsHtml}
            </div>

            <button
              type="button"
              class="btn btn--primary profiling-form__submit btn--disabled"
              id="profiling-motivations-submit"
              disabled
            >
              ${motivationsSpec.continueCta}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function createSummaryMarkup() {
    return `
      <section
        class="screen screen--profiling-summary"
        id="screen-profiling-summary"
        aria-label="Perfilado — mentores"
      >
        <div class="profiling-screen">
          <div class="profiling-screen__stepper-wrap">
            ${renderStepper('summary')}
          </div>
          <div class="profiling-summary">
            <h1 class="profiling-summary__title">${spec.summary.title}</h1>
            <p class="profiling-summary__message">${spec.summary.message}</p>
          </div>
        </div>
      </section>
    `;
  }

  function createMotivationsReviewMarkup() {
    if (!reviewSpec) return '';

    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'profiling-motivations-review-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--profiling-motivations-review"
        id="screen-profiling-motivations-review"
        aria-label="Revisión de motivaciones"
      >
        ${backBar}
        <div class="profiling-screen">
          <div class="profiling-screen__stepper-wrap">
            ${renderStepper('motivations', { postMotivations: true })}
          </div>
          <div class="profiling-screen__scroll">
            <header class="screen-intro motivations-review__intro">
              <h1 class="screen-intro__title">${reviewSpec.title}</h1>
              <p class="screen-intro__subtitle">${reviewSpec.subtitle}</p>
            </header>

            <div class="motivations-review__card">
              <ul class="motivations-review__list" id="motivations-review-list">
                ${buildReviewRowsHtml()}
              </ul>
            </div>

            <button
              type="button"
              class="btn btn--primary profiling-form__submit"
              id="motivations-review-submit"
            >
              ${reviewSpec.generateCta}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function createPlanGeneratingMarkup() {
    if (!generatingSpec) return '';

    return `
      <section
        class="screen screen--plan-generating"
        id="screen-plan-generating"
        aria-label="Generando plan"
        aria-busy="true"
        aria-live="polite"
      >
        <div class="plan-generating">
          <div class="plan-generating__inner">
            <span class="plan-generating__spinner" aria-hidden="true"></span>
            <p class="plan-generating__text">${generatingSpec.message}</p>
          </div>
        </div>
      </section>
    `;
  }

  function createPlanReadyMarkup() {
    if (!planReadySpec) return '';

    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'profiling-plan-ready-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--profiling-plan-ready"
        id="screen-profiling-plan-ready"
        aria-label="Plan autogenerado"
      >
        ${backBar}
        <div class="profiling-screen">
          <div class="profiling-screen__stepper-wrap">
            ${renderStepper('motivations', { postMotivations: true })}
          </div>
          <div class="plan-ready-screen__scroll">
            <h1 class="screen-intro__title plan-ready-screen__hero-title" id="plan-ready-title"></h1>

            <article class="card-plan card-plan--simple" aria-label="Resumen del plan">
              <div class="card-plan__header">
                <p class="card-plan__tagline">${planReadySpec.goalTagline}</p>
                <p class="card-plan__goal" id="plan-ready-goal"></p>
              </div>
              <div class="card-plan__meta">
                <div class="card-plan__stat">
                  <p class="card-plan__stat-value" id="plan-ready-sessions"></p>
                  <p class="card-plan__stat-label">${planReadySpec.sessionsLabel[0]}<br />${planReadySpec.sessionsLabel[1]}</p>
                </div>
                <div class="card-plan__stat">
                  <p class="card-plan__stat-value" id="plan-ready-minutes"></p>
                  <p class="card-plan__stat-label">${planReadySpec.minutesLabel[0]}<br />${planReadySpec.minutesLabel[1]}</p>
                </div>
                <div class="card-plan__stat">
                  <p class="card-plan__stat-value" id="plan-ready-distance"></p>
                  <p class="card-plan__stat-label">${planReadySpec.distanceLabel[0]}<br />${planReadySpec.distanceLabel[1]}</p>
                </div>
              </div>
            </article>

            <p class="plan-ready-screen__hint">${planReadySpec.objectivesHint}</p>
          </div>

          <div class="plan-ready-screen__actions">
            <button type="button" class="btn btn--primary" id="plan-ready-submit">
              ${planReadySpec.continueCta}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function isValidBirthDate(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) return false;
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return false;
    }
    const now = new Date();
    return date <= now && year >= 1900;
  }

  function formatBirthDateInput(value) {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  function getPersonalFormValues() {
    const genderSelected = document.querySelector('[data-gender-option].is-selected');
    return {
      firstName: document.getElementById('profiling-first-name')?.value.trim() || '',
      lastName: document.getElementById('profiling-last-name')?.value.trim() || '',
      birthDate: document.getElementById('profiling-birth-date')?.value.trim() || '',
      gender: genderSelected?.dataset.value || '',
      height: document.getElementById('profiling-height')?.value.trim() || '',
      weight: document.getElementById('profiling-weight')?.value.trim() || '',
    };
  }

  function isPersonalFormValid() {
    const values = getPersonalFormValues();
    return (
      values.firstName.length > 0 &&
      values.lastName.length > 0 &&
      isValidBirthDate(values.birthDate) &&
      values.gender.length > 0 &&
      Number(values.height) > 0 &&
      Number(values.weight) > 0
    );
  }

  function updatePersonalSubmitState() {
    const submitBtn = document.getElementById('profiling-personal-submit');
    if (!submitBtn) return;
    const valid = isPersonalFormValid();
    submitBtn.disabled = !valid;
    submitBtn.classList.toggle('btn--disabled', !valid);
  }

  /* Repuebla el formulario con lo ya guardado (rellenado en un paso previo de
     esta sesión) para que volver atrás no borre visualmente esos datos. */
  function restorePersonalForm() {
    const saved = getStoredPersonal();
    if (!saved || Object.keys(saved).length === 0) return;

    const fieldIds = {
      firstName: 'profiling-first-name',
      lastName: 'profiling-last-name',
      birthDate: 'profiling-birth-date',
      height: 'profiling-height',
      weight: 'profiling-weight',
    };
    Object.entries(fieldIds).forEach(([key, id]) => {
      const input = document.getElementById(id);
      if (input && saved[key]) input.value = saved[key];
    });

    if (saved.gender) {
      document.querySelectorAll('[data-gender-option]').forEach((button) => {
        const isMatch = button.dataset.value === saved.gender;
        button.classList.toggle('is-selected', isMatch);
        button.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });
    }
  }

  function initPersonalForm() {
    const form = document.getElementById('profiling-personal-form');
    const birthInput = document.getElementById('profiling-birth-date');
    const genderButtons = document.querySelectorAll('[data-gender-option]');

    restorePersonalForm();

    window.BarraSuperiorBack?.bind('profiling-personal-back', () => {
      navigateTo('code-bridge');
    });

    form?.querySelectorAll('.profiling-field__input').forEach((input) => {
      input.addEventListener('input', updatePersonalSubmitState);
    });

    birthInput?.addEventListener('input', () => {
      const formatted = formatBirthDateInput(birthInput.value);
      if (birthInput.value !== formatted) birthInput.value = formatted;
      updatePersonalSubmitState();
    });

    genderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        genderButtons.forEach((item) => {
          item.classList.remove('is-selected');
          item.setAttribute('aria-checked', 'false');
        });
        button.classList.add('is-selected');
        button.setAttribute('aria-checked', 'true');
        updatePersonalSubmitState();
      });
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!isPersonalFormValid()) return;
      sessionStorage.setItem(storageKeys.personalInfo, JSON.stringify(getPersonalFormValues()));
      window.ProfilingStepperAnim?.queueAdvance('personal');
      navigateTo('profiling-motivations');
    });

    updatePersonalSubmitState();
  }

  function getQuestionState(questionEl) {
    const type = questionEl.dataset.questionType;
    const selected = [...questionEl.querySelectorAll('.profiling-pill.is-selected')].map(
      (pill) => pill.dataset.value
    );

    if (type === 'multi') {
      const min = Number(questionEl.dataset.minSelections || 1);
      return selected.length >= min;
    }

    if (type === 'health') {
      if (selected.length !== 1) return false;
      if (selected[0] === questionEl.dataset.textWhen) {
        const details = document.getElementById('profiling-health-details')?.value.trim();
        return Boolean(details);
      }
      return true;
    }

    return selected.length === 1;
  }

  function isMotivationsFormValid() {
    const questions = document.querySelectorAll('[data-profiling-question]');
    return [...questions].every((question) => getQuestionState(question));
  }

  function updateMotivationsSubmitState() {
    const submitBtn = document.getElementById('profiling-motivations-submit');
    if (!submitBtn) return;
    const valid = isMotivationsFormValid();
    submitBtn.disabled = !valid;
    submitBtn.classList.toggle('btn--disabled', !valid);
  }

  function collectMotivationsValues() {
    const result = {};
    document.querySelectorAll('[data-profiling-question]').forEach((questionEl) => {
      const id = questionEl.dataset.questionId;
      const type = questionEl.dataset.questionType;
      const selected = [...questionEl.querySelectorAll('.profiling-pill.is-selected')].map(
        (pill) => pill.dataset.value
      );
      result[id] = type === 'multi' ? selected : selected[0] || '';
      if (id === 'health' && selected[0] === questionEl.dataset.textWhen) {
        result.healthDetails =
          document.getElementById('profiling-health-details')?.value.trim() || '';
      }
    });
    return result;
  }

  /* Repuebla las pills con lo ya contestado (solo se guarda al enviar el
     formulario, así que esto solo aplica tras un envío previo en la sesión). */
  function restoreMotivationsForm() {
    const saved = getStoredMotivations();
    if (!saved || Object.keys(saved).length === 0) return;

    document.querySelectorAll('[data-profiling-question]').forEach((questionEl) => {
      const id = questionEl.dataset.questionId;
      const value = saved[id];
      if (value === undefined || value === null || value === '') return;
      const selectedValues = Array.isArray(value) ? value : [value];

      questionEl.querySelectorAll('.profiling-pill').forEach((pill) => {
        const isMatch = selectedValues.includes(pill.dataset.value);
        pill.classList.toggle('is-selected', isMatch);
        pill.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      if (id === 'health' && selectedValues.includes(questionEl.dataset.textWhen)) {
        const healthWrap = document.getElementById('profiling-health-details-wrap');
        const healthTextarea = document.getElementById('profiling-health-details');
        if (healthWrap) healthWrap.hidden = false;
        if (healthTextarea && saved.healthDetails) healthTextarea.value = saved.healthDetails;
      }
    });
  }

  function initMotivationsForm() {
    const submitBtn = document.getElementById('profiling-motivations-submit');
    const healthWrap = document.getElementById('profiling-health-details-wrap');
    const healthTextarea = document.getElementById('profiling-health-details');

    restoreMotivationsForm();

    window.BarraSuperiorBack?.bind('profiling-motivations-back', () => {
      navigateTo('profiling-personal');
    });

    document.querySelectorAll('.profiling-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const questionEl = pill.closest('[data-profiling-question]');
        const type = questionEl?.dataset.questionType;

        if (type === 'multi') {
          pill.classList.toggle('is-selected');
          pill.setAttribute(
            'aria-pressed',
            pill.classList.contains('is-selected') ? 'true' : 'false'
          );
        } else {
          questionEl?.querySelectorAll('.profiling-pill').forEach((item) => {
            item.classList.remove('is-selected');
            item.setAttribute('aria-pressed', 'false');
          });
          pill.classList.add('is-selected');
          pill.setAttribute('aria-pressed', 'true');
        }

        if (questionEl?.dataset.questionId === 'health') {
          const showDetails =
            pill.dataset.value === questionEl.dataset.textWhen &&
            pill.classList.contains('is-selected');
          if (healthWrap) healthWrap.hidden = !showDetails;
          if (!showDetails && healthTextarea) healthTextarea.value = '';
        }

        updateMotivationsSubmitState();
      });
    });

    healthTextarea?.addEventListener('input', updateMotivationsSubmitState);

    submitBtn?.addEventListener('click', () => {
      if (!isMotivationsFormValid()) return;
      sessionStorage.setItem(storageKeys.motivations, JSON.stringify(collectMotivationsValues()));
      sessionStorage.setItem(storageKeys.completed, 'true');
      window.ProfilingStepperAnim?.queueAdvance('motivations', { completeOnly: true });
      navigateTo('profiling-motivations-review');
    });

    updateMotivationsSubmitState();
  }

  function refreshMotivationsReview() {
    const list = document.getElementById('motivations-review-list');
    if (list) list.innerHTML = buildReviewRowsHtml();
  }

  let planGeneratingTimerId = null;

  function clearPlanGeneratingTimer() {
    if (planGeneratingTimerId !== null) {
      clearTimeout(planGeneratingTimerId);
      planGeneratingTimerId = null;
    }
  }

  function startPlanGenerationFlow() {
    clearPlanGeneratingTimer();
    persistGeneratedPlan();
    navigateTo('plan-generating');

    const duration = generatingSpec?.durationMs ?? 1750;
    planGeneratingTimerId = window.setTimeout(() => {
      planGeneratingTimerId = null;
      populatePlanReady();
      navigateTo('profiling-plan-ready');
    }, duration);
  }

  function populatePlanReady() {
    const plan = getGeneratedPlan();
    const titleEl = document.getElementById('plan-ready-title');
    const goalEl = document.getElementById('plan-ready-goal');
    const sessionsEl = document.getElementById('plan-ready-sessions');
    const minutesEl = document.getElementById('plan-ready-minutes');
    const distanceEl = document.getElementById('plan-ready-distance');

    if (titleEl && planReadySpec) {
      titleEl.textContent = `${planReadySpec.titlePrefix} ${plan.firstName}`;
    }
    if (goalEl) goalEl.textContent = plan.mainGoal;
    if (sessionsEl) sessionsEl.textContent = plan.sessionsPerWeek;
    if (minutesEl) minutesEl.textContent = plan.minutesPerSession;
    if (distanceEl) distanceEl.textContent = plan.startDistance;
  }

  function initMotivationsReview() {
    refreshMotivationsReview();

    window.BarraSuperiorBack?.bind('profiling-motivations-review-back', () => {
      navigateTo('profiling-motivations');
    });

    document.getElementById('motivations-review-submit')?.addEventListener('click', () => {
      startPlanGenerationFlow();
    });
  }

  function initPlanReady() {
    populatePlanReady();

    window.BarraSuperiorBack?.bind('profiling-plan-ready-back', () => {
      window.history.back();
    });

    document.getElementById('plan-ready-submit')?.addEventListener('click', () => {
      window.ProfilingStepperAnim?.queue({
        fromStepId: null,
        toStepId: 'mentors',
        connector: 'right',
      });
      const path = window.location.pathname.replace(/\\/g, '/');
      if (path.includes('/activation/')) {
        window.location.href = '../mentor/index.html#catalog';
        return;
      }
      if (path.includes('/profiling/')) {
        window.location.href = '../../mentor/index.html#catalog';
        return;
      }
      window.location.href = 'mentor/index.html#catalog';
    });
  }

  function onProfilingScreenEnter(key) {
    if (key === 'profiling-motivations-review') {
      refreshMotivationsReview();
      window.ProfilingStepperAnim?.runEnter(
        document.getElementById('screen-profiling-motivations-review'),
        'review'
      );
    }
    if (key === 'profiling-motivations') {
      window.ProfilingStepperAnim?.runEnter(
        document.getElementById('screen-profiling-motivations'),
        'motivations'
      );
    }
    if (key === 'profiling-personal') {
      window.ProfilingStepperAnim?.runEnter(
        document.getElementById('screen-profiling-personal'),
        'personal'
      );
    }
    if (key === 'profiling-plan-ready') {
      populatePlanReady();
    }
    if (key !== 'plan-generating') {
      clearPlanGeneratingTimer();
    }
  }

  function mountProfilingScreens() {
    const container = document.querySelector('.phone-shell__body');
    if (!container || !isActivationFlow()) return false;

    let mountedAny = false;

    if (!document.getElementById('screen-profiling-personal')) {
      container.insertAdjacentHTML('beforeend', createPersonalMarkup());
      initPersonalForm();
      mountedAny = true;
    }

    if (!document.getElementById('screen-profiling-motivations')) {
      container.insertAdjacentHTML('beforeend', createMotivationsMarkup());
      initMotivationsForm();
      mountedAny = true;
    }

    if (!document.getElementById('screen-profiling-summary')) {
      container.insertAdjacentHTML('beforeend', createSummaryMarkup());
      mountedAny = true;
    }

    if (spec31 && !document.getElementById('screen-profiling-motivations-review')) {
      container.insertAdjacentHTML('beforeend', createMotivationsReviewMarkup());
      initMotivationsReview();
      mountedAny = true;
    }

    if (spec31 && !document.getElementById('screen-plan-generating')) {
      container.insertAdjacentHTML('beforeend', createPlanGeneratingMarkup());
      mountedAny = true;
    }

    if (spec31 && !document.getElementById('screen-profiling-plan-ready')) {
      container.insertAdjacentHTML('beforeend', createPlanReadyMarkup());
      initPlanReady();
      mountedAny = true;
    }

    return mountedAny;
  }

  function guardProfilingRoutes() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash.startsWith('profiling-')) return;
    if (!isActivationFlow()) return;
    if (!isAccountActivated()) {
      window.location.hash = 'code-bridge';
    }
  }

  window.ProfilingFlow = {
    createPersonalMarkup,
    createMotivationsMarkup,
    createSummaryMarkup,
    createMotivationsReviewMarkup,
    createPlanGeneratingMarkup,
    createPlanReadyMarkup,
    initPersonalForm,
    initMotivationsForm,
    initMotivationsReview,
    initPlanReady,
    onScreenEnter: onProfilingScreenEnter,
    guardRoutes: guardProfilingRoutes,
  };

  const mounted = mountProfilingScreens();

  if (mounted && window.location.hash) {
    window.ActivationFlow?.refreshRoute?.();
  }

  guardProfilingRoutes();
  window.addEventListener('hashchange', guardProfilingRoutes);

  if (document.getElementById('profiling-personal-root')) {
    const root = document.getElementById('profiling-personal-root');
    root.innerHTML = createPersonalMarkup();
    document.getElementById('screen-profiling-personal')?.classList.add('is-active');
    initPersonalForm();
    document.title = 'Rookie — Perfilado';
  }

  if (document.getElementById('profiling-motivations-root')) {
    const root = document.getElementById('profiling-motivations-root');
    root.innerHTML = createMotivationsMarkup();
    document.getElementById('screen-profiling-motivations')?.classList.add('is-active');
    initMotivationsForm();
    document.title = 'Rookie — Motivaciones';
    window.ProfilingStepperAnim?.runEnter(
      document.getElementById('screen-profiling-motivations'),
      'motivations'
    );
  }

  if (document.getElementById('profiling-plan-ready-root')) {
    const root = document.getElementById('profiling-plan-ready-root');
    root.innerHTML = createPlanReadyMarkup();
    document.getElementById('screen-profiling-plan-ready')?.classList.add('is-active');
    initPlanReady();
    document.title = 'Rookie — Tu plan está listo';
  }

  if (document.getElementById('profiling-review-flow-root')) {
    const root = document.getElementById('profiling-review-flow-root');
    root.innerHTML =
      createMotivationsReviewMarkup() + createPlanGeneratingMarkup() + createPlanReadyMarkup();
    initMotivationsReview();
    initPlanReady();
    initReviewFlowStandalone();
    document.title = 'Rookie — Revisión de motivaciones';
    window.ProfilingStepperAnim?.runEnter(
      document.getElementById('screen-profiling-motivations-review'),
      'review'
    );
  }
})();
