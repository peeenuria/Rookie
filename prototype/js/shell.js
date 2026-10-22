/**
 * Shell 4.1.2 — catálogo de mentores (preview Fase 1)
 */
(function () {
  const spec = window.FIGMA_4_1;
  if (!spec) return;

  const previewRoot = document.getElementById('mentor-preview');
  const debugPanel = document.getElementById('dev-panel');
  const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true';

  function renderMentorCard(mentor) {
    const tags = mentor.tags.map((t) => `<span class="pill">${t}</span>`).join('');
    return `
      <article class="mentor-card">
        <div class="mentor-card__info">
          <div class="mentor-card__identity">
            <h2 class="mentor-card__name">${mentor.name}</h2>
            <p class="mentor-card__specialty">${mentor.specialty}</p>
          </div>
          <div class="pill-list">${tags}</div>
          <p class="mentor-card__meta">★ ${mentor.rating} · Salidas los ${mentor.outingDay}</p>
        </div>
        <div class="mentor-card__photo-wrap">
          <div class="mentor-card__photo-bg" aria-hidden="true"></div>
          <div class="mentor-card__foto-mentor">
            <img class="mentor-card__photo" src="../${mentor.photo}" alt="${mentor.firstName}" width="190" height="168" />
          </div>
        </div>
      </article>
    `;
  }

  if (previewRoot) {
    previewRoot.innerHTML = spec.mentors.map(renderMentorCard).join('');
  }

  if (debugPanel) {
    if (isDebug) {
      debugPanel.classList.remove('dev-panel--hidden');
      const script = document.createElement('script');
      script.src = '../js/dev-spec.js';
      document.body.appendChild(script);
    } else {
      debugPanel.remove();
    }
  }

  /** Salto suave a una sección dentro del shell (respeta scroll-behavior) */
  window.scrollToSection = function (selector) {
    const scroller = document.querySelector('.phone-shell__scroll');
    const target = scroller && scroller.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
})();
